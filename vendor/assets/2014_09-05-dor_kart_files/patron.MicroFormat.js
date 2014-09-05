jsLoader.require(['{toolkit.common}ajs/__array/ajs__array', '{patron}patron.Folders'], function ()
{
	if( !window.patron ) window.patron = {};

	patron.MicroFormat		= (function()
	{
		var butseq = [
			['read-link', Lang.get('micoformat.read')],
			['reply-link', Lang.get('micoformat.reply')],
			['accept-link', Lang.get('micoformat.accept')],
			['reject-link', Lang.get('micoformat.reject')],
			['action-link', Lang.get('micoformat.action')],
			['view-link', Lang.get('micoformat.view')]
		];
		var _preload = false;
		var _imgs	= [];
		var domlist = {'corp.mail':'corp', 'mail':'mail', 'inbox':'inbox', 'bk':'bk', 'list':'list'};
		var _sEmail	= /@(ya|yandex|narod|ro|rambler|lenta|myrambler|autorambler|r0|gmail)\.\w{2,3}/i;
		var _isAva	= /(mail|inbox|corp|bk|list)\/([^\/]+)\/_avatar(small)?/i;
		var _isAbsoluteURL	= /^https?:\/\//i;
		var _protocol = location.protocol;

		// @private
		function _aLinks(msgId, msg, noReply)
		{
			var html = [], target = true, links = [], i, href;

			for( i = 0; butseq[i]; i++ ) if( href = msg[butseq[i][0]] )
				links.push([href, msg[butseq[i][0]+'-text'] || butseq[i][1]]);

			for( i = 0; i < 10; i++ ) if( href = msg['action-link'+i] )
				links.push([href, msg['action-link'+i+'-text']]);

			if( !msg.ntype || msg.ntype == 'letter' || !links.length )
			{
				if( noReply )
					links	= [['/message/' + msgId + '/', butseq[0][1]]].concat(links);
				else
					links	= [['/message/' + msgId + '/', butseq[0][1]], ['/compose/' + msgId + '/reply/', butseq[1][1]]].concat(links);

				target	= false;
			}

			for( i = 0; links[i]; i++ )
			{
				href	= (/^(http|\/)/.test(links[i][0]) ? '': 'http://') + links[i][0];
				html[i] = '<a '+(/(msglist|readmsg|sentmsg|message|compose)/.test(links[i]) ? 'rel="history"' : '')+' href="'+ href +'"'+ (target ? ' target="_blank"' : '') + ' class="' + (target ? 'new_Outer ' : '') + 'messageline__microformat__button m-btn'+ (i ? '' : '-first messageline__microformat__button_first')+ '">'+ decodeURIComponent(links[i][1]).replace(/&apos;/gi, '\'') +'</a>';
			}

			return	html;
		}

		var unescapeAdditionalHtmlSymbols = function(str)	{//TODO: remove this after MAIL-12213
			var replacer = function($0, $1, $2) {
				return this[$2] || $1;
			}.bind(this);

			return String(str || "")
				.replace(/(\&\#(037|039|92|35)\;)/g, replacer)
				.replace(/(&(apos);)/g, replacer)
			;
		}.bind({ '037': '%', '92' : '\\', '35' : '#', '039': '\'', 'apos' : '\'' });

		// @public
		var _this = {
			msg: {},

			wordWrap: patron.newsnippets ? 70 : 0,

			preload: function (img){
			},

			/**
			 * Функция подготавливает сообщение для вывода в html. Опционально, может обрезать сообщение по максимальной
			 *  длинне и поставить в конце "..."
			 * @param {{text: string}} Msg Объект, содержащий сообщение в свойстве text
			 * @param {boolean=} wrapAndEscape Обрезать сообщение по максимальной длинне и заэскейпить html?
			 * @param {boolean=} safeString раскодируем строку через функцию decodeURIComponent и заэскейпим html в любом случае
			 * @return {String}
			 */
			text: function (Msg, wrapAndEscape, safeString){
				var txt = Msg.Microformat && Msg.Microformat['text'] || '';

				if( safeString ) {//MAIL-11566
					try {
						txt = decodeURIComponent(txt);
					}
					catch(e){}

					if( !wrapAndEscape ) { // force escaping
						txt = unescapeAdditionalHtmlSymbols(txt);//TODO: remove this after MAIL-12213

						txt = ajs.Html.escape( ajs.Html.unescape( txt.replace(/\s+/g, ' ') ) );
					}
				}

				if( wrapAndEscape && this.wordWrap > 0 ){
					txt = unescapeAdditionalHtmlSymbols(txt);//TODO: remove this after MAIL-12213

					txt = ajs.Html.escape(
						String.wordWrap(
							ajs.Html.unescape( txt )
								.replace(/\s+/g, ' ')
							, 500
							, this.wordWrap
							, '...'
							, true
						)
					);
				}

				return	txt + '&nbsp;';
			},

			links: function(Msg, mf){
				if( !(mf = Msg.Microformat) || Msg.getFolder().isSent() ) return '';
				return _aLinks(Msg.Id, mf, Msg.getFolder().isDrafts()).join('');
			},

			avatar: function (Msg, from){
				var
					  id	= Msg.Id
					, src	= this._getAvaSrc(Msg, from)
					, nsrc	= Msg.AvatarUrl
					, html	= '<i class="messageline__readStatus icon icon_read-status"><i id="nmI%s" style="display: block; width: 100%; height: 100%; background-position: center center; background-repeat: no-repeat;"></i></i>'
				;

				if( src ){
					if( _protocol == 'https:' ){
						src	= nsrc;
					}

					this.preload([id, src]);
				}

				return	html.replace('%s', id);
			},

			_getAvaSrc: function(Msg, from){
				var
					  MF = (Msg.Microformat || {})
					, isUnread = Msg.Unread
					, _img = '<i class="messageline__readStatus icon icon_read-status"><i id="nmI%s" style="display: block; width: 100%; height: 100%; background-position: center center; background-repeat: no-repeat;"></i></i>'
					, mail
					, src
					, id		= Msg.Id
					, email		= (from ? Msg.From : Msg.To)
					, ntype		= MF.ntype
					, photo		= MF.photo
					, filinN	= Number(Msg.FilinN)
					, filinEM	= Number(Msg.FilinEM)
				;

				if( ntype == "undefined" ) ntype	= !1;
				if( photo == "undefined" ) photo	= !1;


				if (_isAva.exec(photo)) {
					src	= photo + (RegExp.$3 != 'small' ? 'small' : '');
				} else {
					mail = (email+'').replace(/\.ru$/, '').split('@');
					if( !(photo && filinN) && domlist[mail[1]] ) {
						src = '//avt2.' + patron.staticDomainName + '/' + domlist[mail[1]] + '/' + mail[0] + '/_mrimavatarsmall?specd='+ (isUnread ? 'one' : 'two');
					} else if ((photo || _sEmail.test(email)) && (filinN || filinEM)) {
						if (!(!!filinN) || _isAbsoluteURL.test(photo)) {
							if (patron.isLocal) {
								src = '//filindev.mail.ru/pic?'+(!!filinN ? 'url='+photo : 'email='+email) +'&default=404';
							} else {
								src = '//filin'+ (filinN || filinEM)+'.' + patron.staticDomainName + '/pic?'+(!!filinN ? 'url='+photo : 'email='+email) +'&default=404';
							}
						}
					}
				}

				return	src ? _protocol + src : src;
			},

			rbCounters: function (render, sh)
			{
				if( render )  (new Image).src = '//rs.' + patron.SingleDomainName + '/d'+(window.MsglistExpanded ? 295418 : 295417)+'.gif?'+Date.now();
				if( defined(sh) ) (new Image).src = '//rs.' + patron.SingleDomainName + '/d'+(sh ? 295415 : 295416 )+'.gif?'+Date.now();
			}
		};

		return _this;
	})();


	jsLoader.loaded('{patron}patron.MicroFormat');
});
