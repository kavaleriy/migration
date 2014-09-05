jsLoader.require([
	'{patron.utils}patron.Utils',
	'{patron}patron.API',
	'{patron.utils}patron.Utils.Search'
], function (){
	"use strict";

	var data;
	var contactsFromAPI;
	var searchIndex;
	var emailsMap;
	var lastChange = 0;
	var $window = $(window);
	var NEED_LOADING_CONTACTS_VIA_API = patron.IsPddAccount || patron.IsCorpUser; // MAIL-13817, MAIL-19939

	function updateCache() {
		lastChange++;

		if( searchIndex === void 0 ) {
			var options = Object.extend({}, $.Autocompleter.defaults, {
				data: data,
				'multiple': true,
				'matchContains': 'word',
				'cacheLength': 1000,
				'multipleSeparatorPattern': /(?:\s)?[,;](?:\s)?/g,
				'rawList' : true
			});

			options.formatMatch = options.formatMatch || options.formatItem;

			searchIndex = $.Autocompleter.Cache(options);
			searchIndex.populate();
		}
	}

	function _mapRowValue(row) {
		return row.value;
	}

	var facadeObject = {
		find: function(query) {
//				return cache[sortBy].searchIndex.find(query);
			return Array.map(searchIndex.load(query), _mapRowValue);
		},

		all: function() {
			return data;
		},

		existsEmail: function(email) {
			return emailsMap[email] !== undefined;
		},


		tokenizer: function(str) {
			return patron.Utils.Search.queryToTokens(str.replace(/[<>]/g, ''));
		}
	};

	function getFacade(callback) {
		if( $.isFunction(callback) ) {
			updateCache();
			callback(facadeObject);
		}
	}

	function isLoaded() {
		return Array.isArray(data);
	}

	function apiContactToPlainContacts(array, contact, emailsMap) {
		var contactName = contact.name
			, emails = contact.emails
			, email
		;

		contactName = contactName && ((contactName.first || "") + " " + (contactName.last || "")).trim() || contact.nick || "";

		if( emails ) {
			for(var i = 0, l = emails.length ; i < l ; i++ ) {
				email = emails[i];
				if( !(email in emailsMap) ) {
					emailsMap[email] = null;
					array.push(contactName ? contactName + " <" + email + ">" : email)
				}
			}
		}
	}

	function combineDataAndCreateEmailsMap(data, apiData) {
		emailsMap = {};

		var item, i, l;

		if( Array.isArray(data) ) {
			for( i = 0, l = data.length ; i < l ; i++ ) {
				item = data[i];

				if( !item ) {
					continue;
				}

				if( item.charAt(0) == '"' ) {
					item = item.replace(/"/g, '');
				}

				if( item.indexOf('<') !== -1 ) {
					item = item.match(/<([^>]+)>/);
					if (item) {
						item = item[1];
					}
				}

				if( !item ) {
					continue;
				}

				emailsMap[item] = null;
			}
		}
		else {
			data = [];
		}

		if( Array.isArray(apiData) ) {
			for( i = 0, l = apiData.length ; i < l ; i++ ) {
				apiContactToPlainContacts(data, apiData[i], emailsMap);
			}
		}

		return data;
	}

	function loadData(afterLoad) {
		patron.Utils.getAddressBook(function(firstParam, response) {
			data = combineDataAndCreateEmailsMap(response, contactsFromAPI);

			contactsFromAPI = null;//We don't need this cache any more

			if( $.isFunction(afterLoad) ) {
				afterLoad();
			}
		});
	}

	patron.Utils.Addressbook = function(callback) {
		if( isLoaded() ) {
			getFacade(callback);
		}
		else {
			// mail-13817
			// Subscribe on API contacts changes
			if( NEED_LOADING_CONTACTS_VIA_API ) {
				getContacts(function (error, contacts) {
					if( !error ) {
						contactsFromAPI = contacts;
						if( isLoaded() ) {
							loadData();
							searchIndex = void 0;
							updateCache();
						}
						$window.triggerHandler('addressbook:update');
					}
				}, {subscribe: true});
			}

			loadData(getFacade.bind(null, callback));
		}
	};

	patron.Utils.Addressbook.getLastChange = function() {
		return lastChange;
	};


	$window.bind("abjs:updated", function() {//MAIL-14676
		if( isLoaded() ) {
			loadData();
			searchIndex = void 0;
			updateCache();
			$window.triggerHandler('addressbook:update');
		}
	});

	var getContacts = NEED_LOADING_CONTACTS_VIA_API && (function () {// mail-13817
		var CONTACTS_FORMAT_VERSION = 2
			, contactsCache
			, _isInAjax
			, updateCallbacks = []
			, Contacts = {}
			, API_URL = "ab/contacts/common"
			, API_KEY = patron.useremail + "|" + API_URL
		;

		function removeContactsFromLocalStore() {
			store.remove(API_KEY + ":version");
			store.remove(API_KEY);
		}

		function getContactsFromLocalStore() {
			var storedVersion = store.get(API_KEY + ":version");

			if( storedVersion == null ) {
				return null;
			}

			if( storedVersion != CONTACTS_FORMAT_VERSION ) {
				removeContactsFromLocalStore();
			}

			return store.get(API_KEY);
		}

		function saveContactsToLocalStore(contacts) {
			removeUnnecessaryFields(contacts);
			try {
				store.set(API_KEY + ":version", CONTACTS_FORMAT_VERSION);
				store.set(API_KEY, contacts);
			}
			catch(e) {}
		}

		function removeUnnecessaryFields(contacts) {
			var data = contacts.body;
			var ALLOWED_FIELDS = {
				"name": null
				, "nick": null
				, "emails": null
				, "id": null
			};

			Array.forEach(data, function(contact) {
				for(var field in contact) if( !(field in ALLOWED_FIELDS) ) {
					delete contact[field];
				}
			});
		}

		function responseNewContacts( response ) {
			var data = {};

			data.body = response.body;
			data.last_modified = response.last_modified;

			saveContactsToLocalStore(data);

			return data;
		}

		function _reduce_arrayToObject(value, item) {
			value[item.id] = item;

			return value;
		}

		function responseContactsDiff( previousContacts, response ) {
			var data = previousContacts.body
				, deleted = response.body.deleted
				, modified = response.body.modified
			;

			if( deleted && deleted.length ) {
				deleted = Array.reduce(deleted, _reduce_arrayToObject, {});
			}
			else {
				deleted = null
			}
			if( modified && modified.length ) {
				modified = Array.reduce(modified, _reduce_arrayToObject, {});
			}
			else {
				modified = null
			}

			if( deleted || modified ) {
				data = Array.reduce(data, function(value, item) {
					if( deleted && item.id in deleted ) {

					}
					else if( modified && item.id in modified ) {
						value.push(modified[item.id]);
					}
					else {
						value.push(item);
					}

					return value;
				}, []);
			}
			else {
				return false;
			}

			previousContacts.body = data;
			data = previousContacts;
			data.last_modified = response.last_modified;

			saveContactsToLocalStore(data);

			deleted = modified = null;

			return data;
		}

		function _clearContactsCache() {
			if( _clearContactsCache.tid ) {
				clearTimeout(_clearContactsCache.tid);
			}

			// Cache live only two minutes
			_clearContactsCache.tid = setTimeout(function() {
				_clearContactsCache.tid = contactsCache = null;
			}, 120000);
		}

		function apiResponse(response) {
			var data
				, error = null
				, callback
			;

			if( response.status == "200" ) {
				if( Array.isArray(response.body) ) {
					// In this case last_modified is too old, so server shipping a full contacts list but not a diff
					data = responseNewContacts(response);

					//console.log("new contacts")
				}
				else if( Object.isObject(response.body) && contactsCache ) {
					data = responseContactsDiff(contactsCache, response);

					//console.log("diff contacts")
				}
				else {
					ajs.log(error = "Something went wrong during Contacts loading");
				}
			}
			else {
				ajs.log(error = "Can't load Contacts")
			}

			if( !error && data !== false ) {
				contactsCache = data;

				for(var i = 0, len = updateCallbacks.length ; i < len ; i++ ) {
					callback = updateCallbacks[i];

					callback.call(null, error, contactsCache.body);
					if( callback.once ) {
						// Delete non-subscribing callbacks
						updateCallbacks = updateCallbacks.splice(1, i);
						// decrement counter and cached array length
						i--;
						len--;
					}
				}
			}
		}

		/**
		 *
		 * @public
		 * @param {function(string: error, Object: data)} fn
		 * @param {Object} options
		 */
		return function (callback, options) {
			var fnIsFunc = $.isFunction(callback)
				, error = null
				, data
				, url
				, needSubscribe
			;

			if( !contactsCache ) {
				// try get cache from localStorage
				contactsCache = getContactsFromLocalStore();
			}

			if( contactsCache ) {
				// set timer to cleanup cache after two minutes
				_clearContactsCache();
			}

			if( fnIsFunc ) {
				if( options ) {
					if( !(needSubscribe = options.subscribe) ) {
						callback.once = true;
					}
					if( options.asObjects ) {
						callback.asObjects = true;
					}
				}

				if( !contactsCache || options.subscribe ) {
					// No localStorage stored data
					needSubscribe = true;
				}
				if( contactsCache ) {
					// Has localStorage stored data - call callback immediately
					callback(error, contactsCache.body);

					if( !options.subscribe ) {
						needSubscribe = false;
					}
				}

				if( needSubscribe ) {
					updateCallbacks.push(callback);
				}
			}

			if( !_isInAjax ) {
				// First API contacts request - send request to server
				_isInAjax = true;

				url = API_URL;

				if( contactsCache ) {
					// Has localStorage stored data - send diff request
					data = {
						last_modified: contactsCache.last_modified
					};
					url += '/diff';
				}

				patron.API({
					url: url,
					data: data,
					complete: apiResponse
				});
			}
		};
	})();

	jsLoader.loaded('{patron.utils}patron.Utils.Addressbook');
});
