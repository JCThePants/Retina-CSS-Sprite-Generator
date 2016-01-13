define(['angular', 'app'], function (angular, app) {

    /** DIRECTIVE (<save-session-btn>) Save the current generator session to a file. **/
    app.directive('saveSessionBtn', SaveSessionBtnDirective);

    function SaveSessionBtnDirective() {

        return {
            restrict: 'A',
            link: saveSessionBtnLink
        };

        function saveSessionBtnLink($scope, $elem) {
            $elem.on('click', function () {
                var gen = $scope.g;

                var session = {
                    mode: gen.mode,
                    sprites: gen.sprites,
                    styles: gen.styles,
                    images: []
                };

                for (var i = 0, img; img = gen.images[i]; i++) {
                    var data = {
                        name: img.name,
                        w: img.w,
                        h: img.h,
                        src: img.src,
                        type: img.type
                    };

                    if (img.normal) {
                        data.normal = {
                            name: img.normal.name,
                            w: img.normal.w,
                            h: img.normal.h,
                            src: img.normal.src,
                            type: img.normal.type
                        }
                    }

                    session.images.push(data);
                }

                session.version = 1;

                var json = angular.toJson(session);
                $elem
                    .attr('filename', 'sprite-session.json')
                    .attr('href', 'data:text/plain;charset=utf-8,' + json);
            });
        }
    }
});