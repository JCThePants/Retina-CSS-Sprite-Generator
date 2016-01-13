define(['angular', 'app'], function (angular, app) {

    document.registerElement && document.registerElement('drag-scroll');

    /** DIRECTIVE: (data-drag-scroll) Allows scrolling by dragging element **/
    app.directive('dragScroll', function () {

        var directive = {
            restrict: 'EA',
            scope: {},
            link: function (scope, elem, attrs) {
                scope.elem = elem;
                scope.clicked = false;
                scope.y = 0;
                scope.x = 0;
                scope.scrollX = true;
                scope.scrollY = true;

                var direction = attrs.direction;

                if (direction === 'x') {
                    scope.scrollY = false;
                } else if (direction == 'y') {
                    scope.scrollX = false;
                }

                elem.css({
                    '-webkit-touch-callout': 'none',
                    '-webkit-user-select': 'none',
                    '-khtml-user-select': 'none',
                    '-moz-user-select': 'none',
                    '-ms-user-select': 'none',
                    'user-select': 'none'
                });

                elem.on('mousemove', function (e) {
                    scope.clicked && updateScrollPos(scope, e);
                });

                elem.on('mousedown', function (e) {
                    scope.clicked = true;
                    scope.y = e.pageY;
                    scope.x = e.pageX;
                });

                elem.on('mouseup', function (e) {
                    scope.clicked && e.preventDefault();
                    scope.clicked = false;
                    elem.css('cursor', 'auto');
                });

            }
        };

        var updateScrollPos = function (scope, e) {
            scope.elem.css('cursor', 'move');
            if (scope.scrollY) {
                scope.elem[0].scrollTop = scope.elem[0].scrollTop + (scope.y - e.pageY);
            }

            if (scope.scrollX) {
                scope.elem[0].scrollLeft = scope.elem[0].scrollLeft + (scope.x - e.pageX);
            }
            scope.x = e.pageX;
            scope.y = e.pageY;
        };

        return directive;
    });

});