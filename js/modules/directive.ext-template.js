define(['angular', 'app'], function (angular, app) {

    document.registerElement && document.registerElement('ext-template');

    /** DIRECTIVE: (<template>) External template */
    app.directive('extTemplate', ['$http', '$compile', function ($http, $compile) {
        return {
            restrict: 'E',
            scope: {
                path: '@path'
            },
            link: function (scope, elem, attrs) {
                scope.$watch('path', function (path) {
                    if (!path)
                        return;

                    $http.get('templates/' + path + '.htm').then(function (result) {
                        elem.html('').append($compile(result.data)(scope.$parent));
                    });
                });
            }
        };

    }]);

});