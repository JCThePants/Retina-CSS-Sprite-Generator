define(['angular', 'app'], function (angular, app) {

    /** DIRECTIVE: (<text-box>) Stylized text box element */
    app.directive('numbersOnly', NumbersOnlyDirective);

    function NumbersOnlyDirective() {
        return {
            restrict: 'AC',
            scope: false,
            link: numbersOnlyLink
        };

        function numbersOnlyLink ($scope, $elem) {

            $elem.on('keypress', function (e) {
                var key;

                if (window.event)
                    key = window.event.keyCode;
                else if (e)
                    key = e.which;
                else
                    return true;

                if (key < 48 || key > 57) {
                    e.preventDefault();
                }
            });
        }
    }
});