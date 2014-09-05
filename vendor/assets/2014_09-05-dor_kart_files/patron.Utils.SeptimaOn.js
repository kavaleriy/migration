jsLoader.require(['{toolkit.common}store/store', '{patron.utils}patron.Utils', '{utils}Counter', '{patron}patron.Balloon'], function (){
	/** @namespace patron.HelperIndex */
	/** @namespace patron.HelperIndex.patron_v2 -- septima switcher */

	(function (){
		var _letterCtrl = {
			'upd-btn-v1': {
				  id: '#letter-septima-on_upd, #letter-septima-on-btm_upd' // id кнопок, которыми можно включить
				, blockId: '#letter-septima-on_upd, #letter-septima-on-btm_upd, #letter-septima-on_title' // блоки, которые нужно отобразить (по умолчанию они скрыты)
				, counter: 1669425
			},
			'upd-btn-v2': {
				  id: '#letter-septima-on_upd7, #letter-septima-on-btm_upd7'
				, blockId: '#letter-septima-on_upd7, #letter-septima-on_upd7, #letter-septima-on_title'
				, counter: 1669434
			},
			'feedback-btn': {
				  id: '#letter-septima-on_rev, #letter-septima-on-btm_rev'
				, blockId: '#letter-septima-on_rev, #letter-septima-on-btm_rev, #letter-septima-on_title-upd'
				, counter: 1669435
			},
			'browser-not-supported': {
				  id: '#letter-septima-on_browser, #letter-septima-on-btm_browser'
				, blockId: '#letter-septima-on_browser, #letter-septima-on-btm_browser, #letter-septima-on_title-browser'
				, counter: 1669438
			}
		};


		/**
		 * @class  patron.Utils.SeptimaOn
		 */
		patron.Utils.SeptimaOn = {
			enable: function (fn) {

				fn = fn || $.noop;

				store.set('septima.on.ts', ajs.now());

				(new Image).src = '//rs.' + patron.SingleDomainName + '/sb1690155.gif?' + Math.random();

				var deferred_status = $.Deferred(), deferred_ts = $.Deferred();

				$.when(deferred_status, deferred_ts).done(function () {
					fn();
				});

				patron.Balloon.updateStatus(patron.HelperIndex.patron_v2, function () {
					deferred_status.resolve();
				});

				patron.Balloon.makeAsShowed(patron.HelperIndex.patron_v2, function () {
					deferred_ts.resolve();
				});
			},

			disable: function (fn){
				(new Image).src = '//rs.'+ patron.SingleDomainName +'/sb1690157.gif?'+ Math.random();
				patron.Balloon.unsetIndex(patron.HelperIndex.patron_v2, fn);
			},

			complete: function (){
				store.remove('septima.on.ts');
			},

			isEnabledNow: function (){
				return	patron.v2 && (new Date - store.get('septima.on.ts') < 60 * 1000);
			},

//			isSupportBrowser: function (){
//				var browserVersion = parseInt($.browser.version, 10);
//				return (
//					   $.browser.webkit
//					|| $.browser.mozilla
//					|| ($.browser.opera && browserVersion > 12)
//					|| ($.browser.msie && browserVersion > 8)
//				);
//			},

			canLayerShow: function (){
				return	patron.EnableMAILRUV2Switcher && (
					   !patron.v2
					|| patron.Utils.SeptimaOn.isEnabledNow()
				);
			},

			checkLetter: function (model/**patron.Message*/, $letterEl/**jQuery*/){
				// тут нужно условие, что это то самое письмо
				if( /corp\.mail\.ru/.test(model.FromFull || model.FromList || model.From) && / id="?septima-on/i.test(model.getBody()) ){
					// Init controls
					ajs.each(_letterCtrl, function (el){
						var $el = $(el.id).hide();

						$(el.blockId).hide();

						el.show = function (){
							if( el.counter ){
								Counter.d( el.counter );

								$el.click(function (){
									Counter.sb( el.counter );
								});
							}

							$(el.blockId)
								.add($el)
								.show()
								.find('img')
									.removeAttr('width')
									.removeAttr('height')
							;

							return	$el;
						};

						el.exists = function (){ return !!$el[0]; };
					});


					// Странная логика, но так нужно.
					_letterCtrl['upd-btn'] = _letterCtrl['upd-btn-v1'].exists()
						? _letterCtrl['upd-btn-v1']
						: _letterCtrl['upd-btn-v2']
					;

					if( patron.EnableMAILRUV2Switcher ){
						if( patron.v2 ){
							_letterCtrl['feedback-btn'].show();
						}
						else {
							_letterCtrl['upd-btn'].show().click(function (){
								patron.Utils.SeptimaOn.enable(function (){
									location.href = jsHistory.buildUrl({ septima: 'on' });
								});
								return	false;
							});
						}
					}
					else {
						_letterCtrl['browser-not-supported'].show();
					}


					if (!patron.EnableMAILRUV2Switcher) {
						patron.gstat([
							  'BAD_SWITCHER'
							, patron.v2 ? 1 : 0
							, patron.useremail
							, patron.realIP || '0.0.0.0'
						].join('-'), 'ua=1');
					}
				}
			}
		};
	})();

	jsLoader.loaded('{patron.utils}patron.Utils.SeptimaOn');
});
