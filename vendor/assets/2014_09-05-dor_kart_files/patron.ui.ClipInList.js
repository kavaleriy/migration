/**
 * @object	patron.ui.ClipInList
 * @author	RubaXa	<trash@rubaxa.org>
 */

jsLoader.require([
	  '{patron.v2}utils/docs'
	, '{patron.v2}utils/apf'
	, '{jQuery}extensions'
	, '{festTemplate}blocks/messagelist/messagelist__dropdown-clip'
], function (docs, apf) {

	var _cssAttach	= '.js-attach';

	patron.ui.ClipInList = {
	// @private
		_id:		'0',	// current Id
		_pId:		0,	// prev Id
		_tId:		0,	// timeout id
		_items:		{},
		_bind:		0,
		_overDelay:	800,

		_loaded:	function (id, R, status){
			var I = this.get(id);

			if( (status == 'success') && (R[1] == 'OK') && (R[2] != '') ){

				var $Layer = $(R[2])
								.attr('id', I.listId)
								.attr('data-id', id)
								.addClass('js-clip-in-list-layer')

					, pUrl = $Layer.attr('previewUrl')
				;

				$Layer
					.find('.js-attachePicture')
					.each(function (){ new patron.ui.ClipInList.Preview(this.parentNode, pUrl); })
				;

				I.$Layer = $Layer;
				I.status = 2;
				this.redraw();
			}
			else {
				I.status = 0;
			}
			$('#'+I.id).removeClass('iAttachLoading');
		},

		_toggle: function (id, show)
		{
			var I = this.get( id ), L, $M;

			if( I.status == 2 )
			{
				I.$Layer.appendTo(this.$container);

				L	= (document.getElementById(I.listId) || { style: {} }).style;

				if (patron.v2) {
					$M = $('.b-datalist__item[data-id="' + I.msgId + '"]', this.$container);
				} else {
					$M	= $('#'+I.id);
				}

				if( show && $M[0] )
				{
					L.display	= '';
					L.top		= $M.position().top + 'px';
					L.zIndex	= 99;
					return	true;
				}
				else
				{
					L.display	= 'none';
					return	false;
				}
			}
			return	-1;
		},

	// @public
		getId: function (){ return this._id+''; },
		get: function (id){
			if( !this._items[id] ) this._items[id] = { id: id, listId: 'ml-al'+id, msgId: id.replace(/[^\d]/g, ''), status: 0 };
			return	this._items[id];
		},

		load: function (id){
			var I = this.get(id);

			if( !I.status ){
				I.status = 1;

				$('#'+ I.id).addClass('iAttachLoading');

				var _loaded = function () {
					var Msg = patron.Messages.get(I.msgId);
					var template = 'blocks/messagelist/messagelist__dropdown-clip';
					var params = {
						MailAttachPreviewHost: Msg.MailAttachPreviewHost,
						MainMailHost: Msg.MainMailHost,
						NewAttachViewer: patron.NewAttachViewer,
						MessageId: Msg.Id,
						letter_size: Msg.Size,
						Attachments: Msg.Attachments || [],
						SingleDomainName: patron.SingleDomainName,
						httpProtocol: window.location.protocol,
						apf: apf,
						docs: docs
					};

					if( patron.v2 ){
						template = 'pages/lego';
						params = {
							block: 'b-datalist__item__attach__dropdown',
							params: params
						};
					}

					this._loaded(id, [0, 'OK', $.fest(template, params)], 'success');
				}.bind(this);

				if( patron.Messages.getSafe(I.msgId).isLoaded() ){
					_loaded();
				}
				else {
					patron.Events.one('update.message.clip-in-list', function (evt){
						if( evt.DATA[0] == I.msgId ){
							_loaded();
						}
					});
					patron.Messages.load(ajs.extend({ id: I.msgId, loading: true }, GET));
				}
			}
			return	I;
		},

		redraw: function (a){
			if( a == 'hide' ){
				this._id = '0';
			}

			if( this._pId && (this._pId !== this._id) ){
				this._toggle(this._pId, false);
			}

			if( this._id ){
				if( this._toggle(this._id, true) == false ){
					this._id = 0;
					this.redraw();
				}
				else {
					//noinspection JSValidateTypes
					this._pId	= this._id;
				}
			}

			if( this._id && !this._bind ){
				this._bind = function (evt){ !evt.isDefaultPrevented() && this.redraw('hide'); }.bind(this);
				$('body').bind('click.nsClipInList', this._bind);
			}
			else if( !this._id && this._bind ){
				this._bind = 0;
				$('body').unbind('click.nsClipInList');
			}
		},

		_mouseLeave: function (){
			if( this._id == this._leaveId ){
				this.redraw('hide');
			}
		},

		toggle: function (id, $container) {
			this.$container = $container;
			this.load(id);
			this._id = this._id != id ? id : 0;
			this.redraw();
		},

		wrap: function (el){
			$(el)
				.unbind('.nsClipInList')
				.delegate(_cssAttach, 'mouseover.nsClipInList', this.clearTO)
				.delegate('.js-clip-in-list-layer', 'mouseenter.nsClipInList mouseleave.nsClipInList', function (evt){
					this.clearTO();
					if( evt.type == 'mouseleave' ){
						this._leaveId = evt.currentTarget.getAttribute('data-id');
						this._tId = setTimeout(this._mouseLeave, this._overDelay);
					}
				}.bind(this))
			;
		},

		clearTO: function (){
			clearTimeout(this._tId);
		}
	};

	ajs.each(['_mouseLeave', 'clearTO'], function (name){ this[name] = this[name].bind(this); }, patron.ui.ClipInList);
	patron.ui.ClipInList.$Ico = jQuery(new Image).attr('src', '//img.' + patron.staticDomainName + '/r/default/loader.gif');
	// patron.ui.ClipInList


	/**
	 * @class	patron.ui.ClipInList.Preview
	 */
	jsClass
		.create('patron.ui.ClipInList.Preview')
		.statics({ zIndex: 900 })
		.methods({

		__construct: function (File, pUrl){
			var data = ajs.extend(ajs.toObject($(File).data("href")), { af_preview: 1 }),
				type = $(File).data('type');

			if (type == 'Office') {
				this.file = $(File).data('href');
			}
			else {
				this.file = pUrl + encodeURIComponent(data.file) +'?'+ ajs.toQuery(data);

				// MAIL-32456
				patron.Utils.logAPFRequest(this.file);
			}

			this.file = this.file.replace(/\/\/+/g, '//');
			this.$Box = jQuery('<div></div>')
							.append( patron.ui.ClipInList.$Ico.clone() )
							.css({
								  position:		'absolute'
								, display:		'none'
								, background:	'#fff'
								, padding:		'8px 4px'
								, width:		this.w = 16
								, height:		this.h = 7
								, top:			-4
								, left:			(this.left = -24)
								, opacity:		0
								, overflow:		'hidden'
							})
							.css3({ borderRadius: 5, boxShadow: '0px 0px 5px #000' })
							.prependTo( File )
						;

			if( ($.browser.msie && $.browser.intVersion < 9) || ($.browser.opera && $.browser.intVersion < 10) )
			{
				this.$Box.css({ border: '1px solid #000' });
			}

			jQuery(File).hover(this._show.bind(this), this._hide.bind(this)).css({ position: 'relative' });
		},

		_ready: function ()
		{
			if( !this.loaded )
			{
				this.w = this.$Img[0].width;
				this.h = this.$Img[0].height;

				this.$Box.empty().append( this.$Img.css({
					  top: '50%'
					, left: '50%'
					, marginLeft: -this.w/2
					, marginTop: -this.h/2
				}) );

				this.left	= -this.w - 8;
				this.loaded = true;

				this.$Box
					.click(this._fullScreen.bind(this))
					[this.visible ? 'animate' : 'css']({
						  left:		this.left - 15
						, top:		-this.h/2
						, width:	this.w
						, height:	this.h
					}, 'fast');
			}
		},

		_show: function ()
		{
			if( !this.$Img ){
				this.$Img = jQuery(new Image)
					.load(this._ready.bind(this))
					.error(function (){
						ajs.log('IMG.ERROR: '+this.src);
					})
					.attr('src', this.file)
					.css('position', 'relative')
				;
			}

			this.visible	= 1;

			//noinspection JSUnresolvedVariable
			this.$Box.stop(true)
				.css({
					  zIndex: ++patron.ui.ClipInList.Preview.zIndex
					, display: ''
				})
				.animate({
					  left:		this.left
					, top:		-this.h/2
					, opacity:	1
					, width:	this.w
					, height:	this.h
				}, 'fast')
			;
		},

		_hide: function ()
		{
			if( this.visible === 1 )
			{
				this.visible	= 0;

				//noinspection JSUnresolvedVariable
				this.$Box.stop(true)
					.css('zIndex', --patron.ui.ClipInList.Preview.zIndex)
					.animate({
						  left:		this.left - 15
						, top:		-this.h/2
						, opacity:	0
						, width:	this.w
						, height:	this.h
					}, 'fast', function (){ this.style.display = 'none'; })
				;
			}
		},

		_fullScreen: function (evt)
		{
			if( this.Layer )
			{	// Destroy
				this.Layer.$Box.remove();
				this.Layer.destroy();
			}

			$R('{plugins}LightBox', function ()
			{
				var src		= this.file.replace('af_preview=1', '');
				var parent	= $('#ScrollBodyInner')[0] || document.body;
				var $Layer	= $('<div></div>')
								.css3({ borderRadius: 10, boxShadow: '0 0 15px #000' })
								.css({ background: '#fff', padding: 10, overflow: 'hidden', width: this.w, height: this.h })
								.append( this.$Img.clone() )
								.appendTo( parent )
								.click(function (){ this.Layer.hide() }.bind(this))
							;

				this.Layer	= new LightBox( $Layer, {
								  visible:		1
								, hideByFade:	'click'
								, BODY:			parent
								, scrollWidth:	$('#ScrollBody').width() - $('#ScrollBodyInner').width()
							});

				$(new Image).load(function (evt){
					var
						  $Big = $(evt.currentTarget)
						, w = $Big.attr('width')
						, h = $Big.attr('height')
						, sW = Math.min(w, ajs.windowWidth() - 70)
						, sH = Math.min(h, ajs.windowHeight() - 60)
					;

					if( w > sW ){
						h   = sW*(h/w);
						w   = sW;
					}

					if( h > sH ){
						w   = sH*(w/h);
						h   = sH;
					}

					this.Layer.$Box.empty().append( $Big.css({ width: w, height: h }) ).find('img').css({
						  marginLeft:	-w/2
						, marginTop:	-h/2
						, left:			'50%'
						, top:			'50%'
						, position:		'relative'
					});
					try { this.Layer.resize(w, h, 0, 'fast'); } catch (e){}
				}.bind(this)).attr('src', src);

			}.bind(this));

			$(evt.target).closest('A').blur();

			return	false;
		}

	});

	jsLoader.loaded('{patron.ui}patron.ui.ClipInList');
});
