/**
 * @class	patron.View.Messages
 * @author	RubaXa	<trash@rubaxa.org>
 */

jsLoader.require([
	  '{labs}jsView'
	, '{labs}TemplateService'
	, '{jQuery}easing'
	, '{patron}patron.MicroFormat'
	, '{patron}patron.Layers'
	, '{patron}patron.BindedCounters'
	, '{patron.ui}patron.ui.ClipInList'
	, '{patron.view}patron.View.Pager'
	, '{patron.utils}patron.Utils'
], function (){
	/**
	 * @class patron.View.Messages
	 */
	jsView
		.create('patron.View.Messages')
		.statics({

			getActive: function () {
				var id = 'folder.messages';
				if (patron.isSearchPage()) {
					id = 'search.messages';
				} else if (patron.isFileSearchPage()) {
					id = 'fileSearch.messages';
				}
				return jsView.get(id);
			}

		})
		.methods({

		_first: patron.v2 ? ajs.F : function (){
			var self = this,  fId = GET.folder, sort = patron.messagesSort;

			this._scbx			= {};
			this.isShort		= !patron.MsglistExpanded;

			this.$View			= $(this.cssList);
			this.idRoot			= this.idRoot || this.idView;
			this.idMsgPrefixLen	= this.idMsgPrefix.length;

			if( this.template ){
				// preload current template
				$.preloadTpl(this.template);
			}

			TemplateParser.add(this.uniqId+'MsgParser', {
				  MsgId:		function(m) { return m.Id; }
				, MsgFolderId:	function(m) { return patron.isFilterFolder() ? GET.folder : m.FolderId; }
				, MsgLine:		function(m) { return (self._scbx[m.Id] ? self.clMsgSel+' ' : '')+(m.Unread >>> 0 ? self.clMsgUnread+' ' : '')+(patron.ui.ClipInList.getId() == m.Id ? 'iAttachExpand ' : ''); }
				, MsgChecked:	function(m) { var c = (self._scbx[m.Id] ? 1 : 0); return (c ? 'checked="true"' : '') + ' title="'+ Lang.get('MessagesCheckBoxTitle')[c] +'"'; }
				, MsgIco:		function(m) { return m.getIcon(); }
				, MsgFlIco:		function(m) { return m.isUnread() && (m.get('FromFull') == 'cards@corp.mail.ru' ? 'fl' : 0) || ''; }
				, MsgTitle:		function(m) {
					var title = '';
					if (m.isUnread()) title += Lang.get('Message').unread;
					if (m.isReply()) title += Lang.get('Message').replied;
					if (m.isForward()) title += Lang.get('Message').forwarded;
					if (!title) title = Lang.get('MessagesMarkUnread');
					return String.ucfirst(title);
				}
				, MsgAttach:	function(m) { return m.Attachment ? self.clMsgAttach : ''; }
				, MsgAttachSize:function(m) { return m.Attachment ? 'title="'+m.Size+'"' : ''; }
				, MsgHref:		function(m) { return patron.getPageURL(!m.inFolder(patron.Folder.DRAFTS) ? 'readmsg' : 'compose', { id: m.id, mode: 'drafts' }); }
				, MsgFrom:		function(m) { return ((m.inFolder(patron.Folder.SENT) || m.inFolder(patron.Folder.DRAFTS)) ? m.ToShort : m.FromShort) || ('<' + Lang.get('message.email.unknown') + '>'); }
				, UserEmail:    function(m) { return this.MsgFromFull(m); }
				, UserEmailText:    function(m) { return String.html2text(this.UserEmail(m)); }
				, MsgFromFull:	function(m) { return ((m.inFolder(patron.Folder.SENT) || m.inFolder(patron.Folder.DRAFTS)) ? m.To : m.From) || ('<' + Lang.get('message.email.unknown') + '>'); }
				, MsgSubject:	function(m) { return patron.isFilterFolder() ? m.getSearchSubject() : m.getSubject(); }
				, MsgSubjectText:	function(m) { return String.html2text(this.MsgSubject(m)); }
				, MsgWbrSubject:	function(m) { return m.getWbrSubject(); }
				, MsgSubjectIco:function(m) { return ( m.isHigh() || m.isLow() ) ? '<i title="'+String.ucfirst((m.isHigh() ? Lang.get('Message').high_priority : (m.isLow() ? Lang.get('Message').low_priority : '')))+'" class="messageline__icon-priority icon icon_priority icon_priority_'+(m.isHigh() ? 'high' : (m.isLow() ? 'low' : '')) + (m.isUnread() ? '-unread' : '')+'"></i>' : ''; }
				, MsgDateTitle:	function(m) { return m.Date; }
				, MsgDate:		function(m) { return m.DateShort; }
				, MsgSize:		function(m) { return m.Size; }
				, IcoFromWho:	function(m) { return m.IcoFromWho ? ' style="background-image: url(//img.imgsmail.ru/mail/ru/images/default/ico-from/12' + m.IcoFromWho + '.png);" class="'+self.clMsgIco+'"' : 'class="'+self.clMsgIcoNo+'"'; }
				, history:			function(m){ return 'rel="history"'; }
				, MsgFlagClass:		function(m){ return m.isFlagged() ? ' '+self.clMsgFlagged+' ' : ' '; }
				, MsgFlagTitle:		function(m){ return Lang.get('MessagesFlags')[+m.isFlagged()]; }
				, MsgMsgText:		function(m){ return patron.newsnippets || !self.isShort ? patron.MicroFormat.text(m, self.isShort) : ''; }
				, MsgFolderName:	function(m){ return m.getFolder().Name; }
				, MsgSnipletText:	function(m){ return m.getSnipletText(); }
				, MsgMakeAvatar:	function(m){ return self.isShort ? '' : patron.MicroFormat.avatar(m, !m.inFolder(patron.Folder.SENT)); }
				, MsgMakeButtons:	function(m){ return self.isShort ? '' : patron.MicroFormat.links(m); }

				, MsgSearchHref:	function(m) {
					return m.inFolder(patron.Folder.DRAFTS)
						? patron.getPageURL('compose', { id: m.id, mode: 'drafts' })
						: patron.getPageURL('readmsg', { id: m.id }) + '?fromsearch=search'+replaceEntity(patron.SearchData.search.URLQ)
					;
				}
				, MsgSearchSnippet:	function(m){ return m.getSearchSniplet(); }
				, MsgSearchSubject:	function(m){ return m.getSearchSubject(); }
				, MsgSearchFrom:	function(m){ return m.getSearchFrom(); }

				, FileId:	function(f) { return f.Id; }
				, FileFolderId:	function(f) { return f.folder_id; }
                , FileFolderHref : function(f) {
                    var url = '/messages', id = f.folder_id;
                    switch (parseInt(id,10)) {
                        case 0      : url += '/inbox'; break;
                        case 950    : url += '/spam'; break;
                        case 500000 : url += '/sent'; break;
                        case 500001 : url += '/drafts'; break;
                        case 500002 : url += '/trash'; break;
                        case 500003 :
                        case 500005 : url = '/agent/archive'; break;
                        default     : url += '/folder/' + id;
                    }
                     return url;
                }
				, FileSize:	function(f) { return String.sizeFormat(f.size); }
				, FileSubject:  function(f) {
					return	String.html2text(patron.Utils.FileSearch.getSubject(f));
				}
				, EnableAttachToCloud: function () {
					return patron.EnableAttachToCloud;
				}
				, FileFolderName:	function(f) {
					var folder = patron.Folders.get(f.folder_id);
					return folder ? String.html2text(folder.Name) : '';
				}
				, FileTime:	function(f) {
					return	patron.Utils.FileSearch.getTime(f);
				}
				, FilePreviewHref:	function(f) {
					return	patron.Utils.FileSearch.getPreviewHref(f);
				}
				, FileName:	function(f) {
					return String.html2text(f.name || ('<' + Lang.get('message.email.unknown') + '>'));
				}
				, FileFromEmail:	function(f) {
					return String.html2text(f.from_to_email || ('<' + Lang.get('message.email.unknown') + '>'));
				}
				, FileFrom:	function(f) {
					return String.html2text((patron.FilesSearchData.version ? (f.from_to_name || f.from_to_email) : (f.from_to)) || ('<' + Lang.get('message.email.unknown') + '>'));
				}
				, FileMsgHref:	function(f) {
					return '/message/' + f.id + '/?folder=' + f.folder_id;
				}
				, FileStatus: function(f) {
					var fid = f.folder_id, status = 0;
					if (fid == 500000) {
						status = 510;
					} else if (fid < 500000) {
						status = 501;
					}
					return status;
				}
				, FileDownloadHref:	function(f) {
					return patron.Utils.FileSearch.getDownloadUrl(f.Id, f.name);
				}
				, FileExtention: function(f) {
					return String.html2text(patron.Utils.FileSearch.getFileExtention(f));
				}
				, FileThumbnail: function(f) {
					return patron.Utils.FileSearch.getThumbnailSrc(f);
				}
				, FileType: function(f) {
					var type_id = f.content_type_id, ext = this.FileExtention(f), result = ext;
					if (type_id == 1) {
						result = 'picture';
					} else if (type_id == 2) {
						result = 'mp3';
					}
					return 'icon_filetype_' + result;
				},


				// thread
				threadLength: function (m){ return m.threadLength }
			});

			if( patron.isMsgList ){
				this.isChange('id', fId);
			}

			this.isChange('hSort', sort+fId);
			this.isChange('sort', sort);
			this.isChange('page'+fId, GET.page);
			this.isChange('pageLoad', GET.page);

			if( patron.isMsgListPage() ){
				fId = this.getFolder().Id;
				this.isChange('hash'+fId, patron.Messages.getHash(fId) || patron.CurrentTimestamp);
			}


			// Message updated
			(function (){
				patron.Events.bind('updated.message', function (evt){
					var msg = evt.DATA, $el = $('#' + this.idMsgPrefix + msg.Id.replace(/(:|;|\.)/g, '\\$1')), c = msg.getChanges();

					if( $el.size() ){
						var u = ('Unread' in c), fl = ('Flagged' in c), r = ('Reply' in c), fw = ('Forward' in c);
						if( u || fl || r || fw ){
							this.upd((fl ? msg.Flagged : undef), ((u || r || fw) ? msg.Unread : undef), $el);
						}
					}
				}.bind(this));
			}).gap(this)();

			this._iForwardRemoveSpam();
		},

		_one: function (){
			this.fID				= !patron.isFilterFolder() && patron.folderId;
			this._scbx				= {};	// selected checkbox

			this.$List				= $( this.cssList );
			this.$Switch			= this.clViewType ? $('.'+this.clViewType, this.idRoot) : $();
			this.$ExpandedSwitch	= this.clExpandedSwitcher ? $('.'+this.clExpandedSwitcher, this.idRoot) : $();
			this.$ToolBar			= $( this.cssToolBar, this.idRoot );
			this.$Sort				= $( this.cssSort, this.idRoot );
			this.$All				= $('input[name="mainCheck"]', this.idRoot);
			this.$prevListContainer	= this._getContainer();
			this.$multiSelect		= $('.js-multi-select', this.idRoot);

			this.Tpl		= new Template(this.uniqId, $('#' + this.tplId)[0], 'text/plain');
			this.Tpl.parser( this.uniqId+'MsgParser' );

			if (this.tplExpandedId) {
				this.TplExpanded = new Template(this.uniqId + 'expanded', jsCore.$('#' + this.tplExpandedId), 'text/plain');
				this.TplExpanded.parser( this.uniqId + 'MsgParser' );
			}

			this._iActions();
			patron.ui.ClipInList.wrap( this.getView() );

			this._toggleSpinner();
		},

		_iForwardRemoveSpam: function (){
			$('.js-reply,.js-replyall,.url-forward,.js-remove,.js-spam,.js-fileDownload,.js-fileToCloud,.js-fileForward,.js-fileInArchive,.js-fileFromArchive, .js-it-spam-definitely, .js-unsubscribe', this.idRoot).click(function (evt){
				var $Btn = $(this)
					, Msg = patron.Messages.get(patron.ReadMsg.ID)
					, isListUnsubscribe = Msg && !!Msg.ListUnsubscribe;

				if ($Btn.hasClass('button-a_disabled')) {
					evt.stopPropagation();
					evt.preventDefault();

				} else if (!($Btn.hasClass('js-reply') || $Btn.hasClass('js-replyall') || $Btn.hasClass('url-forward'))) {
					if( $Btn.hasClass('js-spam') ){
						var F = patron.Folders.getSafe();	// get current folder
						var type = F.isBulk() ? 'notspam' : 'spamabuse';
						patron.Events.fire('spam.click', type);

						if (patron.isReadMsg) {
							if (type == 'notspam') {
								$(window).triggerHandler('nospamLinkClick.readmsg');
							} else {
								$(window).triggerHandler('spamLinkClick.readmsg');
								if (isListUnsubscribe && patron.ListUnsubscribeImmediatlyEnabled) {
									Counter.sb(1853646);
								}
								else if (isListUnsubscribe) {
									Counter.sb(2189258);
								}
							}
						}

					} else if( $Btn.hasClass('js-unsubscribe') ){
						patron.Events.fire('unsubscribe.click');
						Counter.sb(1611231);

					} else if( $Btn.hasClass('js-it-spam-definitely') ){
						patron.Events.fire('spam.click', 'spam.definitely');
					} else if( $Btn.hasClass('js-fileDownload') ){
						patron.Events.fire('fileDownload.click');
						Counter.sb(716195);

					} else if( $Btn.hasClass('js-fileForward') ){
						patron.Events.fire('fileForward.click');
						Counter.sb(716196);

					} else if( $Btn.hasClass('js-fileToCloud') ){
						patron.Events.fire('fileToCloud.click');

					} else if( $Btn.hasClass('js-fileInArchive') ){
						patron.Events.fire('fileInArchive.click');
						Counter.sb(716197);

					} else if( $Btn.hasClass('js-fileFromArchive') ){
						patron.Events.fire('fileFromArchive.click');
						Counter.sb(716198);

					} else {
						patron.Events.fire('move.click', patron.Folder.TRASH);

						if (isListUnsubscribe && patron.ListUnsubscribeImmediatlyEnabled) {
							Counter.sb(1853640);
						}
						else if (isListUnsubscribe) {
							Counter.sb(2189255);
						}
						else {
							Counter.sb(347415);
						}
					}

					evt.preventDefault();
				}
			});
		},

		_getCollectorHost: function() {
			var host = patron.userdomain;

			if (patron.IsExternalAccount) {
				return host;
			}

			var collector = patron.getCollectorInfoByFolderId(patron.getFolderId())
				, email   = collector.email
			;

			if (email && (email = email.match(/@(.*)$/))) {
				host = email[1];
			}

			return host;
		},

		_toggleSpinner: function() {
			var type = patron.Utils.spinner.show() ? 'collector' : 'message';

			this.$View.find('.js-messagelist__empty-' + type)
				.find('.messagelist__empty-collector__providers')
					.addClass('messagelist__empty-collector__provider_' + this._getCollectorHost())
				.end()
			.show();
		},

		_iActions: function (){
			var sm = this.switchMode;

			this.$multiSelect.delegate('.js-link', 'click', function (evt) {
				if (this.selectAllinFolder = this['selectAllinFolder'+patron.getFolderId()] = !this.selectAllinFolder) {
					this.select(true, true);
					this._showMultiSelect();
				} else {
					this.select(false, true);
					for (var id in this._scbx) {
						// deselect on all pages
						this._scbx[id] = false;
					}
					this._hideMultiSelect();
				}
				evt.preventDefault();
			}.bind(this));

			this.$ExpandedSwitch.click(function (){
				this._modeExpanded();
				return false;
			}.bind(this));

			if (sm) {
				this.$Switch.click(function (evt) {
					var $target = $(evt.target).closest('.dropdown__list__item__link', this.$Switch);
					var compact = $target.is(sm.cssShort);
					if (compact != this.isShort) {
						if (patron.MessagelineMedia_split_bubble) {
							if (compact) {
								patron.radar('MessageLineWithBal', 'compactClick=1');
							} else {
								patron.radar('MessageLineWithBal', 'expandClick=1');
							}
						} else {
							if (compact) {
								patron.radar('MessageLine', 'compactClick=1');
							} else {
								patron.radar('MessageLine', 'expandClick=1');
							}
						}
						this._mode(compact, true);
					}
				}.bind(this));

				if( patron.Messages.isShort === ajs.undef ){
					patron.Messages.isShort = !!this.$Switch.find(sm.cssShort +'.'+ sm.cnActive).size();
				}
				this.isShort = patron.Messages.isShort;
			}

			var rFlagAttach = new RegExp('flag|atta?ch|'+this.clIcoUnread+'|'+this.clIcoRead, 'i');

			this.$List
				.bind('select dragstart', function (evt){ evt.preventDefault(); })
				.mouseover(this._onOverList.bind(this))
				.mousedown(this._drag.bind(this))
				.click(function (evt){
					if (this.id == 'fileSearch.messages' && patron.FileSearchWithThumbnail && !patron.MailFilesViewStyle) {
						var
							  $target = $(evt.target)
							, $item = $target.closest('.' + this.clExpandedThumbnail, this.$List)
							, $download = $target.closest('.' + this.clExpandedThumbnailDownloadLink, $item)
							, $attachToCloud = $target.closest('.' + this.clExpandedThumbnailAttachToCloudLink, $item)
							, $checkbox = $target.closest('.' + this.clExpandedThumbnailCheckboxLabel, $item)
							, $subject = $target.closest('.' + this.clExpandedThumbnailBody, $item)
						;

						if ($item.length) {
							if ($checkbox.length) {
								this._checked($target, evt.shiftKey);
							}
							else if ($attachToCloud.length) {
								evt.preventDefault();
								evt.stopPropagation();

								LayerManager.show('attachToCloud', [{
									id: $attachToCloud.attr('data-id'),
									name: $attachToCloud.attr('data-filename')
								}]);
							}
							else if (!$download.length && !$subject.length && !$attachToCloud.length) {
								patron.Utils.FileSearch.openViewer($item.attr('data-id'));
								evt.preventDefault();
								evt.stopPropagation();
							}
						}
					} else {
						if( this._dM && this._dM.hasClass(this.clDisabled) ){
							evt.preventDefault();
							return;
						}

						var $E = $(evt.target), ret = true, tag = $E[0].tagName.toUpperCase();

						if( !evt.shiftKey && tag == 'LABEL' ){
							return;
						}

						if( $E.hasClass('msg-L') || tag == 'LABEL' ){
							$E = $E.find('INPUT');
							$E[0].checked = !$E[0].checked;
						}

						tag	= $E[0].tagName.toUpperCase();

						var $attachToCloud = $E.closest('.js-attachToCloud', this.$List);

						if ($attachToCloud.length) {
							evt.preventDefault();
							evt.stopPropagation();

							LayerManager.show('attachToCloud', [{
								id: $attachToCloud.attr('data-id'),
								name: $attachToCloud.attr('data-filename')
							}]);
						}

						// < IF
						if(
						   (tag !== 'A') && !$E.hasClass(this.clMsg)
						&& (
							   rFlagAttach.test($E[0].className)
							|| (tag == 'INPUT')
							|| ($E = $E.find('.js-flag-icon,.js-attach-icon')).length
						   )
						){
							tag		= $E[0].tagName.toUpperCase();
							var id	= this._dID;

							if( tag == 'INPUT' ){
								this._checked( $E, evt.shiftKey );
							}
							else if( $E.hasClass(this.clIcoRead) ){
								patron.Messages.edit({type: 'mark', id: id, data: patron.Message.UNREAD, allInFolder: this.selectAllinFolder});
								patron.Messages.get(id).set({ Unread: 1 });
							}
							else if( $E.hasClass(this.clIcoUnread) ){
								patron.Messages.edit({type: 'mark', id: id, data: patron.Message.READ, allInFolder: this.selectAllinFolder});
								patron.Messages.get(id).set({ Unread: 0 });
							}
							else if( $E.hasClass('js-attach-icon') || $E.parent().hasClass('js-attach') ){
								ret	= false;
								patron.ui.ClipInList.toggle( this.idMsgPrefix + id, patron.View.Messages.getActive().getView() );
								$(window).triggerHandler('attachLinkClick.msglist');
							}
							else if( $E.hasClass('js-flag-icon') ) {
								var flag = !$E.hasClass(this.clMsgFlagged);
								patron.Messages.edit({type: 'mark', id: id, data: patron.Message[flag ? 'FLAG' : 'NOFLAG'], allInFolder: this.selectAllinFolder});
								patron.Messages.get(id).set({ Flagged: +flag });
							}
						}
						// IF >

						if( jsHistory.disabled ) setTimeout(function (){
							try { if( document.selection && document.selection.empty ) document.selection.empty(); } catch (e){}
							jsHistory.disabled = false;
						}, 1);

						if( !ret ){
							evt.preventDefault();
						}
					}
				}.bind(this))
			;

			if( !this.$List.attr("data-create-time") ) {// MAIL-13870
				this.$List.attr("data-create-time", Date.now());
			}

			this.$List.mousedown(function(evt){// MAIL-13870
				if( patron.isSearchPage() ) {
					var searchResultCreatedTime = this.$List.attr("data-create-time");
					var $target = $(evt.target);
					var link = $target.closest("." + this.clMessageLink, evt.currentTarget);

					if( Number.isNumeric(searchResultCreatedTime) && link.length ) {
						var linkHref = link.attr("href")
							, _time = Date.now() - +searchResultCreatedTime
						;
						if( linkHref.contains("from_search=") ) {
							linkHref = linkHref.replace(/from_search=\d+/, "from_search=" + _time);
						}
						else {
							linkHref += (linkHref.contains("?") ? "&" : "?") + "from_search=" + _time
						}
						link.attr("href", linkHref);
					}
				}
			}.bind(this));

			// Select All
			this.$All.click(function (evt){
				evt.stopPropagation(); // Да простит меня господь!
				this.select(evt.target.checked, true);
			}.bind(this));
		},


		_onOverList: function (evt){
			if( false && patron.isMsgList ){
				var node = evt.target, cn;
				if (node) {
					do {
						cn = ' '+node.className+' ';

						if( ~cn.indexOf(' '+this.clMsgUnread+' ') ){
							// This messages in unread, get message by id
							var M = patron.Messages.getSafe(node.id.replace(this.idMsgPrefix, ''));
							if( M.isUnread() && !M.isLoaded() ){
								patron.Messages.load({ folder: (M.FolderId || GET.Folder), id: M.Id });
							}
						}

						node = node.parentNode;
					} while( cn.indexOf(' js-msg ') === -1 );
				}
			}
		},

		_modeExpanded: function () {
			var isCollapsed = patron.MailFilesViewStyle = !patron.MailFilesViewStyle;

			this.$List.toggleClass(this.clExpandedList, !isCollapsed);
			this.$ExpandedSwitch.toggleClass(this.clExpandedSwitcherShort, isCollapsed);

			patron.Ajax({
				type: 'POST',
				url: '/cgi-bin/ajax_modifyprofile?ajax_call=1&func_name=' + (isCollapsed ? 'mail_files_viewer_on' : 'mail_files_viewer_off')
			});
			this._list();
		},

		_mode: function (short, save){

			var s = ajs.isset(short, !this.isShort), changed = this.isShort != s;

			patron.Messages.isShort = this.isShort = s;

			if (this.clListShort) {
				this.$List.toggleClass(this.clListShort, s);
			}

			if (this.clListMicroformat) {
				this.$List.toggleClass(this.clListMicroformat, !s);
			}

			if (this.clSwitchShort) {
				this.$Switch.toggleClass(this.clSwitchShort, s);
			}

			var sm = this.switchMode;

			this.$Switch
				.find('.'+sm.cnActive).removeClass(sm.cnActive).end()
				.find(s ? sm.cssShort : sm.cssFull).addClass(sm.cnActive).end()
			;

			if (changed) {
				patron.Messages.isShort = this.isShort = s;
				this._list();
			}

//			this._checkView(undef, patron.newsnippets);

			if( save || !arguments.length ){
				patron.Messages.saveCompactViewState(s);
			}
		},

		_getContainer: function () {
			var id = this.getListId(), $box = $(document.getElementById(id));

			if( !$box.length && this.$List ){
				$box = $('<div class="js-msg-list"></div>').attr({ id: id, 'short': this.isShort ? 'Y' : 'N' });
				this.$List.append( $box );
			}

			return $box;
		},

		_checkView: function ($S, force){
			var fId = this.getFolder().Id;

			if( !$S ){
				$S = this._getContainer();
			}

			if( force || (!this.isShort && $S.attr('short') == 'Y') ){
				$S.attr('short', 'N');
				this.isChange('hash'+fId, undef);
				this.redraw();
			}

			return	$S;
		},

		_checked: function ($L, shift){
			var C = $L[0].tagName == 'INPUT' ? $L[0] : $L.find('INPUT')[0], id = C.value;
			this.select(C.checked, id, shift && this._cbx !== id ? this._cbx : 0);
			this._cbx	= id;
		},

		_drag: function (evt){
			if( !(this.isLeftClick = jsEvent.Mouse.isLeft(evt)) ) return;

			var type = evt.type, up = (type == 'mouseup');

			if( (type === 'mousedown') || up ){ // mousedown OR mouseup
				evt.preventDefault();


				if( up ){ // Mouse up
					if( this._d ){
						if( this._dF ){
							this._d$.display(0);
							var mId = this._dID, fId = this._dF.id.substr(6), allInFolder = this.selectAllinFolder;
							setTimeout(function (){ patron.Messages.edit({type: 'move', id: mId, data: fId, allInFolder: allInFolder}); }, 1);
						}
						else {
							this._d$.animate({ left: this._dX, top: this._dY, opacity: 'hide' }, 'slow', 'easeOutExpo');
						}

						this._d	= 0;

						$('body').removeClass('grabbing');
						$('#foldersStartId .'+this.clFolderHover).removeClass(this.clFolderHover);
						this._$dF.unbind('mouseenter._hoverFolder mouseleave._hoverFolder');
					}
				}
				else {
					// Mouse down
					this._dF	= 0;
					this._dM	= $(evt.target).closest('.'+this.clMsg);

					if( this._dM[0] ){
						this._dID	= this._dM[0].id.substr(this.idMsgPrefixLen);
						this._dX 	= evt.pageX;
						this._dY 	= evt.pageY;
					}
				}

				if( this._dI === undef ){
					this._d$ = $('<div id="msgDragId"></div>')
						.css({
							'position':		'absolute',
							'zIndex':		1000,
							'background':	'#AAA',
							'color':		'#333',
							'padding':		'3px 10px',
							'font':			'95% Tahoma',
							'whiteSpace':	'nowrap',
							'left':			this._dX,
							'top':			this._dY,
							'display':		'none'
						})
						.appendTo('BODY')
					;

					this._dI = this._d$[0].style;
				}

				if( this.dragdrop && this._dM && !this._dM.hasClass(this.clDisabled) ){
					// Disable updater for Drag'n'Drop
					patron.log('msglist.dragndrop', up);
					patron.Updater[up ? 'start' : 'stop']();
					if( up ){
						$(document).unbind('mouseup._drag mousemove._drag');
					} else {
						$(document).bind('mouseup._drag mousemove._drag', this._drag.bind(this));
					}
				}

				if( up ){
					setTimeout(function (){
						$('.theme').unbind('click.msgdrag');
						$('#foldersStartId').unbind('click', ajs.retFalse);
					}, 5);
				}
			}
			else {
				// MouseMove
				var dx = evt.pageX - this._dX, dy = evt.pageY - this._dY;

				if( (this._d !== 1) && (Math.abs(dx) > 10 || Math.abs(dy) > 10) ){
					this._d	= 1;

					$('body').addClass('grabbing');
					$('.theme').one('click.msgdrag', ajs.retFalse);

					$('#foldersStartId').click(ajs.retFalse);

					// @todo refactoring msglist drag'n'drop
					var cl = 'menu__item__link_act';

					this._$dF	= $('.js-folder:not(.' + cl + ')', '#foldersStartId').bind('mouseenter._hoverFolder mouseleave._hoverFolder', this._hoverFolder.bind(this));
					this._dID	= this.select(true, this._dID);
					this._d$.stop().html( String.num(this._dID.length, Lang.get('Messages').letter, ' ')).css({ opacity: 1, display: '' });
				}

				if( this._d === 1 ){
					this._dI.top	= (this._dY + dy + 6) + 'px';
					this._dI.left	= (this._dX + dx + 6) + 'px';
				}
			}
		},

		_hoverFolder: function (evt){
			var h = evt.type == 'mouseenter';
			$(evt.currentTarget).toggleClass(this.clFolderHover, h);
			this._dF = h ? evt.currentTarget : 0;
		},

		_sort: function (sortBy, id){
			var F = patron.Folders.getSafe(id), isToFolder = F && (F.isSent() || F.isDrafts());

			sortBy = sortBy || patron.messagesSort || 'D';

			patron.messagesSort =
			patron.Messages.sort = sortBy;

			if( sortBy == 't' ){
				sortBy = 'f';
			}
			else if( sortBy == 'T' ){
				sortBy = 'F';
			}

			this.$Sort
				.find('A')
					.each(function (){
						this.href = this.href.replace(/^[^?]+/, F.getUrl());
					})
					.filter('.dropdown__list__item__link_selected')
						.removeClass('dropdown__list__item__link_selected')
						.end()
					.filter('[href*="sortby=' + sortBy + '"]')
						.addClass('dropdown__list__item__link_selected')
						.end()
					.find('[class^="sort-"]')
						.display(0)
						.filter('[class="sort-' + (isToFolder ? 'to' : 'from') + '-txt"]')
							.display(1)
			;
		},

	// @public
		select: function (c, a, b)
		{
			if( patron.isReadMsg ) {
				var Message = patron.Messages.get(GET.id);

				return [Message.id || GET.id];
			}

			var filter = ajs.retTrue,
				t = c,
				expanded = (this.id == 'fileSearch.messages' && patron.FileSearchWithThumbnail && !patron.MailFilesViewStyle);

			if( typeof c == 'string' )
			{
				c =
				a = true;

				if( t == 'none' )
				{	// Deselect
					c = false;
				}
				else if( t != 'all' )
				{
					var
						  F		= this.getFolder()
						, email	= F && (F.isSent() || F.isDrafts()) ? 'To' : 'From'
						, arEmail
					;

					if( t == 'email' )
					{
						arEmail	= Array.uniq(patron.Messages.map(this.select(), function (M) {
							return (M[email] || '').toLowerCase();
						}));
					}

					filter = function (id, N)
					{
						var M = patron.Messages.get(id);

						if( !M )
						{
							N = $(N);
							M = { Unread: N.hasClass(this.clMsgUnread), Flagged: N.hasClass(this.clMsgFlagged) };
						}

						if( t == 'email' )
						{
							return Array.indexOf(arEmail, M[email].toLowerCase()) > -1;
						}

						return (
							   (t === 'unread' && M.Unread )
							|| (t === 'readed' && !M.Unread )
							|| (t === 'flagged' && M.Flagged )
							|| (t === 'unflagged' && !M.Flagged )
							|| (t === 'attach' && M.Attachment )
						);
					};
				}
			}

			var $container = this._getContainer();

			if( a && this.getMessages().length )
			{
				var Node = $container[0], id, ok = 0, cbx, clSel = this.clMsgSel;

				if( Node && (Node = Node.firstChild) ) do
				{
					if( Node.nodeType == 1 )
					{
						id	= Node.id.substr(this.idMsgPrefixLen); // first

						if( a === true ) ok = 1;
						else if( !b ) { ok = 2; if( (Node = jsCore.$('#'+ this.idMsgPrefix + a)).nodeType !== 1 ) break; }
						else if( id == a || id == b ) ok++;

						id	= Node.id.substr(this.idMsgPrefixLen);	// second

						if( ok > 0 )
						{
							var _c = filter(id, Node) ? c : false;
							this._scbx[id]	= _c;

							if (!expanded) {
								if( _c && Node.className.indexOf(clSel) == -1 ) Node.className += ' '+clSel;
								else if( !_c ) {
									$(Node).removeClass(clSel);
								}
							}

							cbx = Node.getElementsByTagName('INPUT')[0];
							if( cbx !== undef )
							{
								cbx.checked	= _c;
								cbx.title	= Lang.get('MessagesCheckBoxTitle')[+c];
							}

							if( ok == 2 ) break;
						}
					}
				}
				while( Node = Node.nextSibling );
			}

			var $X		= this.$CurSelCBX = $(':checked', $container);
			var count	= $X.length;

			if (c != undef && a != undef && t != undef) {
				if ((c == true && a == true) || t == 'all' || t == 'unread' || t == 'readed' || t == 'flagged' || t == 'unflagged' || t == 'attach') {
					this._showMultiSelect(t);
				} else {
					this._hideMultiSelect();
				}
			}

			c = count ? (count == this.getMessagesOnPage())+1 : 0;

			if( this.isChange('a-cbx', c) && this.$All )
			{
				this.$All
					.css({ opacity: (!c || c == 2) ? 1 : .5 })
					.attr({ checked: !!c, title: Lang.get('MessagesSelectAllTitle')[c?1:0] })
				;
			}

			return Array.map($X, function (C){ return C.value; });
		},

		_showMultiSelect: function (type) {
			if (this.idMultiSelect) {
				var allInFolderCount = this.countInActiveFolder();
				var selectOnPageCount = this.$CurSelCBX.length;
				var allOnPageCount = this.getMessages().length;
				if (selectOnPageCount> 0 && allInFolderCount > allOnPageCount) {
					this._multiselectShow = this['_multiselectShow'+patron.getFolderId()] = this.getCurrentPage();
					var txt = String.num(allInFolderCount, Lang.get('Messages').letter, ' ');
					if (!this.selectAllinFolder) {
						txt = String.num(selectOnPageCount, Lang.get('Messages').letter, ' ');
						/* это ждёт когда сервер будет уметь обрабатывать, например, все отмеченные флажком письма (на всех страницах) и т.п.
						* тогда раскоммитим и допилим умные тексты. Пока же пишем всегда "выделено N писем" чтобы не запутывать пользователя */
						/*if (type == 'attach') {
							txt = String.num(selectOnPageCount, Lang.get('Messages').letter, ' ') + ' ' + String.num(selectOnPageCount, Lang.get('Messages')[type]);
						} else if (type == 'email') {
							var   View = patron.View.Messages.getActive()
								, IDs = View.select()
								, F = this.getFolder()
								, field = (F.isSent() || F.isDrafts() ? 'To' : 'From');
							txt	= String.num(selectOnPageCount, Lang.get('Messages').letter, ' ') + ' '
								+ Lang.get('Messages')[field+'.prefix'] + ' '
								+ Array
								.uniq(patron.Messages.map(IDs, function (M)
								{

									return M[field] || ('<' + Lang.get('message.email.unknown') + '>');
								}))
								.join(', ')
							;
						} else {
							txt = String.num(selectOnPageCount, Lang.get('Messages').letter, (Lang.get('Messages')[type] ? ' ' + String.num(selectOnPageCount, Lang.get('Messages')[type]) : '') + ' ');
						}*/
					}
					this.$multiSelect.tpl(this.idMultiSelect, {
						txt: txt,
						type: type,
						all: this.selectAllinFolder
					}).show();
				}
				else {
					this._hideMultiSelect();
				}
			}
		},

		_hideMultiSelect: function () {
			if (this.selectAllinFolder || this._multiselectShow == this.getCurrentPage()) {
				this._multiselectShow = this['_multiselectShow'+patron.getFolderId()] = false;
			}
			this.selectAllinFolder = this['selectAllinFolder'+patron.getFolderId()] = false;
			this.$multiSelect.hide();
		},

		_redraw: function (r, a) {
			if( r ) {
				var
					  fID	= this.getFolder().Id
					, page	= this.getCurrentPage()
					, hash	= patron.Messages.getHash(fID)
				;

				this._multiselectShow = this['_multiselectShow'+fID];
				this.selectAllinFolder = this['selectAllinFolder'+fID];

				if( this.isChange('id', fID) ){
					this.fID = fID;
					this.show();
				}

				if( this.isChange('id-page', fID+''+page) ){
					this.$P('id-page');
					var
						  $Back = (this.__$Back = this.__$Back || this.getForm().find('input[name="back"]'))
						, val = $Back.val()
					;

					if( val ){
						$Back.val( val.replace(/\?.+/, '?')+ajs.toQuery(GET) );
					}

					if (this._multiselectShow && this.selectAllinFolder) {
						this.select(true, true);
						this._showMultiSelect();
					} else if (this._multiselectShow == page) {
						setTimeout( function() {
							this._showMultiSelect();
						}.bind(this), 10);

					} else {
						this._hideMultiSelect();
					}
					this.$P('id-page', 1);
				}

				if( hash !== undef && this.isChange('hash'+fID, hash) ){
					if( patron.isSearchPage() ) {// MAIL-13870
						this.$List.attr("data-create-time", Date.now());
					}

					this.$P('_list');
					this._list();
					this.$P('_list', 1);

					this.$P('show');
					this.show();
					if (this._multiselectShow && this.selectAllinFolder) {
						this.select(true, true);
						this._showMultiSelect();
					} else {
						this._hideMultiSelect();
					}
					this.$P('show', 1);
				}

				this.$P('_sort');
				this._sort( patron.messagesSort, fID );
				this.$P('_sort', 1);

				if( this.isChange('url', jsHistory.get()) ) setTimeout(function (){
					$(window).triggerHandler('show.msglist', [patron.Pager.page]);
				}, 1);
			}
			else if( !r ){
				if( a ){
					$('#mailruPreFoot').display(1);
					this.statusLine('count');
					this.isChange('pageLoad', GET.page);
					if (this.clListShort && this.clSwitchShort) {
						this._mode(patron.Messages.isShort);
					}
				} else {
					this.isChange('url', null);
				}
			}
		},

		_list: function (){
			var
				  folder = patron.getFolderId()
				, array = this.getMessages()
				, expanded = (this.id == 'fileSearch.messages' && patron.FileSearchWithThumbnail && !patron.MailFilesViewStyle)
				, result_html = ''
			;

			if (!array.length) {
				var query_data =  {
					'q_query' : defined(GET.q_query)  ? String.html2text(GET.q_query).replace(/\+/g, " ") : '',
					'q_from' : defined(GET.q_from)  ? String.html2text(GET.q_from).replace(/\+/g, " ") : '',
					'q_to' : defined(GET.q_to)  ? String.html2text(GET.q_to).replace(/\+/g, " ") : '',
					'q_subj' : defined(GET.q_subj)  ? String.html2text(GET.q_subj).replace(/\+/g, " ") : '',
					'q_read'  : defined(GET.q_read)   ? String.html2text(GET.q_read)   : '',
					'q_folder': defined(GET.q_folder) ? String.html2text(GET.q_folder) : '',
					'q_trash': defined(GET.q_trash) ? String.html2text(GET.q_trash) : '',
					'ddb'     : defined(GET.ddb)      ? String.html2text(GET.ddb)      : '',
					'host'    : this._getCollectorHost()
				};

				if (GET.page > 1) {
					jsHistory.build({ page: 1 }, ['page']);
					this._getContainer().innerHTML('');
				}
				if (this.isEmptyCollector && patron.Utils.spinner.show()) {
					this._getContainer().tpl(this.isEmptyCollector, query_data);
					Counter.d(1675338);
				}
				else if (this.idEmptyView) {
					this._getContainer().tpl(this.idEmptyView, query_data);
				}
				else {
					this._getContainer().innerHTML('');
				}

				this.select('none');

				return;
			}

			this['_scbx'+folder] = this._scbx;
			this._scbx = this['_scbx'+folder] || {};

			this.isChange('page'+folder, GET.page);

			this.$P('tpl');

			var
				  elId = this.getListId()
				, $Msg = $(document.getElementById(elId) || '<div id="'+ elId +'" class="js-msg-list"></div>')
			;

			patron.MicroFormat.preload( true );

			if( this.template ){
				result_html	= $.tpl(this.template, this._getTplData(folder, !this.isShort, array));
			}
			else {

				this.$ExpandedSwitch.toggleClass(this.clExpandedSwitcherShort, !expanded);

				if (expanded) {
					this.TplExpanded.set( array );
				} else {
					this.Tpl.set( array );
				}

				if (array.length) {
					if (expanded) {
						result_html = this.TplExpanded.exec();
					} else {
						result_html = this.Tpl.exec();
					}
				} else {
					result_html = '<div class="loadProgress mb10 mt10">' + Lang.get('Loading').messages + '</div>';
				}
			}

			$Msg[0].innerHTML = result_html;

			if( !$Msg[0].parentNode || $Msg[0].parentNode.nodeType == 11 ){
				// If element is not in DOM, append him to main list
				this.$List.append( $Msg.attr('short', this.isShort ? 'Y' : 'N') );
			}
			else if( this.isShort && $Msg.attr('short') == 'N' ){
				// Store list state
				$Msg.attr('short', 'Y');
			}

			this.$P('tpl', 1);

			this.$P('MicroFormat');
				patron.MicroFormat.preload( false );
			this.$P('MicroFormat', 1);


			this.$P('AttachViewer');
				patron.ui.ClipInList.redraw();
			this.$P('AttachViewer', 1);

			// Fixed "Select all"
			this.select();

			this._clearCBX = 0;
		},

		show: function (){
			if (!this.isActive())
				return;

			var $container = this._getContainer();

			this._cbx = 0; // last active checkbox
			this.hideList();

			this._checkView($container).display(1);

			this.$prevListContainer = $container;

			patron.ui.ClipInList.redraw();
			this.select(); // Fix for Select All
		},


		clearList: function (id)
		{
			id = (id && id.Id ? id.Id : id);
			var $container = this._getContainer();
			$container.empty();
			patron.Folders.get(id, true).set({ Unread: 0, Messages: 0 });
			documentView.redraw();
		},


		statusLine: function (type, txt, sec){
			return;
		},


		upd: function (flag, unread, $Msg){
			var
				  self = this
				, clUnread = self.clMsgUnread
				, Tpl = TemplateService.get('MsgIcon').parser( self.uniqId+'MsgParser' )
				, $cache = $({})
			;

			if( !$Msg ){
				$Msg = self.$CurSelCBX;
			}
			else if( !$Msg.jquery ){
				$Msg	= $('#' + self.idMsgPrefix + $Msg);
				$Msg	= ($Msg && $Msg.length) ? $Msg : this._dM;
			}

			if( $Msg ){
				if( flag !== undef ){
					$Msg.find('.js-flag-icon')
						.attr('title', Lang.get('MessagesFlags')[+flag])
						.toggleClass(self.clMsgFlagged, flag)
					;
				}

				if( unread !== undef ){
					$Msg.each(function (){
						$cache[0] = this;

						if( !self.template ){
							$cache.toggleClass(clUnread, unread==1);
						}

						var Msg = patron.Messages.get( this.id.substr(self.idMsgPrefixLen) );
						if( Msg ){
							if( self.template ){
								$cache.replaceWith($.tpl(self.template, self._getTplData(Msg.FolderId, !self.isShort, [Msg])));
							} else {
								$cache.find('.js-ico').html( Tpl.set([Msg]).exec() );
							}
						}
					});
				}
			}
		},

		_getTplData: function (folder, expanded, array){
			return {
				  Msglist: 1
				, newsnippets: patron.newsnippets
				, expanded: expanded
				, needShortLongMicroformat: !expanded
				, messages: array
				, selected: this._scbx
			};
		},

		getForm: function (){
			return	this.getView().closest('form');
		},

		getFolder: function (){
			return patron.Folders.getSafe();
		},

		getMessages: function (){
			return	patron.Messages.getByFolder( this.getFolder().Id );
		},

		getCurrentPage: function (){
			return	Math.max(GET.page*1||1, 1);
		},

		getMessagesPerPage: function (){
			return	patron.messagesPerPage;
		},

		getMessagesOnPage: function (){
			var
				  count		= this.getMessages().length
				, page		= this.getCurrentPage()
				, perPage	= this.getMessagesPerPage()
				, pages		= Math.ceil(count / perPage)
			;
			return	page == pages ? Math.min(count - (page-1) * perPage, perPage) : perPage
		},

		hideList: function (){
			if( this.$List ){
				this.$List.children('.js-msg-list').display(0);
			}
		}

	});
	// Messages;


	jsCore.wait('patron.ready', function (){
		//
		// Init controllers
		//
		patron.Events
			.bind('select.messages.click', function (evt){
				patron.View.Messages.getActive().select(evt.DATA);
			})
			.bind('fileToCloud.click fileDownload.click fileForward.click fileInArchive.click fileFromArchive.click forward.click mark.markmessage.click move.folder.click bookfilter.moveto.click redirect.click messages.forward.click messages.search.click', function (evt){
				var
					  View	= patron.View.Messages.getActive()
					, IDs	= evt.msgIds || View.select()
					, type	= evt.type
				;

				if( IDs.length ) {
					var F = patron.Folders.getSafe(), SentmsgView, message, url;

					if (type == 'fileDownload' || type == 'fileForward' || type == 'fileToCloud') {

						var size = 0, list = View.getMessages();
						if ($.isArray(list)) {
							$.each(list, function (k, data) {
								if ($.inArray(data.Id, IDs) !== -1) {
									size += data.size;
								}
							});
						}
						if (size > patron['MaxAttachmentSize']) {
							var error = Lang.get(type == 'fileDownload' ? 'FileSearchDownloadSizeLimit' : 'FileSearchForwardSizeLimit');
							View.statusLine('attention', error);
							patron.Notify.add('error', {text: error});
						} else {
							if (type == 'fileForward') {
								SentmsgView = jsView.get('sentmsg');
								if (SentmsgView) {
									SentmsgView.open('forward=&filesearch=1&id='+ IDs.join('&id='));
								}
							} else if (type == 'fileDownload') {
								var params = {
									partids: IDs.join('_'),
									'x-email': patron.useremail,
									mode: 'attachment',
									fname: 'attachments_' + Date.getNow().format('D-M-Y_H-I-S')
								};
								url = '//' + patron.FilesSearchData.attach_host + '/cgi-bin/getattachment?' + $.param(params);
								window.open(url);
							}
							else if (type == 'fileToCloud') {
								var files = $.map(IDs, function(id) {
									var $item = View.$CurSelCBX.filter('[value="'+id+'"]').parent().parent();
									var name = $.trim($item.find('.messageline__body__subject').text() || $item.text());
									return { id: id, name: name };
								});

								LayerManager.show('attachToCloud', files);
							}
						}

					} else {
						setTimeout(function () {

							if( type == 'fileInArchive' || type == 'fileFromArchive') {
								patron.Messages.edit({type: 'move', id: IDs, data: type, allInFolder: View.selectAllinFolder});
							} else if( evt.DATA === 'create_filter' ) {
								message = patron.Messages.get(IDs[0]);
								var urlPrefix = (patron.SettingsOn ? '/settings/filters?action=edit&msgid=' : '/cgi-bin/editfilter?msgid=') + message.Id;
								url = urlPrefix +'&fields=from&folder=' + F.Id;
								if (F.isSent() || F.isDrafts()) {
									url = urlPrefix + '&fields=to&folder=' + F.Id;
								}
								location.href = url;
							} else if( evt.TYPE == 'messages.search.click' ) {
								message = patron.Messages.get(IDs[0]);
								url = patron.getPageURL('search')+'?qc_from=1&q_from='+message.From+'&qc_to=1&q_to=&qc_subj=1&q_subj=&qc_text=1&mode=0&q_text=&ddb=&dmb=&dyb=&dde=&dme=&dye=&q_read=0&q_reply=0&qc_size=3&q_size=&q_prty=0&q_attach=0&q_folder=all&advanced=1';
								if (F.isSent() || F.isDrafts()) {
									url = patron.getPageURL('search')+'?qc_from=1&q_from=&qc_to=1&q_to='+message.To+'&qc_subj=1&q_subj=&qc_text=1&mode=0&q_text=&ddb=&dmb=&dyb=&dde=&dme=&dye=&q_read=0&q_reply=0&qc_size=3&q_size=&q_prty=0&q_attach=0&q_folder=all&advanced=1';
								}
								jsHistory.set(url);
							} else if( type == 'forward' || type == 'fileForward' || evt.TYPE == 'messages.forward.click' ) {
								var forwardType = 'attach';

								if (type == 'fileForward') {
									forwardType = '';
									IDs = $.map(IDs, function (v, k) {
										return v.split(';')[0];
									});
								}

								SentmsgView = jsView.get('sentmsg');
								if (SentmsgView) {
									SentmsgView.open( 'forward=' + forwardType + '&id='+ IDs.join('&id=') );
								} else {
									var $form = $(document.forms['main']);
									if ($form.length) {
										$form.attr('action', patron.getPageURL('compose'));
										$('<input type="submit" name="forward" value="' + forwardType + '" style="display: none;"/>').appendTo($form).click();
									}
								}
							}
							else if( type == 'redirect' ) {
								var captchaLayer;

								patron.Layers.redirect(IDs[0], function (data) {

									var redirectLayer = this;

									function redirect (R) {

										if (captchaLayer) {
											captchaLayer.hide();
										}
										var result = R.getData();
										if ($.isArray(result)) {
											var res = result[0];
											if (res) {
												if (res.ShowSecurityImage) {
													$R('{patron'+'.compose}patron.Compose.Captcha', function() {
														if (!captchaLayer) {
															captchaLayer = new patron.Compose.Captcha();
															captchaLayer.bind('checkSuccess', function (evt, code) {
																data.security_image_word = code;
																patron.Messages.edit({type: 'redirect', id: IDs, data: data, complete: redirect});
															});
														}
														redirectLayer.hide();
														captchaLayer.show();
													});
												} else if (res.status == 'SEND') {
													var L = patron.Layers.get('redirect-done', ajs.retTrue);
													L.$Type.find('.status').hide().end().find(R.isOK() ? '.ok' : '.error').show();
													L.show();
												} else {
													alert($("<div>"+res.status+"<div>").find('B').remove().end().text());
													patron.Events.fire('redirect.click');
												}
											}
										}
										else if (result === null || result && result.Error === null) {
											if (redirectLayer && redirectLayer.$Submit)
												redirectLayer.$Submit.attr('disabled', false);
											patron.Notify.add('error');
										}
									}

									patron.Messages.edit({type: 'redirect', id: IDs, data: data, complete: redirect});
								});
							}
							else
							{
								var cp = patron.Messages.edit({type: type, id: IDs, data: evt.DATA, allInFolder: View.selectAllinFolder}); // count processing
								var txt = Lang.get('Messages').Actions[type];
								if( type == 'mark' && cp && txt ){
									View.statusLine('alert', txt.replace('%s', String.num(cp, Lang.get('Messages').letter, ' ')));
								}
							}
						}, 1);
					}

				} else {
					View.statusLine('attention');
				}

				Dropdown.hide('dropdown');
				return	false;
			})

		// SPAM/NoSpam
			.bind('spam.click', function (evt){

				var
					  View	= patron.View.Messages.getActive()
					, IDs	= View.select()
				;

				if( IDs.length )
				{
					if( evt.DATA == 'spamabuse' || evt.DATA == 'spam.definitely')
					{	// Mark as spam
						var data = { delorig: 'on', toblacklist: 'on' };

						if(evt.DATA == 'spam.definitely') {
							data.verified = 1;
						}

						patron.Messages.confirmSpam({id: IDs, data: data, allInFolder: View.selectAllinFolder});

						if( patron.rb && !patron.isSearchPage() && !patron.isFileSearchPage() ){
							patron.rb.click(patron.isReadMsg ? 288799 : 288797);
							Counter.sb(288799);
						}
					}
					else
					{	// Mark as not spam
						patron.Messages.edit({type: 'spam', id: IDs, data: false, allInFolder: View.selectAllinFolder});
						if( patron.rb && !patron.isSearchPage() && !patron.isFileSearchPage() ){
							patron.rb.click(patron.isReadMsg ? 399353 : 399354);
						}

						if( patron.isReadMsg && patron.ListUnsubscribeEnabled && patron.Messages.get(IDs)[0].ListSubscribe) {
							Counter.sb(1611485)
						}
					}
				}
				else
					View.statusLine('attention');

				return	false;
			})

		// Unsubscribe
			.bind('unsubscribe.click', function (evt){
				var
					  View	= patron.View.Messages.getActive()
					, IDs	= View.select()
					, data	= { delorig: 'on', toblacklist: 'on' };

				patron.Messages.edit({
					type: 'unsubscribe',
					id: IDs,
					data: data
				});

				return false;
			})
		;
	});

	jsLoader.loaded('{patron.view}patron.View.Messages');
});

