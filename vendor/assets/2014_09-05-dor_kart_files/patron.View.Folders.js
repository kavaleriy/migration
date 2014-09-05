/**
 * @class	patron.View.Folders
 * @author	RubaXa	<trash@rubaxa.org>
 */

jsLoader.require([
    '{plugins}Dropdown',
    '{labs}jsView',
    '{jQuery}jquery.tpl',
	'{festTemplate}blocks/messagelist/messagelist__dropdown-moveto'
], function (){
	/**
	 * @class patron.View.Folder
	 */
	jsView
		.create('patron.View.Folder')
		.methods({

		clearProcessStatus: function (id, status){
			var $Alt = $('#ajax-alt-special-folder-'+id).add('#folder'+id);

			if( status == 'start' ){
				$('.js-folder-clear,.js-folder-clear-ok', $Alt).display(0);
				$('.js-folder-clear-loading', $Alt).display(1);
			}
			else if( status == 'end' ){
				$('.js-folder-clear', $Alt).display(1);
				$('.js-folder-clear-loading', $Alt).display(0);
			}
			else {
				$('.js-folder-clear', $Alt).display(0);
				$('.js-folder-clear-ok', $Alt).display(1);
			}
		},

		_one: function (){
			this.$View	= $( this.idView );
			this.isChange('id', GET.folder);

			var t = this;

			$('#ajax-alt-special-folder').delegate('.js-folder-clear', 'click', function (evt){
				var
					  F = patron.Folders.get( $(evt.currentTarget).data('id') )
					, txt = Lang.get('folder.clear.confirm')
				;

				if( F && confirm((txt[F.getType()] || txt.def).replace('%s', F.Name)) ){
					t.clearProcessStatus(F.Id, 'start');

					patron.Ajax({
						url: '/cgi-bin/clearfolder',
						type: 'POST',
						data: {
							ajax_call: 1,
							func_name: 'clear_folder',
							folder: F.Id
						},
						isUser: true,
						complete: function (R) {
							t.clearProcessStatus(F.Id, 'end');

							if( R.isOK() ){
								patron.Updater.reload(true);
								patron.Messages.set(F.Id, [], Date.now(), 0);
								patron.View.Messages.getActive().redraw();
								t.clearProcessStatus(F.Id, 'done');
							}
						}
					});
				}

				return	false;
			});
		},

		_changed: function ()
		{
			var F = patron.Folders.get();
			return	this.isChange('hash', F ? F.getHash() : '', 1);
		},

		_redraw: function (r, a)
		{
			var F = patron.Folders.getSafe();

			if( a ){
				this._init('base', function (){
					this.$Title		= $( this.idTitle );
					this.$MsgList	= $( this.idContent );
					this.$Empty		= $( this.idEmpty );
					this.$AddSender	= $( this.idSender, this.$View );
				});
			}

			if( !r ){
				this.$View.display( a );
			}

			if( r && this._init('base') && this.isChange('hash', F.getHash()) ){
				var e = !F.Messages, s = F.isSent() || F.isDrafts();

				this.$Title.innerHTML(
					  (F.isRoot() ? '' : F.getRoot().Name + ' / ')
					+ F.Name
				);

				if( this.isChange('id', F.Id) ){
					$('DIV', '#ajax-alt-special-folder').display(0);
					$('#ajax-alt-special-folder-'+F.Id)
						.display(1)
						.find('.js-folder-clear').display(!e).end()
						.find('.js-folder-clear-ok').display(0).end()
					;
				}

				if( this.isChange('sender', s) ){
					this.$AddSender.display(!s);
				}
			}
		}

	});
	// Folder.View

	/**
	 * @class patron.View.Folders.DropDown
	 */
	jsView
		.create('patron.View.Folders.DropDown')
		.methods({

		_one: function ()
		{
			this.$View		= $( this.idView );

			if( !patron.isReadMsgPage() ) this.isChange('id', GET.folder);
			this.isChange('hash', patron.Folders.getHash());

			$(this.cssElms, this.$View).removeClass(this.cssElms.replace('.', '') + '_disabled').dropdown({
				  link:			'.'+this.clLink
				, container:	'.'+this.clContainer
				, orientation:	'auto'
				, wrapperWidth:	function () { return $('#PageContent').width(); }
				, onToggle:		function (s, D)
				{
					if (s && D.$link.parent().hasClass('dropdown_disabled')) {
						return false;
					}

					var name = D.$container.attr('data-name');
					this.expand	= s;

					$(window).triggerHandler('dropDownClick.msglist', [name, s]);

					if( s ) this._showDD(D);
					if( name == 'folders' ) this.redraw();

					if (s && name == 'message-media-view') {
						patron.radar('MessageLineWithBal', 'menuClick=1');
						$(window).triggerHandler('dropDownViewLinkClick.msglist');
					}

				}.bind(this)
				, onClick:		function (e, D)
				{
					var
						  $Item	= $(e.target)
						, item	= $onClick($Item, true)
						, name	= D.$container.attr('data-name')
					;

					if( !item ){
						$Item = $Item.parent();
						item	= $onClick($Item, true);
					}

					$(window).triggerHandler('dropDownLinkClick.msglist', [name, item]);

					D.hide();

					if( D.$container.hasClass('dropdown_disabled') || $Item.hasClass('dropdown__list__item_disabled') || $Item.parent().hasClass('dropdown__list__item_disabled') )
					{	// Dropdown or item disabled
						return	false;
					}
					else
					{
						if( item && !$Item.hasClass(this.clSel) )
						{	// [type, action, data]
							patron.Events.fire(item[1]+'.'+item[0]+'.click', item[2]);
							return	false;
						}
					}

					if( (name != 'sort-messages') && (name != 'readmsg-more') )
					{
						return	false;
					}
				}.bind(this)
			});
		},

		_showDD: function (DD)
		{
			var
				  arId	= patron.View.Messages.getActive().select() // get selected messages
				, $Box	= DD.$container
				, name	= $Box.attr('data-name') // get dropdown name
				, txt
				, F = patron.Folders.getSafe()
			;


			if( name == 'folders' ){
				if( $Box.attr('data-hash') != patron.Folders.getHash() ){
					var html = $.fest('blocks/messagelist/messagelist__dropdown-moveto', { top: $Box.hasClass('dropdown__list_bottom') });
					$Box
						.attr('data-hash', patron.Folders.getHash())
						.empty()
						.append($('.js-menu', html).children())
					;
				}

				var
					  s = this.clSel
					, fId = -1
					, arFolderId = patron.Messages.map(arId, function (X){ return X.FolderId })
					, n = arId.length
					, $Info = $Box.find('.js-info')
					, $Items = $Box.find('.dropdown__list__item')

				;

				if( n && Array.uniq(arFolderId).length == 1 ){
					fId	= arFolderId[0];
				}

				if( n ){
					$Items
						.removeClass('dropdown__list__item_disabled')
						.filter('.'+ s).removeClass(s).end()
						.filter('.js-FDD'+fId).addClass(s).end()
					;
				}
				else {
					$Items.addClass('dropdown__list__item_disabled');
				}

				$Info.toggle(!n);
			}
			else if( name == 'select-messages' )
			{	// Messages selector
				var n = arId.length;

				$('.js-if-ge-one', $Box).toggleClass('dropdown__list__item_disabled', !n);

				var email = (F.isSent() || F.isDrafts() ? 'To' : 'From');

				if( n )
				{
					txt	= Lang.get('dropdown.select-messages.'+email+'.prefix')
						+ Array
							.uniq(patron.Messages.map(arId, function (M)
							{
								var F = patron.Folders.get(M.FolderId, true);
								return M[(F.isSent() || F.isDrafts() ? 'To' : 'From')] || ('<' + Lang.get('message.email.unknown') + '>');
							}))
							.join(', ')
						;
				}

				$('.js-email .dropdown__list__item__link__text', $Box)
					.text(
						txt ? String.wordWrap(txt, 50, 120, '...') :
						Lang.get('dropdown.select-messages.'+ email +'.disabled')
				);

				$('.js-if-ne-all', $Box).toggleClass('dropdown__list__item_disabled', n == patron.Pager.onPage);
			}
			else if( name == 'more' || name == 'readmsg-more' )
			{	// Dropdown "More"
				var n = arId.length;
				var $Info = $Box.find('.js-info');

				$Box.toggleClass('dropdown__list_disabled', !n); // disable dropdown, if messages not selected
				$Info.toggleClass('dropdown__list__item__more_note', !n);

				if (n) {

					txt = [];

					patron.Messages.map(arId, function (M) {
						var F = patron.Folders.get(M.FolderId, true);
						if (F.isSent() || F.isDrafts()) {
							if (M.To) {
								txt = txt.concat(M.To.split(', '));
							} else {
								txt.push('<' + Lang.get('message.email.unknown') + '>');
							}
						} else {
							txt.push(M.From || ('<' + Lang.get('message.email.unknown') + '>'));
						}
					});

					txt	= Array.uniq(txt);

					var l = txt.length;
					if( l > 3 ){
						txt = txt.slice(0, 2);
						txt = txt.join(', ');
						txt += Lang.get('addressee.and.more').replace('%s', String.num(l, Lang.get('addressee'))).replace('%n', l - 2);
					} else {
						txt = txt.join(', ');
					}

					$('.js-only-one', $Box).toggleClass('dropdown__list__item_disabled', l > 1 || txt.indexOf('@') === -1);
					$('.js-inboxOnly', $Box).toggleClass('dropdown__list__item_disabled', F.isSent() || F.isDrafts());
				}

				$Info.html( txt ? txt : Lang.get('dropdown.more.empty') );
			}
			else if( name == 'mark' )
			{
				var read = 0, flag = 0, n = arId.length, $Info = $Box.find('.js-info');

				patron.Messages.forEach(arId, function (M) {
					if (!M.Unread) read++;
					if (M.Flagged) flag++;
				});

				$Info.toggle(!n);

				var cn = 'dropdown__list__item_disabled';
				$Box
					.find('.js-mark-readed').toggleClass(cn, !n || read == n).end()
					.find('.js-mark-unread').toggleClass(cn, !n || read == 0).end()
					.find('.js-mark-flagged').toggleClass(cn, !n || flag == n).end()
					.find('.js-mark-unflagged').toggleClass(cn, !n || flag == 0).end()
				;
			}
		},


		destroy: function (){
			if( this.$View ){
				$(this.cssElms, this.$View).dropdown('destroy');
				this.$View = null;
				this.idView = null;
			}
		}

	});
	// DropDown;

	/**
	 * @class patron.View.Folder.SpamButtons
	 */
	jsView
		.create('patron.View.Folder.SpamButtons')
		.methods({

		_redraw: function (r, a){
			var F = this.getFolder();

			if( r && this.isChange('id', F.Id) ){
				this.getView().display(0);

				if( !(F.isDrafts() || F.isSent()) ){
					this.getView()
						.filter(F.isBulk() ? '.js-is-nospam' : '.js-is-spam').display(1).end()
						.filter('.ajax-add-sender').display(1).end()
					;
				}

				this.getView().parent().find('.js-remove').toggleClass('button-a_left', !(F.isDrafts() || F.isSent()));
			}
		},

		getFolder: function (){
			return	patron.Folders.getSafe(patron.getFolderId());
		}

	}); // DropDown

	jsLoader.loaded('{patron.view}patron.View.Folders');
});
