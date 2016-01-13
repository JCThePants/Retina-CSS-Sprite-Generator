define(['angular', 'app'], function (angular, app) {

    /** DIRECTIVE (<load-session-btn>) Load generator session from file **/
    app.directive('loadSessionBtn', LoadSessionBtnDirective);

    function LoadSessionBtnDirective() {

        return {
            restrict: 'A',
            link: loadSessionBtnLink
        };

        function loadSessionBtnLink($scope, $elem) {

            $elem.on('change', function (e) {
                var file = e.target.files[0];
                var reader = new FileReader();

                reader.onload = function (e) {

                    var session = angular.fromJson(e.target.result);
                    if (!$scope.validateGen(session)) {
                        return;
                    }

                    $scope.setGen(session);
                };
                reader.readAsText(file);
            });
        }
    }
});