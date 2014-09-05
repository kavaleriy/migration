/**
 * @class patron.View.ReadMsgMisc
 */
jsClass
.create('patron.View.ReadMsgMisc')
.methods({


	upd: function (msg, params)
	{	try {

		var cacheKey	= this.getCacheKey(msg);
		if( this._cacheKey == cacheKey ) return;

		var mID	= msg.getId();
		var fID	= msg.FolderId;
		var mID_fID = 'id='+mID+'&folder='+fID+'&'+Date.now();

		params = Object.extend({ charset: '', adding: '', welcome: '' }, params);

		// Prev/Next
		this.$Nav.css({ display: !patron.isFilterFolder() && (msg.PrevId || msg.NextId) ? '' : 'none' });

		// Flagged
		this.$Flag.toggleClass('mr_read__flag_y', !!+msg.Flagged);

		// IcoFrom
		//var _if = +!!msg.IcoFromWho, _oa = patron.isMailRuDomain(msg.From);
		var _if = 0, _oa = patron.isMailRuDomain(msg.From);

		this.$IcoFrom.display(_if || _oa);

		if( _if )		this.$IcoFrom.css({ backgroundImage: 'url(//img.imgsmail.ru/mail/ru/images/default/ico-from/12'+msg.IcoFromWho+'.png)' });
		else if( _oa )	this.$IcoFrom.css({ backgroundImage: 'url(//status.mail.ru/?'+ (msg.From.replace(/(\.ru)(.+)$/, '$1') && RegExp.$1) +'.png)' });

		// SubIcon
		this.$subjIco.attr('className', !msg.isNormal() ? ('nm_Icons iOnes iMsg' + (msg.isHigh() ? 'H' : 'L')) : '');

		// add address, filters, spam
		var F = patron.Folders.get(fID);
		if( F )
		{
			this.$msgNoSent.css({ display: F.inFolder(patron.Folder.SENT) ? 'none' : '' });
			this.$msgIsBulk.css({ display: !F.inFolder(patron.Folder.BULK) ? 'none' : '' });
		}


		// < Headers
		var _hdr = /mh-([\w_-]+)/i;
		this.$Fields.each(function (i, N)
		{
			var n = N.className.match(_hdr)[1], v = msg[n];

			if( n == 'To' )	v = (msg.ToList || msg.To || ('<' + Lang.get('readmsg.not_specified') + '>'));
			else if( n == 'From' ){	// @todo Разобраться с FromList/FromFull и оставить что-то одно
				v	= ((msg.FromList || msg.FromFull)+'').match(/^(.+)(&lt;.+)/i);
				v	= (v == null) ? msg.FromList : '<span class="mr_read__fromf">'+v[1]+'</span>'+v[2];
			}
			else if( n == 'DateUTS' )
			{
				v = new Date(msg.DateUTS * 1000).getLocaleDateFull();
			}
			else if( n == 'Subject' )
			{
				if( !v ) v	= msg.getSubject();
				N.title		= Lang.get('Messages').priority[msg.Priority];
			}

			$('.val', N).html( v );
			N.style.display	= !!v && v !== '' ? '' : 'none';
		}.bind(this));
		// Headers >


		var View	= jsView.get('readmsg');


		// Links href
		this.$Url.each(function (i, N){

			var name = N.className.match(/u(rl)?-([\w-]+)/) ? RegExp.$2 : '', url = '';

			if( !name ) return;

			name	= String.ucfirst( name );

			switch( name )
			{
				case 'Prev':
				case 'Next':
				{	// Navigation
					var id = msg[name+'Id'];
					url = id ? patron.getPageURL('readmsg', { id: id }) : 'javascript:;';
					$(N)
						.toggleClass(View.clNav, !id)
						.children('.icon')
						.toggleClass('icon_arrow-' + (name === 'Prev' ? 'up' : 'down') + '_disabled', !id);
				}
				break;

				case 'ViewType':
						url	= patron.getPageURL('readmsg', { id: mID }) + '?mode=header';
					break;

				case 'ShowImages':
						url	= patron.getPageURL('readmsg', { id: mID }) + '?bulk_show_images=1';
					break;

				case 'Reply': url = patron.getPageURL('compose', { id: mID, mode: 'reply' }); break;
				case 'ReplyAll': url = patron.getPageURL('compose', { id: mID, mode: 'replyall' }); break;

				case 'Forward':
				case 'Forward-attach':
						url = patron.getPageURL('compose', { id: mID, mode: name.toLowerCase() });
					break;

				case 'Composebounce': url = '/cgi-bin/composebounce?'+mID_fID+'&adding='+params.adding; break;
				case 'Print': url = patron.getPageURL('readmsg', { id: mID }) + '?template=printmsg.tmpl&adding='+(params.mode == 'header' ? 'top' : ''); break;

				case 'Getmsg': url = '/cgi-bin/getmsg?'+mID_fID; break;

				case 'FromIco':
						if( _oa )
						{
							url		= "http://www.mail.ru/agent?message&to="+msg.From;
							N.title	= Lang.get('readmsg.click_to_magent');
						}
						else if( !(_if || _oa) ) return;
						else url = 'javascript:;';
					break;

				case 'Gosearch':	url = patron.getPageURL('search')+'?q_from='+msg.From; N.title = Lang.get('readmsg.find_from').replace('%s', msg.From);  break;
				case 'Blacklist':	url = '/cgi-bin/movemsg?addfilter&'+mID_fID; break;
				case 'Editfilter':	url = '/cgi-bin/editfilter?msg'+mID_fID; break;
				case '2whitelist':	url = '/cgi-bin/movemsg?whitelist&'+mID_fID; break;
				case 'New_abcontact': url = '/cgi-bin/new_abcontact?msg'+mID_fID; break;

				case 'Remove':
						if( !this._delGET ) this._delGET = String.toObject(N.href);
						var k, v;
						for( k in this._delGET ) if( v = (msg.get(String.ucfirst(k)) || params[k]) ) url += '&'+k+'='+v;
						url = '/cgi-bin/movemsg?remove' + url + (patron.MsglistAfterDelete && msg.NextId ? '' : '&next='+msg.NextId);
					break;

				case 'Spam':
				case 'Nospam':
					{
						url	= F.isBulk() ?
							'/cgi-bin/movemsg?id=' + msg.Id + '&move=1&nospam=1' + ((patron.ListUnsubscribeEnabled && msg.ListSubscribe) ? '&subscribe=1' : '')
							: 'spamabuse?id=' + msg.Id + ((msg.ListUnsubscribe && patron.ListUnsubscribeEnabled) ? '&unsubscribe=1' : '');
						$(N)
							.find('.js-spam-txt')
							.html(F.isBulk() ?
								((patron.ListUnsubscribeEnabled && msg.ListSubscribe) ? Lang.get('ListSubscribe') : Lang.get('IsNotSpam'))
								: Lang.get('IsSpam')
							);
						if( F.isSent() || F.isDrafts() || ((F.isBulk() && name == 'Spam') || (!F.isBulk() && name != 'Spam')) ) url = '';
					}
					break;

				case 'Translate': url = patron.getPageURL('readmsg', { id: mID }) + '?mode=translate&direction=re'; break;
			}

			N.href = url && url.indexOf('javascript:;') == -1 ? url : 'javascript:;';
			N.style.display = url ? '' : 'none';
		}.bind(this));

		if( patron.ListUnsubscribeEnabled && msg.ListUnsubscribe ) Counter.d(1678304);
		if( patron.ListUnsubscribeEnabled && msg.ListSubscribe ) Counter.d(1611485);

		// < Avatar
		this.updAvatar(msg);
		// Avatar >

		this._cacheKey	= cacheKey;

		} catch (er) { debug.log(er); }
	},

	updAvatar: function (msg) {
		var avatarSrc = patron.Utils.getAvatarSrcByMessage(msg, 90);
		var avatarUrl = patron.Utils.getAvatarUrlByMessage(msg);

		var $link = $('.js-avatar-link', this.$Avatar);

		if (avatarSrc) {
			$link.css('backgroundImage', 'url("' + avatarSrc + '")');
			if (avatarUrl) {
				$link.attr({
					href: avatarUrl,
					target: '_blank'
				});
			} else {
				$link.removeAttr('href').removeAttr('target');
			}
		}

		this.$Avatar.display(!!avatarSrc);
		this.$Top.find('.mr_read__top').toggleClass('mr_read__top_ava', !!avatarSrc);
	},

	updIF: function (msg)
	{
		this.$IF.each(function (i, N)
		{
			var d = 0, name = N.className.match(/if-(Not)?([^\s"]+)/) ? RegExp.$2 : null, not = RegExp.$1 == 'Not';

			switch( name )
			{
				case 'Drafts':	d = msg.inFolder(patron.Folder.DRAFTS); break;
				case 'IsMe':	d = msg.From == patron.useremail; break;
				case 'Warning': d = (msg.WithPassKeyMsg || msg.WithFakePresent || msg.WithSMSRequestPresent); break;
				case 'SpamBlack': d = msg.x_ubl_black && msg.inFolder(patron.Folder.BULK); $('#SpamBlackInfo .js-email').html(msg.From); break;
				case 'SpamProbable': d = ((msg.x_spam || msg.x_mras) && !msg.x_ubl_black && msg.inFolder(patron.Folder.BULK)); break;
				case 'finden_fio-bottom': d =  (msg.finden_fio && msg.HideFastAnswer); break;
				case 'finden_fio-url': d = 1; N.href = 'http://go.mail.ru/search?q='+msg.finden_fio+'&fr=mlbdy'; N.innerHTML = msg.finden_fio; break;

				case 'Attachfiles_Items':
						var count	= (msg.Attachfiles_Items||0)*1 + (msg.Attachlinks_Items||0)*1;
						if( count )
						{
							N.href = patron.baseHref + jsHistory.get();
							$('.val',  N).html(String.num(count, Lang.get('files.plural'), ' '))
						}
						d = +count;
					break;

				case 'Priority_High': d = msg[name] || msg.isHigh(); break;

				case 'HasBannedImages':
					d = msg[name] || msg._hasBannedImages;
					if ( d ) {
						// to show this even if 'HasBannedImages' will not arrive with next checknew
						msg._hasBannedImages = 1;
						new Image().src = '//rs.' + patron.SingleDomainName + '/d1131468.gif?' + Math.random();
					}
					break;

				case 'FromSearch':
						d = !!GET.fromsearch;
						if( d ){
							$('.js-back2search', N).attr('href', patron.getPageURL('search')+'?'+jsHistory.buildParams(0, ['fromsearch', 'id', 'folder'])).show();
						}
					break;

				default:
				{
					d = (not ? !msg[name] : msg[name]);
					if( d && name == 'ShowSecurityImage' )
					{
						$('IMG', N).remove();
						$(N).prepend('<img src="/cgi-bin/get_save_image?'+Date.now()+'" />');
					}
					not = 0;
				}
				break;
			}

			if( not ) d = !d;

			N.style.display	= !!d ? '' : 'none';
		}.bind(this));
	},


	updInp: function (msg)
	{
		var F = patron.Folders.get(msg.FolderId, true);
		this.$Forms.each(function (i, Form)
		{
			if( Form.name != 'FastAnswer' || msg.Id != Form.re_msg.value )
			{
				Array.forEach(Form.elements, function (N)
				{
					var value = null;
					if( Form.name == 'FastAnswer' )
					{
						switch( N.name )
						{
							case 'copy': 	value = msg.SaveSent ? 'Yes' : ''; break;
							case 'message':	value = msg.ReplyMessageId; break;
							case 're_msg':	value = msg.Id; break;
							case 'To':		value = msg.ReplyTo; break;
							case 'CC':		value = '';msg.Cc; break;
							case 'Subject':	value = msg.SubjectRe; break;
							case 'Body':
							case 'security_image_word':	value = ''; break;
							default: if( defined(msg[N.name]) ) value = msg[N.name]; break;
						}
					}
					else if( Form.name == 'SpamBottom' )
					{
						var isBulk = F.isBulk();
						switch( N.name )
						{
							case 'id' && !isBulk:	value = msg.Id; break;
							case 'back' && !isBulk:	value = patron.getPageURL('readmsg', { id: msg.Id }); break;
							case 'spamabuse':
							case 'is_not_spam':
								Form.action = isBulk ? '/cgi-bin/spamwarn?id='+msg.Id+'&folder='+msg.FolderId+(msg.NextId ? '&next='+msg.NextId : '') : 'movemsg';
							break;
						}
					}
					else if( Form.name == 'ReceiptInfo' && N.name == 'id' )
					{
						value = msg.Id;
						Form.action = patron.getPageURL('readmsg', { id: value }) + '?sendrcpt=1';
					}

					if( value !== null ) N.value = replaceEntity(value || '');
				});
			}
		});
	}

});


jsLoader.loaded('{patron.view}patron.View.ReadMsgMisc');
