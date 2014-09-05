jsLoader.require(
  ['{jQuery}jquery.tpl', '{labs}jsView', '{utils}jsHistory']
, function ()
{
	/**
	 * @class patron.View.LeftMenu
	 */
	ajs.createClass('patron.View.LeftMenu', [jsView],
	{
	// @private
		_one: function ()
		{
			this.isChange('id', this.selectedId());
			this.isChange('hash', this.getHash());
		},

		_redraw: function (r, a)
		{
			if( r )
			{
//				if( this.isChange('hash', this.getHash()) )
				{
					this.getView().tpl( this.idTpl, this._tplData() );
				}
			}

			this._select(a && this.selectedId());
		},

		_select: function (id)
		{
			if( this.isChange('id', id) )
			{
				var c	= this.cnSelected;
				this.getView('.'+c).removeClass(c);
				if( id ) $(this.prefixId + id).addClass(c);
			}
		},

		_tplData: function ()
		{
			return	{ items: this.getItems(), selectedId: this.selectedId() };
		},

	// @public
		getHash: function ()
		{
			return	jsHistory.get();
		},

		getItems: function ()
		{
			return	[];
		},

		selectedId: function ()
		{
			return	-1;
		}

	});

	jsLoader.loaded('{patron.view}patron.View.LeftMenu');
});
