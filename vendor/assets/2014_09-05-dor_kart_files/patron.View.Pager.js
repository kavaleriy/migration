/**
 * @class	patron.View.Pager
 * @author	RubaXa	<trash@rubaxa.org>
 */

jsLoader.require(['{labs}TemplateService', '{labs}jsView', '{patron}patron.Folders'], function ()
{
	/**
	 * @class patron.Pager
	 */
	jsClass.create('patron.Pager')
		.statics({

		calc: function ()
		{
			var F	= patron.Folders.get();
			if( F !== undef )
			{
				var
					  count		= F.Messages*1
					, perPage	= patron.messagesPerPage * 1
					, pages		= Math.ceil(count / perPage)
					, page		= Math.min((GET.page || 1) * 1, pages)
					, group		= 5
					, f 		= Math.floor((page - 1) / group) * group
					, t 		= Math.min(f + group, pages)
				;

				this.fID		= F.Id;
				this.prePage	= perPage;
				this.page		= page;
				this.pages		= pages;
				this.onPage		= page == pages ? Math.min(count - (page-1) * perPage, perPage) : perPage;
				this.to			= t;
				this.from		= f;
				this.total		= count;
			}
		}
	});

	/**
	 * @class patron.View.Pager
	 */
	jsView
		.create('patron.View.Pager')
		.methods({

		_first: function ()
		{
			patron.Pager.calc();
			this.isChange('hash', [GET.folder, patron.Pager.page, patron.Pager.total]);
		},

		_redraw: function (r, a)
		{
			patron.Pager.calc();

			var
				  page		= patron.Pager.page
				, count		= patron.Pager.total
				, prePage	= patron.Pager.prePage
				, pages		= patron.Pager.pages
				, group		= 5
				, html		= [], i = 0
				, f 		= patron.Pager.from
				, t 		= patron.Pager.to
			;

			if( (a && !r) || (r && a && this.isChange('hash', [jsHistory.get(), page, count])) )
			{
				if( count > prePage )
				{
					if( page > 1 ) html[i++] = '<a class="paging__item paging__item_prev icon icon_paging-horizontal icon_arrow-left" rel="history" href="#url#&page=#prev_page#" title="'+Lang.get('Pager').prev+'"></a>';
					if( pages > 5 && page > 3 ) html[i++] = '<a class="paging__item" rel="history" href="#url#&page=1">1</a>';
					if( page > 4 && pages > 6 ) html[i++] = '<span class="paging__item">&hellip;</span>';

					f	= Math.max(page - (pages - page < 3 ? 5 - (pages - page) : 3), 0);
					t	= Math.min(f + 5, pages);

					for( var p = f, n; p < t; p++ )
					{
						n = p + 1;

						if( page == n ) html[i++] = '<span class="paging__item paging__item_selected">'+ n +'</span>';
						else html[i++] = '<a class="paging__item" rel="history" href="#url#&page='+ n +'">' + n + '</a>';
					}

					if( pages > 6 && pages - page > 3 ) html[i++] = '<span class="paging__item">&hellip;</span>';
					if( pages > 5 && pages - page > 2 ) html[i++] = '<a class="paging__item" rel="history" href="#url#&page='+pages+'">'+pages+'</a>';
					if( page < pages ) html[i++] = '<a class="paging__item paging__item_next icon icon_paging-horizontal icon_arrow-right" rel="history" href="#url#&page=#next_page#" title="'+Lang.get('Pager').next+'"></a>';


					var
					  url = jsHistory.get().split('?')
					, tpl = {
						  folder_id:	GET.folder
						, prev_page:	page - 1
						, next_page:	page + 1
						, prev_group:	f
						, next_group:	t + 1
						, sort_by:		patron.messagesSort
						, url:			url[0] +'?'+ (url[1] || '').replace(/[\?&]*(page)=\d+/ig, '')
					};

					this.getView().display(1).innerHTML( html.join('').replace(/#(\w+)#/ig, function (a, n){ return tpl[n]; }) )
				}
				else
				{
					this.getView().display(0);
				}

				f = (page-1) * prePage + 1;
				t = Math.min(f + prePage - 1, count);

				if( pages < 2 )
				{
					this.$Info
						.display(pages == 1)
						.eq(0).innerHTML( count ? String.num(t, Lang.get('Messages').letter, ' ') : '' ).end()
						.eq(1).innerHTML('')
					;
				}
				else
				{
					var L = Lang.get('Pager');
					this.$Info
						.display(1)
						.eq(0).innerHTML(String.sprintf(L.infoTop, f, t, count)).end()
						.eq(1).innerHTML(String.sprintf(L.infoBottom, f, t, count))
					;
				}
			}
		},

		getView: function ()
		{
			this._init('view', function ()
			{
				this.$View	= $( this.idView );
				this.$Info	= $( this.idInfo );
			});
			return	this.$View;
		}

	});

	jsLoader.loaded('{patron.view}patron.View.Pager');
});
