;(function ( $, window, document, undefined ) {

	var defaults = {
		width: 'auto',
		height: 'auto',
		clickToggle: false,
		content: null,
		enabled: true,

		onOpen: function(){},
		onClose: function(){}
	};

	var templates = '<div class="clarify-placer"><div class="clarify-container"><div class="clarify-content"></div><div class="clarify-arrow"></div><div class="clarify-placeholder"></div></div></div>'; 

	function getElementDimensions(obj){
	    var clone = obj.clone();
	    	clone.css("visibility","hidden").appendTo($('body'));
	  
	    var width = clone.innerWidth();
	    var height = clone.innerHeight();
	    	clone.remove();

	    return {width: width, height: height};
	}

	function Clarify( element, options ){
		this.handle = $(element);
		this.options = $.extend(null, defaults, options);
		this._init();
	}

	Clarify.prototype = {
		_init: function(){
			this._createElement();
			this._initBinds();
		},

		_createElement: function(){
			var element = $(templates),
				content = this.handle.attr('tooltip') || this.options.content || "&nbsp;";

			this.element = element;
			this.container = element.children('.clarify-container');
			this.content_container = this.container.children('.clarify-content');

			// Insert Content into tooltip. HTML or Object or String
			this.content_container.html(content);

			// Calculate Width and set the container's dimensions
			var dimension = getElementDimensions(this.container),
				width = "auto",
				height = "auto";

			if(this.options.width === "auto" || isNaN(parseInt(this.options.width, 10))){
				width = dimension.width;
			}else{
				width = parseInt(this.options.width, 10);
			}

			// Set minimum width
			width = (width <= 40) ? 40 : width;

			if(this.options.height === "auto" || isNaN(parseInt(this.options.height, 10))){
				height = "auto";
			}else{
				height = parseInt(this.options.height, 10);
			}

			this.container.css({
				'opacity' : 0,
				'bottom'  : 22,
				width     : width - 16,
				height    : (height === "auto") ? "" : height - 16,
				left      : (parseFloat(width)/2*-1) + this.handle.outerWidth()/2
			});
		},

		_initBinds: function(){
			var _this = this;

			if(this.options.clickToggle){
				this.handle.on('click', function(){
					_this._tryOpen();
				});

				$(document).on('click', function(){
					_this._tryClose();
				});
			}else{
				this.handle.on('mouseover', function(){
					_this._tryOpen();

					_this.container.off('mouseout').on('mouseout', function(){
						_this._tryClose();
					});
				});

				this.handle.on('mouseout', function(){
					_this._tryClose();
				});
			}
		},

		_tryOpen: function(){
			if(!this.options.enabled) return;

			var offset = this.handle.offset();

			this.element
				.appendTo($('body'))
				.css({
					left: offset.left,
					top: offset.top
				});

			this.container.show();

			this.container.stop().animate({
				'bottom' : '28',
				'opacity' : 1
			}, 300);
		},

		_tryClose: function(){
			var _this = this;
			setTimeout(function(){
				if(!_this.container.is(':hover') && !_this.handle.is(':hover')){
					_this.container.stop().animate({
						'bottom' : '22',
						'opacity' : 0
					}, 200, function(){
						_this.element.remove();
					});
				}
			}, 1);		
		},

		setContent: function(content){
			this.options.content = content;
			this._createElement();

			return this;
		},

		enabled: function(enabled){
			this.options.enabled = enabled;

			return this;
		}
	};

	$.fn.Clarify = function(method) {
		if (Clarify.prototype[method]) {
			if(!$(this).data('clarify_data')){
				console.warn('Element has not been initialized before, initializing with default options.');
				$(this).Clarify();
			}

			return $(this).data('clarify_data')[method].apply($(this).data('clarify_data'), Array.prototype.slice.call(arguments, 1));
		} else if (typeof method === 'object' || !method) {
			return this.each(function() {
				if ( !$.data( this, "clarify_data" ) ) {
						$.data( this, "clarify_data", new Clarify( this, method || {} ) );
				}
			});
		} else {
			$.error('Method ' + method + ' does not exist on Clarify');
		}
	};

})( jQuery, window, document );