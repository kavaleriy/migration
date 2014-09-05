;(function(){var x=Function('return this')();if(!x.fest)x.fest={};x.fest['blocks/messagelist/messagelist__dropdown-moveto']=function (__fest_context){"use strict";var __fest_self=this,__fest_buf=[],__fest_chunks=[],__fest_chunk,__fest_attrs=[],__fest_select,__fest_if,__fest_iterator,__fest_to,__fest_fn,__fest_html=[],__fest_blocks={},__fest_params,__fest_element,__fest_debug_file="",__fest_debug_line="",__fest_debug_block="",__fest_htmlchars=/[&<>"]/g,__fest_htmlchars_test=/[&<>"]/,__fest_short_tags = {"area":true,"base":true,"br":true,"col":true,"command":true,"embed":true,"hr":true,"img":true,"input":true,"keygen":true,"link":true,"meta":true,"param":true,"source":true,"wbr":true},__fest_element_stack = [],__fest_htmlhash={"&":"&amp;","<":"&lt;",">":"&gt;","\"":"&quot;"},__fest_jschars=/[\\'"\/\n\r\t\b\f<>]/g,__fest_jschars_test=/[\\'"\/\n\r\t\b\f<>]/,__fest_jshash={"\"":"\\\"","\\":"\\\\","/":"\\/","\n":"\\n","\r":"\\r","\t":"\\t","\b":"\\b","\f":"\\f","'":"\\'","<":"\\u003C",">":"\\u003E"},___fest_log_error;if(typeof __fest_error === "undefined"){___fest_log_error = (typeof console !== "undefined" && console.error) ? function(){return Function.prototype.apply.call(console.error, console, arguments)} : function(){};}else{___fest_log_error=__fest_error};function __fest_log_error(msg){___fest_log_error(msg+"\nin block \""+__fest_debug_block+"\" at line: "+__fest_debug_line+"\nfile: "+__fest_debug_file)}function __fest_replaceHTML(chr){return __fest_htmlhash[chr]}function __fest_replaceJS(chr){return __fest_jshash[chr]}function __fest_extend(dest, src){for(var i in src)if(src.hasOwnProperty(i))dest[i]=src[i];}function __fest_param(fn){fn.param=true;return fn}function __fest_call(fn, params,cp){if(cp)for(var i in params)if(typeof params[i]=="function"&&params[i].param)params[i]=params[i]();return fn.call(__fest_self,params)}function __fest_escapeJS(s){if (typeof s==="string") {if (__fest_jschars_test.test(s))return s.replace(__fest_jschars,__fest_replaceJS);} else if (typeof s==="undefined")return "";return s;}function __fest_escapeHTML(s){if (typeof s==="string") {if (__fest_htmlchars_test.test(s))return s.replace(__fest_htmlchars,__fest_replaceHTML);} else if (typeof s==="undefined")return "";return s;}var json=__fest_context;(function(__fest_context){(function(__fest_context){__fest_blocks.dropdown__button=function(params){var __fest_buf=[];__fest_buf.push("<div class=\"dropdown__button");try{__fest_if=params.cssClass}catch(e){__fest_if=false;__fest_log_error(e.message);}if(__fest_if){__fest_buf.push(" ");try{__fest_buf.push(__fest_escapeHTML(params.cssClass))}catch(e){__fest_log_error(e.message + "10");}}__fest_buf.push("\"><i class=\"dropdown__arrow\"><i class=\"dropdown__arrow__inner\"></i></i> <span class=\"dropdown__button__text\">");try{__fest_buf.push(__fest_escapeHTML(params.text))}catch(e){__fest_log_error(e.message + "21");}__fest_buf.push("</span></div>");return __fest_buf.join("");};})(__fest_context);(function(__fest_context){(function(__fest_context){__fest_blocks.dropdown__list__item=function(params){var __fest_buf=[];__fest_buf.push("<div class=\"dropdown__list__item");try{__fest_if=params.cssClass && params.cssClass.item}catch(e){__fest_if=false;__fest_log_error(e.message);}if(__fest_if){__fest_buf.push(" ");try{__fest_buf.push(__fest_escapeHTML(params.cssClass.item))}catch(e){__fest_log_error(e.message + "10");}}try{__fest_if=params.disabled}catch(e){__fest_if=false;__fest_log_error(e.message);}if(__fest_if){__fest_buf.push(" dropdown__list__item_disabled form_disabled");}__fest_buf.push("\"");try{__fest_if=params.hidden}catch(e){__fest_if=false;__fest_log_error(e.message);}if(__fest_if){__fest_buf.push(" style=\"display:none\"");}__fest_buf.push(">");try{__fest_attrs[0]=__fest_escapeHTML(params.href)}catch(e){__fest_attrs[0]=""; __fest_log_error(e.message);}__fest_buf.push("<a href=\"" + __fest_attrs[0] + "\" class=\"dropdown__list__item__link");try{__fest_if=params.icon && params.icon.align}catch(e){__fest_if=false;__fest_log_error(e.message);}if(__fest_if){__fest_buf.push(" dropdown__list__item__link_with-icon-");try{__fest_buf.push(__fest_escapeHTML(params.icon.align))}catch(e){__fest_log_error(e.message + "31");}}try{__fest_if=params.selected}catch(e){__fest_if=false;__fest_log_error(e.message);}if(__fest_if){__fest_buf.push(" dropdown__list__item__link_selected");}try{__fest_if=params.cssClass && params.cssClass.link}catch(e){__fest_if=false;__fest_log_error(e.message);}if(__fest_if){__fest_buf.push(" ");try{__fest_buf.push(__fest_escapeHTML(params.cssClass.link))}catch(e){__fest_log_error(e.message + "41");}}__fest_buf.push("\"");try{__fest_if=params.onclick}catch(e){__fest_if=false;__fest_log_error(e.message);}if(__fest_if){__fest_buf.push(" onclick=\"");try{__fest_buf.push(__fest_escapeHTML(params.onclick))}catch(e){__fest_log_error(e.message + "47");}__fest_buf.push("\"");}try{__fest_if=params.id}catch(e){__fest_if=false;__fest_log_error(e.message);}if(__fest_if){__fest_buf.push(" data-id=\"");try{__fest_buf.push(__fest_escapeHTML(params.id))}catch(e){__fest_log_error(e.message + "53");}__fest_buf.push("\"");}__fest_buf.push(">");try{__fest_if=params.icon}catch(e){__fest_if=false;__fest_log_error(e.message);}if(__fest_if){__fest_buf.push("<i class=\"icon dropdown__list__item__icon");try{__fest_if=params.icon.icon}catch(e){__fest_if=false;__fest_log_error(e.message);}if(__fest_if){__fest_buf.push(" ");try{__fest_buf.push(__fest_escapeHTML(params.icon.icon))}catch(e){__fest_log_error(e.message + "66");}}__fest_buf.push(" ");try{__fest_if=params.icon.align}catch(e){__fest_if=false;__fest_log_error(e.message);}if(__fest_if){__fest_buf.push("dropdown__list__item__icon_");try{__fest_buf.push(__fest_escapeHTML(params.icon.align))}catch(e){__fest_log_error(e.message + "73");}}else{__fest_buf.push("dropdown__list__item__icon_right");}__fest_buf.push("\"></i>");}__fest_buf.push("<span class=\"dropdown__list__item__link__text\">");try{__fest_buf.push(__fest_escapeHTML(params.text))}catch(e){__fest_log_error(e.message + "86");}__fest_buf.push("</span></a></div>");return __fest_buf.join("");};})(__fest_context);(function(__fest_context){__fest_blocks.dropdown__list__item_checkbox=function(params){var __fest_buf=[];try{__fest_attrs[0]=__fest_escapeHTML(params.id)}catch(e){__fest_attrs[0]=""; __fest_log_error(e.message);}__fest_buf.push("<label data-id=\"" + __fest_attrs[0] + "\" class=\"js-dropdown-item form__dropdown__item form__dropdown__item_combo form__checkbox form__checkbox_flat");try{__fest_if=params.cssClass && params.cssClass.item}catch(e){__fest_if=false;__fest_log_error(e.message);}if(__fest_if){__fest_buf.push(" ");try{__fest_buf.push(__fest_escapeHTML(params.cssClass.item))}catch(e){__fest_log_error(e.message + "10");}}try{__fest_if=params.checked}catch(e){__fest_if=false;__fest_log_error(e.message);}if(__fest_if){__fest_buf.push(" form__checkbox_flat_checked");try{__fest_if=params.disabled}catch(e){__fest_if=false;__fest_log_error(e.message);}if(__fest_if){__fest_buf.push(" form__checkbox_flat_checked-half");}}try{__fest_if=params.disabled}catch(e){__fest_if=false;__fest_log_error(e.message);}if(__fest_if){__fest_buf.push(" dropdown__list__item_disabled form_disabled");}__fest_buf.push("\"");try{__fest_if=params.hidden}catch(e){__fest_if=false;__fest_log_error(e.message);}if(__fest_if){__fest_buf.push(" style=\"display:none\"");}try{__fest_if=params.name}catch(e){__fest_if=false;__fest_log_error(e.message);}if(__fest_if){__fest_buf.push(" id=\"");try{__fest_buf.push(__fest_escapeHTML(params.name))}catch(e){__fest_log_error(e.message + "35");}__fest_buf.push("_");try{__fest_buf.push(__fest_escapeHTML(params.id))}catch(e){__fest_log_error(e.message + "37");}__fest_buf.push("\"");}__fest_buf.push(">");try{__fest_attrs[0]=__fest_escapeHTML(params.id)}catch(e){__fest_attrs[0]=""; __fest_log_error(e.message);}__fest_buf.push("<input type=\"checkbox\" class=\"form__checkbox__checkbox\" value=\"" + __fest_attrs[0] + "\"");try{__fest_if=params.selected}catch(e){__fest_if=false;__fest_log_error(e.message);}if(__fest_if){__fest_buf.push(" checked=\"checked\"");}__fest_buf.push("/><i class=\"form__checkbox__icon icon icon_form icon_form_checkmark\"></i><span class=\"form__checkbox__label\">");try{__fest_buf.push(params.text)}catch(e){__fest_log_error(e.message + "53");}__fest_buf.push("</span></label>");return __fest_buf.join("");};})(__fest_context);__fest_blocks.dropdown__list=function(params){var __fest_buf=[];try{__fest_attrs[0]=__fest_escapeHTML(params.border ? '' : 'dropdown__list__scroll-without-border')}catch(e){__fest_attrs[0]=""; __fest_log_error(e.message);}__fest_buf.push("<div class=\"js-scroll-list dropdown__list__scroll " + __fest_attrs[0] + "\">");try{__fest_if=params.extraLabels}catch(e){__fest_if=false;__fest_log_error(e.message);}if(__fest_if){__fest_select="dropdown__list__item_checkbox";__fest_params={};try{__fest_params={hidden: true}}catch(e){__fest_log_error(e.message)}__fest_fn=__fest_blocks[__fest_select];if (__fest_fn)__fest_buf.push(__fest_call(__fest_fn,__fest_params,false));}var index,value,__fest_to0,__fest_iterator0;try{__fest_iterator0=params.items || [];__fest_to0=__fest_iterator0.length;}catch(e){__fest_iterator0=[];__fest_to0=0;__fest_log_error(e.message);}for(index=0;index<__fest_to0;index++){value=__fest_iterator0[index];try{__fest_if=value.hr}catch(e){__fest_if=false;__fest_log_error(e.message);}if(__fest_if){__fest_buf.push("<div class=\"dropdown__list__hr\"></div>");}else{try{__fest_if=value.checkbox}catch(e){__fest_if=false;__fest_log_error(e.message);}if(__fest_if){__fest_select="dropdown__list__item_checkbox";__fest_params={};try{__fest_params=value}catch(e){__fest_log_error(e.message)}__fest_fn=__fest_blocks[__fest_select];if (__fest_fn)__fest_buf.push(__fest_call(__fest_fn,__fest_params,false));}else{__fest_select="dropdown__list__item";__fest_params={};try{__fest_params=value}catch(e){__fest_log_error(e.message)}__fest_fn=__fest_blocks[__fest_select];if (__fest_fn)__fest_buf.push(__fest_call(__fest_fn,__fest_params,false));}}}__fest_buf.push("</div>");return __fest_buf.join("");};})(__fest_context);__fest_blocks.dropdown=function(params){var __fest_buf=[];__fest_buf.push("<div class=\"dropdown");try{__fest_if=!params.active}catch(e){__fest_if=false;__fest_log_error(e.message);}if(__fest_if){__fest_buf.push(" dropdown_disabled");}try{__fest_if=params.cssClass}catch(e){__fest_if=false;__fest_log_error(e.message);}if(__fest_if){__fest_buf.push(" ");try{__fest_buf.push(__fest_escapeHTML(params.cssClass))}catch(e){__fest_log_error(e.message + "18");}}__fest_buf.push("\"");try{__fest_if=params.id}catch(e){__fest_if=false;__fest_log_error(e.message);}if(__fest_if){__fest_buf.push(" id=\"");try{__fest_buf.push(__fest_escapeHTML(params.id))}catch(e){__fest_log_error(e.message + "24");}__fest_buf.push("\"");}__fest_buf.push(">");try{__fest_select='dropdown__' + params.control.type}catch(e){__fest_select="";__fest_log_error(e.message)}__fest_params={};try{__fest_params=params.control}catch(e){__fest_log_error(e.message)}__fest_fn=__fest_blocks[__fest_select];if (__fest_fn)__fest_buf.push(__fest_call(__fest_fn,__fest_params,false));try{__fest_attrs[0]=__fest_escapeHTML(params.name)}catch(e){__fest_attrs[0]=""; __fest_log_error(e.message);}__fest_buf.push("<div data-name=\"" + __fest_attrs[0] + "\" style=\"display: none;\" class=\"dropdown__list js-menu");try{__fest_if=!params.top}catch(e){__fest_if=false;__fest_log_error(e.message);}if(__fest_if){__fest_buf.push(" dropdown__list_bottom");}__fest_buf.push("\">");try{__fest_if=params.head}catch(e){__fest_if=false;__fest_log_error(e.message);}if(__fest_if){__fest_buf.push("<div class=\"js-info dropdown__list__top\"><div class=\"dropdown__list__item\"><div class=\"dropdown__list__item__more dropdown__list__item__more_note\"><span class=\"dropdown__list__item__more__text\">");try{__fest_buf.push(params.head.text)}catch(e){__fest_log_error(e.message + "47");}__fest_buf.push("</span></div><div class=\"dropdown__list__hr\"></div></div></div>");}__fest_select="dropdown__list";__fest_params={};try{__fest_params=params}catch(e){__fest_log_error(e.message)}__fest_fn=__fest_blocks[__fest_select];if (__fest_fn)__fest_buf.push(__fest_call(__fest_fn,__fest_params,false));try{__fest_if=params.foot}catch(e){__fest_if=false;__fest_log_error(e.message);}if(__fest_if){__fest_buf.push("<div class=\"dropdown__list__bottom\"><div class=\"dropdown__list__item\"><a class=\"dropdown__list__item__link\" href=\"");try{__fest_buf.push(__fest_escapeHTML(params.foot.href))}catch(e){__fest_log_error(e.message + "61");}__fest_buf.push("\"");try{__fest_if=params.foot.onclick}catch(e){__fest_if=false;__fest_log_error(e.message);}if(__fest_if){__fest_buf.push(" onclick=\"");try{__fest_buf.push(__fest_escapeHTML(params.foot.onclick))}catch(e){__fest_log_error(e.message + "63");}__fest_buf.push("\"");}__fest_buf.push("><span class=\"dropdown__list__item__link__text\">");try{__fest_buf.push(__fest_escapeHTML(params.foot.text))}catch(e){__fest_log_error(e.message + "66");}__fest_buf.push("</span></a></div></div>");}__fest_buf.push("</div></div>");return __fest_buf.join("");};})(__fest_context);__fest_select="dropdown";__fest_params={};try{__fest_params={
			  id:		'folderListSpan' + (json.top ? 'Top' : 'Bot')
			, name:		'folders'
			, control:	{ type: 'button', text: Lang.str('dropdown.moveto') }
			, top:		json.top
			, border:	true

			, head:		{ text: Lang.str('dropdown.more.empty') }

			, foot:		{
							  href:		'#new'
							, onclick:	"return ['folder', 'move', 'new'];"
							, text:		Lang.str('create.folder')
						}

			, items:	ajs.map(patron.Folders.getAll(), function (folder) {
							return {
								  id:		folder.id
								, href:		'#'
								, text:		folder.Name
								, cssClass: { item: 'js-FDD'+folder.id+' '+(folder.IsSubfolder ? 'dropdown__list__item_sub' : '') }
								, onclick:	"return ['folder', 'move', '"+folder.id+"']"
								, disabled:	patron.Router.request.query.folder == folder.id
							};
						})
		}}catch(e){__fest_log_error(e.message)}__fest_chunks.push(__fest_buf.join(""),{name:__fest_select,params:__fest_params,cp:false});__fest_buf=[];try{__fest_if=json.top}catch(e){__fest_if=false;__fest_log_error(e.message);}if(__fest_if){__fest_buf.push("<input class=\"js-InpToFolderId\" type=\"hidden\" value=\"\" name=\"folder\" id=\"InpToFolderId\"/>");}__fest_to=__fest_chunks.length;if (__fest_to) {__fest_iterator = 0;for (;__fest_iterator<__fest_to;__fest_iterator++) {__fest_chunk=__fest_chunks[__fest_iterator];if (typeof __fest_chunk==="string") {__fest_html.push(__fest_chunk);} else {__fest_fn=__fest_blocks[__fest_chunk.name];if (__fest_fn) __fest_html.push(__fest_call(__fest_fn,__fest_chunk.params, __fest_chunk.cp));}}__fest_html.push(__fest_buf.join(""));return __fest_html.join("")} else {return __fest_buf.join("");}}; if(x.jsLoader!==undefined&&x.jsLoader.loaded!==undefined&&typeof x.jsLoader.loaded==='function'){x.jsLoader.loaded('{festTemplate}blocks/messagelist/messagelist__dropdown-moveto')};})();