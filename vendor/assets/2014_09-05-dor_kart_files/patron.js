/**
 * @object	patron
 * @author	RubaXa	<trash@rubaxa.org>
 */

/*global $Scroll*/


jsLoader.require([
	//   '{toolkit.common}ajs/__array/ajs__array' /* Loaded by toolkit */
	// , '{toolkit.common}ajs/__string/ajs__string' /* Loaded by toolkit */
	 '{jsCore}Date'
	, '{utils}jsHistory'
	, '{jQuery}extensions'
	, '{jQuery}jquery.getCSS'
	, '{plugins}LayerManager'
	, '{patron}patron.core'
	, '{patron}patron.Ad'
	, '{patron}patron.Ajax'
	, '{patron}patron.Updater'
	, '{patron}patron.Layers'
	, '{patron.view}patron.View.ReadMsg'
	, '{patron}patron.BindedCounters'
	, '{patron.utils}patron.Utils'
	, '{patron.view}patron.View'
], function (){
	debug.clear		= jsCore.local && window.console && window.console.clear || jsCore.F;
	jsCore.saveMode	= true;

	//
	// Counters (https://sys.mail.ru/task_viewer.php?id=792630)
	//
	(function (m){
		var a = {
			folders:{
				  inbox:	366161
				, sent:		366499
				, trash:	366500
				, spam:		366501
				, user:		366503
			},
			pages: {
				  1:	366507
				, 2:	366508
				, 3:	366510
				, other:366511
			},
			mode:	{
						  'short':	{ top: 366543, bottom: 366544 }
						, detail:	{ top: 366546, bottom: 366548 }
					},
			clickBy:	{ flag: 366553, attachIco: 366558 }
		};

		m.rb = function (type, name, sub, tb)
		{
			var src = '//rs.' + patron.SingleDomainName + '/'+ (type == 'click' ? 'sb' : 'd') +'%d.gif?rnd='+Math.random();
			if( name && (name in a) )
			{
				var c = a[name];
				if( sub && (sub in c) ) c = c[sub];
				if( c && c.top ) c = c[(tb === undef ? (sub === undef ? 1 : sub) : tb) ? 'top' : 'bottom'];
				if( c && (c > 0) )
				{
					(new Image).src = src.replace('%d', c);
					return	true;
				}
			}
			else if( !isNaN(name) && name > 0 )
			{
				(new Image).src = src.replace('%d', name);
			}
			return	false;
		};
		m.rb.show	= function (name, sub, tb){ return m.rb('show', name, sub, tb); };
		m.rb.click	= function (name, sub, tb){ return m.rb('click', name, sub, tb); };
		m.rb.clickAndShow	= function (name, sub, tb){ return m.rb.click(name, sub, tb) && m.rb.show(name, sub, tb); };
	})(patron);


	location.getHref = function () {
		var l = location, r = l.hash.length > 4 ? l.hash.replace(/.*#/, '') : l.href;
		if( !/^http/.test(r) ) r = l.protocol + '//'+ l.hostname +'/cgi-bin/'+ r;
		return r;
	};


	function _parseURL(url){
		patron._updIsPageVars(url);
	}



	// Ready
	var appBeforeInit = function ($) {
		if( !(patron.isMailboxPage() || patron.v2 && patron.isMRIMPage()) ){
			// @todo Этот код вообще не должен подключатся на страницах, кроме isMailboxPage, но где-то бага
			return;
		}


		// RUN UPDATER
		patron.Updater.run();


		// Global events
		patron.Events
			.bind('update.message error.message', function (evt){
				if( !patron.v2 && patron.isReadMsg && evt.DATA && evt.DATA[2] && evt.DATA[2].id == GET.id ){
					patron.ReadMsg.View.redraw( evt.DATA[1], evt.DATA[2], evt.DATA[3] );
				}
			})
			.bind('hashchange', function (evt){
				function getFolderId(url) {
					var folderIdByName = {'spam' : 950, 'sent' : 500000, 'drafts' : 500001, 'trash' : 500002},
						reg = /^\/messages\/(inbox|sent|drafts|spam|trash)|(folder\/(\d+))/,
						res = reg.exec(url);
					if(res){
						res = folderIdByName[res[1]] || res[3];
					}
					else {
						res = patron.getFolderId();
					}
					return res || 0;
				}
                var	F	= patron.Folders.get( String.toObject(evt.DATA).folder || getFolderId(evt.DATA));
				if( F && !F.isSecureOpen() ){
					patron.Events.fire('accessdenied.folder', F.Id);
					return	false;
				}
				else {
					patron.Layers.hide();
				}
			})
			.bind('move.click spam.click fileDownload.click', function (evt) {
				if (patron.isMsgList) {
					if (evt.type == 'move') {
						if (evt.DATA == patron.Folder.TRASH) {
							$(window).triggerHandler('controlClick.msglist', ['delete']);
						}
					} else if (evt.type == 'spam') {
						$(window).triggerHandler('controlClick.msglist', ['spam']);
					}
				} else if (patron.isFileSearchPage()) {
					if (evt.type == 'fileDownload') {
						$(window).triggerHandler('controlClick.msglist', ['fileDownload']);
					}
				}
			})
			.bind('accessdenied.folder', function (evt){
				patron.Layers.secure(evt.DATA, function (access){
				var url = '/messages', id = evt.DATA;
				switch (parseInt(id,10)) {
					case 0	    : url += '/inbox'; break;
					case 950    : url += '/spam'; break;
					case 500000 : url += '/sent'; break;
					case 500001 : url += '/drafts'; break;
					case 500002 : url += '/trash'; break;
					case 500003 :
					case 500005 : url = '/agent/archive'; break;
					default     : url += '/folder/' + id;
				}
				if( access ) jsHistory.set(url);
                });
			})
			.bind('redirect.ajax', function (evt){
				var Res			= evt.DATA;
				location.href	= Res.getData();
			})
		;


		patron._loadPage = function (url, isSet){
			url	= jsHistory.setModifier(url);

			if( this._loadPageUrl != url ){
				this._loadPageUrl = url;
				patron.Router.nav((/^\//.test(url) ? '' : '/') + url); // NEW ROUTER

				var GET = patron._updGETVars(url);
				_parseURL(url.match(/([\w_-]+)(\?|$)/i) && RegExp.$1);

				__tsMsgListLog = true;
				var pageLabel = patron.getPageLabel(url);
				patron.uiRadar(pageLabel)('all');	// Get radar by name + start timers
				patron.uiRadar(pageLabel)('request');

				// Redraw all views
				var redraw = documentView.redraw();

				// Run updater
				if( patron.isMsgListPage() ){
					patron.Updater.reload(true, { bnrs: 'N' });
				}

 				if( patron.isReadMsgPage() ){
					var Msg = patron.Messages.get( GET.id );

					patron.radar('mailru_Messages_get', (redraw ? 'cache' : 'load') + '=1');

					patron.ReadMsg.radar('clear')('all');
					patron.ReadMsg._ID = GET.id;
					patron.ReadMsg._MODE = GET.mode;

					if( !patron.threads ){
						patron.Messages.load( GET, undef, true ); // load
					}

					if( !patron.v2 ){
						if( Msg && Msg.isLoaded() ){
							patron.ReadMsg.View.redraw( Msg, GET );
						}
						else {
							patron.ReadMsg.View.toggleControls(true);
						}
					}
				}
				else if( (patron.isSearchPage() || patron.isFilterFolder()) && !patron.v2 ) {
					patron.Messages.loadSearch( GET );
				}
				else if( patron.isFileSearchPage() && !patron.v2 ) {
					patron.Messages.loadFilesSearch( GET );
				}

				$(window).unbind('errorloadpage.loadPage').bind('errorloadpage.loadPage', function (evt, url){
					if( patron._loadPageUrl == url ){
						patron._loadPageUrl = null;
					}
				});

				if( !patron.v2 ){
					patron.Banners.View.reload();
				}
			}


			if( isSet ){
				if( !patron.Updater.active && !patron.isReadMsgPage() ){
					patron.Updater.reload(true);
				}
			}
		};


		// < History
		var
			  isRelHref	= /^javascript/i
			, _rhttp	= /^https?:\/\/[^/]+/
			, _rcln		= /^\/cln\d+\/[^/]+/
			, _normalizeUrl = jsHistory.normalizeUrl
			, __tsMsgList, __tsMsgListLog
		;

		$.click(function (evt){

			patron.restoreJquery(); // MAIL-33514

			var A = evt.currentTarget;

			if( evt.isDefaultPrevented() ){
				return;
			}

			if( !jsHistory.disabled && ajs.Mouse.isLeft(evt) && (A.rel == 'history') && !(evt.ctrlKey || evt.metaKey || evt.shiftKey) ){
				if( !isRelHref.test(A) ){
					if( !A.getAttribute('disabled') ){
						var url = A.href.replace(_rhttp, '').replace(_rcln, ''), cN = A.className;

						patron.isClickOnMsgNav	= /url-(prev|next)/i.test(cN);
						patron.isClickOnMsgPrev	= /url-prev/i.test(cN);
						patron.disabledMsgCache	= patron.isReadMsg && !patron.isClickOnMsgNav;

						if( !patron.needReloadPage('href', url) && (patron.Events.fire('hashchange', url) !== false) ){
							// Scroll on top
							$Scroll[_normalizeUrl(url)] = 0;

							if( jsHistory.set( url ) ){
								patron._loadPage(url, true);
							}
						}

						A.hideFocus = true;
					}

					evt.preventDefault();
				}
			}
		});
		$(window).blur(function (){ jsHistory.disabled = false; });
		// History >


		var jsViewOnBeforeRedraw = function (){
			patron._updGETVars(jsHistory.get());
			documentView.redraw();
		};

		documentView.onBeforeRedraw = function (){
			var fId = patron.getFolderId(), r = true, isSearch = patron.isSearchPage(), isFileSearch = patron.isFileSearchPage();

			if( patron.isMsgList || isSearch || isFileSearch ){
				if( isSearch || patron.isFilterFolder() ){
					r = patron.Messages.hasSearchCache(GET);
					isSearch = true;
				}
				else if( isFileSearch ){
					r = _first || patron.Messages.hasFilesSearchCache(GET);
				}
				else {
					r = patron.Folders.hasCache(GET.folder, GET.page);
				}

				if( !r ){
					if( !isSearch && !isFileSearch ){
						patron.Events
							.unbind('beforestop.updater beforeloaded.search')
							.unbind('stop.updater.beforeRedraw')
							.one('stop.updater.beforeRedraw', jsViewOnBeforeRedraw)
							.one('beforestop.updater', function (){
								patron.uiRadar(patron.getPageLabel())('request', 1)('onRedraw');
							})
						;
					}
				}
				else {
					patron.uiRadar(patron.getPageLabel())('request', 1);
				}
			}
			else if( patron.isReadMsg ){
				r	= patron.Messages.hasCache(GET);
				if( !r ){
					patron.Events
						.unbind('loaded.messages.redraw')
						.one('loaded.messages.redraw', function (){
							documentView.redraw();
						})
					;
				}
			}
			else if( patron.isComposePage() ){
				r	= patron.View.Compose.isLoaded();
				if( !r ){
					$(window)
						.unbind('composeformloaded')
						.one('composeformloaded', function (){ documentView.redraw(); })
					;
					patron.View.Compose.loadFormHtml();
				}
			}

			if( r ){
				if( patron.isMsgListPage() ){
					__tsMsgList = ajs.now();
				}
				patron.uiRadar(patron.getPageLabel())('onRedraw');
			}

			return	r;
		};



		// History listener
		var _part;
		var _first	= true;
		var _hash 	= _normalizeUrl( jsHistory.get() );
		var _scrollhash = patron.v2 && _hash;

		documentView.onRedraw = function (){
			if( patron.isMsgList ){
				if( !patron.v2 ){
					patron.uiRadar('msglist')('onRedraw', 1)('all', 1)(true);
				}

				if( __tsMsgListLog ){
					var dt = ajs.now()-__tsMsgList, browser = $.browser.name;

					if( browser == 'opera' ){
						browser	+= '_'+ ($.browser.intVersion > 9 ? 10 : 9);
					}
					else if( browser == 'msie' ){
						browser	+= '_'+ ($.browser.intVersion < 8 ? 7 : $.browser.intVersion);
					}

					if( !patron.v2 ){
						patron.radar('mailru_UI_msglist_'+patron.messagesPerPage, browser+'='+dt, dt);
					}
					__tsMsgListLog = false;
				}
			}

			!patron.v2 && documentView.onScroll();
		};

		documentView.onScroll = function (){
			if( _scrollhash != _normalizeUrl( _hash ) ){
				_scrollhash = _hash;
				var oTop = $Scroll.top, nTop = $Scroll[_hash];
				if( oTop != nTop ){
					if( !patron.threads || !patron.isReadMsgPage() ){
						$.event.trigger('scrolltop', nTop);
						$Scroll.scrollTop(nTop);
//						ajs.log('$Scroll.scrollTop:', nTop);
					}
					$Scroll.top = nTop
				}
			}
		};

		patron.Folders.isReady			= /msglist/.test(_hash);
		patron.ReadMsg.ID				= 0;//defined(GET.id, 0);
		patron.ReadMsg.View.isActive	= function (){ return patron.isReadMsg; };

		jsHistory.change(function (hash, isSet, data, local){
			if( patron.needReloadPage('href', hash) ){
				return;
			}

			hash = _normalizeUrl(hash);

			var
				  nTop	= (!isSet && !$Scroll.fixed && $Scroll[hash]) || 0
				, oTop	= $Scroll.top
//				, part	= hash.match(/([\w_-]+)(\?|$)/i) && RegExp.$1
				, part	= jsHistory.setModifier(hash).replace(/\?.+$/, '')
				, redraw= true
			;

			patron._updGETVars(hash);
			_parseURL(part);

			if (local) {
				return;
			}


			if( !~_hash.indexOf('search') != !~hash.indexOf('search') ){
				// Если мы ушли или пришли на поиск, то нужно сбросить cache
				patron.Messages.resetSearchCache();
			}


			$Scroll[_hash]	= oTop;
			$Scroll[hash]	= nTop;


			_hash			= hash;

			if( patron.isMsgList || patron.isReadMsg )
				GET.folder = GET.folder >= 0 ? GET.folder : patron.folderId;


			patron.folderId		= (GET.folder >= 0 ? GET.folder : patron.folderId) || 0;

			patron.messageId	= !!GET.id ? GET.id : 0;
			patron.messagesPage	= parseInt(!!GET.page ? GET.page : 1, 10) || 1;
			patron.messagesSort	= !!GET.sortby ? ajs.htmlEncode(GET.sortby) : patron.messagesSort;

			patron.Pager.calc();


			patron.log('history.nav', hash);
			patron.uiRadar(false);	// clear all radars

			if( !_first ){
				patron._loadPage(hash);
			}


			if( _first ){
				// It's first run
				if( patron.isReadMsg ){
					patron.ReadMsg.View.wrapStatic();
				}
				else if( patron.isFileSearchPage() ) {
					patron.Messages.loadFilesSearch( GET );
				}
				else if( patron.isFilterFolder() ){
					patron.Messages.loadSearch( GET );
				}

				documentView.redraw();
			}

			_first	= false;
		});


		window.rb_innerhtml = true;
		window.msgListReady	= true;

		$('#MsgListContent,#ReadMsg,#search__result').addClass('mr_toolbar__y');

		// Disable history
		if( patron.isSearchNoResultPage() ){
			patron.needReloadPage('build', ajs.now());
		}


		// NEW ROUTER START
		if( !patron.Router ){
			ajs.require([patron.v2 ? '{patron.v2}patron.App' : '{patron}patron.Router'], function () {
				patron.Router.nav(jsHistory.get());
			});
		}
		else {
			patron.Router.nav(jsHistory.get());
		}


		// Dispatch event views ready
		jsCore.notify('patron.ready');

		if (typeof fixedDocumentWrite == 'function') {
			fixedDocumentWrite(document);
		}
	}; // appBeforeInit


	jsLoader.loaded('{patron}patron', appBeforeInit);
});
