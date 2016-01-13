define(['angular', 'app'], function (angular, app) {

    /** DIRECTIVE: (<text-box>) Stylized text box element */
    app.directive('maxChars', MaxCharsDirective);

    function MaxCharsDirective() {
        return {
            restrict: 'A',
            scope: false,
            link: maxCharsLink
        };

        function maxCharsLink ($scope, $elem, $attrs) {

            $elem.on('keypress', function (e) {
                var max = parseInt($attrs.maxChars);
                try {
                    max += Math.abs($elem[0].selectionEnd - $elem[0].selectionStart);
                } catch (err) {}

                if ($elem.val().length >= max) {
                    e.preventDefault();
                }
            });
        }
    }
});