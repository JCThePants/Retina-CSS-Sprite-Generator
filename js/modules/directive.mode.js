define(['angular', 'app'], function (angular, app) {

    /** DIRECTIVE (<data-mode>) Only show element if the generator mode matches the attribute value **/
    app.directive('mode', ModeDirective);

    function ModeDirective() {

        return {
            restrict: 'A',
            link: modeLink
        };

        function modeLink($scope, $elem, $attrs) {
            var showMode = $attrs.mode;
            $scope.$watch('g.mode', function (mode) {
                $elem[mode === showMode ? 'removeClass' : 'addClass']('hidden ng-hide');
            });
        }
    }
});