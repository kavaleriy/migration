jsLoader.require([
	'{patron.ui}patron.ui.Suggest',
	'{patron.utils}patron.Utils.Addressbook',
	'{patron.utils}patron.Utils.Search'

], function() {
	var   RE_EMAIL = /([\w.\-+!#$%&'*=/?\^_`|~{}]+)@([\w.а-яё\-]+)\.[\wа-яё]+/
		, RE_NAME_AND_EMAIL_IN_LTGT = new RegExp("[\"']?(.*?)[\"']?\\s*(?:<|&lt;)(" + RE_EMAIL.source + ")(?:>|&gt;)$")
		, RE_NAME_AND_EMAIL_IN_LTGT_WITH_SPACE = new RegExp("[\"']?(.*?)[\"']?\\s+(?:<|&lt;)(" + RE_EMAIL.source + ")(?:>|&gt;)$")
		, RE_SEPARATOR = /,\s*/g
		;

	// https://jira.mail.ru/browse/MAIL-18309
	// RE_NAME_AND_EMAIL_IN_LTGT отличается от той, что в addressbookSuggest.js, \s* вместо \s+

	var   htmlEscape = ajs.HTML.escape
		//, htmlUnescape = ajs.HTML.unescape
	;

	var d2052135Sended = false;//MAIL-19655

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
				this.log('');

			}.bind(this), timeout);
		}
	};

	function _getOpts() {
		var opts = {
			width: '250px'
			, searchLast: true
			, autosubmit: false
			, showInternet: false
			, internalSource: true
			, minLength: 1
			, popularSuggestsListLength: 16
			, timeout: 0
			, multiSuggests: true
			, suggestEscapeStart: '"'
			, suggestEscapeEnd: '"'
			, suggestSeparator: RE_SEPARATOR
			, selectByTab: true
			, cnSuggest:  'addressbook__suggest__block'
			, cnList:     'addressbook__suggest__list compose__labels__suggest'
			, cnItem:     'addressbook__suggest__item'
			, cnSelected: 'addressbook__suggest__item_selected'
			, cnItemTick: 'addressbook__suggest__item__tick'
			, cnInput:    'addressbook__suggest__input'
			, fetching: true
			, limit: 0
			, undeterminedStage: false
			, ignoreUsedData: true
			, isLoading: false
			, blockMaxWidth: 0
			, suggestMaxExcess: 30
			, dragNDropEnabled: false
			, disabled: false
			, focusWhileDisabled: false

			, template: function (val, item, index, data, originalVal) {
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

				return "<div data-suggest='" +  ajs.$.quote( htmlEscape(item) ) + "' class='addressbook__suggest__item' data-suggest-idx=''>" +
					(
						'<div class="addressbook__suggest__item__text">' +
							(originalVal ? tick(name) : htmlEscape(name)) + ' ' +
							'<span class="addressbook__suggest__item__hint">' +
								( email ? (originalVal? tick(email) : htmlEscape(email)) : "&nbsp;" ) +
							'</span>' +
						'</div>'
					) +
					(avatar ? '<img alt="" class="addressbook__suggest__item__image" src="' + avatar + '" />' : '') +
				'</div>'
			}

		};

		if( patron.isAncientBrowser() ) {
			opts.limit = 100;
			delete opts.fetching;
		}

		// позиционирование блока с саджестами
		opts.margin = 7;

		return opts;
	}

	function isCtrlKey(e) {
		return e.ctrlKey || e.metaKey;
	}

	/**
	 * Check keycode that it is a letter or a number or some punctuation marks and not system keys
	 * @param keyCode
	 */
	function isNotSystemKey (keyCode) {
		return keyCode == 32 || (keyCode >= 48 && keyCode <= 90) || (keyCode >= 96 && keyCode <= 111) || (keyCode >= 186 && keyCode != 224)
	}

	function _hasEmail(str) {
		return !!str.match(RE_EMAIL);
	}

	function _suggestToEmail(str) {
		if (!str) {
			return "";
		}
		var  nameAndEmail_parts = str.match(RE_NAME_AND_EMAIL_IN_LTGT);
		return nameAndEmail_parts ? nameAndEmail_parts[2] : str;
	}

	function _suggestToName(str) {
		if (!str) {
			return "";
		}
		var  nameAndEmail_parts = str.match(RE_NAME_AND_EMAIL_IN_LTGT);
		return nameAndEmail_parts ? nameAndEmail_parts[1] : str;
	}

	function _suggestToNameAndEmail( str ) {
		if (!str) {
			return "";
		}
		var nameAndEmail_parts = str.match(RE_NAME_AND_EMAIL_IN_LTGT);
		return nameAndEmail_parts ? {
			name: nameAndEmail_parts[ 1 ],
			email: nameAndEmail_parts[ 2 ]
		} : str;
	}

	/**
	 * Преобразует username@domen.ru <username@domen.ru> в username <username@domen.ru>
	 * @param str
	 * @private
	 */
	function _normalizeContact(str) {
		if (_suggestToEmail(str) == str && str.match(RE_EMAIL)) {
			// Текст содержит только емейл. Нужно взять юзернейм из емейла и подставить его вместо имени
			if (!~str.indexOf('<'))
				str = '<' + str;
			if (!~str.indexOf('>'))
				str = str + '>';
			str = str.match(RE_EMAIL)[1] + ' ' + str;
		}

		return str;
	}


	function _getDataText ( $label ) {
		return '' + ($label.attr('data-text') || '');
	}

	function logInvalidBlock() {
		patron.radar('composelabels','invalidblock_abjsdata_' + (patron.abjsData && patron.abjsData.length ? '1' : '0') + '=1', 1);
	}

	/**
	 * @class patron.ui.ComposeLabels
	 */
	jsClass
		.create('patron.ui.ComposeLabels')
		.statics({
			suggestToEmail: _suggestToEmail,
			suggestToName: _suggestToName,
			normalizeContact: _normalizeContact
		})
		.methods({
			__construct: function(input, namespace, opts) {
				this.opts = Object.extend({}, _getOpts(), opts);
				this.namespace = namespace;

				var hasFocus = (input == document.activeElement);
				if (hasFocus && this.opts.disabled) {
					this.opts.focusWhileDisabled = true;
					setTimeout(function() {this.opts.focusWhileDisabled = false}.bind(this), 5000);
				}

				this._prepareContainer($(input));
				this._initSuggests();
				this._initHandlers();
				this._initHistory();
				this._initWidget();
				this._initLabels();
				this._initDragNDrop();

				if (hasFocus) {
					this._prepareInput();
				}

				// Store original display names for every email address
				this.originalContacts = {};
				// Store display names that change
				this.changedContacts = {};

				ajs.log('patron.ui.ComposeLabels ready');
			},


			_prepareContainer: function($donor) {
				// переделываем инпут в контейнер, а в нем уже лежит все, что нам надо.

				// заменяем инпут на скрытый
				this.$source = $('<input type="hidden">')
					.attr({
						'name': $donor.attr('name')
						, 'id': $donor.attr('id')
						, 'class': 'js-source'
					})
					.val( $donor.val() );
				this.source = this.$source[0];

				// инпут, в котором будем печатать
				this.$input = $('<input type="text">')
					.attr({
						'tabindex': $donor.attr('tabindex')
						, 'data-original-name': $donor.attr('name')
						, 'class': 'js-input compose__labels__input'
					});
				this.input = this.$input[0];

				// лейбл
				var $label = $('<span></span>')
					.attr({
						'tabindex': -1
						, 'class': 'js-compose-label compose__labels__label'
						, 'style': 'display: none;' + (this.opts.blockMaxWidth ? ' max-width: ' + (this.opts.blockMaxWidth + 17) + 'px;' : '')
					})
					.append($('<span></span>')
						.attr({
							'class': 'compose__labels__label__text js-label-text',
							'style': (this.opts.blockMaxWidth ? 'max-width: ' + this.opts.blockMaxWidth + 'px;' : '')
						}))
					.append($('<i></i>')
						.attr({
							'class': 'icon icon_compose_label_close js-remove-label'
						}));

				// ксерокс
				// если надо скопировать несколько лейблов, то подставляем их отформатированное
				// содержимое сюда и передаем ему фокус, браузер сделает дальше все сам.
				this.$xerox = $('<input type="text"/>')
					.attr({
						'tabindex': -1
					})
					.css({
						'overflow': 'hidden',
						'position': 'absolute',
						'marginLeft': -10000,
						'width': 'auto'
					});

				// пересобираем:
				// контейнер вместо инпута
				$donor.replaceWith(this.$container = $('<div></div>')
					.attr({
						'class': $donor.attr('class')+' compose__labels',
						'style': 'height: auto;'
					})
					.addClass('js-compose-labels'));

				// добавляем лейбл, инпут и скрытый инпут
				this.$container.append($label, this.$input, this.$source, this.$xerox);
				// готово!
			},

			_initLabels: function() {
				// создаем лейблы из исходной строки
				this.$input.val(this.$source.val());

				var words = this.suggest.getSuggestWords();

				if (words.length) {
					if (this.opts.disabled && !_hasEmail(words[words.length - 1])) {
						// последний адрес невалидный, наверно это прямо сейчас печатают, пока мы не успели загрузиться
						// тогда не будем мешать - пусть продолжает печатать
						var inputText = words.pop();
					}

					Array.forEach(words, function(str) {
						this._createLabel(str, true);
					}.bind(this));
					this._updateSource();

					if (inputText) {
						this.$input.val(inputText);
					}
				}
			},

			_initSuggests: function() {
				var t = this;
				var events = {
					"suggests:show": function(e) {
						if (patron['ComposeLabelsShowSuggestsOnClick']) {
							Counter.d((e && e.findValue)? 2610332 : 2610049);
						} else {
							Counter.d(1833838);
						}
					}
					, "suggests:select": function(e) {
						if (patron['ComposeLabelsShowSuggestsOnClick']) {
							Counter.sb((e && e.findValue)? 2610333 : 2610051);
						} else {
							Counter.sb(1833843);
						}
					}
				};

				this.suggest = new patron.ui.Suggest(this.$input, [], Object.extend(this.opts, {
					events: events,
					cnInput: this.input, // корректная ссылка на текущий элемент
					afterSelect: function(value, idx) {
						stat.log(value, idx);

						// удаляем лишнюю метку (она создалась по blur)
						t._removeDuplicate(t.$input.val());
						// создаем метку из саджеста
						t._createLabel(value);
						t._prepareInput();

						return '';
					},
					//afterGetSuggestWords: t._getSuggestWords_after.bind(this),
					ignoreUserData: true,

					afterGetData: function(triggerEvent) {
						var data = triggerEvent["data"];

						if( !data || data.length === 0 )return;

						// заполнение статистики перед выдачей саджестов
						stat.requestValue = triggerEvent["suggestValue"];
						stat.suggestsList = data;
						stat.sourceSize = t.addressbookData ? t.addressbookData.all().length : 0;

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
						// отбрасываем уже добавленные саджесты
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

					afterRebuild: function(e, $block) {
						// проверяем, не вышел ли блок за край
						var max = t.$container.offset().left + t.$container.width() + t.opts.suggestMaxExcess;
						if ($block.offset().left + $block.width() > max) {
							$block.css({left: Math.max(max - $block.width(), t.$container.offset().left)})
						}
					}
				}));

				if(!this.opts.isLoading) {
					this._setDataSource();
					this.opts.isLoading = true;
				}
			},

			_initHandlers: function() {
				var t = this,
					$window = $(window);
				// здесь подписываемся на события мыши и клавиатуры

				// ******************** input ********************
				this.suggest.ajsSuggest.addTrigger('suggests:activeOut', function(e) {
					// аналог blur, но не вызывается по клику на список саджестов.
					if (t.opts.noblur) {
						t.opts.noblur = false;
					}
					else {
						if (!t.opts.disabled && !t.opts.focusWhileDisabled) {
							if (!t.opts.isActive) {
								t._createLabel(t.input.value);
								t.input.value = '';
							}
						}
						else if (t.input.value) {
							setTimeout(function(){t.suggest.ajsSuggest.show()}, 10); // MAIL-18000
						}
					}
				});

				this.$input
					.bind('blur', function(e, force) {
						// при потере фокуса создаем из инпута лейбл
						// только если вызвали вручную, в штатных случаях - сработает suggests:activeOut
						if (force) {
							t._createLabel(this.value);
							this.value = '';
							if (t.suggest.isExpanded()) {
								t.suggest.hide();
							}
							if (t.opts.focusWhileDisabled)
								t.opts.focusWhileDisabled = false;
						}
					})

					.bind('keydown', function(e) {
						var keyCode = e.keyCode
							, caret = ajs.$.getCaretPosition(this);

						if (keyCode == 13 || keyCode == 27) { //  enter или escape
							if ( !t.suggest.isExpanded() ) { // открытые саджесты сами отработают эти кнопки
								if (t._checkTextValidity(this.value).valid) {
									t._createLabel(this.value);
									t._prepareInput();
								}
								e.preventDefault();
							}
						}
						else if ( ((keyCode == 37 || keyCode == 8) && (!caret.start && !caret.end))) {
							// left или backspace в начале строки
							var $prev = t._getPrevLabel(t._getInputWrap());
							if($prev.length) {
								if (patron.ComposeLabelsOneClick && keyCode == 8) {
									// по backspace просто удаляем предыдущий лейбл
									t._removeLabel($prev);
								} else {
									// уходим из инпута и выделяем предыдущий лейбл
									$(this).trigger('blur', true);
									if (e.shiftKey)
										t._selectLabel($prev, true);
									else
										$prev.click();
								}
							}
							e.preventDefault();
						}
						else if ( (keyCode == 39 && caret.start == this.value.length)/* || keyCode == 9*/) { // right
							var $next = t._getNextLabel(t._getInputWrap());
							if ($next.length) {
								// уходим из инпута и выделяем следующий лейбл
								$(this).trigger('blur', true);
								if (e.shiftKey)
									t._selectLabel($next, true);
								else
									$next.click();
								e.preventDefault();
							}
							else if (this.value != '' && t._checkTextValidity(this.value).valid) {
								// если инпут непустой и в нем валидный текст, то создаем лейбл и ставим курсор в новый
								t._createLabel( this.value );
								t._prepareInput();
								e.preventDefault();
							}
						}
						else if (keyCode == 9) { // tab
							// таймаут, чтобы фокус успел перепрыгнуть на следующий элемент
							setTimeout(function () {
								t._createLabel( this.value );
							}.bind(this), 0);
						}
						else if (isCtrlKey(e) && keyCode == 65 && this.value == '') { // ctrl+a
							//  на пустом тексте выделяем все лейблы
							t._selectAllLabels();
							e.preventDefault();
						}
						else if (isCtrlKey(e) && this.value == '' && (keyCode == 90 || keyCode == 89 )) { // ctrl+z, ctrl+y undo/redo
							var memento = (keyCode == 90) ? t.history.undo() : t.history.redo();
							if (memento !== null) {
								t.$source.val(memento);
								// clear current
								t._removeAllLabels();
								// init new
								t._initLabels();
								t._prepareInput();
							}
							e.preventDefault();
						}
						else if (_hasEmail(this.value) && (keyCode == 32 || this.value.slice(-1) == '>')) {
							// если введен емейл в угловыми скобками, то после него по любой букве схлопываем
							// а если емейл без скобок но нажали на пробел, то все равно схлопываем
							if (caret.start == this.value.length && isNotSystemKey(keyCode)) {
								t._createLabel( this.value );
								t._prepareInput();
								if (keyCode == 32)
									e.preventDefault();
							}
						}

						// скрыть тултипы, если они есть
						t._hideTooltip(true);

						// сброс статистики по выделению
						clearTimeout(stat.waitSelection);
						if (!stat.startSearchTS) {
							stat.startSearchTS = ajs.now();
						}
					})

					.bind('keyup', function (e) {
						if (t.opts.ignoreUsedData) {
							// пересчитываем использованные адреса, чтобы учесть пользовательские правки
							t.suggest.ignoreUsed(t._getSuggestWords());
						}

						if (this.value == '' && t.$input.closest('.js-input-wrap').length) {
							// если все стерли, то крестик больше не нужен
							t._prepareInput();
						}

						if (e.keyCode == 9) {
							// https://jira.mail.ru/browse/MAIL-31316
							// при переходе по табу нужно выполнить логику из _prepareInput
							t._prepareInput();
						}

						// обновляем ширину инпута
						t._updateInputWidth();
					})

					// если вставили текст содержащий запятые, то его нужно разбить на метки и вернуть фокус в инпут
					.bind('input', function() {
						if(this.value.match(/,/)) {
							var words = Array.filter(t.suggest.getSuggestWords(), function(item) {
								return !!item; // filter empty strings
							});

							if (words.length > 1 || this.value.slice(-1).match(RE_SEPARATOR)) {
								// адресов действительно несколько или запятая последняя
								// т.о. мы исключаем запятые в имени пользователя
								this.value = '';
								Array.forEach(words, function(str) {
									if (str) {
										t._createLabel(str, true);
									}
								});
								t._prepareInput();
								t._updateSource();
							}
						}
						// обновляем ширину инпута
						t._updateInputWidth();
					})

					.bind('focus', function() {
						// если саджестов еще нет, надо их получить
						if (!t.addressbookData) {
							t._setDataSource();
						}
					});

				// ******************** labels ********************
				this.$container
					.bind('click', function(e) {
						// в зависимости от таргета делаем:
						var   $target = $(e.target)
							, $label = $target.closest('.js-compose-label');

						if ($target.is('.js-remove-label') && !isCtrlKey(e) && !e.shiftKey) {
							// удаляем лейбл
							t._removeLabel($label);
							t._prepareInput();
							e.preventDefault();
						}
						else if ($label.length)  {
							// выделение на лейбл
							if (isCtrlKey(e) || e.shiftKey) {
								if ($label.hasClass('compose__labels__label_selected')) {
									// убираем выделение
									e.shiftKey ? t._deselectLabelsRange($label) : t._deselectLabel($label);
								}
								else {
									// добавляем к выделенным
									e.shiftKey ? t._selectLabelsRange($label) :  t._selectLabel($label, true);
								}
							}
							else {
								t._selectLabel($label);
							}
							e.preventDefault();
						}
					});

				// события клавиатуры
				/// самое интересное
				this.$container
					.bind('keydown', function(e) {
						// на инпут свой обработчик
						if (e.target == t.input)
							return;

						var   keyCode = e.keyCode
							, $selectedLabel = t._getSelectedLabel()
							, $label;

						if (keyCode == 37 || keyCode == 39) { // left, right, tab
							// selection
							var   multiple =  e.shiftKey // shift+стрелки - нужно добавить к выделению
								, isRight = keyCode == 39; // right, tab - вправо, left, shift+tab - влево

							$selectedLabel = isRight? $selectedLabel.first() : $selectedLabel.last();
							if (multiple)
								$selectedLabel = t.$lastSelectedLabel || $selectedLabel;

							$label = isRight? t._getNextLabel($selectedLabel) : t._getPrevLabel($selectedLabel);

							// выбираем предыдущий следующий
							if ($label.length) {
								if (multiple && $label.hasClass('compose__labels__label_selected')) {
									// возвращаемся на предыдущий выбранный, нужно текущий развыбрать
									t._deselectLabel($selectedLabel);
									t.$lastSelectedLabel = $label;
								}
								else {
									// добавляем к выделению левый или просто выделяем левый
									t._selectLabel($label, multiple);
								}

								e.preventDefault();
							}
							else if (isRight) {
								// фокус в инпут
								t._prepareInput();
								e.preventDefault();
							}
						}
						else if (e.shiftKey && (keyCode == 38 || keyCode == 40)) {
							// запрещаем shirt+вверх/вниз
							e.preventDefault();
						}
						else if (keyCode == 8 || keyCode == 46) { // backspace, delete
							// удаляем все что выбрано
							if($selectedLabel.length) {
								t._removeLabel($selectedLabel);
								t._prepareInput();
							}
							e.preventDefault();
						}
						else if (keyCode == 27) { // esc
							// сбрасываем выбранные лейблы, начинаем печатать
							t._deselectAllLabels();
							t._prepareInput();
							e.preventDefault();
						}
						else if (keyCode == 13) { // enter
							// редактирование лейбла
							$selectedLabel = t.$lastSelectedLabel || $selectedLabel.last();
							if($selectedLabel.length) {
								t._prepareInput($selectedLabel);
							}
							e.preventDefault();
						}
						else if (keyCode == 9) { // tab
							t._deselectAllLabels();
						}
						else if (isCtrlKey(e) && keyCode == 65) { // ctrl+a
							t._selectAllLabels();
							e.preventDefault();
						}
						else if (isCtrlKey(e) && (keyCode == 67 || keyCode == 88)) { // ctrl+c, ctrl+x
							t._prepareLabelsForCopy($selectedLabel);

							if(keyCode == 88) {
								// вырезаем лейблы
								t._removeLabel($selectedLabel);
							}
						}
						else if (isCtrlKey(e) && keyCode == 86) { // ctrl+v
							// удаляем выделенные если есть
							t._removeLabel($selectedLabel, true);
							// фокус в инпут, пусть он вставляет новые.
							t._prepareInput(null, true);
						}
						else if (isCtrlKey(e) && (keyCode == 90 || keyCode == 89 )) { // ctrl+z, ctrl+y undo/redo
							var memento = (keyCode == 90) ? t.history.undo() : t.history.redo();
							if (memento != null) {
								t.$source.val(memento);
								// clear current
								t._removeAllLabels();
								// init new
								t._initLabels();
								e.preventDefault();
								t._prepareInput();
							}
						}
						else if ( isNotSystemKey(keyCode) ) { // буква
							// при нажатии на любую букву начинаем ее печатать в новом лейбле
							t._prepareInput();
						}
					});

				// остальное

				// отслеживаем когда не надо создавать лейбл по blur
				this.$container.bind('mousedown', function(e) {
					var $target = $(e.target);
					if ($target.is('.js-remove-label') && $target.closest('.js-input-wrap').length) {
						t.opts.noblur = true;
					}
				});

				if (!patron.ComposeLabelsOneClick) { // https://jira.mail.ru/browse/MAIL-14941
					this.$container.delegate('.js-compose-label', 'dblclick', function(e) {
						// редактирование
						t._prepareInput($(e.target).closest('.js-compose-label'));
						e.preventDefault();
					});
				}

				if ($.browser.msie) {
					// отмена выделения текста по нажатию на лейблы в ие
					this.$container.delegate('.js-compose-label', 'selectstart', function(e) {
						e.preventDefault();
					});
				}

				// выделение мышью
				this.$container.bind('mousedown', function(e) {
					// если нажали не на лейбл, то пробуем выделить все
					var   $target = $(e.target)
						, $label = $target.closest('.js-compose-label')
						, blurred = false;

					if (document.activeElement != t.input && !$label.length && !t.$input.val()) {
						t._prepareInput(); // https://jira.mail.ru/browse/MAIL-18630
					}

					if ( e.which < 2 && !$label.length && !t.$input.val()) {
						// если нажали не на лейбле и в инпуте нету текста, то можно мышью выделить лейблы
						e.preventDefault();

						var startPoint = {x: e.pageX, y: e.pageY}
							, $labels = t._getLabels().filter(':visible')
							, map = mapLabels($labels)
							, hasSelection = false;

						t._deselectAllLabels();
						t.opts.preventTooltips = true; // чтобы не появлялись тултипы

						$(document)
							.bind('mousemove.selection', function(e) {

								if (!blurred) {
									// так как mousedown запревенчен, надо вручную заблюрить все инпуты
									if (patron.ComposeLabelsInstances) {
										Array.forEach(patron.ComposeLabelsInstances, function(item) {
											if (item.is(':visible')) {
												var widget = item.composeLabels('widget');
												if (widget)
													widget.blur();
											}
										});
									}
									else {
										t.$input.trigger('blur', true);
									}
									blurred = true;
								}

								// все пересекающиеся с областью выделения лейблы нужно выделить
								var selection = {
									x: Math.min(startPoint.x, e.pageX)
									, y: Math.min(startPoint.y, e.pageY)
									, w: Math.abs(startPoint.x - e.pageX)
									, h: Math.abs(startPoint.y - e.pageY)
								};
								// каждый раз идем по всему списку лейблов и сравниваем их координаты
								// , если они хоть как-то пересекаются с областью выделения, то помечаем их выделенными
								Array.forEach(map, function(item, k) {
									if (   ((item.x < selection.x && (item.x + item.w) < selection.x)
										    || (item.x > (selection.x + selection.w) && (item.x + item.w) > (selection.x + selection.w)))
										|| ((item.y < selection.y && (item.y + item.h) < selection.y)
										   || (item.y > (selection.y + selection.h) && (item.y + item.h) > (selection.y + selection.h)))
										) {
										// outside
										item.$label.removeClass('compose__labels__label_selected');
									}
									else {
										if (!hasSelection) hasSelection = true;
										// inside
										item.$label.addClass('compose__labels__label_selected');
									}
								});
							})
							.bind('mouseup.selection', function(e) {
								$(document).unbind('mousemove.selection mouseup.selection');
								t.opts.preventTooltips = false;
								// чтобы дальше можно было выделять клавиатурой или с шифтом мышью, нужно назначить последний выбранный лейбл
								t.$lastSelectedLabel = t._getSelectedLabel().first().focus();
								if (!hasSelection && document.activeElement != t.input) {
									// если так ничего и не выбрали, то передаем фокус в инпут (как и по клику в пустое место)
									t._prepareInput();
								}
								else if (hasSelection && $.browser.safari) {
									t._prepareLabelsForCopy(t._getSelectedLabel());
								}
							});
					}

					/**
					 * @private Собираем один раз координаты и размеры всех лейблов, чтобы не узнавать их на каждый mousemove
					 * @param $labels
					 * @returns {Array}
					 */
					function mapLabels($labels) {
						var map = [], $label, offset ;
						Array.forEach($labels, function(label) {
							$label = $(label);
							offset = $label.offset();
							map.push({
								$label:$label
								, x: offset.left - ( window.$Scroll && $Scroll.normal ? 0 : ajs.scrollLeft() )
								, y: offset.top - ( window.$Scroll && $Scroll.normal ? 0 : ajs.scrollTop() )
								, w: $label.outerWidth()
								, h: $label.outerHeight()
							});
						});
						return map;
					}
				});

				if (patron['ComposeLabelsShowSuggestsOnClick']) {
					this._showSuggestsOnClick = function () {
						var   length = t.opts.popularSuggestsListLength
							, maxRecipients = patron['MaxRecipients'] || 30 /* макс число адресатов */
							, data = t.suggest.localData.all().slice(0, maxRecipients);

						t.suggest.ignoreUsed(t._getSuggestWords());
						if(Object.keys(t.suggest.usedMap).length) {
							data = t.suggest.opts.filterUsed(data, t.suggest.usedMap);
						}
						data = data.slice(0, length); // первые N
						data.__nooverride = true; // не даем перезатереть список

						t.suggest.ajsSuggest.showSuggests("", false, data, true);
					}.debounce(200, t);

					this.$container.bind('mouseup', function(e) {
						var   $target = $(e.target)
							, $label = $target.closest('.js-compose-label');
						if (!$label.length && !t.$input.val() && !t.suggest.isExpanded()) {
							t._showSuggestsOnClick();
						}
					});
				}

				// tooltips
				this.$container
					.delegate('.js-compose-label', 'mouseenter', function(e){
						// при наведении на лейбл показываем тултип
						t._showTooltip($(e.target).closest('.js-compose-label'));
					})
					.delegate('.js-compose-label', 'mouseleave', function(){
						// при уведении скрываем тултип
						t._hideTooltip();
					});

				this._resizeObserver = t._updateInputWidth.debounce(500, t);

				this.$container
					.bind('change', function() {
						// обновляем ширину поля под ширину контейнера
						t.opts.inputMaxWidth = t.$container.width() - 24;
						t.$input.css('max-width', t.opts.inputMaxWidth + 'px');

						// обновляем ширину, чтобы она была минимальна во время ресайза - так будет меньше прыгать высота во время ресайза
						t._updateInputWidth(true);
						// ставим таймаут, чтобы вернуть ширину на максимальную - чтобы работала правая кнопка мыши.
						t._resizeObserver();
					})
					.bind('focus', function(evt) {
						t.opts.isActive = true;
					})
					.trigger('change')
				;

				$window.bind('hide.layer', function(evt, layer) {
					//обновляем ширину, чтобы она была минимальна во время закрытия попапов (появления вертикального скроллбара) - иначе инпут перескакивает на следующую строку
					t._updateInputWidth(true);
				});

				$(document.body).bind('mousedown', function(evt) {
					// сбрасываем выделение при клике наружу
					if(!t.$container.has(evt.target).length && t.opts.isActive) {
						if (t.opts.focusWhileDisabled) {
							t.opts.focusWhileDisabled = false;
						}
						t._updateSource();
						t._deselectAllLabels();
						t.opts.isActive = false;
					}
				});

				if (!$.browser.msie) {
					$window.bind('blur.composelabels', function() {
						// https://jira.mail.ru/browse/MAIL-19324
						t.$input.trigger('blur', true);
					});
				}

				if ($.browser.msie || $.browser.opera) {
					// https://jira.mail.ru/browse/MAIL-17723
					// Если стирать подряд кучу блоков можно случайно уйти со страницы. По флагу превентим клавиатуру
					$(document.body).bind('keydown', function(e) {
						if (t.opts.lockKeyboard && t.opts.isActive) {
							e.preventDefault();
						}
					});
				}

				this.$source
					.bind('focus', function(e) {
						// когда снаружи пытаются поставить фокус на исходник, который теперь скрытый
						// нам надо перепраить фокус на настоящий инпут
						e.preventDefault();
						if (t.opts.disabled)
							t.opts.focusWhileDisabled = true;
						if (t.input != document.activeElement)
							t._prepareInput();
					})

					.bind('clearPreviousValue change', function() {
						// подписываемся на изменение адресов извне и пересоздаем лейблы
						t._removeAllLabels();
						t._initLabels();
					});

				if(!patron.v2) {
					$window.bind('beforeunload.composeLabels', t._hideTooltip.bind(t, true));
				}
			},

			_initHistory: function() {
				this.history = {
					stack : [],
					pointer : -1,
					checkpoint : function(memento) {
						var   stack = this.stack
							, pointer = this.pointer
							, current = this._getState(pointer);

						memento = memento.replace(/,\s*$/,''); // удаляем последнюю запятую (если есть)

						if (current !== null) {
							if (memento != current) {
								pointer = ++this.pointer;
								stack.splice(pointer, stack.length - pointer, memento);
							}
						} else {
							stack.push(memento);
							this.pointer++;
						}
					},
					undo : function() {
						var prev = this._getState(this.pointer - 1);
						if (prev !== null) {
							this.pointer--;
						}
						return prev;
					},
					redo: function() {
						var next = this._getState(this.pointer + 1);
						if (next !== null) {
							this.pointer++;
						}
						return next;
					},
					clear: function () {
						this.stack = [];
						this.pointer = -1;
					},
					_getState: function(i) {
						var stack = this.stack;
						if (i > -1 && i < stack.length)
							return stack[i];
						else
							return null;
					}
				};
				// initial state
				this.history.checkpoint(this.$source.val());
			},

			_initWidget: function() {
				var t = this;
				this.$container.data(this.namespace, {
					getUsed: function(ignoreAfterGetSuggestWords) {
						return t._getSuggestWords(ignoreAfterGetSuggestWords);
					},

					clear: function() {

						// clear current
						t._removeAllLabels();
						// and source
						t.$source.val('');
					},

					redraw: function() {
						// clear current
						t._removeAllLabels();
						t.history.clear();
						// init new
						t._initLabels();
						// clearCounter
						this.invalidLabelCounted = false;
					},

					isValid: function() {
						// проверим, нет ли невалидных лейблов
						return !t._getLabels().filter('.compose__labels__label_invalid').length;
					},

					blur: function() {
						t.$input.trigger('blur', true);
					},

					disable: function(b) {
						t.opts.disabled = b;
					},

					getChangedContacts: function() {
						return t.changedContacts;
					},

					clearChangedContacts: function() {
						t.changedContacts = {};
					},

					clearOriginContacts: function() {
						t.originalContacts = {};
					}
				})
			},

			// ******* экспорт адресов наружу **************

			_updateSource: function() {
				// заполняем поле всеми созданными лейблами
				var str = this._getText(this._getLabels());
				this.$source.val(str);
				this.$source.trigger('composeLabelsChange');
				// checkpoint
				this.history.checkpoint(str);
			},

			/*
			 * Из массива лейблов достает непустые адреса (полностью с именами) и соединяет их через запятую
			 */
			_getText: function($labels) {
				var texts = [];
				var $label;
				Array.forEach($labels, function(label) {
					$label = $(label);
					if($label.length)
						texts.push(_getDataText($label));
				});
				texts = Array.filter(texts, function(str) {
					return $.trim(str).length > 0;
				});
				if (texts.length == 1) {
					texts[0] += ',';
				}
				return texts.join(', ');
			},

			_setDataSource: function(callback) {
				var t = this;

				patron.Utils.Addressbook(function(data) {
					if ( !t.addressbookData ) {
						if( !d2052135Sended && (!Array.isArray(data) || data.length === 0) && !patron.abjsDataEmpty ) {//MAIL-19655
							d2052135Sended = true;
							Counter.d(2052135);
						}
						t.addressbookData = data;

						t.suggest.setData(data);
					}

					if($.isFunction(callback)) {
						callback();
					}

					t.opts.isLoading = false;
				});
			},

			/*
			 * Из лейблов достает емейлы и возвращает массив
			 */
			_getSuggestWords: function(ignoreAfterGetSuggestWords) {
				var   suggestWords = []
					, $label;

				Array.forEach(this._getLabels().not(':first'), function(label) {
					$label = $(label);
					if ($label.length) {
						suggestWords.push(_getDataText($label));
					}
				});

				return ignoreAfterGetSuggestWords ?
					Array.filter(suggestWords, function(str) {
						return $.trim(str).length > 0;
					})
					: this._getSuggestWords_after(suggestWords);
			},

			_getSuggestWords_after: function(suggestWords) {
				return Array.filter(
					Array.map(suggestWords, function(str) {
						return _suggestToEmail(str);
					})
					, function(str) {
						return $.trim(str).length > 0;
					}
				);
			},


			/**
			 *
			 * Проверяет данную строку на валидность и возвращает объект с данными для заполнения лейбла.
			 *
			 * 0. если нет емейла, это невалидный контакт
			 * 1. если есть емейл и имя пользователя, но емейл не обернут в угловые скобки, то надо попробовать отделить имя от емейла
			 * 2. если есть емейл и имя пользователя, то скрываем емейл, оставляя видимым только имя.
			 * 3. если есть только емейл, без имени контакта, но обернутый в скобки или кавычки, то убираем их, оставляя только сам емейл
			 * 4. если есть емейл, но обернутый в другие символы или буквы, делаем невалидным (asd@mail.ruasd@mail.ru)
			 * 5. если есть емейл, но после него есть какой-то отделяемый текст, его нужно отрезать в отдельный лейбл
			 *
			 * @param str
			 * @returns {
			 * valid: Boolean
			 * , str: string modified or original str
			 * , name: string name
			 * , email: string email
			 * , newLabel: string text should be moved to new label
			 * }
			 * @private
			 */
			_checkTextValidity: function (str) {
				var result = {valid:false, str: str, name: "", email:"", newLabel:null};

				var   emailParts = str.match(RE_EMAIL)
					, email = emailParts ? emailParts[0] : str
					, name = str;

				if (_hasEmail(str)) {

					if (_suggestToEmail(str) == str && str != email && str.match(/\s|"/)) {
						// псевдовалидный лейбл, надо проверить что точно валидный.
						// текст состоит не только из емейла, но, возможно, еще содержит имя, но емейл не обернут в скобки
						var endIndex = str.length
							, startIndex = Math.max(str.lastIndexOf(' '),str.lastIndexOf('"')) + 1
							, found = false;

						while (!found) {
							if (str.substring(startIndex, endIndex).match(RE_EMAIL)) {
								found = true;
							}
							else {
								if (str.charAt(startIndex - 1) == ' ')
									endIndex = startIndex;
								startIndex = str.substring(0, startIndex - 1).lastIndexOf(" ") + 1;
							}
							if (endIndex <= 0) {
								break;
							}
						}

						if (found) {
							var strname = str.substring(0, startIndex).replace(/(^\s+|\s+$)/g, '');
							if (strname.length > 0 || endIndex < str.length) {
								if (endIndex < str.length) {
									// после емейла еще какой-то текст, создаем из него новый лейбл
									result.newLabel = str.substring(endIndex);
								}

								result.str = str = strname
									+ ' <' + str.substring(startIndex, endIndex).replace(/[<>\s]/g, '') + '>';
							}
						}
					}

					if (email != str) {
						name = _suggestToName(str).replace(/(^\s+|\s+$)/g, '');

						if (name.length > 0 && name != str) { // это самый простой случай, когда все хорошо. Скрываем емейл, показываем только имя
							email = _suggestToEmail(str);
							result.valid = true;
							result.name = name;
							result.email = email;
							if (!str.match(RE_NAME_AND_EMAIL_IN_LTGT_WITH_SPACE)) { // MAIL-18309
								if (str.match(/^\s*"/)) {
									// вернуть кавычки
									result.str = '"' + name + '" <' + email + '>';
								}
								else {
									result.str = name + ' <' + email + '>';
								}
							}
						}
						else if (name.length == 0) {
							// MAIL-20619
							// имя есть, но оно пустое ("" <asd@asd.er>). Нужно его отрезать совсем
							result.valid = true;
							result.str = result.email = email; // for return
							result.name = '';
						}
						else {
							var rest = str.replace(RE_EMAIL,'');
							if (rest.match(/^["'<>()]+$/)) {
								// емейл не совпадает с строкой, но при этом в остатке строки только кавычки и скобки,
								// значит это лишние символы - уберем их совсем.

								result.valid = true;
								result.str = result.email = email;
								result.name = '';
							}
							else {
								// емейл слитно с какой-то непонятной ерундой, так что просто пометим это невалидным
								result.str = str;
								result.name = result.email = '';
								result.valid = false;
							}
						}
					}
					else {
						result.valid = true;
						result.str = result.email = email;
						result.name = '';
					}
				}

				return result;
			},


			/*
			 * Если текст невалидный, то помечает лейбл как невалидный
			 * Если текст валидный, или почти валидный, тогда он модифицируется до валидного
			 * @return {String} видимый текст лейбла
			 */
			_validateLabelText: function($label, str) {
				var result = this._checkTextValidity(str)
					, text = !result.valid ? result.str : result.name ? result.name : result.email
				;

				$label
					.attr('data-text', result.str)
					.find('.js-label-text')
					.text(text);

				if (result.newLabel) {
					setTimeout(function() {
						this._createLabel(result.newLabel);
					}.bind(this), 1);
				}

				if (!result.valid) {
					// лейбл без емейла, помечаем его как невалидный
					$label.addClass('compose__labels__label_invalid');
					if (!this.invalidLabelCounted) {
						Counter.d(1708699);
						this.invalidLabelCounted = true; // считаем только 1 раз
					}
					logInvalidBlock();
				}

				return text;
			},

			//*********** input **********

			/*
			 * Если лейбл не передали, то ставим инпут в конец и передаем в него фокус
			 * Если передали лейбл, то вставляем инпут внутрь лейбла вместо его текста
			 *
			 * immediately - без таймаута
			 */
			_prepareInput: function($label, immediately) {
//				ajs.log('_prepareInput ',$label);
				var $input = this.$input
					, $inputWrap = $input.closest('.js-input-wrap') // а вдруг до этого мы редактировали
					, text
					;

				// lock key events
				this.opts.lockKeyboard = true;

				if ($label == undefined) {
					if (!this.opts.focusWhileDisabled)
						$input.val('');
//					$input.width('auto');
					this.$container.append($input);

					if ($inputWrap.length) {
						// надо удалить пустой и ненужный лейбл
						this._removeLabel($inputWrap, true);
					}

					var $lastLabel = this._getLabels().last();
					if ($lastLabel.length && $lastLabel.hasClass('compose__labels__label_invalid')) {
						$input.val(_getDataText($lastLabel));
						this._removeLabel($lastLabel, true);
					}
				}
				else {
					// проверяем, возможно мы редактировали другой лейбл и не закрыли его
					if ($inputWrap.length && $input.val()) {
						this._createLabel($input.val());
					}

					// достаем текст
					var $text = $label.find('.js-label-text');
					text = _getDataText($label) || $text.text();

					$input.val( text );
					// заменяем его на инпут
					$text
						.hide()
						.before($input);
					// меняем стили лейбла
					$label
						.removeClass()
						.addClass('js-input-wrap compose__labels__label compose__labels__label_edit');
					var currentMaxWidth = $label[0].style['max-width'] || $label[0].style['maxWidth'];
					if (currentMaxWidth) {
						$label
							.attr('data-max-width', currentMaxWidth)
							.css('max-width',8000+'px');
					}

					var contact = _suggestToNameAndEmail( text );
					if ( this.originalContacts[ contact.email ] === undefined ) {
						this.originalContacts[ contact.email ] = contact.name;
					}
				}
				this.opts.noblur = true;

				this._deselectAllLabels();
				$input.show();
				this._updateInputWidth();
				this._hideTooltip(true);



				if (immediately && $label === null) {
					this.opts.noblur = false;
					$input.focus();
					// unlock keyboard
					this.opts.lockKeyboard = false;
				}
				else {
					setTimeout(function() { // в некоторых браузерах (ie) фокус не успевает переставиться сразу
						this.opts.noblur = false;
						$input.focus();
						if (patron.ComposeLabelsOneClick && text) { // https://jira.mail.ru/browse/MAIL-14941
							if (_hasEmail(text)) {
								var name, start, end;
								name = _suggestToName(text);
								start = text.indexOf(name);
								end = start + name.length;
								ajs.$.setCaretPosition(this.input, start, end);
							}
							else {
								ajs.$.setCaretPosition(this.input, 0, text.length);
							}
						}
						else {
							text = $input.val();
							ajs.$.setCaretPosition(this.input, text.length, text.length);
						}

						// unlock keyboard
						this.opts.lockKeyboard = false;
					}.bind(this), 10);
				}
			},

			_updateInputWidth: function(narrowInput) {
				var $input = this.$input
					,  indent = 6 /* ширину делаем с небольшим запасом */
					, cloneWidth
					, width;

				if (!this.$inputClone) {
					// делаем клон инпута, чтобы мерять ширину его текста
					this.$inputClone = $('<span/>')
						.attr({
							'tabindex': -1,
							'class': $input.attr('class'),
							'style': $input.attr('style')
						})
						.css({
							'overflow': 'hidden',
							'position': 'absolute',
							'marginLeft': -10000,
							'marginTop': -10000,
							'max-width': '',
							'width': 'auto'
						})
						.appendTo(this.$container);
				}

				// вставляем в клон текст из инпута и узнаем ширину текста
				this.$inputClone.text(this.$input.val());
				cloneWidth = this.$inputClone[0].scrollWidth;
				width = cloneWidth + indent;

				if (!narrowInput && !this.$input.closest('.js-input-wrap').length) {
					// https://jira.mail.ru/browse/MAIL-18630
					$input.width( width );
					var   inputX = $input.offset().left
						, containerX = this.$container.offset().left
						, containerW = this.$container.width()
						, marginOffset = 10 /* на всякие отступы, чтобы каждый раз их не считать */
						;

					// ставим ширину инпута до края контейнера, чтобы можно было вставлять текст по правой кнопке
					width = Math.max(width, containerW - inputX + containerX - marginOffset);
				}

				$input.width( width );

				// инпуту ставится избыточная ширина (indent)
				// поэтому если ничего не делать, при редактировании блока его крестик съедет вправо
				// Чтобы этого избежать, инпуту при редактировании вешается стилями отрицательный правый маржин
				// но если мы приближаемся к максимальной ширине инпута, этот маржит задвигает крестик на инпут
				// поэтому здесь мы проверяем что ширина превышает максимальную,
				// и уменьшаем правый маржин обратно до нуля. а если не надо, то сбрасываем.
				if ($input.closest('.js-input-wrap').length && width > this.opts.inputMaxWidth) {
					var diff = cloneWidth - this.opts.inputMaxWidth;
					if (diff <= 5 || !($input[0].style['margin-right'] || $input[0].style['marginRight'])) {
						$input.css('margin-right', Math.min(diff,5) + 'px');
					}
				}
				else if ($input[0].style['margin-right'] || $input[0].style['marginRight']) {
					$input.css('margin-right', '');
				}
			},

			/*
			 * @returns Либо сам инпут, либо лейбл который он редактирует
			 */
			_getInputWrap: function() {
				return (this.$input.closest('.js-input-wrap').length)
					? this.$input.closest('.js-input-wrap')
					: this.$input;
			},

			//*********** labels **********

			_getLabels: function() {
				return $('.js-compose-label',this.$container);
			},

			//*** создание лейблов ******

			_createLabel: function(str, noSave) {
//				ajs.log('_createLabel',str);
				str = str
					.replace(/(^\s+|\s+$)/g, '')
					.replace(/(^,*|,*$)/g,'');

				if (str.length) {
					this.opts.noblur = true;
					var $label = this.$input.closest('.js-input-wrap' ), // может ничего создавать и не надо
						labelWasEdited;

					if ($label.length) {
						var labelWasEdited = true;
						// мы редактировали лейбл, так что надо вернуть в него текст и все.
						var oldText = _getDataText($label);

						// меняем стили
						$label
							.removeClass()
							.addClass('js-compose-label compose__labels__label');
						// вставляем текст
						$label
							.attr('data-text',str)
							.find('.js-label-text')
							.text(str)
							.show();

						if ($label.attr('data-max-width'))
							$label.css('max-width',$label.attr('data-max-width'));

						if (oldText != str) {
							Counter.d(1708702);
						}
					}
					else {
						// создаем новый лейбл и кладем рядом с инпутом
						$label = this.$container.find('.js-compose-label:first').clone();
						$label.css('display','');

						this.$input.before($label);
					}

					// проверяем на валидность и скрываем емейл для адресов с именем
					var labelText = this._validateLabelText($label, str);

					str = _getDataText($label); // строка могла быть видоизменена при валидации
					this._removeDuplicate(str, $label[0]/*, true*/); // отключил плавное удаление

					if ( labelWasEdited ) {
						// If display name for email is differs from original
						var contact = _suggestToNameAndEmail( str );
						if ( this.originalContacts[ contact.email ] !== contact.name ) {
							this.changedContacts[ contact.email ] = contact.name;
						} else {
							delete this.changedContacts[ contact.email ];
						}
					}

					var maxLen = this.opts.blockMaxWidth || 350
						, maxChars = Math.round(maxLen * 1.2 / 5); // букв заведомо больше чем максимальная длина блока
					if (labelText.length > maxChars) {
						labelText = labelText.slice(0, maxChars); // лучше отрезать лишние буквы, чтобы не распирало в ие
						$label.find('.js-label-text').text(labelText);
					}

					this._createTooltip($label);

					this.$input.val('').width(1);
					this.$container.append(this.$input);

					if (noSave === undefined)
						this._updateSource();

					this.opts.noblur = false;
				}
				else if (this.$input.closest('.js-input-wrap').length) {
					var $wrap = this.$input.closest('.js-input-wrap');
					this.$container.append(this.$input);
					this._removeLabel($wrap, true);
				}

				if (this.opts.focusWhileDisabled && !noSave)
					this.opts.focusWhileDisabled = false;
			},

			//*** удаление лейблов ******

			_removeLabel: function($label, immediately) {
//				ajs.log('_removeLabel',$label,immediately);
				if (!$label.length) {
					return;
				}

				var t = this;

				var email = _suggestToEmail( _getDataText($label) ).email;
				if ( t.changedContacts[ email ] ) {
					delete t.changedContacts[ email ];
				}

				if (immediately) {
					$label.remove();
					t._updateSource();
				} else {
					var count = $label.length;
					if ($.browser.msie) $label.find('.js-remove-label').hide();
					$label.removeClass('js-compose-label');
					$label.fadeOut('fast', function() {
						$(this).remove();
						if (--count < 1) {
							t._updateSource();
							t._updateInputWidth();
						}
						t._hideTooltip(true);
					});
				}
			},

			_removeAllLabels: function() {
				this._getLabels()
					.not(':first')// кроме первого, он источник для клонирования
					.remove();

				this._hideTooltip(true);
			},

			/*
			 * Удаляем лейблы с таким же email,
			 * А если лейблы без емейла, то по полному совпадению текста
			 */
			_removeDuplicate: function(str, label, slow) {
				if (str) {
					this._getLabels()
						.filter(':visible')
						.each(function() {
							if (this != label) {
								var labelText = _getDataText($(this));
								if(_suggestToEmail(labelText) == _suggestToEmail(str)) {
									if(slow) {
										$(this).fadeOut('slow', function() {
											$(this).remove();
										});
									} else {
										$(this).remove();
									}
								}
							}
						});
				}
			},

			//*** выделение лейблов ******

			_deselectAllLabels: function() {
				this._getLabels().removeClass('compose__labels__label_selected');
				this.$lastSelectedLabel = null;
			},

			_deselectLabel: function($label) {
				$label.removeClass('compose__labels__label_selected');
			},

			/*
			 * развыбирает диапазон лейблов от заданного до $lastSelectedLabel
			 * включительно
			 */
			_deselectLabelsRange: function($label) {
				if (!this.$lastSelectedLabel) {
					// no selected labels
					this._deselectLabel($label);
					return;
				}

				var $labels = this._getLabels().filter(':visible')
					, startDeselection = false
					, endDeselection = false
					, currentLabel
					, cutFromRight
					;

				for (var i = 0; i < $labels.length; i++) {
					currentLabel = $labels[i];

					if (currentLabel == $label[0] || currentLabel == this.$lastSelectedLabel[0]) {
						endDeselection = startDeselection; // не пора ли заканчивать
						startDeselection = !startDeselection; // пора начинать
						if (startDeselection)
							cutFromRight = (currentLabel == $label[0]); // развыбираем вправо от кликнутого
					}

					if (startDeselection || endDeselection)
						this._deselectLabel($(currentLabel));

					if (endDeselection)
						break;
				}

				var $nextLabel = cutFromRight ? this._getPrevLabel($label) : this._getNextLabel($label);
				this.$lastSelectedLabel = ($nextLabel.hasClass('compose__labels__label_selected')) ? $nextLabel : null;
			},

			_selectAllLabels: function() {
				this._getLabels()
					.filter(':visible')
					.addClass('compose__labels__label_selected')
					.last()
					.focus();

				if ($.browser.safari) {
					this._prepareLabelsForCopy(this._getSelectedLabel());
				}
			},

			/*
			 * @param add - true - добавить к уже выделенным
			 * , false - сбросить выделение и выделить текущий
			 */
			_selectLabel: function($label, add) {
				if (!add) {
					this._deselectAllLabels();
				}

				if (!add && ($label.hasClass('compose__labels__label_invalid') || patron.ComposeLabelsOneClick)) {
					// сразу переходим в редактирование
					this._prepareInput($label);
				}
				else {
					this.$lastSelectedLabel = $label.addClass('compose__labels__label_selected').focus();
				}

				if ($.browser.safari) {
					this._prepareLabelsForCopy(this._getSelectedLabel());
				}
			},

			/*
			 * выбирает диапазон лейблов от заданного до $lastSelectedLabel
			 */
			_selectLabelsRange: function($label) {
				if (!this.$lastSelectedLabel) {
					// no selected labels
					this._selectLabel($label, true);
					return;
				}

				var $labels = this._getLabels().filter(':visible')
					, startSelection = false
					, endSelection = false
					, currentLabel
					;

				for (var i = 0; i < $labels.length; i++) {
					currentLabel = $labels[i];

					if (currentLabel == $label[0] || currentLabel == this.$lastSelectedLabel[0]) {
						endSelection = startSelection; // не пора ли заканчивать
						startSelection = !startSelection; // пора начинать
					}

					if (startSelection || endSelection)
						$(currentLabel).addClass('compose__labels__label_selected');

					if (endSelection)
						break;
				}

				this.$lastSelectedLabel = $label;

				if ($.browser.safari) {
					this._prepareLabelsForCopy(this._getSelectedLabel());
				}
			},

			/*
			 * Может быть 1 лейбл, а может и много
			 */
			_getSelectedLabel: function() {
				return this._getLabels().filter('.compose__labels__label_selected');
			},

			_getPrevLabel: function($label) {
				var $prev = $label.prev('.js-compose-label:visible');

				if (!$prev.length) {
					// try to look futher
					$prev = $label
						.prevUntil('.js-compose-label:visible')
						.last().prev();
				}

				return $prev;
			},

			_getNextLabel: function($label) {
				var $next = $label.next('.js-compose-label:visible');

				if (!$next.length) {
					// try to look futher
					$next = $label
						.nextUntil('.js-compose-label:visible')
						.last().next();
				}
				return $next;
			},

			_prepareLabelsForCopy: function($labels) {
				var text = this._getText($labels);
				// отдаем фокус в ксерокс, браузер скопирует нужный текст из него
				this.$xerox
					.val(text)
					.focus()
					.select();
			},

			//****************** tooltips ***************

			/*
			 * Создает на основе саджестов блок, показываемый при наведении на лейблы
			 * Хранится прямо в лейбле
			 */
			_createTooltip: function($label) {
				if ($label.hasClass('compose__labels__label_invalid')) {
					// плохие лейблы не заслужили
					return;
				}

				var text = _getDataText($label);

				text = _normalizeContact(text);

				$label.data('tooltip', this.opts.template(null,text));
			},

			_showTooltip: function($label) {
				if (~this.opts.toolTipShowTimeout) {
					clearTimeout(this.opts.toolTipShowTimeout);
					this.opts.toolTipShowTimeout = -1;
				}

				if (this.opts.preventTooltips || this.suggest.isExpanded() || !$label.data('tooltip')) {
					// занято
					return;
				}

				this.opts.toolTipShowTimeout = setTimeout(function() {
					// показываем тултип с задержкой, чтобы избежать показа по случайному проводу мышки
					this.opts.toolTipShowTimeout = -1;

					var   block = this.suggest.block
						, list = this.suggest.list;

					list.empty();
					list.append($label.data('tooltip'))
						.show();

					this.opts.hasTooltip = true;

					// MAIL-19119 подписываемся на события только после установки флага, чтобы потом от них точно отписаться
					this.suggest.block
						.unbind('mouseenter.tooltip')
						.bind('mouseenter.tooltip', function(e) {
							// при наведении на тултип нужно его продолжать показывать
							this.suggest.block
								.stop(true)
								.css('opacity','1')
								.show();
							if ($.browser.msie && !this.$input.val())
								this.$input.blur();
						}.bind(this))
						.unbind('mouseleave.tooltip')
						.bind('mouseleave.tooltip', function(e) {
							this._hideTooltip();
						}.bind(this));

					// позиционирование блока
					var   offset = $label.offset()
						, width = (typeof this.opts.width == "string" || this.opts.width > 0) ? this.opts.width : Math.max($label.width(), 100)
						, widthNum = (typeof this.opts.width == "string")? parseInt(width) || parseInt(width.slice(0,-2)) : width
						, margin = this.opts.margin ? this.opts.margin : 7
						, max = this.$container.offset().left + this.$container.width() + this.opts.suggestMaxExcess
						, left = (offset.left + widthNum > max)? Math.max(max - widthNum, this.$container.offset().left) : offset.left;


					block
						.css({
							width: width,
							top: offset.top + $label.height() + margin,
							left: left,
							zIndex: 40000
						})
						.stop(true)
						.css('opacity','1')
						.fadeIn('fast');

				}.bind(this), 500);


			},

			_hideTooltip: function(immediately) {
				if (~this.opts.toolTipShowTimeout) {
					clearTimeout(this.opts.toolTipShowTimeout);
					this.opts.toolTipShowTimeout = -1;
				}
				if (this.opts.hasTooltip) {
					if (immediately) {
						this.opts.hasTooltip = false;
						this.suggest.block
							.stop(true, true)
							.unbind('mouseenter.tooltip')
							.unbind('mouseleave.tooltip')
							.hide();
					}
					else {
						this.suggest.block
							.fadeOut(function() {
								this.opts.hasTooltip = false;
								this.suggest.block
									.unbind('mouseenter.tooltip')
									.unbind('mouseleave.tooltip');
							}.bind(this));
					}
				}
			},

			//**************************** drag n drop ***************
			_initDragNDrop: function() {
				// вещь в себе
				var t = this
					, dropTarget = '.js-compose-labels'
					, draggableElement = '.js-compose-label'
					, namespace = '.drag'
					, namespaceDragStart = '.dragstart'
					, dragArea = $(document.body)
					, dragListener = $(document)
					, dragAreaBackground /* for ie and opera */
					, currentDraggedItem = null
					, IS_POINER_EVENTS_SUPPORT = (function() {
						//https://github.com/Modernizr/Modernizr/blob/master/feature-detects/css-pointerevents.js
						var element = document.createElement('x')
							, documentElement = document.documentElement
							, getComputedStyle = window.getComputedStyle
							, supports
							;

						if(!getComputedStyle || !('pointerEvents' in element.style)){
							return false;
						}

						element.style.pointerEvents = 'auto';
						element.style.pointerEvents = 'x';
						documentElement.appendChild(element);
						supports = getComputedStyle &&
							getComputedStyle(element, '').pointerEvents === 'auto';
						documentElement.removeChild(element);

						return !!supports;
					})()
					;

				if (window.$ScrollElement) {
					dragArea = $Scroll.normal ? $(document.body) : $ScrollElement;
				} else {
					jsCore.wait('patron.ready', function() {
						dragArea = $Scroll.normal ? $(document.body) : $ScrollElement;
					});
				}

				function startDrag($item) {
					var $clone = getClone($item);

					dragListener
						.bind('mousemove'+namespace, function(e) {
							e.preventDefault();
							var x = Math.min(e.pageX, $(window).width() - $clone.width() + ajs.scrollLeft());
							var y = Math.min(e.pageY, $(window).height() - $clone.height() + ajs.scrollTop());
							$clone.css({
								left: (x - $item.mousePosition.left + ajs.scrollLeft()) + 'px',
								top: (y - $item.mousePosition.top + ajs.scrollTop()) + 'px'
							});
						})
						.bind('mouseup'+namespace, function(e) {
							dragArea
								.css('pointer-events','auto');
							if (dragAreaBackground) {
								dragAreaBackground.remove();
							}
							e.preventDefault();
							dragListener
								.unbind('mousemove'+namespace)
								.unbind('mouseup'+namespace)
								.unbind('dragstart'+namespace+' drag'+namespace)
							;

							endDrag(getDropTarget(e),$item);
						})
						.bind('dragstart'+namespace+' drag'+namespace, function(e) {
							// prevent default dragndrop
							e.preventDefault();
						})
					;

					if (!IS_POINER_EVENTS_SUPPORT && !dragAreaBackground) {
						// create layer to prevent iframes from catching mouse
						dragAreaBackground = $('<div></div>')
							.css({
								position: 'absolute'
								, left: 0
								, top: 0
								, width: 100+'%'
								, height: 100+'%'
								, zIndex: 49999
								, 'background-color': '#000'
								, opacity: 0.001
							});
					}

					if(dragAreaBackground) {
						dragArea.append(dragAreaBackground);
					}

					// prevent selection and iframe catching in modern browsers
					dragArea
						.css('pointer-events','none')
						.append($clone);

					t._hideTooltip(true);

					return $clone;
				}

				function endDrag($target, $item) {
					currentDraggedItem.remove();
					currentDraggedItem = null;
					// check target:
					var container = $target.closest(dropTarget);
					if (!container.length || $.contains(container[0],$item[0])) {
						// вертай все назад!
						// todo анимация обратно
					}
					else {
						// на самом деле мы могли таскать не один итем а все выделенные
						// поэтому используем их
						$item = t._getSelectedLabel();
						t._removeLabel($item);
						container.composeLabels('widget').drop($item);
					}
				}

				function dragWait($item) {
					// wait for some motion
					dragListener
						.bind('mousemove'+namespaceDragStart, function(e) {
							e.preventDefault();
							var mousePosition = getMousePosition(e, $item)
								, delta = 3;
							if (   Math.abs(mousePosition.left - $item.mousePosition.left) > delta
								|| Math.abs(mousePosition.top - $item.mousePosition.top) > delta) {
								blurInputs(); // simulate mousedown;

								dragListener.unbind('mousemove'+namespaceDragStart);
								dragListener.unbind('mouseup'+namespaceDragStart);
								dragListener.unbind('selectstart'+namespaceDragStart);
								currentDraggedItem = startDrag($item);
							}
						})
						.bind('mouseup'+namespaceDragStart, function(e) {
							blurInputs(); // simulate mousedown;
							// cancel
							dragListener.unbind('mousemove'+namespaceDragStart);
							dragListener.unbind('mouseup'+namespaceDragStart);
							dragListener.unbind('selectstart'+namespaceDragStart);
						})
						.bind('selectstart'+namespaceDragStart, function(e) {

							e.preventDefault();
						})
					;
				}

				function getMousePosition(e, $item) {
					var offset = $item.offset();
					return {left: (e.pageX + ajs.scrollLeft() - offset.left || 0), top: (e.pageY + ajs.scrollTop() - offset.top || 0)};
				}

				/**
				 * @param $item - лейбл по которому кликнули
				 */
				function getClone($item) {
					var $clone;
					// если выделенных лейблов много, то надо их добавить
					// если только этот, то просто клоним его.

					// add current item to selection
					t._selectLabel($item, true);
					var selectedLabels = t._getSelectedLabel();
					if (selectedLabels.length > 1) {
						$clone = $('<div></div>')
							.width( $item.outerWidth() )
							.append(
								$item.clone()
									.addClass('compose__labels__drag')
									.css({
										top: 0
										, left: 0
										, 'z-index': 100
										, margin: 0
									})
							)
							.append(
								$('<div class="compose__labels__label compose__labels__drag"></div>')
									.css({
										height: '19px'
										, top: 2
										, left: 4
										, right: 4
										, 'z-index': 99
										, margin: 0
										, padding: 0
									})
								, (selectedLabels.length > 2) ?
									$('<div class="compose__labels__label compose__labels__drag"></div>')
										.css({
											height: '19px'
											, top: 4
											, left: 8
											, right: 8
											, 'z-index': 98
											, margin: 0
											, padding: 0
										})
									: null
							)
							.append(
								$('<div class="compose__labels__drag__cnt">'+selectedLabels.length+'</div>')
							)
							.attr('data-text',t._getText(selectedLabels));
					}
					else {
						// only 1 item - clone it
						$clone = $item.clone();
					}

					// css
					var offset = $item.offset();

					$clone.css({
						position: 'absolute'
						, left: offset.left + 'px'
						, top: offset.top + 'px'
						, zIndex: 50000
						, 'pointer-events': 'none'
					});

					return $clone;
				}

				function getDropTarget(e) {
					var $target = $(e.target);
					if (IS_POINER_EVENTS_SUPPORT) {
						$target = $(document.elementFromPoint(e.pageX - ($Scroll.normal? ajs.scrollLeft() : 0), e.pageY - ($Scroll.normal? ajs.scrollTop() : 0)));
					}
					else {
						Array.forEach(patron.ComposeLabelsInstances, function(item) {
							if (item.is(':visible')) {
								var offset = item.offset()
									, x = offset.left - ajs.scrollLeft()
									, y = offset.top - ajs.scrollTop()
									;

								if (   e.pageX >= x
									&& e.pageY >= y
									&& e.pageX <= x + item.width()
									&& e.pageY <= y + item.height() )
								{
									$target = item;
									return false;
								}
							}
						});
					}
					return $target;
				}

				function blurInputs() {
					Array.forEach(patron.ComposeLabelsInstances, function(item) {
						if (item.is(':visible')) {
							var widget = item.composeLabels('widget');
							if (widget)
								widget.blur();
						}
					});
				}

				// some public functions
				this.$container.data(this.namespace,
					Object.extend({}, t.$container.data(this.namespace),
						{
							drop: function($item) {
								// droptarget
								// todo анимация
								var $source = t.$source;
								$source.val($source.val() + ', '+t._getText($item));
								t._initLabels();
								t._prepareInput();
							},

							toggleDragNDrop: function(on) {
								t.opts.dragNDropEnabled = (on == true);
							}
						}));

				// listen to drag init
				this.$container.delegate(draggableElement, 'mousedown', function(e) {
					if ( patron.ComposeLabelsDnd
						&& t.opts.dragNDropEnabled && !currentDraggedItem
						&& e.which == 1 ) {

						e.preventDefault();

						var $item = $(e.target).closest(draggableElement);
						$item.mousePosition = getMousePosition(e, $item);
						dragWait($item);
					}
				});

				// список возможных таргетов для ие
				if (patron.ComposeLabelsInstances === undefined) {
					patron.ComposeLabelsInstances = [];
				}
				patron.ComposeLabelsInstances.push(this.$container);
			}
		})
	;

	jsLoader.loaded('{patron.ui}patron.ui.ComposeLabels');
});
