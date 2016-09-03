(function ($) {

    $.fn.inview = function (options) {
        var $items = this;              
        var defaults = {
            offset: 0,    
            onIn: function(visPart, $el){},
            onOut: function($el){}
        };

        var _settings = $.extend(defaults, options);

        //private helpers
        //================
        function _getScrollTop() {
            return window.pageYOffset ||
                document.documentElement.scrollTop ||
                document.body.scrollTop;
        }

        function _getViewportHeight() {
            var height = window.innerHeight; // Safari, Opera
            // if this is correct then return it. iPad has compat Mode, so will
            // go into check clientHeight (which has the wrong value).
            if (height) {
                return height;
            }
            var mode = document.compatMode;

            if ((mode || !$.support.boxModel)) { // IE, Gecko
                height = (mode === 'CSS1Compat') ?
                    document.documentElement.clientHeight : // Standards
                    document.body.clientHeight; // Quirks
            }

            return height;
        }

        function _offsetTop(debug) {
            // Manually calculate offset rather than using jQuery's offset
            // This works-around iOS < 4 on iPad giving incorrect value
            // cf http://bugs.jquery.com/ticket/6446#comment:9
            var curtop = 0;
            for (var obj = debug; obj; obj = obj.offsetParent) {
                curtop += obj.offsetTop;
            }
            return curtop;
        }

        function _checkInView() {
            var viewportTop = _getScrollTop(),
                viewportBottom = viewportTop + _getViewportHeight();

            $items.each(function () {

                var $el = $(this),
                    elTop = _offsetTop(this),
                    elHeight = $el.height(),
                    elBottom = elTop + elHeight,
                    wasInView = $el.data('inview') || false,
                    offset = _settings.offset || 0,
                    inView = elTop >= viewportTop && elBottom <= viewportBottom,
                    isBottomVisible = elBottom + offset >= viewportTop && elTop <= viewportTop,
                    isTopVisible = elTop - offset <= viewportBottom && elBottom >= viewportBottom,
                    inViewWithOffset = inView || isBottomVisible || isTopVisible || (elTop <= viewportTop && elBottom >= viewportBottom);


                if (inViewWithOffset) {
                    var visPart = (isTopVisible) ? 'top' : (isBottomVisible) ? 'bottom' : 'both';
                    if (!wasInView || wasInView !== visPart) {                        
                        $el.data('inview', visPart);
                        _settings.onIn(visPart, $el);
                    }
                } else if (!inView && wasInView) {
                    $el.data('inview', false);
                    _settings.onOut($el);
                };
            });

        };

        function _createFunctionLimitedToOneExecutionPerDelay(fn, delay) {
            var shouldRun = false;
            var timer = null;

            function runOncePerDelay() {
                if (timer !== null) {
                    shouldRun = true;
                    return;
                }
                shouldRun = false;
                fn();
                timer = setTimeout(function () {
                    timer = null;
                    if (shouldRun) {
                        runOncePerDelay();
                    }
                }, delay);
            }

            return runOncePerDelay;
        }

        var _runner = _createFunctionLimitedToOneExecutionPerDelay(_checkInView, 100);
        $(window).on("load scroll resize scrollstop", _runner);


        return $items;

    };

} (jQuery));