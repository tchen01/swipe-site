// REKT SWIPE
// could remove jQuery stuff but i'm using jQuery anyway
(function ($) {
    $.fn.swipe = function(func, options) {

        //some values and stuff
        //this can be cleaned up i'm guessing
        var xinit = yinit = 0;
        var tinit = dt = 0;
        var dx = dy = 0;
        var distance = 0;
        var direction = action = interval = null;

        //default parameters
        var param = $.extend({
            threshold: 200,
            refresh: 15, //refresh rate in ms
            ratio: 1 // is this even working?
        }, options);

        //why use jQuery?
        $(this).one('mousedown touchstart', touchstart);
		$(this).on('mouseup touchend touchcancel', end);
				

        function touchstart(e) {
            action = e.type;

            if (action == 'mousedown') {
                xinit = e.clientX;
                yinit = e.clientY;
            } else if (action == 'touchstart') {
                xinit = e.originalEvent.targetTouches[0].clientX;
                yinit = e.originalEvent.targetTouches[0].clientY;
                el = document.elementFromPoint(xinit, yinit);
            };
            tinit = getms();

            action = "start"

            $(this).on('mousemove touchmove', move);
            $(document).one('keydown', escape);
            escape();
			interval = setInterval(function() {
				console.log( "interval") 
                dt = getms() - tinit;
				direction = dir(dx, dy)
                func(direction, action, dt, dx, dy, xinit, yinit);
            }, param.refresh);
        }

        function escape() {
			console.log("escape");
            clearInterval(interval);
        }

        function getms() {
            return new Date().getTime();
        }

        function move(e) {

            action = e.type;

            if (xinit != 0) {

                if (action == 'mousemove') {
                    dx = e.clientX - xinit;
                    dy = e.clientY - yinit;
                } else if (action == 'touchmove') {
                    dx = e.originalEvent.targetTouches[0].clientX - xinit;
                    dy = e.originalEvent.targetTouches[0].clientY - yinit;
                }
            }

            action = "move"
        }

        function end(e) {
            action = e.type;

            var direction = dir(dx, dy)

            xinit = yinit = 0;
            dx = dy = 0;

            //this prevents mousemove from always happening
            $(this).off('mousemove touchmove', move);

            action = "end";
            

            func(direction, action, dt, dx, dy, xinit, yinit);
            $(this).one('mousedown touchstart', touchstart);
            $(document).off('keydown', escape);
			console.log("end");
			escape();
        }


        function dir(dx, dy) {
            distance = dx * dx + dy * dy
            theta = Math.atan2(dy, dx);
            xy = Math.abs(dx / dy);

            if (distance > param.threshold * param.threshold) {
                if (xy > param.ratio) {
                    if (dx > 0) return "left"
                    else return "right"
                } else {
                    if (dy > 0) return "down"
                    else return "up"
                }
            } else return "cancel"
        }

    };

}(jQuery));