jsLoader.require('{labs}jsView', function ()
{
	/**
	 * @class patron.View.SentMsg
	 */
	jsView
		.create('patron.View.SentMsg')
		.methods({

		_first: function ()
		{
			this._skip		= this.active;
			this.isFirst	= !(this.isSentMsg && ('MCompose' in window));
			this.isChange('hash', jsHistory.get());
		},

		_one: function ()
		{
			this.$View		= $( this.idView );
			this.$Loader	= $( this.idLoader );

			this.isChange('GET', String.toQuery(GET));

			if( this.isSentMsg )
			{	// preload compose files
				$R('{patron'+'.build}Compose');
				//$.getCSS(jsLoaderFiles['compose.css'], jsCore.F);
				//$.getCSS(jsLoaderFiles['compose-skin.css'], jsCore.F);
			}
		},

		_load: function (data)
		{
			if( data._key_ && this[data._key_] ) data = this[data._key_];

			var key		= String.toQuery( data );
			var html	= this.preload();

			if( this.ajax )
			{
				this.ajax.abort();
				this.ajax = null;
			}

			if( !this.cache || (this._key !== key) )
			{
				this._key	= key;
				if( html !== undef )
				{
					this._html( html );
				}
				else
				{
					if( this.isFirst ) this.$View.html( '<div class="loadProgress mb10 mt10">' + Lang.get('Loading').messages + '</div>' );
					else if( this.isSentMsg && ('MCompose' in window) ) MCompose.reset();

					this.ajax = patron.Ajax({
						url:		(this.isFirst && this.urlFirst || this.url) +'&jsb=1&first='+ (+this.isFirst),
						data:		data,
						type:		'POST',
						complete:	this._loaded.bind(this)
					});
				}
			}
		},

		_loaded: function (R/*Ajax.Result*/)
		{
			if(this.isActive() )
			{
				if( R.isOK() )
				{
					var D = R.getData();
					if( D )
					{
						var html = D.HTML;
						if( html === undef )
						{
							if( this.isSentMsg && ('MCompose' in window) )
							{
								MCompose.redraw(D);
								patron.uiRadar('sentmsg', 1)('onRedraw', 1)('all', 1)(true);
							}
						}
						else
							this._html(html, this.isFirst);
					}
					else
					{
						jsHistory.set(patron.getPageURL('msglist', { folder: 'inbox' }));
						var View = patron.View.Messages.getActive();
						if( View ) View.statusLine(R);
					}
				}
				else if( R.isError() ){
					this.$View.innerHTML('<p style="margin: 100px 50px;"><b>'+Lang.get('InternalError')+'</b></p>');
				}

				if( this.isSentMsg ){
					$('A[href*="sentmsg"]').each(function (){
						this.href = this.href.replace(/&\d+/, '&'+Date.now());
					});
				}
			}
		},

		_html:	function (html, first)
		{
			if (typeof fixedDocumentWrite == 'function')
				fixedDocumentWrite(document);

			this.$View[!this.append || first ? 'html' : 'append']( this.isSentMsg ? html : document.open(html) );

			if( this.isSentMsg )
			{
				if( 'MCompose' in window ) MCompose.focus();
				patron.uiRadar('sentmsg')('onRedraw', 1)('all', 1)(true);
			}

			this.isFirst	= false;
		},

		_redraw:function (r, a)
		{
			if( this._skip )
			{
				this._skip	= 0;
				return;
			}

			if( this.isSentMsg )
			{
//				this.$View.display(a);
				if( r && a )
				{
					//this.$Loader.display(1);
					this._load(GET);
				}
				else if( !a )
				{
					if( this.ajax )
					{
						this.ajax.abort();
						this.ajax = null;
					}
					//this.$Loader.display(0);
				}
			}
			else
			{
				if( !r )
				{
					this.$View.display(a);
					$('#preload_banner_1').display(a);

					var ar = patron.Messages.get( GET.id_orig ? [GET.id_orig] : jsView.get('folder.messages').select() );
					if( a && ar && ar[0] )
					{
						Array.forEach(ar, function (M)
						{
							if( GET.mode == 'reply' ) M.set('Reply', 1);
							else if( GET.mode == 'forward' ) M.set('Forward', 1);
						});
					}
				}
				else if( a && this.isChange('hash', jsHistory.get()) )
				{
					this._load(GET);
				}
			}
		},

	// @public
		preload:	function (html)
		{
			if( html === undef )
			{
				var h = this._h;
				this._h = undef;
				return	h;
			}
			else
				this._h = html;
		},

		open: function (data)
		{
			var key		= Date.now();
			this[key]	= data;
			jsHistory.set(patron.getPageURL('compose_key', { key: key }));
		},

		clearCache: function (){ this._key = undef; }

	});
	// patron.View.SentMsg;


	jsLoader.loaded('{patron.view}patron.View.SentMsg');
});
