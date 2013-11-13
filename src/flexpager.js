/**
 * Copyright (c) 2013 Mike Sendlakowski
 * Author: Mike Sendlakowski
 * Git: https://github.com/sendlo/FlexPager
 *        
 * Released under the MIT License
 * http://www.opensource.org/licenses/MIT
 * 
 * FlexPager
 * A jQuery plugin to create a horizontal list carousel with pagination that reconfigures to handle irregular sized elements and any container size.
 *
 * Version: 1.0.0
 * 
 * 
 * TODO: 
 * 1) Resize when page (or container) resizes. Reset user to the same position.
 *
 */


(function (window, $, undefined) {
	"use strict";

    $.flexpager = function flexp(options, callback, element) {

    	this.element = $(element);
        this.ul = $("ul:first", this.element);
        this.pgNotFit = "data-notfit";

        // Flag the object in the event of a failed creation
        if (!this._create(options, callback)) {
            this.failed = true;
        }
    };

    $.flexpager.defaults = {
    	setPagesCB: function(){},		// Callback called whenever items are configured into pages
    	movedCB: function(){},			// Callback called whenever the carousel is paginated
    	pgFlag: "data-flxpgrstart",		// Flag to identify the first item in each page
    	pgTxt: {p:"Previous page",n:"Next page",pg:"Page {}"}	// All text used. Can be overriden for localization
	};

    $.flexpager.prototype = {

        /*	
			----------------------------
			Private methods
			----------------------------
		*/

		_create: function(options, callback){
			var opts = $.extend(true, {}, $.flexpager.defaults, options);
			this.options = opts;
			this._attachEvents();
			this._setPages();
			return true;
		},
		
		_update: function(options){
			var self = this;
			var opts = $.extend(true, {}, $.flexpager.defaults, options);
			self.options = opts;
			self._setPages();
			return true;
		},
		
		_attachEvents: function(){
			var self = this;
			self.element.delegate(".fpCtrls a","click",function(){self._move($(this).data("move"));});
		},

		_setPages: function() {
			var self = this,
				curPageWidth = 0,
				previousItem,
				itemWidth,
				item,
				previousRightMargin,
				previousStartElement;

			var maxPageWidth = self.element.width();
			self._hidePaging();
			$('li', self.ul).each(function(){
				item = $(this);
				item.attr(self.options.pgFlag, false);
				item.attr(self.pgNotFit, false);
				itemWidth = item.width();
				if(!previousItem) {
					item.attr(self.options.pgFlag, true); // mark this as a start to a page
					previousStartElement = item;
					curPageWidth = itemWidth;
				} else {
					previousRightMargin = previousItem.css("marginRight").replace('px', '')-0;
					if((curPageWidth + previousRightMargin + itemWidth) > maxPageWidth) {
						item.attr(self.options.pgFlag, true); // mark this as a start to a page
						if(curPageWidth + previousRightMargin + 1 < maxPageWidth) {
							// if the items on the prevous page cannot fit nicely, mark the previous start page so it can be handled in a customized way (fade away, etc)
							previousStartElement.attr(self.pgNotFit, true);
						}
						previousStartElement = item;
						curPageWidth = 0;
					} else {
						curPageWidth += previousRightMargin;
					}
					curPageWidth += itemWidth;
				}
				previousItem = item;								
			});
			self._initPaging();
			self.options.setPagesCB();
		},
			
		_hidePaging: function() {
			var self = this;
			if(self.controls) {
				self.controls.hide();
			}
		},
		
		_initPaging : function() {
			var self = this,
				pagination = "",
				classVar;

			self.curPage = 0;
			self.pageItems = $("li["+self.options.pgFlag+"=true]", self.ul);
			if(self.pageItems.size() < 2) {
				self._testFit();
				return; // no paging needed
			}
			if(!self.controls) {
				self.controls = $('<div class="fpCtrls"></div>');
				self.element.append(self.controls);
			}
			pagination += self._buildPageLink("p","flxP flxAlt",self.options.pgTxt.p);
			self.pageItems.each(function(idx){
				classVar = (idx === 0)?"flxD flxAlt":"flxD";
				pagination += self._buildPageLink(idx+1, classVar ,self.options.pgTxt.pg.replace("{}",idx+1));
			});
			pagination += self._buildPageLink("n","flxN",self.options.pgTxt.n);
			
			self.controls.html(pagination);
			self.controls.show();
			self._testFit();
			self.pgCntrls = $("a", self.controls);
		},

		_buildPageLink: function(moveStr, classStr, title) {
			return '<a href="javascript:;" data-move="'+moveStr+'" class="'+classStr+'" title="'+title+'"></a>';
		},
		
		_move: function(direction) {
			var self = this,
				newPage = self._getPage(direction),
				pageItem = self.pageItems.eq(newPage),
				position = 0-pageItem.position().left;
			
			self.curPage = newPage;
			self._updateControls(newPage);
			self.ul.stop(true,true).animate({"left":position}, 750);
			self._testFit();
			self.options.movedCB();
		},
		
		_testFit: function(off) {
			var self = this,
				pageStartItem = self.pageItems.eq(self.curPage);
			this.element.toggleClass("flxNoFit", (pageStartItem.attr(this.pgNotFit) === "true"));
		},
		
		_updateControls: function(newPage) {
			var self = this,
				lastPage = self.pgCntrls.size()-2,  // adjusting for previous and next links
				link,
				addClass;
			newPage++;  // adjusting the 0 based index being passed in
			self.pgCntrls.each(function(idx){
				link = $(this);
				addClass = false;
				if(link.hasClass('flxP')) {
					addClass = (newPage === 1);
				} else if(link.hasClass('flxN')) {
					addClass = (newPage === lastPage);
				} else {
					addClass = (newPage === idx);
				}
				link.toggleClass("flxAlt", addClass);
			});
		},
		
		_getPage: function(direction) {
			var self = this,
				newPage = self.curPage;

			switch(direction) {
			case "p":
				newPage--;
				break;
			case "n":
				newPage++;
				break;
			default:
				newPage = parseInt(direction) || 0;
				newPage--;  // adjusting for 0 based array
				break;
			}
			if(newPage < 1) {
				newPage = 0;
			} else if(newPage > self.pageItems.size()-1) {
				newPage = self.pageItems.size()-1;
			}
			return newPage;
    	},
		
        /*	
			----------------------------
			Public methods
			----------------------------
		*/

        update: function(options) {
            this._update(options);
        }
    };

	/*	
		----------------------------
		Function
		----------------------------
	*/


    $.fn.flexpager = function flexp_init(options, callback) {

    	
        var thisCall = typeof options;

		switch (thisCall) {

            // allow users to call a specific public method 
            case 'string':
                var args = Array.prototype.slice.call(arguments, 1);

                try{
					this.each(function () {
						var instance = $.data(this, 'flexpager');
	
						if (!instance) {
							throw 'Method ' + options + ' cannot be called until Flex Pager is setup';
						}
	
						if (!$.isFunction(instance[options]) || options.charAt(0) === "_") {
							throw 'No such public method ' + options + ' for Flex Pager';
						}
	
						// no errors!
						instance[options].apply(instance, args);
					});
                } catch(err){
                	if(window.console){
                		console.log(err);
                	}
                	return false;
                }

            break;

            // attempt to create
            case 'undefined':
            case 'object':

                this.each(function () {
	                var instance = $.data(this, 'flexpager');
	                if (instance) {
	                    // update options of current instance
	                    instance.update(options);
	                } else {
	                    // initialize new instance
	                    instance = new $.flexpager(options, callback, this);
	                    // don't attach if instantiation failed
	                    if (!instance.failed) {
	                        $.data(this, 'flexpager', instance);
	                    }
	                }
                });

            break;

        }
		
        return this;
    };

})(window, jQuery);