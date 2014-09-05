jsLoader.require([
	'{patron.ui}patron.ui.Suggest',
	'{patron.utils}patron.Utils.Addressbook',
	'{patron.utils}patron.Utils.Search'
], function (){
	(function($) {
		var RE_EMAIL = /([\w.а-яё\-+]+)@([\w.а-яё\-]+)\.[\wа-яё]+/
			, RE_NAME_AND_EMAIL_IN_LTGT = new RegExp("[\"']?(.*?)[\"']?\\s+(?:<|&lt;)(" + RE_EMAIL.source + ")(?:>|&gt;)")
			, RE_LAST_WORDS =  /^.*,\s*/
			, RE_SEPARATOR = /,\s*/g
			, RE_COMMA_ON_END = /,\s*$/
			, RE_COMMA_ON_START = /^\s*,/
			/** @const */
			, INPUT_EVENT_NAME = "oninput" in document ? "input" : "keyup"
		;

		var namespace = 'addressbookSuggest' + $.expando;

		var stat = {
			startSearchTS: 0,
			startSelectionTS: 0,

			waitSelection: null,
			waitFail: null,

			requestValue: '',
			suggestValue: '',

			sourceSize: 0,
			suggestsList: [],

			log: function(val, idx){
				if(this.startSearchTS){
					clearTimeout(this.waitSelection);
					clearTimeout(this.waitFail);

					patron.Utils.suggestLog('email', {
						  start_ts: this.startSearchTS
						, sel_ts:   this.startSelectionTS
						, val:      this.requestValue
						, sel:      val
						, data:     this.suggestsList || []
						, idx:      idx
						, abjs:     this.sourceSize
					});

					delete this.requestValue;
					delete this.startSearchTS;
					delete this.startSelectionTS;
					delete this.suggestsList;
				}
			},

			autoLog: function(type, timeout) {
				this[type] = setTimeout(function() {
					this.log('')

				}.bind(this), timeout);
			}
		};

		function _getOpts(params) {
			var opts = {
				  width: "auto"//not a css 'auto'!
				, searchLast: true
				, findLastWord: RE_LAST_WORDS
				, autosubmit: false
				, showInternet: false
				, internalSource: true
				, minLength: 1
				, timeout: 0
				, multiSuggests: true
				, suggestEscapeStart: '"'
				, suggestEscapeEnd: '"'
				, suggestSeparator: RE_SEPARATOR
				, selectByTab: true
				, cnSuggest:  'addressbook__suggest__block'
				, cnList:     'addressbook__suggest__list'
				, cnItem:     'addressbook__suggest__item'
				, cnSelected: 'addressbook__suggest__item_selected'
				, cnItemTick: 'addressbook__suggest__item__tick'
				, cnInput:    'addressbook__suggest__input'
				, useCache: false
				, fetching: true
				, limit: 0
				, undeterminedStage: false
				, ignoreUsedData: true
				, onlyEmailAfterSelect: false
				, deleteLastComma: false

				, template: function (val, item, index, data, originalVal){
					var nameAndEmail_parts = item.match(RE_NAME_AND_EMAIL_IN_LTGT)
						, tick = patron.Utils.Search.highlightReplace(originalVal, '<b class="addressbook__suggest__item__tick">', '</b>')
						, avatar
						, name
						, email
					;

					if( nameAndEmail_parts ) {
						name = nameAndEmail_parts[1];
						email = nameAndEmail_parts[2];
						avatar = patron.Utils.getAvatarSrc(email, name, 32, null);
					}
					else {
						name = item;
						email = "";
						avatar = patron.Utils.getAvatarSrc(item, "", 32, null);
					}

					return "<div data-suggest='" +  ajs.$.quote( ajs.Html.escape(item) ) + "' class='addressbook__suggest__item' data-suggest-idx=''>" +
						(
							tick(name) + ' ' +
								'<span class="addressbook__suggest__item__hint">' +
									( email ? tick(email) : "&nbsp;" ) +
								'</span>'
						) +
						(avatar ? '<img alt="" class="addressbook__suggest__item__image" src="' + avatar + '" />' : '') +
					'</div>'
				}
				, onselect: function(e) {
					var opts = this["opts"]
						, selectedValue
					;

					if( opts && opts["onlyEmailAfterSelect"] ) {
						selectedValue = e["newSuggest"];
						if( selectedValue = selectedValue.match(RE_NAME_AND_EMAIL_IN_LTGT) ) {
							if( selectedValue[2] ) {
								e["newSuggest"] = selectedValue[2];
							}

						}
					}
				}

			};

			if( Object.isPlainObject(params) ) {
				opts = Object.extend(opts, params);
			}

			if( patron.isAncientBrowser() ) {
				opts.limit = 100;
				delete opts.fetching;
			}

			// позиционирование блока с саджестами
			opts.margin = patron.IsNewComposeDesign ? 7 : 3;

			return opts;
		}

		var isLoading = false;



		function _suggestToEmail(str) {
			var  nameAndEmail_parts = str.match(RE_NAME_AND_EMAIL_IN_LTGT);
			return nameAndEmail_parts ? nameAndEmail_parts[2] : str;
		}
		function _getSuggestWords_after(suggestWords) {
			return Array.filter(
				Array.map(suggestWords, function(str) {
					return _suggestToEmail(str);
				})
				, function(str) {
					return $.trim(str).length > 0;
				}
			);
		}

		$.fn.addressbookSuggest = function(param) {
			if(param === 'widget') {
				return this.data(namespace);

			} else {
				return this.each(function() {
					var addressbookData;
					var _addressbookLastChange;
					var $input = $(this);

					var opts = _getOpts(param);

					var suggest = new patron.ui.Suggest($input, [], Object.extend(opts, {
						cnInput: $input[0], // корректная ссылка на текущий элемент
						afterSelect: function(value, idx, leftPart, rightPart) {
							if( opts.multiSuggests ) {
								stat.log(value, idx);

								if( !rightPart
									|| !RE_COMMA_ON_START.test(rightPart)
								) {
									return value + ", ";
								}
							}
							return value;
						},
						afterGetSuggestWords: _getSuggestWords_after,
						ignoreUserData: true,

						afterGetData: function(triggerEvent) {
							var data = triggerEvent["data"];

							if( !data || data.length === 0 )return;

							// заполнение статистики перед выдачей саджестов
							stat.requestValue = triggerEvent["findValue"];
							stat.suggestsList = data;
							stat.sourceSize = addressbookData ? addressbookData.all().length : 0;

							clearTimeout(stat.waitSelection);
							clearTimeout(stat.waitFail);

							if( data.length == 0 ) {
								// пишем в лог fail, если ничего не нашли в течении 0,5s
								stat.autoLog('waitFail', 500);

							} else {
								stat.startSelectionTS = ajs.now();

								// пишем в лог, если пользователь ничего не выбрал в течении 15s
								stat.autoLog('waitSelection', 15000);
							}
						},

						filterUsed: function(data, usedMap) {
							var filteredData = [];

							for(var i=0, l=data.length; i<l; i++) {
								var row = data[i];

								var key = _suggestToEmail(row);

								if(usedMap[key] === undefined) {
									filteredData.push(row);
								}
							}

							return filteredData;
						},

						startFindSuggest: addCommaToInput
					}));

					$(window).bind('addressbook:update', function() {
						addressbookData = null;

						if( suggest.isExpanded() ) {
							setDataSource();
							suggest.rebuildSuggestsList();
						}
					});

					function setDataSource(callback) {
						if( !addressbookData
							|| patron.Utils.Addressbook.getLastChange() != _addressbookLastChange
						) {
							patron.Utils.Addressbook(function (data) {
								_addressbookLastChange = patron.Utils.Addressbook.getLastChange();

								addressbookData = data;

								suggest.setData(data);

								if($.isFunction(callback)) {
									callback();
								}
							});
						}
						else {
							if($.isFunction(callback)) {
								callback();
							}
						}
					}

					function addCommaToInput(event) {
						if( opts.multiSuggests ) {
							// если в поле ввода, что то есть
							// то пишем туда запятую, чтобы корректно добавлять
							// новые элементы из списка
							var value = $input.val()
								, caret
							;

							if( event
								&& event.type == "focus"
							) {
								caret = ajs.$.getCaretPosition($input[0]);
								if( caret.end != value.length ) {
									return;
								}
							}

							value = $.trim(value);

							if(value && !value.match(RE_COMMA_ON_END)) {
								$input.val(value += ", ");
								ajs.$.setCaretPosition($input[0], value.length + 1);
							}
						}
					}
					$input
						.data(namespace, {
							getUsed: function(ignoreAfterGetSuggestWords) {
								return suggest.getSuggestWords(ignoreAfterGetSuggestWords);
							}
						})

						.bind('keydown', function(e) {
							// отключение вставки переносов строк в поле с адресами
							if (!e.ctrlKey && e.keyCode == 13) {
								e.preventDefault();
							}

							// сброс статистики по выделению
							clearTimeout(stat.waitSelection);
							if(!stat.startSearchTS) {
								stat.startSearchTS = ajs.now();
							}
						})

						.bind('keyup', opts.ignoreUsedData ? function(e) {
							// пересчитываем использованные адреса, чтобы учесть пользовательские правки
							suggest.ignoreUsed(suggest.getSuggestWords());
						} : null)

						.bind('keydown keyup', function(e) {
							// и возвращаем сортировку по приоритетам (если АК была уже загружена с другой сортировкой)
							setDataSource();
						})
					;

					if( opts.deleteLastComma ) {
						$input.bind('blur', function() {//removeCommaFromInput | MAIL-13992
							var value = $.trim($input.val());

							if(value && value.match(RE_COMMA_ON_END)) {
								$input.val(value.replace(RE_COMMA_ON_END, ""));
								$input.trigger(INPUT_EVENT_NAME);
							}
						});
					}

					if(!isLoading) {
						setDataSource();
						isLoading = true;
					}
				})
			}
		};

	})(jQuery);

	jsLoader.loaded('{jQuery}addressbookSuggest');
});
