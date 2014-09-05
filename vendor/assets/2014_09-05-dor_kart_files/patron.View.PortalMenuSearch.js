jsLoader.require(['{jQuery}jquery', '{labs}jsView'], function (){
	/**
	 * @class		patron.View.PortalMenuSearch
	 * @namespace	patron.FileSearchWithThumbnail
	 */
	jsView
		.create('patron.View.PortalMenuSearch')
		.methods({
			_onReady: function (){
				if (window.__PM && __PM.whenLoaded) {
					__PM.whenLoaded(this._initialize.bind(this));
				} else if (window.__PH && __PH.whenLoaded) {
					__PH.whenLoaded(this._initialize.bind(this));
				} else {
					this._initialize();
				}
			},

			_initialize: function () {
				this.$form = $('.js-form', '#portal-menu__search').submit(function (evt){
					if( !patron.isSearchNoResultPage() ){
						var $form = $(this), $inp = $('.js-input', this), params = $form.toObject();
						if( $.trim($inp.val()) != '' || $inp.attr("data-allow-empty-value") ){
							if( patron.isMRIMPage() ){
								// ничего не делаем
								// https://jira.mail.ru/browse/MAIL-16085
							}
							else if (patron.isFileSearchPage()) {
								$.extend(params, {
									folder_id: 0,
									content_type_id: -1
								});

								if (defined(GET.folder_id)) {
									params.folder_id = encodeURIComponent(GET.folder_id);
								}

								if (defined(GET.content_type_id)) {
									params.content_type_id = encodeURIComponent(GET.content_type_id);
								}

								if (GET.only_hidden) {
									params.only_hidden = encodeURIComponent(GET.only_hidden);
								}

								jsHistory.set('filesearch?' + ajs.toQuery(params));
								Counter.sb(716199);
							} else {
								params.from_search = patron.isSearchPage() ? 1 : 0;// MAIL-13870

								jsHistory.set(patron.getPageURL('search') +'?'+ ajs.toQuery(params));

								patron.Messages.loadSearch(GET);
							}
							if (patron.Banners) {
								patron.Banners.View.reload();
							}
							$inp.blur();
						}
						evt.preventDefault();
					}
				});
			},

			_redraw: function () {
				if( $.isReady ){
					var text;

					switch(true) {
						case patron.isAddressbookPage():
							text = Lang.get('search.onaddressbook');
							break;

						case patron.isFileSearchPage():
							text = Lang.get('search.onfiles');
							break;

						case patron.isMRIMPage():
							text = Lang.get('search.onagent');
							break;

						default:
							text = Lang.get('search.onmail');
							break;
					}

					$('.js-labelText', this.$form).text(text);
				}
			}
		})
	;


	jsLoader.loaded('{patron.view}patron.View.PortalMenuSearch');
});
