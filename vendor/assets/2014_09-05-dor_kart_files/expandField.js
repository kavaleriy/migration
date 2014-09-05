jsLoader.require('{jQuery}jquery', function () {

	(function($) {

		var fields = [];

		$.fn.extend({
			expandField: function(options) {
				return this.each(function() {
					new $.ExpandField(this, options);
				});
			}
		});

		$.ExpandField = function(input, options) {
			// not support input.scrollHeight
			if ($.browser.opera && parseFloat($.browser.version) < 9.6)
				return;

			options = $.extend({}, $.ExpandField.defaults, options);

			var $input = $(input),
				minHeight,
				maxHeight,
				scrollHeight,
				indent,
				height,
				isKeyDownDefaultPrevented,
				$parent,
				clone,
				$clone;

			if ($input.is('input')) {
				$input.replaceWith($input = $('<textarea/>')
					.attr({
						'id': $input.attr('id'),
						'name': $input.attr('name'),
						'tabindex': $input.attr('tabindex'),
						'spellcheck': $input.attr('spellcheck'),
						'class': $input.attr('class'),
						'style': $input.attr('style'),
						'autofocus': $input.attr('autofocus')
					}).val($input.val()));

				input = $input[0];

				if( $input.attr('autofocus') ) {
					input.setAttribute('autofocus', 'true');
				}
			}

			$input.bind('keyup change keypress keydown focus', init);

			function init() {
				$input.bind('clearPreviousValue', fieldChange);

				$input
					.unbind('keyup change keypress keydown focus', init)
					.bind({
						'keyup change focus': fieldChange,
						'keypress': fieldKeyPress,
						'keydown': fieldKeyDown
					});

				$parent = $input.parent();

				$clone = $('<textarea/>')
					.attr({
						'tabindex': -1,
						'class': $input.attr('class'),
						'style': $input.attr('style')
					})
					.css({
						overflow: 'hidden',
						position: 'absolute',
						marginLeft: -10000,
						marginTop: -10000
					})
					.appendTo(options.parent || $parent);

				if (options.fixedWidth) {
					$clone.css('width', $input.width());
				}

				clone = $clone[0];

				minHeight = clone.offsetHeight;
				indent = minHeight - clone.scrollHeight;

				if ($.browser.msie && parseInt($.browser.version) < 8) {
					minHeight = clone.scrollHeight;
					indent = minHeight - clone.clientHeight;
					clone.style.position = 'relative';
				}

				if (options.rows > 0) {
					maxHeight = (options.rows * 16) + (minHeight - $clone.height());
				}

				if (input.value && $input.is(':visible')) $input.change();

				updateFieldHeight();
			}

			function fieldKeyDown(evt) {
				isKeyDownDefaultPrevented = evt.isDefaultPrevented();
			}

			function fieldKeyPress(evt) {
				if (!evt.ctrlKey && evt.keyCode == 13 && !isKeyDownDefaultPrevented && !evt.isDefaultPrevented()) {
					clone.value = input.value + '\n';
					updateFieldHeight();
				}
			}

			function fieldChange() {
				clone.value = input.value;
				updateFieldHeight();
			}

			function updateFieldHeight() {
				clone.style.height = clone.offsetHeight + 'px';
				scrollHeight = clone.scrollHeight + indent;
				if (maxHeight) {
					height = Math.max(minHeight, Math.min(maxHeight, scrollHeight));
					if ($input.hasClass('form__field')) {
						$input.toggleClass('form__field_expandable_expanded', scrollHeight > maxHeight);
					}
				}
				else {
					height = Math.max(minHeight, scrollHeight);
				}
				input.style.height = height + 'px';
//				$parent.toggleClass('j-expandField_scroll', scrollHeight > maxHeight);
			}

			var r = {
				getInput: function() {
					return $input;
				}
			};

			fields.push(r);

			if (input.value && $input.is(':visible')) init();

			return r;
		};

		$.ExpandField.defaults = {
			rows: -1,
			fixedWidth: true
		};

		/**
		$(window).resize(function() {
			setTimeout(function() {
				for (var i=0, l=fields.length; i<l; i++) {
					var $input = fields[i].getInput();
					if ($input.is(':visible'))
						$input.change();
				}
			}, 0);
		});
		/**/

	})(jQuery);

	jsLoader.loaded('{jQuery}expandField');
});

