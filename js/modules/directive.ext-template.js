define(['angular', 'app'], function (angular, app) {

    document.registerElement && document.registerElement('ext-template');

    /** DIRECTIVE: (<template>) External template */
    ExtTemplateDirective.$inject = ['$http', '$compile'];
    app.directive('extTemplate', ExtTemplateDirective);

    function ExtTemplateDirective($http, $compile) {
        return {
            restrict: 'E',
            scope: {
                path: '@path'
            },
            link: extTemplateLink
        };

        function extTemplateLink($scope, $elem) {
            $scope.$watch('path', function (path) {
                if (!path)
                    return;

                $http.get('templates/' + path + '.htm').then(function (result) {
                    $elem.html('').append($compile(result.data)($scope.$parent));
                });
            });
        }
    }
});