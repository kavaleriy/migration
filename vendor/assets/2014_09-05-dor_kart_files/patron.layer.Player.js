/**
 * @desc Модуль определяет на какой ресурс видео ссылка и если для такого ресурса есть плеер
 * то он инициализирует данный плеер
 *
 * @event ui-abstract-action:fishing:process
 */
define('{patron.v2.layer}patron.layer.Player', ['{jQuery}jquery', '{patron.build}Players'], function ($, players) {
	var LAYER_NAME = 'externalFlashPlayer',
		DEFAULT_OPTIONS = {
			width: 640,
			height: 360,
			allowVersion: '8',
			params: {allowscriptaccess: 'always', allowfullscreen: 'true'},
			vars: {},
			attrs: {},
			queryParams: {}
		};

	function init(_, uri) {
		var actives;

		function test(player) {
			return player.test(uri);
		}

		function exec(player) {

			Layer.get(LAYER_NAME, function (layer) {
				layer.$div.find('.js-link').attr('href', uri).text(uri);
				layer.$div.find('.js-name').innerHTML('&#160;');
				layer.mainDiv.$innerDiv.css('width', 670);

				player.create(uri, layer.$div, DEFAULT_OPTIONS, function () {
					layer.show();
					(new Image).src = '//rs.' + patron.SingleDomainName + '/d570141.gif?now=' + Date.now();
				});

				layer.one('hide', function () {
					layer.$div.find('.js-player').empty();
					layer.mainDiv.$innerDiv.css('width', '');
				});

			});

		}

		actives = Array.filter(players, test);
		Array.forEach(actives, exec);

		return actives.length > 0;
	}

	$(document).bind('ui-abstract-action:fishing:process', init);
});