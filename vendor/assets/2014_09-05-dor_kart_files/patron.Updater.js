/***
 * @class	patron.Updater
 * @author	RubaXa	<trash@rubaxa.org>
 */

/*global createRadar, arMailRuFolders, arMailRuMessages*/
jsLoader.require([
	  '{patron}patron.Folders'
	, '{patron}patron.Messages'
	, '{patron}patron.API'
	, '{utils}Counter'
	, '{patron.utils}patron.Utils'
	, '{toolkit.common}jinn/__bubble/jinn__bubble'
], function (){

	/** @namespace patron.Updater */
	patron.Updater = {

		  idx:		0
		, Banners:	[]
		, Folders:	[]
		, Messages:	{}
		, Request:	{}
		, radar:	createRadar('mailru_Updater')
		, stopCnt:	0
		, active:	false
		, disabled:	false
		, cts:		{}
		, lastTS:	0
		, __sort:	{
			folder: {},
			global: null
		}
		,

		run: function (){
			store.set('last_message_ts', patron.CurrentTimestamp);

			if (ajs.offline) {

				patron.Updater.reload();

			} else {
				if( 'SearchData' in patron ){
					patron.Messages.setSearchData(patron.SearchData);
					// patron.Messages.set(patron.getFolderId(), patron.SearchData.messages, Date.now());
					// patron.Messages.addSearchCache(GET, new patron.Ajax.Result({ status: 'OK', data: patron.SearchData }, {}, {}, 'success'));
				}

				var folderList = patron.Folders.getAll();

				if( patron.threads ){
//					patron.Events.bind('updated.message', function (evt){
//						var msg = evt.DATA;
//						var thread = patron.Threads.get(msg.thread);
//						if( thread ){
//							patron.Threads.remove(thread);
//						}
//					});
				}
				else {
					if( window.arMailRuMessages && arMailRuMessages.length ){
						/** @namespace window.arMailRuMessages */
						var id = patron.folderId;
						if( patron.isFilterFolder(id) ) id = 0;
						patron.Messages.set(id, window.arMailRuMessages, patron.CurrentTimestamp, 1);

						// MAIL-16248
						if (patron.messagesSort === 'd' && $.isArray(arMailRuMessages) && arMailRuMessages.length === 0 ) {
							var folder;
							$.each(folderList, function (k, v) {
								var next = true;
								if (v.Id == id) {
									folder = v;
									next = false;
								}
								return next;
							});
							if (folder && folder.Messages) {
								patron.messagesSort = 'D';
							}
						}
					}
				}

				patron.Events.trigger('stop.updater');
			}


			patron.Events.bind('update.messages loaded.messages preload.messages', function (){
				// Preload messages
				if( patron.isMsgList && !patron.threads ){
					var M, List = patron.Messages.getByFolder(patron.getFolderId(), Math.max(GET.page>>0, 1));

					if( List.length ){
						if( 0 && /corp/.test(patron.userdomain) ){
							// DISABLED:  https://jira.mail.ru/browse/MAIL-13841
							var from = -1, to = -1;

							for( var i = 0, n = List.length; i < n; i++ ){
								M = List[i];
								if( from == -1 ){
									if( M.Unread && !M._loading && !M._loaded && !M._preload ){
										from = i;
										break; // preload by one msg
									}
								} else if( !M.Unread || M._loading || M._loaded ) {
									break;
								} else {
									to	= i;
								}
							}

							if( from > -1 ){
								M = List[from];
								patron.Messages.load({ folder: M.FolderId, id: M.Id }, to > 0 ? to-from+1 : 0);
							}
						} else {
							M = List[0];
							if( M.Unread && !M._loading && !M._loaded && !M._preload ){
								patron.Messages.load({ folder: M.FolderId, id: M.Id }, 0);
							}
						}
					}
				}
			}).trigger('preload.messages');


			if( patron.isMsgListPage() && !patron.threads ){
				this.__sort.global = (GET.sortby || patron.messagesSort);
				this.cts[patron.getFolderId() + '_' + Math.max(patron.messagesPage, 1) + '_' + this.__sort.global] = patron.CurrentTimestamp;
			}

			setInterval(function (){
				if( !patron.Updater.active || (ajs.now() - patron.Updater.lastTS > 120000) ){
					patron.Updater.reload();
				}
			}, 30*1000);
		},

		getCacheKey: function (id, page, sort){
			return	this.cts[id+'_'+Math.max(page|0,1)+'_'+(sort || patron.messagesSort || '')];
		},


		// @private
		_request: function (id, data, force){
			var
				  fId		= patron.isMsgListPage() || (patron.isReadMsgPage() || patron.isThreadPage()) ? defined(data.folder, patron.getFolderId()) || 0 : patron.Folder.INBOX
				, page		= patron.isMsgListPage() ? Math.max(patron.messagesPage, 1) : 1
				, sortby	= ajs.htmlEncode(GET.sortby || '') || patron.messagesSort
				, cacheKey	= fId + '_' + page + '_' + sortby
				, complete	= data.complete
			;

			var folder_sent = patron.Folder.SENT;
			var folder_data = patron.getFolderData(fId);

			// MAIL-13537
			if (fId == folder_sent || (folder_data && folder_data.ParentId == folder_sent)) {
				if (sortby == 'f') {
					sortby = 't';
				}
				else if (sortby == 'F') {
					sortby = 'T';
				}
			}

			if (sortby && ((sortby != this.__sort.global)/* || (this.__sort.folder[fId] = sortby) == this.__sort.global*/)) {
				// Reset cts
				this.__sort.global = sortby;
				this.cts[cacheKey] = 0;
			}

			// Set request data
			data = {
				  force:	+(!!window.QUnit || ajs.offline || (patron.isMsgList && !patron.Folders.hasCache(fId, page)))
				, now:		Date.now()
				, page:		page
				, sortby:	sortby
				, ref:		patron.getPageLabel()
				, bnrs:		(data.bnrs || 'N')
				, email:	patron.useremail
				, cts:		(this.cts[cacheKey] || 1)

				// threads
				, offset: (page-1) * patron.messagesPerPage
				, limit: patron.messagesPerPage
				, htmlencoded: false
				, last_modified: this.cts[cacheKey] || -1
			};

			if( fId >= 0 && fId != patron.Folder.MRIM_ARCH && !patron.isFilterFolder(fId) ){
				data.folder	= fId;
			}


			if( this.prevR ) {
				this._abort(this.prevR);
			}

			this.prevR = this.Request[id] = {
				  'id':			id
				, 'data':		data
				, 'isAjax':		true || !force // https://jira.mail.ru/browse/MAIL-3230
			};

			var ajaxData = {
				  data:		data
				, isUser:	!!force
				, loading:	!!data.force
				, loadPage:	true
				, complete:	this._receive.bind(this, id, complete)
			};

			if (patron.threads) {
				if (ajaxData.data.force) {
					ajaxData.data.last_modified = -1;
				}

				this.Request[id].transport = patron.API.ajax(ajs.extend(ajaxData, { method: 'threads/status' }));
			}
			else {
				var sort = {
					type: 'date',
					order: 'desc'
				};

				if (sortby == 'd') {
					sort.type = 'date';
					sort.order = 'asc';
				} else if (sortby == 'f') {
					sort.type = 'from';
					sort.order = 'asc';
				} else if (sortby == 'F') {
					sort.type = 'from';
					sort.order = 'desc';
				} else if (sortby == 'T') {
					sort.type = 'to';
					sort.order = 'desc';
				} else if (sortby == 't') {
					sort.type = 'to';
					sort.order = 'asc';
				} else if (sortby == 's') {
					sort.type = 'from';
					sort.order = 'asc';
				} else if (sortby == 'S') {
					sort.type = 'from';
					sort.order = 'desc';
				}

				this.Request[id].transport = patron.API({
					url: 'messages/status',
					convertResultToOldApi: true,
					isUser: !!force,
					loading: !!data.force,
					data: {
						nolog: force ? 0 : 1,

						// old params
						cts: data.cts,
						force: data.force,
						now: data.now,
						sortby: sortby,
						page: data.page,

						// new params
						sort: sort,
						folder: data.folder,
						offset: data.offset,
						limit: data.limit,
						last_modified: data.cts,
						htmlencoded: false
					},
					complete: this._receive.bind(this, id, complete)
				});
			}

			// Опрос сервера о его статусе
			$.getJSON('/srv-st.json?' + ajs.uuid(), function (srv) {
				patron.needReloadPage('build', srv.build);
			});
		},

		/**
		 * @private
		 * @param	{Number} id
		 * @param	{patron.Ajax.Result}	Result
		 */
		_receive: function (id, callback, Result){
			var Request		= this.Request[id];
			var Params		= Request.data;
			var isLast		= (id == this.idx);

			if( !Request.isAjax ){
				Result	= new patron.Ajax.Result( Result, Request.data, null, 'success' );
			}

			this._abort(Request);

			if( isLast ){
				if( Result.isOK() || Result.isNOP() && Math.random() <= .1 ){
					var _dt = ajs.now() - Result.getOpts().__ts;
					patron.radar('checknew', Result.getStatus()+'='+_dt, _dt);
				}

				patron.Events.fire('beforestop.updater');

				this.active	= false;

				if( Params.bnrs == 'Y' ){
					// Reload banners + counters
					patron.Banners.View.reload();
				}


				var Data = Result.getData();

				this.radar(Request.isAjax ? 'ajax' : 'iframe', 1)('processing');


				if( !this.disabled && Result.isOK() ){
					// Last updated timestamp
					var cacheKey		= Params.folder+'_'+Params.page+'_'+Params.sortby;
					var last_modified	= this.cts[cacheKey] = (Data.cts || Result.last_modified) || patron.CurrentTimestamp;

					if( patron.threads ){
						patron.Threads.merge(Data.threads);

						Data.sortBy = patron.messagesSort;
						Data.folders_hash = last_modified;
						Data.folders = patron.Utils.AjaxConverter.convertThreadsStatusFolders(Data.folders);

						Data.messages_hash = last_modified;
						Data.messages = patron.Utils.AjaxConverter.convertThreadsStatusMessages(Data.threads)
					}


					if (Data.token) {
						patron.updateToken(Data.token);
					}

					if (Data.tokens) {
						$.extend(patron.tokens, Data.tokens);
					}

					if (Data.collectors) {
						/** @deprecated */
						patron.collectors = Data.collectors;
					}

					if( Data.folders){
						if( !patron.isMsgList ){
							// https://jira.mail.ru/browse/MAIL-3736
							ajs.each(patron.Folders.getAll(), function (oF, nF){
								for( var i = 0, n = Data.folders.length; i < n; i++ ){
									if( (nF = Data.folders[i]) && (oF.Id == nF.Id) && (oF.Messages != nF.Messages || oF.Unread != nF.Unread) ){
										Counter.d(nF.Id > 0 ? 555145 : 555144);
										break;
									}
								}
							});
						}

						this.radar('FOLDERS');

						/** @namespace Data.folders_hash */
						patron.Folders.set( Data.folders, Data.folders_hash );

						this.radar('FOLDERS', 1);

						if( !Data.messages ){
							// expire cache
							patron.Messages.set(Params.folder, [], ajs.now());
						}
					}

					if( Data.messages ){
						this.radar('MESSAGES');

						// MAIL-16248
						if ((Data.sortBy === 'd' || patron.messagesSort === 'd') && $.isArray(Data.messages) && Data.messages.length === 0 && $.isArray(Data.folders)) {
							var folder;
							$.each(Data.folders, function (k, v) {
								var next = true;
								if (v.Id == Params.folder) {
									folder = v;
									next = false;
								}
								return next;
							});
							if (folder && folder.Messages) {
								Data.sortBy = 'D';
								this.__sort.global = null;
								this.cts = {};
							}
						}

						/** @namespace Data.messages_hash */
						patron.messagesSort	= Data.sortBy;
						patron.Messages.set(Params.folder, Data.messages, Data.messages_hash, 0);

						this.radar('MESSAGES', 1);

						/** @namespace patron.browserNotification */
						if( ajs.blurred && patron.browserNotification && Jinn.hasRight() ){
							var
								  ts = store.get('last_message_ts')
								, list = ajs.filter(Data.messages, function (msg){ return msg.DateUTS > ts && msg.Unread; })
								, count = list.length
							;

							if( count ){
								//noinspection JSUnresolvedVariable

								var icon = (count == 1 && list[0].SPF) ?
									patron.Utils.getAvatarSrcByMessage(list[0], 90) :
									patron.Utils.getAvatarSrc(patron.IsMyCom ? 'mail-team@corp.my.com' : 'noreply@corp.mail.ru', null, 90)
								;

								icon = location.protocol + icon + (~icon.indexOf('?') ? '&' : '?') + Math.random();

								var notify = {
									  icon:  icon
									, title: Lang.get('jinn.new_messages').replace('%s', ajs.plural(count, Lang.get('unread.plural'), ' ') +' '+ ajs.plural(count, Lang.get('Messages').letter))
								};

								if( count == 1 ){
									ajs.extend(notify, {
										  title: replaceEntity(list[0].Subject || Lang.get('message.email.untitled'))
										, text:  Lang.get('jinn.from') + replaceEntity(list[0].FromShort)
									});
								}

								notify = Jinn.say(notify);
								notify.onclick = function (){
									//noinspection JSUnresolvedFunction
									window.focus();
									jsHistory.disabled = jsHistory.disabled || !patron.isMailboxPage();

									$.event.trigger('ui-abstract-action', {
										number: count,
										chain: ['browserNotification', 'click']
									});

									if( count == 1 ){
										if (patron.threads) {
											jsHistory.set(patron.getPageURL('thread', { id: list[0].thread }));
										} else {
											jsHistory.set(patron.getPageURL('readmsg', { id: list[0].Id }) + '?referer=snotifer');
										}
									}
									else {
										jsHistory.set(patron.getPageURL('msglist') + '?referer=snotifer');
									}

									this.cancel();
								};

								store.set('last_message_ts', list[0].DateUTS);
								patron.Messages.getSafe(list[0].Id).jinnNotify = notify;
							}
						}
					}

					if (callback) {
						callback(Data);
					}
				}
				else if( Result.isAccessDenied() ){
					/** @namespace Data.section */
					if( Data && Data.section == 'folder'  )
						patron.Events.fire('accessdenied.folder', Params.folder);
				}


				documentView.redraw();

				patron.Events.fire('stop.updater');

				// Disabled by RubaXa
				//this.radar('processing', 1)('all', 1)(true);
			}

			delete this.Request[id];
		},

		_abort: function(R){
			if( R === undef ) R = this.Request[this.idx];

			if( R ){
				var tr = R.transport;

				if( tr ){
					if( R.isAjax ) {
						tr.abort();
					}
					else {
						try {
							var win	= tr.contentWindow;
							if( win ){
								if( 'stop' in win ) win.stop();
								else if( win.document ) win.document.execCommand('Stop');
							}
						}
						catch (er) {}

						$(tr).delay(0).queue(function(){ $(this).remove(); });
					}
				}

				R.transport = null;
				delete R.transport;
				clearTimeout(R.timeout);
			}
		},


	// @public
		abort: function (){
			try { this._abort(); } catch (e){}
			this.idx++;	// ?!?!
		},

		stop: function (force){
			if( force ){
				this.abort();
			}
			if( !this.disabled ) this.stopCnt = 1; else this.stopCnt++;
			this.disabled	= true;
		},

		start: function (reload, data){
			this.stopCnt	= Math.max(0, this.stopCnt - 1);
			this.disabled	= this.stopCnt > 0;
			if( reload ) this.reload(true, data);
		},

		reload: function (force, data){
			if( !this.disabled ){
				if( force || (ajs.now() - this.lastTS > 30000) ){
					this.lastTS	= ajs.now();
					this.active	= true;
					this.radar('clear')('all')(force ? 'iframe' : 'ajax');

					clearTimeout(this._timeId);
					this._timeId = setTimeout(function (){
						 patron.Updater._request( ++patron.Updater.idx, data || {}, force )
					}, 50);
				}
			}
		}

	}; // Updater


	jsLoader.loaded('{patron}patron.Updater');
});
