;(function(){var x=Function('return this')();if(!x.fest)x.fest={};x.fest['blocks/messagelist/messagelist__dropdown-clip']=function (__fest_context){"use strict";var __fest_self=this,__fest_buf=[],__fest_chunks=[],__fest_chunk,__fest_attrs=[],__fest_select,__fest_if,__fest_iterator,__fest_to,__fest_fn,__fest_html=[],__fest_blocks={},__fest_params,__fest_element,__fest_debug_file="",__fest_debug_line="",__fest_debug_block="",__fest_htmlchars=/[&<>"]/g,__fest_htmlchars_test=/[&<>"]/,__fest_short_tags = {"area":true,"base":true,"br":true,"col":true,"command":true,"embed":true,"hr":true,"img":true,"input":true,"keygen":true,"link":true,"meta":true,"param":true,"source":true,"wbr":true},__fest_element_stack = [],__fest_htmlhash={"&":"&amp;","<":"&lt;",">":"&gt;","\"":"&quot;"},__fest_jschars=/[\\'"\/\n\r\t\b\f<>]/g,__fest_jschars_test=/[\\'"\/\n\r\t\b\f<>]/,__fest_jshash={"\"":"\\\"","\\":"\\\\","/":"\\/","\n":"\\n","\r":"\\r","\t":"\\t","\b":"\\b","\f":"\\f","'":"\\'","<":"\\u003C",">":"\\u003E"},___fest_log_error;if(typeof __fest_error === "undefined"){___fest_log_error = (typeof console !== "undefined" && console.error) ? function(){return Function.prototype.apply.call(console.error, console, arguments)} : function(){};}else{___fest_log_error=__fest_error};function __fest_log_error(msg){___fest_log_error(msg+"\nin block \""+__fest_debug_block+"\" at line: "+__fest_debug_line+"\nfile: "+__fest_debug_file)}function __fest_replaceHTML(chr){return __fest_htmlhash[chr]}function __fest_replaceJS(chr){return __fest_jshash[chr]}function __fest_extend(dest, src){for(var i in src)if(src.hasOwnProperty(i))dest[i]=src[i];}function __fest_param(fn){fn.param=true;return fn}function __fest_call(fn, params,cp){if(cp)for(var i in params)if(typeof params[i]=="function"&&params[i].param)params[i]=params[i]();return fn.call(__fest_self,params)}function __fest_escapeJS(s){if (typeof s==="string") {if (__fest_jschars_test.test(s))return s.replace(__fest_jschars,__fest_replaceJS);} else if (typeof s==="undefined")return "";return s;}function __fest_escapeHTML(s){if (typeof s==="string") {if (__fest_htmlchars_test.test(s))return s.replace(__fest_htmlchars,__fest_replaceHTML);} else if (typeof s==="undefined")return "";return s;}var json=__fest_context;try{__fest_attrs[0]=__fest_escapeHTML(json.MailAttachPreviewHost)}catch(e){__fest_attrs[0]=""; __fest_log_error(e.message);}__fest_buf.push("<div cnt_sb=\"366559\" class=\"messagelist__dropdown\" previewUrl=\"\/\/" + __fest_attrs[0] + "\/cgi-bin\/readmsg\/\"><div class=\"messagelist__dropdown__shadow messagelist__dropdown__shadow_right\"></div><div class=\"messagelist__dropdown__shadow messagelist__dropdown__shadow_bottom\"></div><div class=\"messagelist__dropdown__clip\"><div class=\"messagelist__dropdown__clip__icon icon icon_attach\"></div></div><ul class=\"messagelist__dropdown__file-list\">");var idx,item,__fest_to0,__fest_iterator0;try{__fest_iterator0=json.Attachments || [];__fest_to0=__fest_iterator0.length;}catch(e){__fest_iterator0=[];__fest_to0=0;__fest_log_error(e.message);}for(idx=0;idx<__fest_to0;idx++){item=__fest_iterator0[idx];try{
					// a.href & a.data-href
					var _href = '//'+json.MainMailHost+'/cgi-bin/', _icon = 'Other', _type = 'Other', _canPreview = false;

					if (json.docs.canThumbnail(item.name)) {
						_canPreview = true;
						_type = 'Office';
					} else if (json.apf.canThumbnail(item.name)) {
						_canPreview = true;
					}

					if( item.isRFC822 ){
						_href = 'readmsg?id' + item.PartID
					}
					else if( item.isTNEF && !item.IsRtf ){
						_href += 'get_tnef_part?' + ajs.toQuery({
									  id: item.PartID
									, tnef_id: item.tnef_id
									, mode: 'tnef_attach'
								});
					}
					else {
						_href += 'getattach?' + ajs.toQuery({
									  id: item.PartID
									, file: item.name
									, channel: item.Channel
									, mode: 'attachment'
									, bs: item.BodyStart
									, bl: item.OriginalBodyLen
									, ct: item.ContentType
									, cn: item.ContentName
									, cte: item.ContentEncoding
								});
					}

					var
						_mime = item.ContentType,
						_ext = item.name.substr(item.name.lastIndexOf('.')+1)
					;

					// File-Icon mod
					if( item.IsMp3 ){
						_icon = 'Mp3';
					} else if( _ext == 'tar' || _ext == '7z' ||  _ext == 'gz' || _ext == 'zip' || _ext == 'rar' || _mime == 'application/zip' || _mime == 'application/x-rar-compressed' ){
						_icon = 'Arhiv';
					} else if( /image/.test(_mime) ){
						_icon = 'Picture';
					} else if( _ext == 'doc' || _ext == 'docx' ){
						_icon = 'Word';
					} else if( _ext == 'xls' || _ext == 'xlsx' ){
						_icon = 'Exel';
					} else if( _ext == 'ppt' || _ext == 'pptx' ){
						_icon = 'PowerPoint';
					} else if( _ext == 'txt' ){
						_icon = 'Txt';
					} else if( _ext == 'eml' ){
						_icon = 'Letter';
					} else if( _ext == 'pdf' ){
						_icon = 'Pdf';
					}

				}catch(e){__fest_log_error(e.message);}__fest_buf.push("<li class=\"messagelist__dropdown__file-list__item\"><a class=\"messagelist__dropdown__file-list__item__content\" target=\"_blank\" href=\"");try{__fest_buf.push(__fest_escapeHTML((
									json.NewAttachViewer
										? '/attaches-viewer/?id='+ json.MessageId +'&_av='+ idx
										: _href
								)))}catch(e){__fest_log_error(e.message + "81");}__fest_buf.push("\" data-href=\"");try{__fest_if=_type === 'Office'}catch(e){__fest_if=false;__fest_log_error(e.message);}if(__fest_if){try{__fest_buf.push(__fest_escapeHTML('//docs.' + json.SingleDomainName + '/preview/206x206/?src=' + encodeURIComponent(json.httpProtocol + _href)))}catch(e){__fest_log_error(e.message + "86");}}else{try{__fest_buf.push(__fest_escapeHTML(_href))}catch(e){__fest_log_error(e.message + "89");}}__fest_buf.push("\" data-type=\"");try{__fest_buf.push(__fest_escapeHTML(_type))}catch(e){__fest_log_error(e.message + "93");}__fest_buf.push("\"><i class=\"messagelist__dropdown__file-list__item__content__file-type-icon messagelist__dropdown__file-list__item__content__file-type-icon_");try{__fest_buf.push(__fest_escapeHTML(_icon))}catch(e){__fest_log_error(e.message + "103");}__fest_buf.push(" ");try{__fest_if=_canPreview}catch(e){__fest_if=false;__fest_log_error(e.message);}if(__fest_if){__fest_buf.push("js-attachePicture");}__fest_buf.push("\"></i><u>");try{__fest_if=item.isRFC822}catch(e){__fest_if=false;__fest_log_error(e.message);}if(__fest_if){try{__fest_buf.push(__fest_escapeHTML(ajs.HTML.unescape(item.Subject) || 'No Subject'))}catch(e){__fest_log_error(e.message + "113");}}else{try{__fest_if=item.FileName}catch(e){__fest_if=false;__fest_log_error(e.message);}if(__fest_if){try{__fest_buf.push(__fest_escapeHTML(item.FileName))}catch(e){__fest_log_error(e.message + "114");}}else{try{__fest_if=item.name}catch(e){__fest_if=false;__fest_log_error(e.message);}if(__fest_if){try{__fest_buf.push(__fest_escapeHTML(ajs.HTML.unescape(item.name)))}catch(e){__fest_log_error(e.message + "115");}}else{try{__fest_buf.push(__fest_escapeHTML(item.URLFileName))}catch(e){__fest_log_error(e.message + "116");}}}}__fest_buf.push("</u>&nbsp;<span class=\"messagelist__dropdown__file-list__content-size\">");try{__fest_buf.push(__fest_escapeHTML(item.size))}catch(e){__fest_log_error(e.message + "121");}__fest_buf.push(" ");try{__fest_buf.push(__fest_escapeHTML(Lang.get('Size').kb))}catch(e){__fest_log_error(e.message + "123");}__fest_buf.push("</span></a></li>");}try{__fest_if=!json.Attachments.length}catch(e){__fest_if=false;__fest_log_error(e.message);}if(__fest_if){__fest_buf.push("<li class=\"messagelist__dropdown__file-list__item\"><i class=\"messagelist__dropdown__file-list__item__content__file-type-icon messagelist__dropdown__file-list__item__content__file-type-icon_Letter\"></i><span class=\"messagelist__dropdown__file-list__content-size\">");try{__fest_buf.push(__fest_escapeHTML(Lang.str('readmsg.text').toLowerCase()))}catch(e){__fest_log_error(e.message + "133");}__fest_buf.push("&nbsp;");try{__fest_buf.push(__fest_escapeHTML(json.letter_size))}catch(e){__fest_log_error(e.message + "135");}__fest_buf.push("</span></li>");}__fest_buf.push("</ul></div>");__fest_to=__fest_chunks.length;if (__fest_to) {__fest_iterator = 0;for (;__fest_iterator<__fest_to;__fest_iterator++) {__fest_chunk=__fest_chunks[__fest_iterator];if (typeof __fest_chunk==="string") {__fest_html.push(__fest_chunk);} else {__fest_fn=__fest_blocks[__fest_chunk.name];if (__fest_fn) __fest_html.push(__fest_call(__fest_fn,__fest_chunk.params, __fest_chunk.cp));}}__fest_html.push(__fest_buf.join(""));return __fest_html.join("")} else {return __fest_buf.join("");}}; if(x.jsLoader!==undefined&&x.jsLoader.loaded!==undefined&&typeof x.jsLoader.loaded==='function'){x.jsLoader.loaded('{festTemplate}blocks/messagelist/messagelist__dropdown-clip')};})();