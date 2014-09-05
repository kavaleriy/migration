jsLoader.require(
  ['{labs}jsView', '{jQuery}jquery.tpl']
, function ()
{
	/**
	 * @class patron.View.PageOfPages
	 */
	ajs.createClass('patron.View.PageOfPages', [jsView],
	{
	// @private
		_redraw: function (r, a)
		{
			if( r )
			{
				var data = this._tplData();
				if( this.isChange('hash', [data.MessageCount, data.FirstMessage]) )
				{
					this.getView().tpl(this.idTpl, data)
				}
			}
		},

		_tplData: function ()
		{
			var total = this.count(), page = Math.max(Math.min(~~GET.page, Math.ceil(total / patron.messagesPerPage)), 1);
			return {
				  MessageCount:		total
				, FirstMessage:		(page-1)*patron.messagesPerPage + 1
				, LastMessage:		Math.min(page * patron.messagesPerPage, total)
				, messagesPerPage:	patron.messagesPerPage
				, sortTop:			this.isTop
			};
		},

		count: function ()
		{
			return	0;
		}

	});

	jsLoader.loaded('{patron.view}patron.View.PageOfPages');
});
