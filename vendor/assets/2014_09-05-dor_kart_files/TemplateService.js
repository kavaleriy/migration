jsLoader.require('{toolkit.common}ajs/__array/ajs__array', function ()
{

	jsClass
	.create('Template')
	.statics({
		  OPEN:		'#'
		, CLOSE:	'#'
	})
	.methods({

		__construct: function (name, node, type)
		{
			if( !Template._ )
			{
				Template._		= true;
				Template.O	= Template.OPEN.replace(/(\$|\{|\}|\(|\)])/g, '\\$1');
				Template.C	= Template.CLOSE.replace(/(\{|\}|\(|\)])/g, '\\$1');
			}

			this._name		= name;
			this._var		= new RegExp(Template.O + '([\\w_-]+)' + Template.C, 'ig');
			this._ifr		= new RegExp(Template.O + 'IF:([!\\w_"\'*/+%\s()|&<>=-]+)'+ Template.C +'(.*)'+ Template.O+ 'FI'+ Template.C, 'ig');
			this._tpl		= new RegExp(Template.O + 'include:([\\w_-]+)' + Template.C, 'ig');
			this._ifEval	= [];
			this._ifEval_	= {};

			this.reset();

			if( typeof node == 'string' )
			{	// Text template OR Selector
				this._n		= jQuery(node);
				this._h		= node;
				this._t		= 1;
			}
			else
			{
				this._n		= jQuery(node);
				if( !this._n.length ) return;

				this._h		= jQuery.trim(this._n[0].innerHTML);
				this._t		= 1;
			}


			this._if	= {};	// IFs
			this._ifs	= this._ifr.test(this._h);	// IF support

			if( this.isText() )
			{
				this._h = this._h.replace(this._tpl, function (a, b){ return TemplateService.get(b).getText(); });

				var x = 0, s, e, i = 0, self = this, _if = new RegExp(Template.O + 'IF:([!\\w_"\'*/+%\\s()|&<>=-]+)' + Template.C, 'ig');
				this._h			= this._h.replace(_if, function (a, b){ return [Template.OPEN+'IF', i++, ':', self._if2eval(b), Template.CLOSE].join(''); });
				this._ifCount	= i;
				for( ; i--; )
				{
					x		= 2 + Template.OPEN.length;
					e		= this._h.indexOf(Template.OPEN+'FI'+Template.CLOSE, this._h.indexOf(Template.OPEN+'IF'+i+':'));
					this._h	= this._h.substr(0, e+x) +i+ this._h.substr(e+x);
				}
			}

			TemplateService.add(name, this);
		},


	// @private
		_if2eval: function (expr)
		{
			var a = expr.replace(/([a-z_]+)/ig, "P.get('$1', values, idx)");
			if( !this._ifEval_[a] ) this._ifEval_[a] = this._ifEval.push(a);
			return	this._ifEval_[a];
		},

		_text: function (P)
		{
			var t = this._h;

			if( this._arVars )
			{
				var r = [], i = this._arVars.length, n = i - 1;
				for( ; i--; ) r[i] = this.__test(t, P, this._arVars[i], i, n);
				t = r.join('');
			}
			else if( this._ivars ) t = this.__test(t, P, this._vars, 1, 1);
			else t = t.replace(this._ifr, '');

			return	t;
		},

		__test: function (txt, P, values, idx, len)
		{
			values.__first	= idx == 0;
			values.__last	= idx == len;

			P.set(values);

			if( this._ifCount )
			{
				this._ifEvalResult = {};
				var i = this._ifCount, il, s, e, v, c, not;

				for( ; i--; )
				{
					il	= (i+'').length + Template.OPEN.length + 3;
					s	= txt.indexOf(Template.OPEN + 'IF' + i + ':');
					c	= txt.indexOf(Template.CLOSE, s + il);
					v	= txt.substring(s + il, c)*1; // eval index
					e	= txt.indexOf(Template.OPEN + 'FI' + i + Template.CLOSE);


					if( typeof this._ifEvalResult[v] == 'undefined' )
					{	// caching eval result
						this._ifEvalResult[v] = eval('('+this._ifEval[v-1] +')');
					}

					txt	= txt.substring(0, s)
						+ (this._ifEvalResult[v] ? txt.substring(c + Template.CLOSE.length, e) : '')
						+ txt.substring(e + il)
					;
				}
			}

			var self = this;
			return	txt.replace(this._var, function (a, b)
			{
				return	self._vars[b] || P.get(b, values, idx);
			});
		},



	// @public
		getNode: function (){ return this._n;},
		isText: function () { return !!this._t; },
		getText: function (){ return this._h; },

		set: function (key, value)
		{
			this._ex	= 0;
			if( !this._ivars ) this._ivars	= 1;
			this._arVars = key;
			return	this;
		},

		get: function (key)
		{
			return key ? this._vars[key] : this._vars;
		},

		reset: function ()
		{
			this._vars		= {};
			this._arVars	= 0;
			this._ivars		= 0;
			this._ex		= 0;
			this.result		= undefined;
			return	this;
		},

		parser: function (P)
		{
			if( !P ) return this._tp;
			if( this._tp !== P )
			{
				if( P in TemplateParser ) P = TemplateParser[P];
				if( P.constructor !== TemplateParser ) P = new TemplateParser( P );
				this._tp	= P;
				this._ex	= 0;
				this.result	= undefined;
			}
			return	this;
		},

		exec: function (Parser)
		{
			if( !this._n.length ) return '';
			if( !this._ex )
			{
				if( !this._tp ) this.parser( TemplateParser[this._name] || TemplateParser.Base );

				this._ex	= 1;
				this.result	= this[this.isText() ? '_text' : '_jquery'](Parser || this._tp);
			}
			return	this.result;
		},

		toString: function (){ return this.exec(); }

	});


	TemplateService = jsClass
	.create()
	.methods({

		__construct: function ()
		{
			this._tpl		= {};
			this._exists	= {};
		},

	// @public
		get: function (name, node)
		{
			if( !this.has(name) ) this.add(name, new Template( name, node || $('#tpl-'+name)[0] ));
			return	this._tpl[name].reset();
		},

		has: function (name){ return !!this._exists[name]; },

		add: function (name, Tpl)
		{
			if( !this.has(name) )
			{
				this._exists[name]	= 1;
				if( Tpl.constructor !== Template ) Tpl = new Template(name, Tpl);
				this._tpl[name]	= Tpl;
			}
			return	this;
		},

		load: function (){ throw "TemplateService.load -- must be defined"; },
		need: function (tpls){ return Array.filter(tpls, function (name){ return !TemplateService._tpl[name]; }); }

	}).getInstance();



	TemplateParser = jsClass
	.create()
	.methods({

		__construct: function (methods)
		{
			var values = {};

			Object.extend(this, methods);

			this.set	= function (val){ values = val; return this; };
			this.val	= function (key, def){ return _hv(key) ? values[key] : def; };

			function _hv(key){ return typeof values[key] != 'undefined'; };
		},

	// @public
		get: function (key, values, idx)
		{
			var val = this[key] ? this[key](values, idx) : this.val(key, '');
			return	val;
		}

	});
	TemplateParser.Base = new TemplateParser;
	TemplateParser.add	= function (name, Parser)
	{
		if( Parser.constructor !== TemplateParser ) Parser = new TemplateParser(Parser);
		this[name] = Parser;
	};

	jsLoader.loaded('{labs}TemplateService');
});

