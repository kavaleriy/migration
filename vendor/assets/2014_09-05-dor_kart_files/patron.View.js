/*global Template, createRadar*/
/** @namespace GET.q_flag */
/** @namespace GET.q_attach */
/** @namespace patron.filesPerPage */
/** @namespace patron.SearchData.search.dates */
/** @namespace patron.SearchData.search.SearchFolder */


jsLoader.require([
	  '{patron}patron.core'
	, '{patron.view}patron.View.Elms'
	, '{patron.view}patron.View.Pager'
	, '{patron.view}patron.View.Banners'
	, '{patron.view}patron.View.Folders'
	, '{patron.view}patron.View.Messages'
	, '{patron.view}patron.View.ReadMsg'
	, '{patron.view}patron.View.SentMsg'
	, '{patron.view}patron.View.Compose'
	, '{patron.view}patron.View.LeftMenu'
	, '{patron.view}patron.View.LettersList'
	, '{patron.view}patron.View.PortalMenuSearch'
], function (){
	// Template settings
	Template.OPEN	= '#{';
	Template.CLOSE	= '}';


	// WTF????
	jsClass.create('patron.ReadMsg').statics({ radar: createRadar('mailru_ReadMsg') });
	jsClass.create('patron.Banners').statics();


	// Views
	patron.Banners.View		= new patron.View.Banners();
	patron.ReadMsg.View		= new patron.View.ReadMsg();


	jQuery(function (){
	// Build Views
	documentView
	/**/
		.addSubView(new patron.View.Elms.Head({
			  id:			'head'
			, events:		'reload.folders update.folders update.message update.head updated.folder'
			, idMenuRow:	'#row_link_to_unread'
			, idNavigation:	'#ddbuttons'
		}))
		.group({
			  id:		'SentMsgGroup'
			, _active:	function (){ return !patron.v2 && (patron.isComposePage() || patron.isSendMsgOkPage()); }
		}, function (){
			this
				.addSubView(new patron.View.Compose({
					  id:		'sentmsg'
					, idView:	'#MailRuSentMsg'
					, active:	patron.isComposePage()
					, autoload:	true
					, _active:	function (){ return patron.isComposePage(); }
				}))
				.addSubView(new patron.View.SentMsg({
					  id:		'sendmsgok'
					, url:		'/compose/?ajax_call=1&func_name=get_sendmsgok'
					, idView:	'#MailRuSentMsgOk'
					, cache:	true
					, active:	patron.isSendMsgOk
					, _active:	function (){ return patron.isSendMsgOkPage(); }
				}))
			;
		})
		.group({
			  id:		'MsgListGroup'
			, _active:	function (){
				return	!patron.v2 && (patron.isMsgListPage() || patron.isReadMsgPage() || patron.isSentMsg || patron.isSendMsgOk);
			}
			, _redraw: function (r, a)
			{
				if( !r )
				{
//					jsView.get('leftcol__msglist').getView().display( a );
				}
			}
		}, function ()
		{
			/*
			this.group({ id: 'leftcol__msglist' }, function ()
			{
				this.addSubView(new patron.View.Folders({
					  id:			'folders.menu'
					, idView:		'#leftcol__folders'
					, idMenu:		'#foldersStartId,#msglist__filters'
					, clSel:		'menu__item__link_act'
					, clIsUnread:	'menu__item__link_unread'
					, clClearHover:	'menu__item__link__clear_hover'
				}));
			});
			*/

			this
				/*
				.addSubView(new patron.View.Folder({
					  id:		'folder.content'
					, idMessagesView: 'folder.messages'
					, idView:	'#MsgListContent'
					, idMenu:	'#foldersStartId'
					, idTitle:	'#id-folder-name'
					, idContent:'#MainForm'
					, idEmpty:	'#id-messages-list-empty'
					, idSender:	'.ajax-add-sender'
					, _active:	function (){ return patron.isMsgListPage(); }
				}))
				*/
				.group({
					  id: 'FolderGroup'
					, _active: function (){ return !patron.v2 && (patron.isMsgListPage() || patron.isReadMsgPage()); }
				}, function ()
				{
					this
						.addSubView(new patron.View.Folders.DropDown({
							  id:			'folders.dropdown'
							, idMessagesView: 'folder.messages'
							, idTpl:		'#FolderDD'
							, idView:		'#MsgList_ReadMsg'
							, cssElms:		'.dropdown'
							, clSel:		'dropdown__list__item_disabled'
							, clLink:		'dropdown__button, .dropdown__checkbox'
							, clContainer:	'dropdown__list'
						}))
						.addSubView(new patron.View.Folder.SpamButtons({
							  id:		'folder.spambuttons'
							, idView:	'#MsgList_ReadMsg .js-spam'
						}))
						.group({
							  id:		'MessagesGroup'
							, _active:	function (){ return patron.isMsgListPage(); }
						}, function ()
						{
							this
								.addSubView(new patron.View.PageOfPages({
									  idTpl:	'#menu_msg_pageofpages_ejs'
									, idView:	'#MsgListContent .js-PageOfPages:first'
									, isTop:	true
									, count:	function (){ return patron.Folders.getSafe()[patron.threads ? 'Threads' : 'Messages']; }
								}))
								.addSubView(new patron.View.PageOfPages({
									  idTpl:	'#menu_msg_pageofpages_ejs'
									, idView:	'#MsgListContent .js-PageOfPages:last'
									, count:	function (){ return patron.Folders.getSafe()[patron.threads ? 'Threads' : 'Messages']; }
								}))
								.addSubView(new patron.View.Paging({
									  id:			'msglist__paging'
									, idTpl:		'#paging_ejs'
									, idView:		'#MsgListContent .js-paging'
									, tag:			'paging'
									, pages:		function (){ return Math.ceil(patron.Folders.getSafe()[patron.threads ? 'Threads' : 'Messages'] / patron.messagesPerPage); }
									, _tplExtData:	function (){ return { URLQ: patron.isFilterFolder() ? patron.SearchData.search.URLQ : '' } }
								}))
								.addSubView(new patron.View.Messages({
									  id:				'folder.messages'
									, tag:				'letterslist'
									, idRoot:			'#MsgList_ReadMsg'
									, idMsgPrefix:		'msglist-'
									, getListId:		function () {
										return 'ML'+ patron.getFolderId();
									}
									, cssList:			'#id-messages-list'
									, cssToolBar:		'.toolbar'
									, cssSort:			'.is-sort'
									, clMsg:			'js-msg'
									, clIco:			'js-ico'
									, clMsgSel:			'messageline_selected'
									, clMsgUnread:		'messageline_unread'
									, clIcoUnread:		'icon_message-status_500'
									, clIcoRead:		'icon_message-status_0'
									, clMsgAttach:		'messageline__attach_hasOne'
									, clMsgFlag:		'messageline__flag__icon'
									, clMsgFlagged:		'icon_message-flag_on'
									, clMsgIco:			'messageline__body__name messageline__body__name_ico-from'
									, clMsgIcoNo:		'messageline__body__name'
									, clViewType:		'toolbar__buttons_messagelist-mode'
									, clListShort:		'messagelist_media_simple'
									, clSwitchShort:	'mr_toolbar__mode_short'
									, switchMode: {
										cnActive:	'dropdown__list__item__link_selected',
										cssShort: 	'.js-messagelist-compact',
										cssFull: 	'.js-messagelist-microformat'
									}
									, clFolderHover:	'menu__item__link_hover'
									, clDisabled:		'messageline_disabled'
									, dragdrop:			true
									, tplId:			'tplMsg'
									, template:			'#msglist__messageline_ejs'
									, idEmptyView:		'#msglist__empty_ejs'
									, isEmptyCollector:	'#ejs-msglist__empty_collector'
									, idMultiSelect:	'#msglist__multi_select_ejs'
									, countInActiveFolder: function () {
										return patron.Folders.getSafe().Messages;
									}
								}))
							;
						})
						.addSubView(new patron.View.ReadMsgNew({
							  id:		'readmsg'
							, idView:	'#ReadMsg'
							, active:	patron.isReadMsgPage()
							, _active:	function (){ return patron.isReadMsg; }
							, clNav:	'paging__item_disabled'
						}))
					;
				})
			;
		})
		.addSubView(new patron.View.PortalMenuSearch({ id: 'portal_menu_search' }))
		.group({
			  id:		'search'
			, _active:	function (){ return !patron.v2 && patron.isSearchPage(); }
			, _one:		function (){
							this.$Filters = $('#leftcol__search__filters :checkbox').click(function (){
								jsHistory.build($('#leftcol__search__filters').toObject(), ['q_read', 'q_flag', 'q_attach', 'page']);
							});
						}
			, _redraw:	function (r, a){
				if( !r ){
					jsView.get('leftcol__search').getView().display( a );
					jsView.get('search__result').getView().display( a );
				}
				else {
					this.$Filters
						.filter('.js-unread').attr('checked', GET.q_read == 2).end()
						.filter('.js-flagged').attr('checked', GET.q_flag == 2).end()
						.filter('.js-attach').attr('checked', GET.q_attach == 1).end()
					;
				}
			}
		}, function (){

			// Left coll
			this.group({ id: 'leftcol__search' }, function (){
				this
					.addSubView(new patron.View.LeftMenu({
						  id:		'leftcol__search__persons'
						, idTpl:	'#leftcol__search__persons_ejs'
						, tag:		'menu'
						, _tplData:	function (){ return patron.SearchData.search; }
						, getItems:	function (){ }
					}))
					.addSubView(new patron.View.LeftMenu({
						  id:		'leftcol__search__folders'
						, idTpl:	'#leftcol__search__folders_ejs'
						, tag:		'menu'
						, _tplData:	function (){ return patron.SearchData.search; }
						, getItems:	function (){ return patron.SearchData.search.SearchFolder; }
					}))
					.addSubView(new patron.View.LeftMenu({
						  id:		'leftcol__search__dates'
						, idTpl:	'#leftcol__search__dates_ejs'
						, tag:		'menu'
						, _tplData:	function (){ return patron.SearchData.search.dates; }
					}))
					.addSubView(new jsView({
						  id: 'leftcol__search__informer'
						, _active: function (){ return $.trim(GET.q_query||'') != ''; }
						, _redraw: function (r, a){
							if( r ){
								this.getView('.js-url').each(function (){ this.href = this.href.replace(/(q|common)=[^&]*/, '$1='+ajs.encode(GET.q_query)); });
								this.getView('.js-query').text(GET.q_query);
							}
							else {
								this.getView().display(a);
							}
						}
					}))
				;
			});


			// Content
			this.group(new patron.View.LettersList({ id: 'search__result' }), function (){
				this
					.addSubView(new patron.View.PageOfPages({
						  idTpl:	'#menu_msg_pageofpages_ejs'
						, idView:	'#search__result .js-PageOfPages:first'
						, isTop:	true
						, count:	function (){ return patron.SearchData.search.count; }
					}))
					.addSubView(new patron.View.PageOfPages({
						  idTpl:	'#menu_msg_pageofpages_ejs'
						, idView:	'#search__result .js-PageOfPages:last'
						, count:	function (){ return patron.SearchData.search.count; }
					}))
					.addSubView(new patron.View.Paging({
						  id:			'search__paging'
						, idTpl:		'#paging_ejs'
						, idView:		'#search__result .js-paging'
						, tag:			'paging'
						, pages:		function (){ return Math.ceil(patron.SearchData.search.count / patron.messagesPerPage); }
						, _tplExtData:	function (){ return { URLQ: patron.SearchData.search.URLQ } }
					}))
					.addSubView(new patron.View.Folders.DropDown({
						  idTpl:		'#FolderDD'
						, idView:		this.idView
						, idMessagesView: 'search.messages'
						, cssElms:		'.dropdown'
						, clSel:		'dropdown__list__item_disabled'
						, clLink:		'dropdown__button, .dropdown__checkbox'
						, clContainer:	'dropdown__list'
					}))
					.addSubView(new patron.View.Folder.SpamButtons({
						  idView:	'.js-spam, .ajax-add-sender'
					}))
					.addSubView(new patron.View.Messages({
						  id:			'search.messages'
						, tag:			'letterslist'
						, idRoot:		'#search__result'
						, idMsgPrefix:	'search-'
						, getListId:	function () {return 'search-messages-list';}
						, cssList:		'#search-messages-list'
						, cssToolBar:	'.toolbar'
						, cssSort:		'.is-sort'
						, clMsg:		'js-msg'
						, clIco:		'js-ico'
						, clMsgSel:		'messageline_selected'
						, clMsgUnread:	'messageline_unread'
						, clIcoUnread:	'icon_message-status_500'
						, clIcoRead:	'icon_message-status_0'
						, clMsgAttach:	'messageline__attach_hasOne'
						, clMsgFlagged: 'icon_message-flag_on'
						, clMsgIco:		'messageline__body__name messageline__body__name_ico-from'
						, clMsgIcoNo:	'messageline__body__name'
						, clViewType:	'toolbar__buttons_messagelist-mode'
						, clListMicroformat:	'messagelist_search_expanded'
						, clListShort:	'messagelist_media_simple'
						, clSwitchShort:'mr_toolbar__mode_short'
						, switchMode:	{ cnActive: 'dropdown__list__item__link_selected', cssShort: '.js-messagelist-compact', cssFull: '.js-messagelist-microformat' }
						, clFolderHover:'lmTRMove'
						, clDisabled:	'messageline_disabled'
						, clMessageLink: 'messageline__body__link'
						, dragdrop:		false
						, tplId:		'search__result_tpl'
						, template:		'#search__messageline_ejs'
						, idEmptyView:	'#search__result__empty_ejs'
						, getFolder:	function (){
											var id = GET.q_folder;
											id = -1 - (id >= 0 ? id : 0);
											return	patron.Folders.getSafe( id );
										}
						, countInActiveFolder: function () {
							return patron.SearchData.search.count;
						}
					}))
				;
			});
		})
		.group({
			  id:		'fileSearch'
			, _active:	function (){ return !patron.v2 && patron.isFileSearchPage(); }
			, _redraw:	function (r, a)
			{
				if( !r )
				{
					jsView.get('leftcol__fileSearch').getView().display( a );
					jsView.get('fileSearch__result').getView().display( a );
				}
			}
		}, function ()
		{
			this.group({ id: 'leftcol__fileSearch' }, function ()
			{
				this
					.addSubView(new patron.View.LeftMenu({
						  id:		'leftcol__fileSearch__folders'
						, idTpl:	'#leftcol__fileSearch__folders_ejs'
						, tag:		'menu'
						,  _onReady: function () {
							this.getView().delegate('.js-link', 'click', function(){
								// MAIL-6310
								var id = $(this).data('folder_id'), counters = {
									'0': 716190,
									'500000': 716191,
									'-1': 716192
								};
								Counter.sb(counters[id] || 716193);
							});
						}
						, _tplData:	function () {

							var params = {
								Folder: patron.Folders.getAll(),
								folder_id: 0,
								content_type_id: -1,
								only_hidden: 0,
								q_query: ''
							};

							if (defined(GET.folder_id)) {
								params.folder_id = encodeURIComponent(GET.folder_id);
							}

							if (defined(GET.content_type_id)) {
								params.content_type_id = encodeURIComponent(GET.content_type_id);
							}

							if (GET.only_hidden) {
								params.only_hidden = 1;
							}

							if (GET.q_query) {
								params.q_query = encodeURIComponent(GET.q_query);
							}

							return params;
						}
					}))
					.addSubView(new patron.View.LeftMenu({
						  id:		'leftcol__fileSearch__types'
						, idTpl:	'#leftcol__fileSearch__types_ejs'
						, tag:		'menu'
						,  _onReady: function () {
							this.getView().delegate('.js-link', 'click', function() {
								// MAIL-6310: rb.counters
								var id = $(this).data('content_type_id'), counters = {
									'1': 716183,
									'4': 716184,
									'2': 716185,
									'3': 716186,
									'0': 716187,
									'-1': 716188
								};
								counters[id] && Counter.sb(counters[id]);
							});
						}
						, _tplData:	function () {

							var params = {
								folder_id: 0,
								content_type_id: -1,
								only_hidden: 0,
								q_query: ''
							};

							if (defined(GET.folder_id)) {
								params.folder_id = encodeURIComponent(GET.folder_id);
							}

							if (defined(GET.content_type_id)) {
								params.content_type_id = encodeURIComponent(GET.content_type_id);
							}

							if (GET.only_hidden) {
								params.only_hidden = 1;
							}

							if (GET.q_query) {
								params.q_query = encodeURIComponent(GET.q_query);
							}

							return params;
						}
					}))
					.addSubView(new patron.View.LeftMenu({
						  id:		'leftcol__fileSearch__other'
						, idTpl:	'#leftcol__fileSearch__other_ejs'
						, tag:		'menu'
						,  _onReady: function () {
							this.getView().delegate('.js-link', 'click', function(evt) {
								// MAIL-6310
								Counter.sb(716189);
							});
						}
						, _tplData:	function () {
							return {
								only_hidden: defined(GET.only_hidden) ? encodeURIComponent(GET.only_hidden) : 0,
								folder_id: defined(GET.folder_id) ? encodeURIComponent(GET.folder_id) : null,
								q_query: defined(GET.q_query) ? encodeURIComponent(GET.q_query) : '',
								content_type_id: defined(GET.content_type_id) ? encodeURIComponent(GET.content_type_id) : -1
							};
						}
					}))
				;
			});

			this.group(new patron.View.LettersList({
				  id:			'fileSearch__result'
			}), function ()
			{
				this
					.addSubView(new jsView({
						  _one: function () {
							var $parent = this.parentView().getView();
							this.$title = $('#id-folder-name', $parent);
							this.$archiveButtons = $('.js-fileInArchive,.js-fileFromArchive', $parent);
							this.$listContainer = $('#fileSearch-messages-list');
							this.$searchInput = $('.js-input', jsView.get('portal_menu_search').$form);
						}
						, _redraw: function (r, a) {
							if (r) {
								if (this.isChange('q_query', GET.q_query)) {
									this.$title.innerHTML(GET.q_query ? Lang.get('search.results') : Lang.get('Files').Title);

									if (!GET.q_query) {
										this.$searchInput.focus().val('').blur();
									}
								}
								if (this.isChange('only_hidden', GET.only_hidden)) {
									this.$archiveButtons.display(0).filter(GET.only_hidden ? '.js-fileFromArchive' : '.js-fileInArchive').display(1);
								}
								if (this.isChange('folder_id', GET.folder_id)) {
									this.$listContainer.toggleClass('messagelist_files-search_short',!defined(GET.folder_id) || GET.folder_id != -1);
								}
							}
						}
					}))
					.addSubView(new patron.View.PageOfPages({
						  idTpl:	'#menu_fileSearch_pageofpages_ejs'
						, idView:	'#fileSearch__result .js-PageOfPages:first'
						, isTop:	true
						, count:	function (){ return patron.FilesSearchData.total; }
						, _tplData: function () {
							var total = this.count(), page = ajs.isset(GET.page, 1), num = patron.filesPerPage;
							return {
								  MessageCount:		total
								, FirstMessage:		(page - 1) * num + 1
								, LastMessage:		Math.min(page * num, total)
								, messagesPerPage:	num
								, sortTop:			this.isTop
							};
						}
					}))
					.addSubView(new patron.View.PageOfPages({
						  idTpl:	'#menu_fileSearch_pageofpages_ejs'
						, idView:	'#fileSearch__result .js-PageOfPages:last'
						, count:	function (){ return patron.FilesSearchData.total; }
						, _tplData: function () {
							var total = this.count(), page = ajs.isset(GET.page, 1), num = patron.filesPerPage;
							return {
								  MessageCount:		total
								, FirstMessage:		(page - 1) * num + 1
								, LastMessage:		Math.min(page * num, total)
								, messagesPerPage:	num
								, sortTop:			this.isTop
							};
						}
					}))
					.addSubView(new patron.View.Paging({
						  id:			'fileSearch__paging'
						, idTpl:		'#paging_ejs'
						, idView:		'#fileSearch__result .js-paging'
						, tag:			'paging'
						, pages:		function (){ return Math.ceil(patron.FilesSearchData.total / patron.filesPerPage); }
						, _tplExtData:	function () {

							var params = {
								folder_id: 0,
								content_type_id: -1
							};

							if (defined(GET.folder_id)) {
								params.folder_id = GET.folder_id;
							}

							if (defined(GET.content_type_id)) {
								params.content_type_id = GET.content_type_id;
							}

							if (GET.only_hidden) {
								params.only_hidden = GET.only_hidden;
							}

							if (GET.q_query) {
								params.q_query = GET.q_query;
							}

							return { URLQ: '&' + ajs.toQuery(params) };
						}
					}))
					.addSubView(new patron.View.Folders.DropDown({
						  idTpl:		'#FolderDD'
						, idView:		this.idView
						, idMessagesView: 'fileSearch.messages'
						, cssElms:		'.dropdown'
						, clSel:		'dropdown__list__item_disabled'
						, clLink:		'dropdown__button, .dropdown__checkbox'
						, clContainer:	'dropdown__list'
					}))
					.addSubView(new patron.View.Messages({
						  id:			'fileSearch.messages'
						, tag:			'letterslist'
						, idRoot:		'#fileSearch__result'
						, idMsgPrefix:	'fileSearch-'
						, getListId:	function () {return 'fileSearch-messages-list';}
						, cssList:		'#fileSearch-messages-list'
						, cssToolBar:	'.toolbar'
						, cssSort:		'.is-sort'
						, clMsg:		'js-msg'
						, clIco:		'js-ico'
						, clMsgSel:		'messageline_selected'
						, clMsgUnread:	'messageline_unread'
						, clIcoUnread:	'icon_message-status_500'
						, clIcoRead:	'icon_message-status_0'
						, clMsgAttach:	'messageline__attach_hasOne'
						, clMsgFlagged: 'icon_message-flag_on'
						, clMsgIco:		'messageline__body__name messageline__body__name_ico-from'
						, clMsgIcoNo:	'messageline__body__name'
//							, clViewType:	'toolbar__buttons_messagelist-mode'
						, clExpandedSwitcher:'js-switcher'
						, clExpandedSwitcherShort:'attachlist__header__mode_short'
						, clExpandedList:'filesearch__thumbnail__list'
						, clExpandedThumbnail:'filesearch__thumbnail'
						, clExpandedThumbnailDownloadLink:'filesearch__thumbnail__download__link'
						, clExpandedThumbnailAttachToCloudLink:'js-attachToCloud'
						, clExpandedThumbnailCheckboxLabel:'filesearch__thumbnail__checkbox__label'
						, clExpandedThumbnailBody:'filesearch__thumbnail__body'
//							, clListShort:	'messagelist_simple'
//							, clSwitchShort:'mr_toolbar__mode_short'
//							, switchMode:	{ cnActive: 'button-a_active', cssShort: '.button-a_messagelist-simple', cssFull: '.button-a_messagelist-microformat' }
						, clFolderHover:'lmTRMove'
						, clDisabled:	'messageline_disabled'
						, dragdrop:		false
						, tplId:		'fileSearch__result_ejs'
						, tplExpandedId:'fileSearch__result__expanded_ejs'
//						, template:		'#files-search__messageline_ejs'
						, idEmptyView:	'#fileSearch__result__empty_ejs'
						, getFolder:	function (){
											var id	= patron.getFolderId();
											return	patron.Folders.getSafe( id );
										}
						, getMessages: function () {
							return patron.FilesSearchData.list;
						}
						, countInActiveFolder: function () {
							return patron.FilesSearchData.total;
						}
					}))
				;
			});
		});
		/* patron.Views > */
	});

	jsCore.notify('patron.Views.ready');
	jsLoader.loaded('{patron.view}patron.View');
});
