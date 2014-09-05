jsLoader.require(
  ['{jQuery}jquery.tpl', '{labs}jsView', '{utils}jsHistory']
, function () {
	/**
	 * @class patron.View.Paging
	 */
	ajs.createClass('patron.View.Paging', [jsView], {
	// @private
		_one: function () {
			//this.isChange('pages', this.pages());
		},

		_redraw: function (r, a) {
			if( r ) {
				var
					  pages = this.pages()
					, show = pages > 1
					, uniqueKey = patron.SearchData && patron.SearchData.search && patron.SearchData.search.URLQ +'_'+ jsHistory.get()
				;

				if( this.isChange('hash', pages + '_' + this.selected() + '_' + uniqueKey) ) {
					this.getView()
						.display(show)
						[show ? 'tpl' : 'F']( this.idTpl, this._tplData() )
					;
				}
			}
		},

		_tplData: function ()
		{
			var
				  pages		= this.pages()
				, page		= this.selected()
				, from 		= Math.max(page - (pages - page < 3 ? 5 - (pages - page) : 3), 0)
				, to		= Math.min(from + 5, pages)
				, arPages	= []
			;

			for( var p = from + 1; p <= to; p++ ) {
				arPages.push({ Id: p, Selected: page == p });
			}

			return ajs.extend({
				  NoPager:			false
				, sortTop:			true
				, SEARCH:			patron.isSearchPage()
				, FILESEARCH:		patron.isFileSearchPage()
				, PrevPage:			(page > 1) ? page-1 : 0
				, FirstPage:		(pages > 5 && page > 3) ? 1 : 0
				, PrevHellipPage:	(page > 4 && pages > 6)
				, Page:				arPages
				, NextHellipPage:	(pages > 6 && pages - page > 3)
				, LastPage:			(pages > 5 && pages - page > 2) ? pages : 0
				, EndPage:			pages
				, NextPage:			(page < pages) ? page+1: 0
				, Folder:			~~ajs.isset(GET.folder, 0)
				, Sortby:			ajs.Html.escape(ajs.isset(GET.sortby, ''))
				, URLQ:				''
				, Random:			''
			}, this._tplExtData());
		},

		_tplExtData: function (){
			return	{};
		},


	// @public
		pages: function (){
			return 0;
		},

		selected: function (){
			return Math.max(Math.min(~~GET.page, this.pages()), 1);
		},

		next: function (){
			return Math.min(this.selected() + 1, this.pages());
		},

		prev: function (){
			return Math.max(this.selected() - 1, 1);
		}

	});

	jsLoader.loaded('{patron.view}patron.View.Paging');
});
