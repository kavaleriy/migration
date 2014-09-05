jsLoader.require([
	  '{utils}jsHistory'
	, '{patron.view}patron.View.Paging'
	, '{patron.view}patron.View.PageOfPages'
]
, function ()
{
	/**
	 * @class patron.View.LettersList
	 */
	ajs.createClass('patron.View.LettersList', [jsView],
	{
	// @private
		_one: function ()
		{
			this.$H1	= this.getView('.js-h1');

			this.isChange('title', this.getTitle());

			//
			//  DISABLED
			/*

			// Page of pages (top & bottom)
			var pop	= this.pageOfPages;
			if( pop ){
				if( pop.top ){
					this.addSubView(new patron.View.PageOfPages(pop.top));
				}

				if( pop.bottom ){
					this.addSubView(new patron.View.PageOfPages(pop.bottom));
				}
			}

			// Paging (top & bottom)
			if( this.paging ){
				this.addSubView(new patron.View.Paging(this.paging));
			}

			// Toolbar
			if( this.toolbar ){
				this.addSubView(new patron.View.LettersToolbar(this.toolbar));
			}

			/**/
		},

		_redraw: function (r, a)
		{
			if( r )
			{
				var title = this.getTitle();
				if( this.isChange('title', title) )
				{
					this.$H1.innerHTML(title);
				}
			}
		},

	// @public
		getTitle: function ()
		{
		}

	});
	// patron.View.LettersList;


	/**
	 * @class patron.View.MsgList
	 */
	ajs.createClass('patron.View.MsgList', [patron.View.LettersList],
	{
		_one: function (){
			// Paging
			if( this.paging ){
				this.paging.pages = function (){ return Math.ceil(this.getCountMessages() / this.getMessagesPerPage()); }.bind(this);
			}

			// Page of pages
			var pop	= this.pageOfPages;
			if( pop ){
				if( pop.top ){
					pop.top.count = this.getCountMessages.bind(this);
				}

				if( pop.bottom ){
					pop.bottom.count = this.getCountMessages.bind(this);
				}
			}

			this.inherit(patron.View.LettersList, '_one', arguments);
		},

	// @public
		getFolder: function (){
			return	patron.Folders.getSafe();
		},

		getCountMessages: function (){
			return	this.getFolder().Messages;
		},

		getMessagesPerPage: function (){
			return	patron.messagesPerPage;
		},

		getTitle: function (){
			return	this.getFolder().Name;
		}
	});


	jsLoader.loaded('{patron.view}patron.View.LettersList');
});
