jsLoader.require([
	'{jQuery}autocomplete',
	'{jQuery}expandField'
], function()
{
	patron.readMsgTrash = {};

	var errors = {
		'ENCRYPTED': Lang.get('readmsg.protected_archive'),
		'BROKEN': Lang.get('readmsg.broken_archive')
	};

	(function (w)
	{
		var foldersHashmap = {};

		w.loadZipIncludes = function(R, scope)
		{
			if( R && R[1] == 'OK' )
			{
				if( R[2] && (R[2][0] != null) )
				{
					// < by RubaXa
					var
						  partId	= R[2][0]
						, files		= R[2][1]
						, fSt		= ['filesShow', 'filesHide']
						, $Box		= $(scope).closest('.'+fSt[0])
					;

					if( (files == 'ENCRYPTED') || (files == 'BROKEN') )
					{
						$Box.find('.fileShow').remove();
						$Box.find('.js-error').html(errors[files]).display('');
					}
					else
					{
						jQuery( buildArchiveTree(partId, files) ).insertBefore( $('.js-info', $Box) );

						// Toggle
						$Box
							.removeClass(fSt[0]).addClass(fSt[1])
							.delegate('.i-f,.fileHide,.fileShow', 'click', function () {
								var $P = jQuery(this).closest('.'+fSt.join(',.'));
								var open = $P.hasClass(fSt[1]);
								var loaded = !!$P.find('.attIns').length;
								if (!open && !loaded) {
									var folderData = foldersHashmap[$P.attr("data-key")];
									$P.find('.sub').html(buildArchiveTree(folderData.partId, folderData.files));
								}
								$P.removeClass(fSt[+open]).addClass(fSt[+!open]);
								return	false;
							});
					}
					Counter.d(1788062);
					// end >
				}
			}
		};


		w.buildArchiveTree = function(partId, files)
		{
			var str = [''], i = 1, name;

			for( name in files )
			{
				var arSub = files[name], isOpen = false, url;

				if( arSub.constructor === Object )
				{
					//isOpen = isOpenFolder(arSub);
					var key = ajs.MD5('' + Math.random());
					foldersHashmap[key] = {
						partId: partId,
						files: arSub
					};
					str[i++] = tplParse(getAttachTpl(), {
								  tag:		'b'
								, name:		ajs.Html.escape(name)
								, icon:		'f'
								, links:	'<a class="fileShow" href="">' + Lang.get('readmsg.show_folder') + '</a><a class="fileHide" href="">' + Lang.get('readmsg.hide_folder') + '</a>'
								, classes:	isOpen ? 'filesHide' : 'filesShow'
								, key:		key
							});
				}
				else
				{
					url	= '/cgi-bin/getattach?mode=attachment-zip&id=' + partId + '&file=' + encodeURIComponent(arSub[2]);

					var linksHtml, tag = 'span', col = 'black';
					if( arSub[1] )		linksHtml = Lang.get('readmsg.protected');
					else if( arSub[3] )	linksHtml = Lang.get('readmsg.part');
					else if( arSub[0] < 32*Math.MB )
					{
						tag = 'a';
						col = '';
						linksHtml = '<a href="'+ url +'">' + Lang.get('readmsg.download') + '</a>';
					}


					str[i++] = tplParse(getAttachTpl(), {
									  tag:		tag
									, href:		url
									, name:		ajs.Html.escape(name.replace(/\.[^.]+$/, ''))
									, ext:		ajs.Html.escape(name.replace(/.+?(\.[^.]+)$/, '$1'))
									, icon:		getFileIcon(name)
									, size:		getFileSize(arSub[0])+' &nbsp;'
									, color:	col
									, links:	linksHtml
									, classes:	'filesHide'
								});
				}
				//debug.log(indent + name);
			}

			if( i > 1 )
			{
				str[0]		= '<div class="attIns"><b class="sortD attUg"></b>';
				str[i++]	= '</div>';
			}

			return	str.join('');

			function isOpenFolder(entry)
			{
				for( var name in entry )
				{
					if( entry[name][0] )
						return	false;
				}
				return	true;
			}

			function getFileIcon(file)
			{
				return	(file.match(/\.(\w+)$/)||[])[1];
			}

			function getFileSize(size)
			{
				if( size < 1024 ) return String.num(size, [Lang.get('Size').bytes, Lang.get('Size').bytesPl], '&nbsp;');
				else if( size < 1024*1024 ) return Math.round(size/1024)+'&nbsp;' + Lang.get('Size').kb;
				else return Math.round(size/1024/1024)+'&nbsp;' + Lang.get('Size').mb;
			}
		}


		function tplParse(tpl, values, parser)
		{
			return	tpl.replace(/\{\{(\w+)\}\}/ig, function (a, name)
			{
				return	values[name]||'';
			});
		}


		function getAttachTpl()
		{
			var $tpl = $('#tpl-Attach');
			return	$tpl.val() || $tpl.html();
		}
		// END: Archive


		// TranslateForm
		w.open_tr = function (elm){
			var posX = 50, posY = 50, link = $('#TrURL')[0];

			if( link ){
				var SpellWin = w.open(link.href, "Translate",
					"menubar=no,resizable=yes,width=750,height=500,toolbar=no,focus=yes,scrollbars=no," +
						"screenX=" + posX + ",screenY=" + posY + ",left=" + posX + ",top=" + posY);
				SpellWin.focus();
			}
		};

		// Answer Link
		w.confirm_answ = function()
		{
			var I = $('FORM[name=FastAnswer] TEXTAREA[name=Body]');
			if( $.trim(I.val()) != "" )
			{
				return	confirm(Lang.get('trash.confirm.go_to_sentmsg'))
			}
			else
				return	true;
		};

		// Remove link
		w.del_confirm = function(link)
		{
			return confirm(Lang.get('trash.confirm.delete_msg'));
		};

		// Show AddressBook
		w.sw = function(addto)
		{
			var posX = (screen.width - 700) / 2;
			var posY = (screen.height - 500) / 2;
			w.open("addressbook?template=quicklist.tmpl&addto="+addto, "sw","width=700,height=500,resizable=yes,scrollbars=yes,top="+posY+",left="+posX);
		};
	})(window);



	/**
	 * AudioPlayer
	 */
	(function (w)
	{
		var
			  volume	= 70
			, curPlayer, play, players
			, _ids		= 0
			, _iPlayers = function ()
			{
				_ids = [];
				$('.js-attachAudio').each(function (){ if( !this.id ) this.id = jsCore.getUniqId(); _ids.push(this.id); });
			}
		;

		var playerUrl = '//img.' + patron.staticDomainName + '/mail/ru/images/audio_player/player_20111209.swf';
		if (window.IS_LOCAL) {
			playerUrl = 'http://v.demidov.boom.corp.mail.ru/audio_player/player2.swf?r=' + Math.random();
		}

		Object.extend(w, {
			loadPlayer: function (cont, tpl, elm)
			{	_iPlayers(); // init
				var $Elm = jQuery(elm).closest('.js-attachAudio'), pId = $Elm.attr('id'), $X;

				if( audioPlayer.get(pId) )
				{
					if( pId == curPlayer ) audioPlayer.toggle();
					else
					{
						audioPlayer.set(pId);
						audioPlayer.play();
					}
				}
				else if( curPlayer != pId )
				{
					audioPlayer.set(pId);
					if( curPlayer == pId )
					{
						$X = $Elm.closest('.filesShow');

						var file = {
							  time:		''
							, mid:		'0'
							, vol:		volume
							, file:		$X.attr('data-url') || ''
							, title:	$X.attr('data-title') || ''
							, uid:		$X.attr('uid') || ''
							, linkshow:	'1'
							, linkurl:	'http://my.mail.ru/cgi-bin/my/audiotrack%3Ffile='
						};

						$.each(file, function (k, v) {
							file[k] = encodeURIComponent(v);
						});

						players[pId] = SWF.build( $('<div class="audioContainer"/>').insertBefore( $('.js-info', $X) ),
						{
							params: {wmode: 'opaque'},
							movie:	{
										  url:		playerUrl
										, height:	30
									},
							vars:		file
						});
						$X.find('.audioContainerID').hide();
					}
				}
			},

			audioPlayer:
			{
				reset: function ()
				{
					play		=
					curPlayer	= 0;
					players		= {};
				},

				_ico: function (n)
				{
					$('#' + curPlayer).find('.i-spI').removeClass('i-mp3Play i-mp3Pause').addClass('i-mp3' + n);
				},

				set: function (id)
				{
					if( curPlayer ) this.pause();
					play		= 1;
					curPlayer	= id;
					this._ico('Pause');
				},

				get: function (id) {
					var flash = players[id || curPlayer];
					if (flash && !flash.offsetHeight) {
						flash = null;
					}
					return flash;
				},
				play: function ()
				{
					play = 1;
					this._ico('Pause');
					this.get() && this.get().resume();
				},
				pause: function ()
				{
					play = 0;
					this._ico('Play');
					this.get() && this.get().pause();
				},
				toggle: function ()
				{
					this[!play ? 'play' : 'pause']();
				}
			}, // audioPlayer;

			unPause: function (){ debug.log('unPause') },
			setvolume: function (v){ volume = parseInt(v); },
			endMusic: function ()
			{
				audioPlayer._ico('Play');
				var P	= audioPlayer.get(curPlayer);
				if( P )
				{
					P.seek(0);
					P.pause();
				}
				if( _ids.length > 1 )
				{
					var idx	= Array.indexOf(_ids, curPlayer);
					var id	= (_ids[idx+1] || _ids[0]);
					loadPlayer(null, null, '#'+id);
				}
			}

		});


		audioPlayer.reset();
	})(window);

	// Fast answer form
	(function ($)
	{
		var sl = 0, ava, plus = !!document.cookie.match('f_ans=plus'), $SL, $Ava, $I, $B, $Submit, $Form;

		patron.avaCNT = function (){ if( ava ) (new Image).src = '//rs.' + patron.SingleDomainName + '/d347460.gif?rnd='+Math.random(); };
		patron.initFastAnswer = function(reInit)
		{
			if( reInit && ($SL !== undef) )
			{
				sl	= 0;
				$SL.css('display', 'none');
				$('#BBC_tr :input').val('');
				$('#cit_ar,#all_tab TR[id*=_]').css('display', 'none');
				$Submit.attr('disabled', false);
			}
			else
			{
				$SL = $('#show_link');
				$Ava = $('#avaToggle');
				$I = $('#hide_show_all');
				$Form = $('form[name=FastAnswer]');
				$B = $('textarea[name=Body]', $Form);
				$Submit = $Form.find(':submit');

				$('.mlr-snd_input_expand input', $Form).expandField();

				var $auFields = $('.mlr-snd_acitxt[name]', $Form);

				// Show fields
				$B.unbind('click')
					.click(function ()
					{
						if( !sl )
						{
							$Submit.attr('disabled', false);
							if( this.rows != 8 ) this.rows = 8;
							sl = 1;
							$SL.css('display', '');
							$('#To_tr,#cit_ar').css('display', '');
							var pixImg = new Image();
							pixImg.src = "//mail.ru/zero?cln=950A";

							$.Autocompleter.abjs($auFields);
						}
					})
					.bind($.browser.opera ? 'keypress' : 'keydown', function (e) {
						if (e.ctrlKey || e.metaKey) {
							var keyCode = e.keyCode || e.which;
							if (keyCode == jsEvent.Key.enter) {
								e.preventDefault();
								$Form.submit();
							}
						}
					})
				;

				// Show all fields
				$SL.unbind('click').click(function ()
				{
					sl = 2;
					$SL.css('display', 'none');
					$('#all_tab TR').css('display', '');

					var pixImg = new Image();
					pixImg.src = "//mail.ru/zero?cln=950B";

					// Return focus
					$B.focus();

					return	false;
				});

				// +/-
				$('#hide_show_all,#shlop_link').unbind('click').click(function ()
				{
					plus =! plus;
					$I.toggleClass('iShowAns', !plus).toggleClass('iHideAns', plus);
					$('#all_tab,#shlop_com').css('display', plus ? 'none' : '');
					$('#shlop_link').css('display', !plus ? 'none' : '');
					if( sl == 1 ) $SL.css('display', plus ? 'none' : '');
					jsCookie.set('f_ans', plus ? 'plus' : 'minus');
					return	false;
				});

				// Quoting
				$('#cit_ar').click(function ()
				{
					var text	= (window.currentMessage || patron.Messages.get(patron.messageId)).let_body_plain;
					$B[0].value	+= "\n\n\n"+String.trim( text );
					$B.focus();
					if( $B[0].setSelectionRange ) $B[0].setSelectionRange(0, 0);
					return	false;
				});

				function captchaCheckSuccess(evt, code)
				{
					$('input[name="security_image_word"]', $Form).val(code || '');
					this.hide();
					$Form.trigger('submit');
				}

				function showCaptcha(verified)
				{
					if (verified)
					{
						$R('{patron'+'.compose}patron.Compose.Captcha', $.proxy(function()
						{
							var t = this, captcha = t.captcha;
							if (!captcha)
							{
								captcha = t.captcha = new patron.Compose.Captcha();
								captcha.bind('checkSuccess', {'scope': t}, captchaCheckSuccess);
							}
							captcha.show();
						}, this));
					}
					else
					{
						$R('{patron'+'.compose}patron.Compose.CaptchaCombine', $.proxy(function()
						{
							var t = this, captcha = t.captchaVerified;
							if (!captcha)
							{
								captcha = t.captchaVerified = new patron.Compose.CaptchaCombine();
								captcha.bind('verifySuccess', {'scope': t}, captchaCheckSuccess);
							}
							captcha.show();
						}, this));
					}
				}

				// Form
				$Form.submit(function ()
				{
					if( !$.trim($B.val()).length )
					{
						alert(Lang.get('trash.error.empty_msg'));
						return	false;
					}
					else if( !/@/i.test( $('TEXTAREA[name=To]', this).val() ) )
					{
						alert(Lang.get('trash.error.empty_to'));
						return	false;
					}
					else if( patron.Ajax )
					{
						$Submit.attr('disabled', true);
						patron.Ajax.post('/compose/?ajax_call=1&func_name=send&send=1', $(this).serialize().replace(/(old_charset=)[^&]+/i, '$1utf-8'), function (R)
						{
							$Submit.attr('disabled', false);
							var d = R.getData();
							if (d.ShowSecurityImage)
							{
								showCaptcha(d.AccountVerified);
							}
							else if (d.Error)
							{
								jsView.get('sendmsgok').preload( d.Error );
								jsHistory.set( 'sendmsgok?'+Date.now() );
							}
							else
							{
								$B.val('');
								jsView.get('sendmsgok').preload( d.Ok );
								jsHistory.set( d.redir_url );
							}
						});
						return	false;
					}
				});


				// Toggle avatar
				ava = $Ava.hasClass('iAvaHide');
				$Ava.click(function ()
				{
					ava =! ava;
					$Ava.toggleClass('iAvaHide', ava).toggleClass('iAvaShow', !ava);
					$('#avatar-show').css('display', ava ? '' : 'none');
					$.post('/cgi-bin/ajax_avatarstat?ajax_call=1&func_name=ajax_set_stat_avatar&data=["'+(+!ava)+'"]');
					return	false;
				});


				$auFields.each(function(){ $.Autocompleter.addressbook(this); });
			}
		};

		patron.readMsgTrash.cfm =
		{
			cfm: function(link)
			{
				var txt = link.href.replace(/http:\/\/([A-Za-z0-9_\-\.]+)[^>]*/ig , "$1");
				return	confirm(Lang.get('trash.confirm.open_site').replace('%s', txt));
			},

			cfmn: function(link, url)
			{
				var txt = link.href.replace(/http:\/\/([A-Za-z0-9_\-\.]+)[^>]*/ig , "$1");
				return	confirm(Lang.get('trash.confirm.open_site').replace('%s', txt));
			},

			cfmf: function(url)
			{
				return confirm(Lang.get('trash.confirm.open_site').replace('%s', url));
			}
		};
		Object.extend(window, patron.readMsgTrash.cfm);

	})(jQuery);



	jsLoader.loaded('{patron}patron.readMsg.trash');
});
