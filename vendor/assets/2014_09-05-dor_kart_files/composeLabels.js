jsLoader.require([
	'{patron.ui}patron.ui.ComposeLabels'
], function() {
	(function($) {
		var namespace = 'composeLabels' + $.expando;

		$.fn.composeLabels = function(param) {
			if (param === 'widget') {
				return this.data(namespace);
			}
			else {
				return this.each(function() {
					var composeLabels = new patron.ui.ComposeLabels(this, namespace, param);
				})
			}
		};

	})(jQuery);

	jsLoader.loaded('{jQuery}composeLabels');
});
