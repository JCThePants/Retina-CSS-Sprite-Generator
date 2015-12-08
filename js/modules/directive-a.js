define(['angular', 'app'], function (angular, app) {

    /** DIRECTIVE (<A>) Prevent clicks on disabled buttons **/
    app.directive('a', function () {
        return {
            restrict: 'E',
            link: function (scope, elem, attrs) {
                elem.on('click', function (e) {
                    if (elem.hasClass('js-disabled')) {
                        e.stopImmediatePropagation();
                        return false;
                    } else if (attrs['href'] === '#') {
                        e.preventDefault();
                    }
                });
            }
        };
    });
});