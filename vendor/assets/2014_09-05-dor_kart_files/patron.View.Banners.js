/**
 * @class patron.View.Banners
 */

jsLoader.require([
	  '{patron}patron.Ad'
], function (){
	var _rRBOptions = /<!--RB:(.+?)-->/;

	jsClass
		.create('patron.View.Banners')
		.methods({

		__construct: function (){
			this._cntTS		    = 0;
			this._bannerTS      = 0;
			this._bnrsPrevTS    = ajs.now();

			this._reloadedTryCatch = function (){
				try {
					this._reloaded.apply(this, arguments);
				} catch( err ){
					patron.saveError('js6', ['MAILRU.VIEW.BANNERS', encodeURIComponent(err.toString())]);
				}
			}.bind(this);


			this._autoReload    = function (){
				if( patron.AutoReloadBanners ){
					clearInterval(this._autopid);
					this._autopid = setInterval(this._reloadBanners, 3*60*1000);
				}
			}.bind(this);
			this._reloadBanners = function (){ if( !ajs.blurred ) this.reload({ cnt: 'N' }); }.bind(this);

			this._autoReload();
		},

		left:	jsCore.F,
		redraw: jsCore.F,

		reload: function (opts) {
			if (typeof fixedDocumentWrite == 'function')
				fixedDocumentWrite(document);

			var path = jsHistory.get().split('?')[0];
			if( this._path != path ){
				this._path  = path;
				this._cntTS = this._bannerTS = 0;
			}

			var ts = ajs.now(), data = ajs.extend({
				  ref:		patron.getPageLabel()
				, cnt:		(ts - this._cntTS > 1000 ? 'Y' : 'N')
				, bnrs:		(!this._bannersReq && (ts - this._bannerTS > 3000) ? 'Y' : 'N')
				, nav:		patron.RB_NAV_BANNER ? 'Y' : 'N'
				, start:	patron.LogoToMsglist ? 'N' : 'Y'
				, newsnippets: ~~patron.newsnippets
				, composelabels:  ~~patron.ComposeLabels
				, IsMyCom:     ~~patron.IsMyCom
				, IMAPBanner:  ~~patron.IMAPBanner
			}, opts);

			if( patron.isReadMsg ){
				// Get FromDomain, for left banner
				var M = patron.Messages.get( GET.id );
				if( M && M.From ) data.from = M.From.split('@')[1];
			}
			else if( !patron.UseSendAPIV1 && patron.isSendMsgOk && (patron.Folders.COUNT >= 9) ){
				// Left banner
				data.bnrs	= 'N';
			}

			if( patron.IS_PREVIEW ){
				data.preview = patron.IS_PREVIEW;
			}

			if( (data.cnt == 'Y' && !this._cntReq) || (data.bnrs == 'Y' && !this._bannersReq) ){
				if( data.cnt == 'Y' ){
					this._cntTS = ts;
					this._cntReq = true;
				}

				if( data.bnrs == 'Y' ){
					this._bannerTS = ts;
					this._bannersReq = true;
				}

				$('#rb-context-left-slots').display( (patron.isMsgListPage() || patron.isReadMsgPage() || patron.isThreadPage() || patron.isComposePage() || patron.isSearchPage() || patron.isFileSearchPage()) && patron.RB_LEFT_BANNER );
				$('#SendMsgOkLeftSlot').display( patron.isSendMsgOk );


				var showSlotContainer2 = (patron.isMsgListPage() || patron.isReadMsgPage() || patron.isThreadPage() || patron.isSearchPage() || patron.isFileSearchPage()) && patron.RB_LEFT_BANNER;
				$('#slot-container_2').add('#b-slot_left_banner').display( showSlotContainer2 );
				$('#slot-container_2_separator').display( !showSlotContainer2 );

				_getXhrRBSlots(data).done(this._reloadedTryCatch);
			}
			else {
				$('#AdLeftInformer, #b-slot_left_banner').display(false);
				if( this.__sendMsgOk !== patron.isSendMsgOk ){
					$(patron.isSendMsgOk ? '#SendMsgOkLeftSlot' : '#slot-container_2').empty();
				}
			}

			this.__sendMsgOk = patron.isSendMsgOk;
		},

		_reloaded: function (R){

			if( R && R.status == 'OK' ){
				var D = R.data, info = [];

				if( D.cnt == 'Y' ){
					this._cntReq = false;
				}

				if( D.bnrs == 'Y' ){
					this._bannersReq = false;
					this._bnrsPrevTS = ajs.now();

					if( D.left ){
						var
							RB = ajs.toObject(D.left.match(_rRBOptions) && RegExp.$1 || ''),
							$Left = $(patron.isSendMsgOk ? '#SendMsgOkLeftSlot' : '#slot-container_2'),
							LeftDirect  = patron.Ad.find(function (Ad){ return Ad.getId() == 'direct-left' })[0]
						;

						if( LeftDirect && LeftDirect.ads[0] ){
							// https://jira.mail.ru/browse/MAIL-5155
							LeftDirect.ads[0].limit = (
								   RB.DIRECT_LEFT_COUNT
								|| (RB.noncommercial ? 6 : patron.DIRECT_LEFT_COUNT || 3)
							);
						}


						/** @namespace RB.noncommercial */
						if( RB.noncommercial != 1 ){
							info.push('left banner');
							$Left.html( D.left );
						} else {
							info.push('left banner -- is non commercial');
							$Left.empty();
							$('#_trash_').html( D.left ); // MAIL-24693
						}

						$('#slot-container_2_separator').display(!!RB.noncommercial);

						info.push(Math.round((ajs.now()-this._bnrsPrevTS)/1000)+'s');
					}

					if (D.line) {
						if (patron.UseSendAPIV1 && patron.isSendMsgOkPage()) {
							$('#message-sent__rb-main-container').html( D.line );
						} else {
							var lineName = D.ref + '-topline';
							info.push(lineName + ' banner');
							patron.Ad.push({
								id: lineName,
								placeId: 'RBLine',
								type: 'rbline',
								ads: [{html: D.line}]
							});
						}
					}

					if (D.leftDirect) {
						var leftDirect = D.ref + '-leftDirect';
						info.push(leftDirect + ' banner');
						patron.Ad.push({
							id: leftDirect,
							placeId: 'rb-target-left-slot',
							type: 'rbLeftDirect',
							ads: [{html: D.leftDirect}]
						});
					}

					if (D.center) {
						$('#message-sent__rb-center-container').html( D.center );
					}
				}

				if( D.nav ){
					info.push('nav');

					if (patron.flatheader) {
						window.__PM.getItems(function (items) {
							__PM.batchActions(function () {
								items.toolbar.itemsByName['bannerAndSearch'].itemsByName['banner'].reload(D.nav);
							});
						});
					} else {
						$('#portal__banner').html( document.parseWrite(D.nav) );
					}
				}

				if( $.trim(D.leftInformer) ){
					info.push('leftInformer');
					$('#AdLeftInformer').html( document.parseWrite(D.leftInformer) ).show();
				}
				else {
					$('#AdLeftInformer').empty().hide();
				}

				if( $.isArray(D.counters) ){
					info.push('counters');
					$('#_counters_').html( document.parseWrite(D.counters.join('')) );
				}

				var themeConfig = patron.Themes.getThemeConfig(patron.currentTheme), widget;
				if (themeConfig) {
					widget = themeConfig.widget;
				}
				if (widget) {
					if (D.themeWidget) {
						try {
							widget.data = (new Function("return " + D.themeWidget))();
						} catch (e) {}
						if (widget.observer && widget.data) {
							widget.observer.redraw(widget.data).show();
						}
					}
				}


				$(window).triggerHandler('refresh.ad');

				if( info.length ){
					debug.log('INFO: ' + info.join(' & ') + ' -- reloaded');
				}
			}
			else {
				this._cntReq = false;
				this._bannersReq = false;
			}

			this._autoReload();
		}

	});


	// @todo: Переместить в отдельный файл
	var rbSlots = {
		sz: { // SiteZone
			  msglist: 10
			, messages: 10
			, readmsg: 11
			, thread: 11
			, message: 11
			, sentmsg: 12
			, compose: 12
			, sendmsgok: 13
			, addressbook: 21
		},
		line: {
			_get: function (p, r){
				var slot;
				if (!patron.IsMyCom) {
					if (p.bnrs != 'N') {
						if (patron.UseSendAPIV1 && patron.isSendMsgOkPage()) {
							slot = 1991;
						} else {
							slot = 3003;
						}
					}
				}
				return slot;
			}
		},
		left: {
			def: patron.IsMyCom ? 1490 : 2902,
			sentmsg: 0,
			compose: 0,
			sendmsgok: 0,
			_get: function (p, r){
				return p.bnrs != 'N' && patron.Ad.urls[p.ref+'-topline'] && (this[p.ref] || this.def);
			}
		},
		leftDirect: {
			_get: function (p, r){
				return !patron.IsMyCom && p.bnrs != 'N' && 3600;
			}
		},
		counters: {
			_get: function (p, r){
				return p.cnt != 'N' && [2200, 2243];
			}
		},
		nav: {
			_get: function (p, r){
				return (p.bnrs != 'N') && (p.nav != 'N') && 2430;
			}
		},
		leftInformer: {
			_get: function (p, r){
				if( /sentmsg|compose/.test(p.ref) && p.composelabels ){
					r.sz = 24;
				}
				return p.bnrs != 'N' && 1236;
			}
		},
		center: {
			_get: function (p, r){
				return !patron.IsMyCom && patron.UseSendAPIV1 && p.bnrs != 'N' && 1009;
			}
		},
		themeWidget: {
			_get: function (p, r) {
				var slot;
				if (p.bnrs != 'N') {
					var themeConfig = patron.Themes.getThemeConfig(patron.currentTheme), widget;
					if (themeConfig) {
						widget = themeConfig.widget;
					}
					if (widget) {
						slot = widget.slot;
					}
				}
				return slot;
			}
		}
	};


	function _getXhrRBSlots(params){
		var q = [], df = new $.Deferred, data = { 'q[]': q }, radarStats = {};

		ajs.each(rbSlots, function (slot, name){
			if( slot._get ){
				var req = {/*params*/}, id = slot._get(params, req);
				if( id ){
					req.n = name;
					req = ajs.toQuery(req);
					radarStats[name] = 1;

					ajs.each([].concat(id), function (id){
						q.push(req.length ? id+'?'+req : id);
						radarStats[id] = 1;
					});
				}
			}
		});

		data.sz = rbSlots.sz[params.ref];

		/** @namespace patron.EXPERIMENTID */
		if( patron.EXPERIMENTID ){
			data.test_id = patron.EXPERIMENTID;
		}

		/** @namespace patron.SITEID */
		if( patron.SITEID ){
			data._SITEID = patron.SITEID;
		}

		if (patron.AdURL) {
			$.getJSON(patron.AdURL + "/adq/?callback=?", data).done(function (slots/**Array*/){
				var res = {};
				ajs.each(slots, function (slot){
					res[slot.name] = res[slot.name] ? [].concat(res[slot.name], slot.html) : slot.html;
				});

				res.ref = params.ref;
				res.cnt = params.cnt;
				res.bnrs = params.bnrs;

				df.resolve({ status: 'OK', data: res });
			}).fail(df.reject);
		} else {
			df.resolve({ status: 'OK', data: {} });
		}

		return	df;
	}

	jsLoader.loaded('{patron.view}patron.View.Banners');
});
