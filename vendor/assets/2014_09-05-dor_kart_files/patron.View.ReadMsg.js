/**
 * @class    patron.View.ReadMsg
 * @author    RubaXa    <trash@rubaxa.org>
 */


jsLoader.require([
	'{patron.view}patron.View.ReadMsgMisc'
	, '{patron}patron.readMsg.trash'
	, '{patron}patron.Balloon'
	, '{patron.build}AttachViewer'
	, '{patron}patron.Themes'
	, '{patron.utils}patron.Utils.Message'
	, '{patron.utils}patron.Utils.Fishing'
	, '{patron.utils}patron.Utils.InlineImage'
	, '{patron.utils}patron.Utils.SeptimaOn'
	, '{plugins}LayerManager'
	, '{plugins}Layer'
	, '{labs}jsView'
], function () {
	/**
	 * @class patron.View.ReadMsgNew
	 */
	jsView
		.create('patron.View.ReadMsgNew')
		.methods({

			_one: function () {
				patron.Events.bind('updated.message', function (evt) {
					var M = evt.DATA;
					if (patron.isReadMsg && (M.Id == GET.id) && M.getChanges().Unread && !M.Unread) {
						patron.Updater.reload(true, { 'folder': -1 });
					}
				});


				this.$View = $(this.idView);

				$('#Go2Attachments').click(function (evt) {
					var id = GET.id;
					if (id) {
						var top = $('#ReadMsgAttachment' + id.replace(/(:|;|\.)/g, '\\$1')).offset().top;
						$ScrollElement.animate({ scrollTop: top }, 'slow', 'easeOutExpo');
					}
					evt.preventDefault();
				}.bind(this));

				// Actions
				$('A.iAnswer', this.$View).removeAttr('onclick').click(function () {
					return confirm_answ();
				});
				$('A.iDelete', this.$View).click(function () {
					return patron.Events.fire('move.click', patron.Folder.TRASH);
				});
				$('A.iRedirect', this.$View).click(function (e) {
					return patron.Events.fire('redirect.click', e);
				});

				$('A.iSpam', this.$View).click(function () {
					return patron.Events.fire('spam.click', 'spamabuse');
				});
				$('A.iNoSpam', this.$View).click(function () {
					return patron.Events.fire('spam.click', 'nospam');
				});

				$('.url-print.mr_read__print,.url-translate.mr_read__transl,.mr_btn__wr', '#action_buttons')
					.add($('.url-prev,.url-next', this.$View))
					.add($('.url-new_abcontact,.url-gosearch', '#msgFieldFrom'))
					.add($('.js-avatar-link', '#ReadMsgTop'))
					.mousedown(function () {
						var type = this.className.replace(/(^|.*?\s+)url-([^\s]+).*/g, '$2');
						$(window).triggerHandler('actionLinkClick.readmsg', [type]);
					});

				$('.mr_read__flag', '#msgFieldSubject').mousedown(function () {
					$(window).triggerHandler('actionLinkClick.readmsg', ['flag']);
				});

				$('.url-translate,.url-print,.url-getmsg,.url-composebounce,.url-forward,.url-ViewType', '#action_buttons .dropdown__list').mousedown(function () {
					var type = this.className.replace(/(^|.*?\s+)url-([^\s]+).*/g, '$2');
					$(window).triggerHandler('dropDownLinkClick.msglist', ['more', [0, 0, type]]);
				});

				$('#Go2Attachments').mousedown(function () {
					$(window).triggerHandler('actionLinkClick.readmsg', ['go2attach']);
				});


				// https://jira.mail.ru/browse/MAIL-9357
				this.$View.delegate('.js-blockquote-ctrl', 'click', function (evt) {
					var
						$ctrl = $(evt.currentTarget)
						, cnExpanded = 'b-blockquote_expand'
						, $block = $ctrl.closest('.js-blockquote').toggleClass(cnExpanded)
						;

					$ctrl.html(Lang.get('readmsg.blockquote.ctrl')[+$block.hasClass(cnExpanded)]);
					evt.preventDefault();
				});
			},


			_redraw: function (r, a) {
				var Msg = patron.Messages.get(GET.id);

				if (!r) {
					this.$View
//					.display(a)
						.find('.js-thread-messages')
						.display(a)
					;

					if (!a && patron.ReadMsg.View && patron.ReadMsg.View.$Top) {
						var Msg = patron.Messages.get(patron.ReadMsg.ID);

						if (Msg && Msg._static) {
							Msg.set({ _static: 0, _loaded: 0 });
						}

						patron.ReadMsg.View.$Top.display(0);
						patron.ReadMsg.View.$Bottom.display(0);
						patron.ReadMsg.View._remove(patron.ReadMsg.ID);
						patron.ReadMsg.View._bnrId = null;
						patron.ReadMsg.ID = 0;

						patron.ReadMsg.View.$Top.find('.js-unsubscribe').display(!!Msg.ListUnsubscribe && patron.ListUnsubscribeImmediatlyEnabled);
					}
				}
				else if (Msg && r && a && patron.ReadMsg.View && patron.ReadMsg.View.$Top) {
					//patron.ReadMsg.View.redraw( Msg );
					patron.ReadMsg.View.$Top.find('.js-unsubscribe').display(!!Msg.ListUnsubscribe && patron.ListUnsubscribeImmediatlyEnabled);
				}

				// MEGA PIZDOS`
				patron.ReadMsg.NEW_REDRAW = 0;
				if (a) {
					patron.ReadMsg.NEW_REDRAW = 1;
					if (patron.ReadMsg.REDRAW) {
						$(window).triggerHandler('showMessage.readmsg');
						patron.ReadMsg.NEW_REDRAW = patron.ReadMsg.REDRAW = 0;
					}
				}
			}

		});


	/**
	 * @class patron.View.ReadMsg
	 */
	jsClass
		.create('patron.View.ReadMsg')
		.extend(patron.View.ReadMsgMisc)
		.extend(patron.Balloon)
		.methods({

			_init: function () {
				this._init = jsCore.F;
				this.radar = patron.ReadMsg.radar;

				this.radar('_init');

				/** @namespace priority.low */
				/** @namespace priority.high */
				this.priority = { 1: ['red', Lang.get('Message').priority.high], 3: ['', Lang.get('Message').priority.normal], 5: ['grey', Lang.get('Message').priority.low] };

				this.$Top = $('#ReadMsgTop');
				this.$Body = $('#ReadMsgBody');
				this.$Bottom = $('#ReadMsgBottom');

				var $TB = this.$Top.add(this.$Bottom);

				this._garbage = {};
				this._garbageIds = [];
				this._garbageLimit = 5;

				this.$Fields = $('.m-header', this.$Top);
				this.$Avatar = $('.b-ava,.mr_ava', this.$Top);
				this.$IF = $('.if', $TB);
				this.$Url = $('A', $TB);
				this.$Controls = $('.button-a', $TB);
				this.$Dropdowns = $('.dropdown', $TB);
				this.$Nav = $('.paging', $TB);
				this.$Flag = $('.mr_read__flag', this.$Top);
				this.$Forms = $('FORM', $TB);
				this.$IcoFrom = $('.spf-from', this.$Top);
				this.$msgNoSent = $('#msgNoSent');
				this.$msgIsBulk = $('#msgIsBulk');
				this.$subjIco = $('#MsgSubjIco');
				this.$Loading = $('#ReadMsgLoading').display(0);

				this._iFastAnswer();

				this.$Flag.click(function () {
					var M = patron.Messages.getSafe(GET.id);
					// MAIL-15297
					if (GET.sm) {
						M = patron.Messages.getSafe(M.Id);
					}
					if (M) {
						patron.Messages.edit({type: 'mark', id: M.Id, data: patron.Message[M.Flagged ? 'NOFLAG' : 'FLAG']});
						$(this).toggleClass('mr_read__flag_y', !!M.Flagged);
					}
					return    false;
				});

				patron.Events.bind('updated.message', function (evt) {
					var M = evt.DATA;
					if (M.Id == GET.id) this.$Flag.toggleClass('mr_read__flag_y', !!M.Flagged);
				}.bind(this));

				this.radar('_init', 1);

				// FastAnswer
				this.$FALinks = this.$Bottom.find('.answerbar__link').click(function (evt) {
					var type = evt.currentTarget.className.match(/js-mode-(\w+)/)[1];
					$(window).triggerHandler('fastAnswerControlsClick.readmsg', [jsView.get('readmsg_compose').expanded, type]);
					this._iFastAnswer(type);
					evt.preventDefault();
				}.bind(this));

				this.$Body

					.mousedown(function (evt) {
						var $target = $(evt.target), $w = $(window);
						var $link = $target.closest('.js-icon,.js-title,.js-previewImg,.js-download,.js-inAlbum,.js-previewLink', '#ReadMsgAttachment' + GET.id);
						var className = $link.attr('class');
						if (className) {
							var type = className.match(/js-(\w+)/)[1];
							if (type == 'icon') {
								$w.triggerHandler('attachIconClick.readmsg');
							} else if (type == 'title') {
								$w.triggerHandler('attachTitleClick.readmsg');
							} else if (type == 'previewImg') {
								$w.triggerHandler('attachPreviewClick.readmsg');
							} else if (type == 'download') {
								$w.triggerHandler('attachDownloadLinkClick.readmsg');
							} else if (type == 'inAlbum') {
								$w.triggerHandler('attachInAlbumLinkClick.readmsg');
							} else if (type == 'previewLink') {
								$w.triggerHandler('attachPreviewLinkClick.readmsg');
							}
						}
					})

					// https://jira.mail.ru/browse/MAIL-11368
					.delegate('.js-phone-number', 'click', function (evt) {
						if (this.canCallToPhone()) {
							var number = evt.currentTarget.innerHTML.replace(/[^\d]/g, '');
							this.callToPhone(number);
							Counter.sb(1313358);
							evt.preventDefault();
						}
					}.bind(this))

					.delegate('.mail-quote-collapse__button', 'click', function (evt) {
						this.$Body.find('.mail-quote-collapse').removeClass('mail-quote-collapse');
					}.bind(this))
				;


				this.attachViewer = new patron.FullAttachViewer.Viewer();
				this._checkFishing = this._checkFishing.bind(this);

				jsHistory.change(function (hash) {
					var anchor = ajs.toObject(hash)._;
					try {
						anchor = decodeURIComponent(anchor)
					} catch (e) {
						anchor = unescape(anchor);
					}
					if (anchor && anchor !== this.__anchor) {
						this._scrollTo('a[name="' + anchor + '"]', -30);
					}
					this.__anchor = null;
				}.bind(this));

				if (GET && GET.id && patron.ListUnsubscribeEnabled) {
					// counters for https://jira.mail.ru/browse/MAIL-15344
					var M = patron.Messages.getSafe(GET.id);
					if (M.ListUnsubscribe) {
						Counter.d(1678304);
					}
					if (M.ListSubscribe) {
						Counter.d(1611485);
					}
				}
			},

			getWebAgentAPI: function () {
				return    patron.Utils.Message.getWebAgentAPI();
			},

			canCallToPhone: function () {
				return    patron.Utils.Message.canCallToPhone();
			},

			callToPhone: function (number) {
				return    patron.Utils.Message.callToPhone(number);
			},

			_scrollTo: function ($elm, offset) {
				if (typeof $elm === 'string') {
					$elm = $(this._get(GET.id)).find($elm);
				}
				var top = $($elm).offset();
				if (top && (top = top.top + offset)) {
					$ScrollElement.animate({ scrollTop: top }, 'slow', 'easeOutExpo');
				}
			},

			_iFastAnswer: function (mode, scroll) {
				if (patron.v2) return;

				var View = jsView.get('readmsg_compose');

				scroll = defined(scroll, true);

				if (!View && !mode) {
					$R('{patron.view}' + 'patron.View.Compose', function () {
						$(window).bind('init.readmsg_compose', function () {
							var Form = jsView.get('readmsg_compose').getForm();

							Form.parentHeight(function () {
								// Set function for calc availableHeight
								// debug.log('HEIGHT:', this.options.resizeDisabled, $('#LeftColEndAnchor').offset().top - this.getMainFrame().offset().top);
								return $('#LeftColEndAnchor').offset().top - this.getMainFrame().offset().top;
							});

							Form.bind('cancel', {scope: this}, function (evt) {
								var scope = evt.data.scope;
								this._removeUnloadConfirm();
								scope._iFastAnswer(true);
								return false;
							});

						}.bind(this));

						jsView.get('readmsg').addSubView(new patron.View.Compose({
							id: 'readmsg_compose', idView: '#ReadMsgComposeForm', _active: function () {
								return this.visible;
							}
						}));

						jsView.get('readmsg_compose').redraw();

						$(window).triggerHandler('{patron.view}patron.View.Compose');

					}.bind(this));

					$('#ReadMsgComposeFake').click(function () {
						$(window).triggerHandler('fastAnswerFakeBodyClick.readmsg');
						this._iFastAnswer('reply');
						return    false;
					}.bind(this));

					$('#ReadMsg2SentMsg').mousedown(function () {
						$(window).triggerHandler('fastAnswerFullFormLinkClick.readmsg');
					});
				}
				else if (mode) {
					this.$FALinks.removeClass('answerbar__link_selected');

					$('#ReadMsgCompose').display(mode !== true);
					$('#ReadMsgComposeFake').display(mode === true);
					$('#ReadMsgComposeTabs').toggleClass('answerbar_active', mode !== true);
					$('#ReadMsgBottomToolbar').display(mode == true);

					if (View) {
						View.visible = mode !== true;
						View.redraw();

						if (mode !== true) {
							jsCore.wait('readmsg_compose.init', function () {
								View.getForm().resizeDisabled(View.expanded);
								if (View.expanded) {
									View.switchMode(mode);
								}
								else {
									// patron.Messages.getSafe.getSage(GET.id) -- support short id
									View.load('id=' + patron.Messages.getSafe(GET.id).id, mode);
									if (scroll) {
										$Scroll.scrollTop($('#ReadMsgComposeTabs').offset().top - 5);
									}
								}
								View.expanded = true;

								$('#ReadMsg2SentMsg').attr('href', View.getUrl());
								this.$FALinks.filter('.js-mode-' + mode).addClass('answerbar__link_selected');
							}.bind(this));
						}
						else {
							View.expanded = false;
							View.abort();
						}
					} else {
						$(window).one('{patron.view}patron.View.Compose', function () {
							this._iFastAnswer(mode, scroll);
						}.bind(this));
					}
				}
			},

			_remove: function (id, clearData) {
				var $Msg = $('#MSG' + (id + '').replace(/(:|;|\.)/g, '\\$1'));
				if ($Msg.length) {
					if (clearData) {
						$Msg.remove();
					} else {
						this._cleanData($Msg.detach());
					}
				}
			},

			_cleanData: function ($Msg) {
				$.cleanData($Msg.find('.js-readmsg-link-box').andSelf());
			},

			_get: function (id, create) {
				id = (id + '').replace(/&[^;]+;/g, '').replace(/(:|;|\.)/g, '\\$1');

				var $Msg = $('#MSG' + id);

				if (create && !$Msg.length) {

					var ids = this._garbageIds, cache = this._garbage, i, M, mId, l = this._garbageLimit;

					if (cache[id]) {
						$Msg = cache[id];
					} else {

						$Msg = cache[id] = $('<div />', { id: 'MSG' + id });

						ids.unshift(id);

						for (i = ids.length; i > l; i--) {
							mId = ids.pop();
							M = patron.Messages.get(mId);
							if (M) {
								delete M._crc;
							}
							this._remove(mId, true);
							delete cache[mId];
						}
					}

					$Msg.appendTo(this.$Body);
				}

				return $Msg;
			},

			// @public
			isActive: function () {
				return false;
			},

			getCacheKey: function (msg) {
				return    [jsHistory.get(), msg.Id, msg.PrevId, msg.NextId, msg.FolderId, msg.Unread, msg.Flagged, msg.Reply, msg.Forward, msg.Attachfiles_Items, msg._loaded, msg['Avatar.UrlAbsolute']].join('.');
			},

			_iAttachEvents: function (id) {
				var $attachContainer = $('#ReadMsgAttachment' + id), $w = $(window);
				if ($('.i-bmp,.i-jpg,.i-jpeg,.i-png,.i-tif', $attachContainer).length) {
					$w.triggerHandler('attachHasImage.readmsg');
				} else if ($('.js-previewText', $attachContainer).length) {
					$w.triggerHandler('attachPreviewText.readmsg');
				}
			},

			wrapStatic: function () {
				if (patron.v2) return;

				var messageId = patron.messageId;

				if (patron.message && patron.message.Id) {
					messageId = patron.message.Id;
				}

				GET.id =
					patron.ReadMsg.ID =
						patron.ReadMsg._ID = messageId = (messageId + '').replace(/&[^;]+;/g, '');

				var selectorId = (messageId + '').replace(/(:|;|\.)/g, '\\$1');

				var messageBody = $('#'+ selectorId +'_TEXT').clone();

				messageBody.find('script').each(function (k, v) {
					if (v.innerHTML === "document.write('</scr' + 'ipt>')") {
						$(v).remove();
					}
				});

				var htmlBody = messageBody.attr('innerHTML');

				if (htmlBody == null) {
					htmlBody = "";
				}

				this.logFormsInBody($('#' + selectorId + '_TEXT'));
				this._calculatePhones(htmlBody); // count each phones show

				var M = patron.Messages.upd(messageId, ajs.extend({
					let_body: htmlBody, let_body_plain: $('#ReadMsgBodyPlain').val(), Attachment_html: !patron.NewAttachViewer ? $('#ReadMsgAttachment' + selectorId).attr('innerHTML') : '', _static: true, _loaded: true, _load_by_message: true
				}, patron.message));

				M._key = [M.FolderId, GET.mode, GET.charset].join('|');

				this._cacheKey = this.getCacheKey(M);

				this._init();

				this.updAvatar(M);

				this._iLinks('#viewmessagebody, #style_' + selectorId);
				this._iAttachEvents(selectorId);

				if (patron.NewAttachViewer) {
					this.attachViewer.redraw('#ReadMsgAttachment' + selectorId, M, true);
				}

				if (M.isReadSet()) {
					M.set('ReadSet', false, 1);
				}

				patron.Folders.setId(M.FolderId);

				// Fixed reload banner after 30 seconds
				this._bnrId = jsHistory.get();

				jsView.get('head').redraw();

				if (M.ShowRemindPhoneOverlay && M.RemindPhone) {
					LayerManager.show('phonesync', [patron.ShowRemindPhoneOverlayForce, M.RemindPhone]);
				}

				var daftType = this._getDraftType(M);
				if (patron.MessageFromDraft && daftType) {
					this._iFastAnswer(daftType, false);
				}

				$(window).triggerHandler('showMessage.readmsg');

				patron.Utils.SeptimaOn.checkLetter(M, $('#viewmessagebody, #style_' + selectorId));
			},

			_getDraftType: function (M) {
				var type;
				if (M && M.last_draft_type && M[M.last_draft_type + '_draft']) {
					type = M.last_draft_type;
				}
				return type;
			},

			toggleControls: function (disable) {
				this._init();

				this.$Nav.find('a')[disable ? 'attr' : 'removeAttr']('disabled', true);
				this.$Controls.toggleClass('button-a_disabled', disable);
				this.$Dropdowns.toggleClass('dropdown_disabled', disable);
			},

			logFormsInBody: function (bodyNode) {
				return;
				// log forms in body
				bodyNode.find('form').each(function () {
					var div = document.createElement('div');
					div.appendChild($(this).clone()[0]);
					var _log = patron.useremail + "\t" + div.innerHTML.substring(0, 200);
					new Image().src = '//gstat.' + patron.staticDomainName + '/gstat?ua=1&logme=FORMS_IN_BODY.' + encodeURIComponent($.param(_log)) + '&r=' + Math.random();
				})
			},

			redraw: function (M, _opts, Res) {
				var _tsStart = ajs.now();

				this._init();
				this.loading(M);

				var params = GET, id = params.id, F, changeMessage = false, completeLoadMessage = false;

				if (!M || (M == 'error')) {	// FIXME, FIXME, FIXME: logging this situation!!!!
					var X = patron.Messages.get(id);
					if (X && X.Id && X.let_body) M = X;
				}

				if (patron.ReadMsg.ID !== id) {
					this._redrawThread(id);
					this._remove(patron.ReadMsg.ID);

					patron.ReadMsg.ID = id;
					patron.Events.fire('select.readmsg', id);

					this._iFastAnswer(true);

					// Clear selection
					try {
						var d = document;
						if (d.selection && d.selection.empty) d.selection.empty();
						else window.getSelection().removeAllRanges();
					}
					catch (e) {
					}

					this._unread = M.Unread;
					this._folderDecrimented = 0;

					$(window).triggerHandler('show.readmsg');
					if (M.ListUnsubscribe && patron.ListUnsubscribeImmediatlyEnabled) {
						Counter.d(1611231);
						Counter.d(1853640);
						Counter.d(1853646);
					}
					else if (M.ListUnsubscribe) {
						Counter.d(2189255);
						Counter.d(2189258);
					}

					var preloadId = M && M[patron.isClickOnMsgPrev ? 'PrevId' : 'NextId'];
					if (~~preloadId) {
						patron.Messages.load(Object.extend({}, GET, {id: preloadId, sm: 0}));
					}

					this.radar('change', 1);

					changeMessage = true;
				}

				if (M && M != 'error') {
					if (this._unread) {
						if (M._loaded) {
							this._unread = 0;
							if (this._folderDecrimented) {
								M.set('Unread', false);
								this._folderDecrimented = 0;
							}
							M.set('ReadSet', false, 1);
							patron.Messages.edit({type: 'read', id: M.Id});
						} else {
							F = M.getFolder();
							if (F) {
								F.inc('Unread', -1);
								this._folderDecrimented = 1;
							}
						}
					} else {
						if (M.isReadSet()) {
							M.set('ReadSet', false, 1);
							F = M.getFolder();
							if (F) {
								F.inc('Unread', -1);
							}
						}
					}
				}

				if (M && (M == 'error' || M.NoMSG == 1)) {
					this.loading(false);

					this.$Top.display(0);
					this.$Bottom.display(0);

					var errType = M.NoMSG ? 'MessageNotFound' : 'InternalError';
					if (Res) {
						errType = Res.getStatus() == 'timeout' ? 'timeout.error' : (Res.getXHR().readyState < 4 ? 'connection.error' : 'InternalError');
					}

					if (M.NoMSG) {
						var log = patron.useremail + '.id=' + (GET.id || 0) + '.folder=' + ~~GET.folder;
						(new Image).src = '//gstat.' + patron.staticDomainName + '/gstat?logme=READMSG_NOT_FOUND.' + encodeURIComponent(log) + '&r=' + ajs.now();
					}

					this._get(id, true).display(1).innerHTML('<p style="padding: 100px 50px;"><b>' + Lang.get(errType) + '</b></p>');
				}
				else if (M && (M.Date || M._loaded)) {
					patron.Folders.setId(M.FolderId);

					this.$Top.display(1);
					$(window).resize();//.triggerHandler('refresh.ad');

					var bnr = jsHistory.get();
					if (this._bnrId != bnr) {	// Reload banners + counters
						this._bnrId = bnr;
//					patron.Banners.View.reload();
					}

					if ((this._tid != M.Id) || (M._tcrc != M._key)) {
						M._tcrc = M._key;
						this._tid = M.Id;
					}

					this.upd(M, params);
					this.updIF(M);
				}

				if (M && !M.NoMSG && M._loaded) {
					this.updInp(M);

					this.$Bottom.display(1);
					$('#mailruPreFoot').display(1);

					var $M = this._get(id, true);

					if ((M._crc !== M._key || !M._key) || !$M[0].firstChild) {
						var attachId = 'id' + jsCore.getUniqId();

						if (patron.NewAttachViewer) {
							attachId = 'ReadMsgAttachment' + M.Id;
						}

						// Close Jinn Notify
						if (M.jinnNotify) {
							M.jinnNotify.cancel();
							delete M.jinnNotify;
						}

						this._cleanData($M);

						M._crc = M._key || Date.now();
						var messageBody = M.getBody();
						$M.innerHTML(
								messageBody
								+ '<div style="clear: both;"></div>'
								+ '<div id="' + attachId + '"></div>'
						);
						this._calculatePhones(messageBody);
						patron.Utils.Message.highlightPhoneNumbers($M);

						patron.Utils.Message.prepareQuotes($M);

						patron.Utils.SeptimaOn.checkLetter(M, $M);
						this.logFormsInBody($M);

						if (!patron.NewAttachViewer) {
							if (M.Attachment_html) {
								$('#' + attachId).html(M.Attachment_html);
							}
						}

						this._iAttachEvents(M.Id);

						if ($.browser.msie && M.style_for_message) {	// Fixed <style />
							$M.prepend('<style type="text/css">' + M.style_for_message + '</style>');
						}

						this.updAvatar(M);
						this.loading(M);
						this.radar('html', 1);

						if (M.ShowRemindPhoneOverlay && M.RemindPhone) {
							LayerManager.show('phonesync', [patron.ShowRemindPhoneOverlayForce, M.RemindPhone]);
						}
						changeMessage = true;
					}

					// Fishing
					this._iLinks('#style_' + M.Id + '_BODY');

					completeLoadMessage = true;
				}

				// MEGA PIZDOS 2
				patron.ReadMsg.REDRAW = 0;
				if (changeMessage && completeLoadMessage) {

					if (patron.NewAttachViewer) {
						this.attachViewer.redraw('#ReadMsgAttachment' + M.Id, M);
					}

					var daftType = this._getDraftType(M);
					if (patron.MessageFromDraft && daftType) {
						this._iFastAnswer(daftType, false);
					}

					this.toggleControls(false);
					patron.ReadMsg.REDRAW = 1;
					if (patron.ReadMsg.NEW_REDRAW) {
						setTimeout(function () {
							// async event
							$(window).triggerHandler('showMessage.readmsg');
						}, 1);
						patron.ReadMsg.NEW_REDRAW = patron.ReadMsg.REDRAW = 0;
					}
				}


				// https://jira.mail.ru/browse/MAIL-8196
				var dt = ajs.now() - _tsStart, browser = $.browser.name;
				if (browser == 'opera') {
					browser += '_' + ($.browser.intVersion > 9 ? 10 : 9);
				}
				else if (browser == 'msie') {
					browser += '_' + ($.browser.intVersion < 8 ? 7 : $.browser.intVersion);
				}
				patron.radar('UI_readmsg', browser + '=' + dt, dt);
				patron.uiRadar('readmsg')('onRedraw', 1)('all', 1)(true);

				return    this;
			},

			_calculatePhones: function (body) {
				var phones = body.match(/(<span class="js-phone-number)">/g)
					, i = phones ? phones.length : 0;
				while (i--) {
					Counter.d(1313358);
				}
			},


			_getNodeInfo: function (node) {
				return  patron.Utils.Fishing.getNodeInfo(node);
			},


			_checkFishing: function (evt) {
				patron.Utils.Fishing.checkEvent(evt);
			},

			_go: function (node) {
				patron.Utils.Fishing.go(node);
			},

			_iLinks: function (id) {
				if (!patron.v2) {
					$(id)
						.unbind('.fishing')
						.addClass('js-readmsg-link-box')
						.delegate('a', 'click.fishing mousedown.fishing', this._checkFishing)
						.delegate('form', 'submit.fishing', this._checkFishing)
						.one('mouseover.fishing focusin.fishing', function () {
							$(id)
								.each(function (i, node) {
									node = node.getElementsByTagName('a');
									for (i = node.length; i--;) {
										this._getNodeInfo(node[i]);
									}
								}.bind(this))
							;
						}.bind(this))
					;
				}
			},

			loading: function (M) {
				this._init();

				// Is show
				var s = (M !== false) && M && (M._loading && !M._loaded);

				if (this.__s !== s) {
					this.__s = s;
					this.$Top.display(!!(M && M.Date && M.Id));
					this.$Body.display(!s);
					this.$Bottom.display(!s);
					this.$Loading.display(s);
					$('#mailruPreFoot').display(M && M._loaded);
				}
			},


			_redrawThread: function (msgId) {
				var msg = patron.Messages.get(msgId);
				if (msg && msg.thread) {
					patron.Threads.find({ id: msg.thread }, function (err, thread) {
						var
							find = false
							, before = []
							, after = []
							, messages = patron.Messages.get(thread.get('messages'))
							, i = 0
							, n = messages.length
							, msg
							;


						for (; i < n; i += 1) {
							msg = messages[i];
							find |= msg.Id == msgId;
							if (msg.Id != msgId) {
								(find ? after : before).push(msg);
							}
						}


						$('#ReadMsgThreadTop').tpl('#msglist__messageline_ejs', {
							messages: before, Msglist: 1, newsnippets: 1, MessagelineMedia: 1, needShortLongMicroformat: 1, expanded: false, selected: {}
						});


						$('#ReadMsgThreadBottom').tpl('#msglist__messageline_ejs', {
							messages: after, Msglist: 1, newsnippets: 1, MessagelineMedia: 1, expanded: false, needShortLongMicroformat: 0, selected: {}
						});

						$(window).triggerHandler('readmsgthreadredraw');
					});
				}
			}

		});


	if (patron.threads) {
		ajs.each(['_init', '_redraw', 'redraw', 'wrapStatic', 'toggleControls'], function (name) {
			patron.View.ReadMsg.prototype[name] =
				patron.View.ReadMsgNew.prototype[name] = ajs.F;
		});
	}


	jsLoader.loaded('{patron.view}patron.View.ReadMsg');
});
