define(['angular', 'app'], function (angular, app) {

    document.registerElement && document.registerElement('space-indent', {
        prototype: Object.create(HTMLSpanElement.prototype),
        parent: 'span'
    });

    /* DIRECTIVE: (data-space-indent) Prepend indents to child elements that have the 'data-indent' attribute */
    app.directive('spaceIndent', SpaceIndentDirective);

    function SpaceIndentDirective() {

        return {
            restrict: 'E',
            scope: {
                spaces: '=spaces',
                update: '=update'
            },
            link: spaceIndentLink
        };

        function spaceIndentLink($scope, $elem) {

            update($elem, $scope.spaces);

            $scope.$watchGroup(['spaces', 'update'], function () {
                update($elem, $scope.spaces);
            });
        }

        function indent(elem, spaces, depth) {

            var indentSpaces = (function () {
                var result = '';
                for (var i = 0; i < spaces * depth; i++) {
                    result += '&nbsp;';
                }
                return result;
            }());

            var children = elem.children();

            for (var i = 0, child; child = children[i]; i++) {
                var achild = angular.element(child);
                var adepth = depth;
                if (achild[0].hasAttribute('indent') || achild[0].hasAttribute('data-indent')) {
                    achild.prepend(angular.element('<span class="indent-spaces">' + indentSpaces + '</span>'));
                    adepth++;
                } else if (achild[0].hasAttribute('indent-container') || achild[0].hasAttribute('data-indent-container')) {
                    adepth++;
                }
                indent(achild, spaces, adepth);
            }
        }

        // update indents
        function update(elem, spaces) {

            var indentSpaces = elem[0].querySelectorAll('.indent-spaces');
            for (var i = 0, s; s = indentSpaces[i]; i++) {
                s.parentElement.removeChild(s);
            }

            indent(elem, spaces, 1);
        }
    }

});