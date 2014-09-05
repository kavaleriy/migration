jsLoader.require([
	'{patron.utils}patron.Utils',
	'{patron.v2.layer}patron.layer.Player'
], function () {
	(function () {
		/**
		 * @class    patron.Utils.Fishing
		 */
		var Utils = {
			initNode: function (node) {
				Utils.getNodeInfo(node);
			},

			removeRedirectorFromText: function (text) {
				var el = $('<div/>').innerHTML(text).each(function (x, node) {
					var links = node.getElementsByTagName('a'), i = links.length;
					while (i--) {
						this.initNode(links[i]);
					}
				}.bind(this));

				return    el[0].innerHTML;
			},

			getNodeInfo: function (node) {
				var url = (node['__originUrl' + patron.CurrentTimestamp] || node.href || node.action) + '',
					info = String.toObject(url),
					childs = node.childNodes,
					html = node.innerHTML
					;

				try {
					/** @namespace info.js */
					if (!info.js) {
						url = url.replace(/^([^#]+)/, '$1&js=1');
					}
					if (!info.token) {
						url = url.replace(/^([^#]+)/, '$1&token=' + window['mailru_api_token']);
					}

					if (location.protocol == 'https:' && /^http/i.test(info.url) || $.browser.msie) {
						info.redir = 1;
					}

					info.real = url;
					info.attr = node.href ? 'href' : 'action';

					if (info.check && info.url) {
						$(node)
							.attr({ target: '_blank', onclick: null })
							.attr(info.attr, $.nodeName(node, 'a') ? info.url : url)
						;
						node['__originUrl' + patron.CurrentTimestamp] = info.real;
						if ($.browser.msie && $.nodeName(node, 'a') && childs.length == 1 && childs[0].nodeType == 3) {
							// IEFix: restore link innerHTML
							node.innerHTML = html;
						}
					}
					else {
						info.url = url;
					}
				}
				catch (er) {
					// https://jira.mail.ru/browse/MAIL-10639
					var log = url + '.' + (node && node.tagName || 'NULL');
					patron.saveError('js', 'FISHING.ERROR.' + log + '.' + er.toString());
				}

				return  info;
			},


			checkEvent: function (evt) {
				var type = evt.type, node = evt.currentTarget, info = Utils.getNodeInfo(node), url = info.url;

				if (type == 'mousedown') {
					if (ajs.Mouse.isRight(evt)) {
						Counter.sb(1822110);
						/** @namespace patron.FishingCheckOnRightClickDisabled  -- head__js, https://jira.mail.ru/browse/MAIL-18062#comment-833331 */
						if (patron.FishingCheckOnRightClickDisabled) {
							// Skip check
							return;
						}
					} else {
						Counter.sb(1827622);
					}


					if (info.check && $.nodeName(node, 'a')) {
						// Revert original url
						var href = node.href, childs = node.childNodes, html = node.innerHTML;

						if ($.browser.msie && childs.length == 1 && childs[0].nodeType == 3) {
							// IEFix: restore link innerHTML on mousedown
							node.href = info.real;
							node.innerHTML = html;
							setTimeout(function () {
								node.href = href;
								node.innerHTML = html;
							}, 300);
						}
						else {
							node.href = info.real;
							setTimeout(function () {
								node.href = href;
							}, 300);
						}
					}
				}
				else if (url) {
					var caught = $(document).triggerHandler('ui-abstract-action:fishing:process', url) == true;

					if (caught) {
						evt.preventDefault();
						return;
					}

					if (~url.indexOf('#') && node.hostname == location.hostname) {
						// @todo: Local anchors
						url = url.replace(/^[^#]*#/, '');
						try {
							url = decodeURIComponent(url)
						} catch (e) {
							url = unescape(url);
						}
						Utils.scrollTo('a[name="' + url + '"]', -30);
						jsHistory.build({ _: this.__anchor = url });
						evt.preventDefault();
					} else if (info.check) {
						var res;

						if (~url.indexOf('&') && !~url.indexOf('?') && (url.indexOf('&') < url.indexOf('#'))) {
							url = url.replace('&', '?');
						}

						node[info.attr] = url;

						$.ajax({
							url: '/cgi-bin/link', data: {
								ajaxmode: 1,
								url: url,
								token: window['mailru_api_token']
							}, async: false, dataType: 'json', success: function (data) {
								if (data && $.isPlainObject(data[2])) res = data[2];
							}
						});

						if (res) {
							/** @namespace res.WOT */
							/** @namespace res.noWarnUrl */
							/** @namespace res.isSuspect */
							var
								isSuspect = res.isSuspect | 0
								, WOT = res.WOT | 0
								, noWarnUrl = res.noWarnUrl | 0
								, noForeignConfirm = (res.noForeignConfirm | 0) || Utils.noForeignConfirm
								, go = true
								;

							if (!noWarnUrl) {
								if (isSuspect || !noForeignConfirm) {
									var layerType = (isSuspect ? 'fishing' : 'outer') + (node.action ? '_form' : '_site');

									go = false;

									if (WOT) {
										layerType = 'wotfishing_site';
										(new Image).src = '//rs.' + patron.SingleDomainName + '/d484803.gif?now=' + ajs.now();
									} else {
										(new Image).src = '//rs.' + patron.SingleDomainName + '/d' + (isSuspect ? 351250 : (noForeignConfirm ? 352105 : 351249)) + '.gif?now=' + ajs.now();
									}

									/** @namespace patron.Layers */
									var SuspectLayer = patron.Layers.get(layerType, function (ok) {
										if (ok) {
											(new Image).src = '//rs.' + patron.SingleDomainName + '/sb' + (isSuspect ? '351250' : '351249') + '.gif?now=' + Date.now();

											if (!isSuspect) {
												var $checkbox = SuspectLayer.$Box.find('input[name="NoForeignConfirm"]');
												Utils.noForeignConfirm = $checkbox.is(':checked') + 0;
												if (Utils.noForeignConfirm) {
													$.get('link?ajaxmode=1&set=1&NoForeignConfirm=1');
												}
											}

											Utils.go(node);
										}
										else if (WOT) {
											(new Image).src = '//rs.' + patron.SingleDomainName + '/d484814.gif?now=' + ajs.now();
										}
									}.bind(this), function () {
										this.$Txt.click(function () {
											SuspectLayer.hide();
										})
									});

									SuspectLayer.text(url);
									SuspectLayer.$Txt.attr('href', url);
									SuspectLayer.$Type.find('.fishing-link').attr('href', url);

									if (url.match(/https?:\/\/([^\/]+)/)) {
										SuspectLayer.$Type.find('.js-wotlink').attr('href', 'http://wot.mail.ru/?hosts=' + RegExp.$1);
									}

									SuspectLayer.show();
									SuspectLayer.$Type.find('.confirm-ok').focus();
								}
							}

							if (go) Utils.go(node);
							evt.preventDefault();
						}
					} // info.check
				}
			},


			go: function (node) {
				try {
					var info = Utils.getNodeInfo(node), url = info[info.redir ? 'real' : 'url'];

					if (info.redir) {
						url += '&redir=1';
					}

					if ($.nodeName(node, 'form')) {
						ajs.log('go.submit:', url, info);
						// Yes, babe! If in "form" exists input[name="submit"], impossible call "submit" method!
						document.createElement('form').submit.call(node);
					}
					else {
						ajs.log('go.newWin:', url, info);
						var win = window.open(url);
						if (win) {
							win.opener = null;
						} else {
							patron.radar('popup_blocked', $.browser.label + '=1');
						}
					}
				}
				catch (e) {
				}
			},


			scrollTo: function (el, offset) {
				if (typeof el === 'string') {
					el = $.find(el);
				}
				var top = $(el).offset();
				if (top && (top = top.top + offset)) {
					$ScrollElement.animate({ scrollTop: top }, 'slow', 'easeOutExpo');
				}
			}
		};


		// @export
		patron.Utils.Fishing = Utils;
	})();

	jsLoader.loaded('{patron.utils}patron.Utils.Fishing');
});
