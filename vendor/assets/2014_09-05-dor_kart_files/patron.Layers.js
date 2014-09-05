/**
 * @object	patron.Layers
 * @author	RubaXa	<trash@rubaxa.org>
 */

jsLoader.require([
	'{toolkit.common}modernizr/modernizr',
	'{plugins}LightBox',
	'{patron}patron.core',
	'{jQuery}addressbookSuggest',
	'{jQuery}composeLabels'
], function (){

	jsClass
		.create('patron.Layers')
		.statics({

		_init:	{},

	// @private
		_base: function (func, type, initFunc)
		{
			if( !this._bL )
			{
				this._bL	= new LightBox('#MailRuConfirm',
				{
					BODY:		'#ScrollBodyInner',
					position:	'fixed',
					fadeColor:	patron.isDarkPopup ? '#000' : '#fff',
					fadeOpacity: patron.isDarkPopup ? 0.4 : 0.6,
					$wrapper: $Scroll.normal ? $(document.body) : $ScrollElement,

					init: function (){
						var _check = function (evt) {
							if( ( !evt.isDefaultPrevented() || /js-cancel/.test( evt.currentTarget.className ) ) && this.isVisible() ) {
								var state = (evt.type == 'submit') || /confirm-ok/.test(evt.currentTarget.className);
								if( this.func( state, this.$Type.toObject(), this.$Type ) !== false ){
									if (patron.TestAnimations && Modernizr.keyframes) {
										this.$Box.one('animationend webkitAnimationEnd MSAnimationEnd oAnimationEnd', function(){
											this.hide();
											this.$Box.removeClass('popup_effect-zoom-out');
										}.bind(this));

										this.$Box
											.removeClass('popup_effect-zoom-in')
											.addClass('popup_effect-zoom-out');
									} else {
										this.hide();
									}
								}
								return	false;
							}
						}.bind(this);

						this.$Box
							.delegate('form', 'submit', _check)
							.delegate('.confirm-ok', 'click', _check)
							.delegate('.confirm-cancel', 'click', _check)
							.delegate('.js-cancel', 'click', _check)
						;
					},

					onBeforeShow: function ()
					{
						if (patron.TestAnimations && Modernizr.keyframes) {
							this.$Box.addClass('popup_effect-zoom-in');
						}
						this.$Type.removeClass('dN').display(true);
					},

					onShow: function ()
							{
								this.type(this._t);

								this.$Type
									.find('INPUT[type!=hidden], TEXTAREA')
										.filter(':text, :password, :file, TEXTAREA').val('').end()
										.eq(0).focus()
								;
							},

					onHide: function ()
							{
								this.$Box
									.css({ marginLeft: '', marginTop: '', left: '', top: '', zIndex: 30012 })
									.removeClass('is-'+this._t)
								;

								if( this.$Type ) this.$Type.addClass('dN').hide();
								this._t	= '';
							},

					type:	function (t)
							{
								if( this._t != t )
								{
									if( this.$Type ) this.$Type.addClass('dN').hide();

									this.$Box.replaceClass(/is-\w+/, '').addClass('is-'+ t);
									this._t		= t;
									this.$Txt	= $('#is-'+ t +'-txt');
									this.$Type	= this.$Box.find('.is-'+ t +'_in');
									this.$Submit= this.$Type.find(':submit');
								}
							},
					text:	function (t){ this.$Txt.text(t); },
					getType:function (){ return this._t; }
				});

				this._bL.onHide();
				this._bL.type(type);
			}

			var L = this._bL;

			if( type ) L.type(type);
			if( func ) L.func = func;


			var t	= L.getType();
			if( !this._init[t]  )
			{
				this._init[t] = 1;
				(initFunc || jsCore.F).call(L);
			}

			return	L;
		},



	// @public
		// Secure folder
		secure: function (id, fn){
			fn = fn || ajs.F;
			var
				Folder	= patron.Folders.getSafe(id),
				Layer	= this._base(function (ok, Form, $Node){
					$Node = $(':password', $Node).val('');

					var messageElem = $Node.parent().find('.form__message');
					messageElem.empty();
					$Node.removeClass('form__field_error');

					if( ok ){
						patron.Ajax({
							  url: '/cgi-bin/folderlogin?ajax=1'
							, type: 'POST'
							, isUser: true
							, data: { folder: Folder.Id, password: Form.pass }
							, complete: function (R){
								if( R.isOK() ){
									Folder.set('Secure', patron.Folder.SECURE_OPEN);
									patron.Layers.hide();
									fn(true, Folder);
								}
								else if( R.isInvalidPassword() ){
									$Node.addClass('form__field_error');
									messageElem
										.html(Lang.get('password.wrong'))
										.addClass('form__message_error');
									$Node.first().focus();
								}
							}
						});
						return	false;
					} else {
						fn(false, Folder);
						if( window.documentView )
							documentView.redraw();
					}
				}, 'secure')
			;

			Layer.text( Folder.Name );
			$('A', Layer.$Type).attr('href', '/folder/restore/?folder='+ Folder.Id);
			Layer.show();
			return	Layer;
		},


		// Redirect message
		redirect: function (id, func) {
			var L	= this._base(function (ok, d) {
						if( ok ) {
							if(patron.ComposeLabels && (!this.$Type.find('[name=RedirectTo]').val() || !this.$Type.find('.js-compose-labels').composeLabels("widget").isValid() ) ) {
								var txt = Lang.get('compose.field.invalid_address')
									, a = Lang.get('compose.field.To');
								alert(String.sprintf(txt,a));
								return false;
							}
							this.$Type.find('.confirm-ok').attr('disabled', true);
							func.call(this, d);
							return	false;
						}
					}, 'redirect', function (n)	{
						this.$Type.find(n = '[name=RedirectTo]').expandField();
						var $inp = this.$Type.find(n);

						if (patron.ComposeLabels) {
							$inp.composeLabels({blockMaxWidth: 150});
							// redefine inp
							$inp = this.$Type.find(n);
							this.onShow = function() {
								// super.onShow
								this.type(this._t);

								this.$Type
									.find('INPUT[type!=hidden], TEXTAREA')
									.filter(':text, :password, :file, TEXTAREA').val('').end()
									.eq(0).focus()
								;
								// clear compose labels
								if (this._t == 'redirect' && $inp && $inp.length) {
									$inp.val('').trigger('change');
								}
							}
						}
						else if (patron.CanUseNewAddressbookSuggests) {
							$inp.addressbookSuggest({width: "322px"});
						}
						else {
							$.Autocompleter.addressbook($inp, true, true);
							this.$Type.find('.ac-layer').mouseup(function (){ setTimeout(function (){ $inp.triggerHandler('keyup'); }, 5); });
						}
						if (!patron.ComposeLabels)
							$inp.bind('keyup change', function (){ this.$Submit.attr('disabled', !/@/.test( $inp.val() )) }.throttle(150, this));

						this.$Type.find('.js-addressbook').click(function(evt) {
							patron.Utils.openAddressbookPopup('RedirectTo');

							evt.preventDefault();
						});

						// Tab indexes
						$inp.attr('tabindex', 101);
						this.$Submit.attr('tabindex', 102);
						this.$Type.find('.confirm-cancel').attr('tabindex', 103);
					});

			L.$Type
				.find('.confirm-ok').attr('disabled', false).end()
				.find('input[name=id]').val(id).end()
				.find('a[rel="history"]').attr('href', patron.getPageURL('compose', { id: id, mode: 'forward' }))
			;

			L.$Submit.attr('disabled', !patron.ComposeLabels);

			L.show();

			return L;
		},

		// Hide active layer
		hide: function (){ if( this._base().isVisible() ) this._base().hide(); },

		fade: function (s, t)
		{
			if( !this._fL )
			{
				this._fL	= new LightBox($('<div style="color: #fff; font-size: 20px;">' + Lang.get('lightbox.wait') + '</div>').appendTo('BODY'));
			}

			if( t ) this._fL.$Box[0].innerHTML = t;
			this._fL.disabledHide	= s;
			return	this._fL[s ? 'show' : 'hide']();
		},

		get: function (type, func, initFunc)
		{
			return	this._base(func, type, initFunc);
		}

	});


	jsLoader.loaded('{patron}patron.Layers');
});
