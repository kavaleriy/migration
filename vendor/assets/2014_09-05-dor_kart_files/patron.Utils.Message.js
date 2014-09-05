jsLoader.require('{patron.utils}patron.Utils', function (){
	/**
	 * @class	patron.Utils.Message
	 */
	patron.Utils.Message = {
		callToPhone: function (number){
			try {
				return	this.getWebAgentAPI().callTo(number);
			} catch (er){}
		},


		getWebAgentAPI: function (){
			/** @namespace window.WebAgent */
			return	window.WebAgent && WebAgent.API && WebAgent.API && WebAgent.API;
		},


		canCallToPhone: function (){
			var api = this.getWebAgentAPI();
			/** @namespace api.callTo -- WebAgent.API.callTo */
			/** @namespace patron.WebAgentEnabled  -- agent enambled */
			/** @namespace patron.WebAgentCall -- call api avaible */
			return	patron.WebAgentCall && patron.WebAgentEnabled && !!(api && api.callTo);
		},

		highlightPhoneNumbers: function ($body) {
			if (patron.Utils.Message.canCallToPhone()) {
				$body.find('.js-phone-number').addClass('highlight-phone').attr('title', Lang.get('readmsg.phone.highlight'));
			}
		},

		prepareQuotes: function ($body) {
			$body.find('.mail-quote-collapse').prepend(
				$('<div>')
					.addClass('mail-quote-collapse__button')
					.html(Lang.get('readmsg.quote.show'))
			);
		}
	};


	jsLoader.loaded('{patron.utils}patron.Utils.Message');
});
