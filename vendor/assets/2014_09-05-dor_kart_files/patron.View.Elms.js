jsLoader.require(['{labs}jsView', '{patron}patron.Threads'], function (){
	/**
	 * @class patron.View.Elms.Head
	 */
	jsView
		.create('patron.View.Elms.Head')
		.methods({

		_first: function (){
			this._rkey	= /#(\w+)#/gi;

			$(document).bind('propertychange', function() {
				// Rebuild page title
				var title = this.createTitle();
				if (document.title != title && document.title.indexOf('#' + jsHistory.get()) !== -1) {
					patron.setTitle(title);
				}
			}.bind(this));
		},

		_one: function (){
			this.$HeadNum		= $('#g_mail_events').closest('.head_menu_link');
//			this.$MenuRow		= $(this.idMenuRow); by MAIL-4881
			this.$Navigation	= $(this.idNavigation);

/*
			$('#HeaderBtnCheckNewMsg').click(function ()
			{	// Check new messages
				patron.Updater.reload(true);
				return	false;
			});
*/

			$('.header, .portal-menu').one('mouseover click', function (){
				// Preload ComposeForm HTML
				patron.View.Compose.loadFormHtml('preload');
			});

			$('#HeaderBtnSentMsg').mousedown(function (){ this.href = '/compose/?r='+ajs.now(); });
			$(window).bind('updatemessagescount', this.title.bind(this));
			patron.Events.bind('update.messages loaded.messages', this.title.bind(this));
		},

		_redraw: function (r, a){
			if( r ){
				if( !patron.isMrimHistory ){
					this.title();
				}

				if( this.isChange('navigation', patron.getPageLabel()) ){
					this.navigation();
				}

				$('#AdvertisingTopLine').display(
					   patron.Ad.test('advertising-topline')
					&& (!patron.isSearchPage()
						|| !patron.isAdvancedSearchPage()
						|| $('#leftcol__search').is(':visible') // INCLUDE settings
					)
				);
			}
		},

		navigation: function () {
			if (patron.UseFlatHeader) {
				__PM.getItems(function(menuItems) {
					Object.forEach(menuItems.toolbar.itemsByName.menu.itemsByName, function (item, name) {
						if (item.setCurrent) {
							if (name === 'inbox' && (patron.isMsgList || patron.isReadMsg || patron.isSearch)) {
								item.setCurrent(true);
							} else if (name === 'files' && patron.isFileSearch) {
								item.setCurrent(true);
							} else {
								item.setCurrent(false);
							}
						}
					});
				});
			} else {
				$('.portal-menu__buttons__cont_selected', this.$Navigation).removeClass('portal-menu__buttons__cont_selected');
				if (patron.isSentMsg) {
					$('.dd-sentmsg', this.$Navigation).addClass('portal-menu__buttons__cont_selected');
				} else if (patron.isFileSearch) {
					$('.dd-filesearch', this.$Navigation).addClass('portal-menu__buttons__cont_selected');
				} else if (patron.isMsgList || patron.isReadMsg || patron.isSearch) {
					$('.dd-msglist', this.$Navigation).addClass('portal-menu__buttons__cont_selected');
				} else if (patron.isAddressbook) {
					$('.dd-addressbook', this.$Navigation).addClass('portal-menu__buttons__cont_selected');
				}
			}
		},

		createTitle: function () {
			var
				  title
				, postfix
				, folder = patron.Folders.getSafe(patron.getFolderId())
				, letter = patron.threads ? patron.Threads.get(GET.id) : patron.Messages.getSafe(GET.id)
				, data = {
					  email:	patron.useremail
					, folder:	folder.Name
					, unread:	~~folder.Unread
					, subject:	letter && letter.get && letter.get('Subject') || '<'+Lang.get('message.email.untitled')+'>'
					, query:	GET.q_query
				}
			;


			if( patron.isMsgListPage() || patron.isReadMsgPage() || patron.isComposePage() || patron.isSendMsgOk || patron.isSearch || patron.isFileSearch ){
				if( patron.isMsgList && data.unread ){
					postfix	= (((folder.id === 950 && patron.HideSpamCounterOnTheLeftCol) || folder.id === 500002) ? 'unread_without_counter' : 'unread');
				}
				else if( GET.mode == 'reply' || ('reply' in GET) || jsHistory.get().match(/\/compose\/\d+\/reply/) ){
					/** @namespace GET.id_orig */
					postfix	= 'reply';
					data.subject = patron.Messages.getSafe( GET.id_orig || GET.id ).Subject || '<'+Lang.get('message.email.untitled')+'>';
				}
				else if( patron.isSearchPage() && data.query ){
					postfix	= 'query';
				}

				if( !title ){
					var path = jsHistory.get().match(/(\w{4,})(\/|$|[?#])/);
					if (path) {
						path = path[1];
						title = 'title.'+ path.replace('compose', 'sentmsg').replace('search', 'gosearch') + (postfix ? '.'+postfix : '');
					}
				}

				title = Lang.str(title, 'title.default').replace(this._rkey, function (a, key){ return data[key] || ''; });
			}

			return title || document.title;
		},

		title: function (){
			if (!patron.isThreadPage()) {
				patron.setTitle( this.createTitle() );
			}
		}

	});
	// HEAD


	/**
	 * @class patron.View.Elms.GSNForm
	 */
	jsView
		.create('patron.View.Elms.GSNForm')
		.methods({

		_one: function ()
		{
			this.$View = $(this.idView);

			var $button = $('input.GOsubmit', this.$View), $asearch = $('a.iSearch', this.$View);

			// MAIL-1106
			$button.mousedown(function() {
				new Image().src = '//rs.' + patron.SingleDomainName + '/sb427958.gif?' + Math.random();
			});
			$asearch.mousedown(function() {
				new Image().src = '//rs.' + patron.SingleDomainName + '/sb427959.gif?' + Math.random();
			});
		},

		_redraw: function (r, a)
		{
			if( !r )
			{
				this._init('view', function (){ this.$View = $(this.idView); });
				this.$View.display(a);
			}
		}
	});



	jsLoader.loaded('{patron.view}patron.View.Elms');
});
