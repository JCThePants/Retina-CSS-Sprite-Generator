define(['angular', 'app'], function (angular, app) {

    /** DIRECTIVE (<data-show-mode>) Only show element if the generator mode matches the attribute value **/
    app.directive('showMode', function () {
        return {
            restrict: 'A',
            link: function (scope, elem, attrs) {
                var showMode = attrs.showMode;
                scope.$watch('g.mode', function (mode) {
                    elem[mode === showMode ? 'removeClass' : 'addClass']('hidden ng-hide');
                });
            }
        };
    });
});