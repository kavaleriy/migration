jsLoader.require([
	  '{patron.utils}patron.Utils'
	, '{festTemplate}blocks/letter/letter__inline-image__wrapper'
], function (){
	(function (){

		var
			  timer
			, wrapper_geometry = [44, 44]
			, wrapper_min_geometry = [300, 600]
		;

		var Utils = {

			checkEvent: function (evt) {

				var
					  $target = $(evt.target)
					, $container = Utils.getNode($target)
					, $wrapper = Utils.getWrapper($target, $container)
				;

				clearTimeout(timer);

				if (evt.type === 'mouseenter') {

					if ($container) {

						var geometry = [$container[0].offsetWidth, $container[0].offsetHeight];

						if (Math.min(geometry[0], geometry[1]) < wrapper_min_geometry[0] && Math.max(geometry[0], geometry[1]) < wrapper_min_geometry[1]) {
							return;
						}

						var position = $container.position();

						$wrapper.css({
							  width: wrapper_geometry[0]
							, height: wrapper_geometry[1]
							, left: position.left + geometry[0] - wrapper_geometry[0]
							, top: position.top
						}).display(1);
					}

				} else {

					timer = setTimeout(function () {
						$wrapper.display(0);
					}, 1);
				}
			},

			getNode: function ($target) {
				return $target.is('img') ? $target : null;
			},

			getWrapper: function ($target, $container) {

				var $wrapper;

				if ($container) {

					var id = $container[0].__inlineWrapperId || ($container[0].__inlineWrapperId = 'inlineimage' + ajs.uniqId());

					$wrapper = $('#' + id);

					if (!$wrapper[0]) {

						$wrapper = $($.fest('blocks/letter/letter__inline-image__wrapper', {
							  src: $container[0].src
							, title: Lang.get('letter.inline_image_wrapper_link_text')
						})).attr('id', id).display(0);

						$container.closest('.js-body').append($wrapper);
					}

				} else {
					$wrapper = $target.closest('.js-b-letter__inline-image__wrapper');
				}

				return $wrapper;
			}
		};

		// @export
		patron.Utils.InlineImage = Utils;
	})();

	jsLoader.loaded('{patron.utils}patron.Utils.InlineImage');
});
