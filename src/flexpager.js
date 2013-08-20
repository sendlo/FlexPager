/*
   --------------------------------
   Flex Pager
   --------------------------------
   + https://github.com/sendlo/FlexPager
   + version 0.1
   + Copyright 2013 Mike Sendlakowski
   + Licensed under the MIT license

	* Adopted jQuery plugin structure from Paul Irish: https://github.com/paulirish/

*/

(function (window, $, undefined) {
	"use strict";

    $.flexpager = function flexp(options, callback, element) {
        this.element = $(element);

        // Flag the object in the event of a failed creation
        if (!this._create(options, callback)) {
            this.failed = true;
        }
    };

    $.flexpager.defaults = {

	};

    $.flexpager.prototype = {

        /*	
			----------------------------
			Private methods
			----------------------------
		*/

		_private: function(){

		},


        /*	
			----------------------------
			Public methods
			----------------------------
		*/

        publicMeth: function flexp_publicMeth() {
            this._private();
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

				this.each(function () {
					var instance = $.data(this, 'flexpager');

					if (!instance) {
						// not setup yet
						// return $.error('Method ' + options + ' cannot be called until Flex Pager is setup');
						return false;
					}

					if (!$.isFunction(instance[options]) || options.charAt(0) === "_") {
						// return $.error('No such method ' + options + ' for Flex Pager');
						return false;
					}

					// no errors!
					instance[options].apply(instance, args);
				});

            break;

            // attempt to create
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