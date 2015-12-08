define(['angular', 'app'], function (angular, app) {

    document.registerElement && document.registerElement('text-box');

    /** DIRECTIVE: (<text-box>) Stylized text box element */
    app.directive('textBox', ['$compile', '$parse', function ($compile, $parse) {
        return {
            restrict: 'E',
            scope: {
                model: '@model'
            },
            link: function (scope, elem, attrs) {

                var type = attrs.type || 'text';
                var templateType = type;
                if (type === 'number')
                    templateType = 'text'; // number does not allow text selection

                var inner =
                    '<span class="icon clear"></span>' +
                    '<input type="' + templateType + '" data-ng-model="' + scope.model + '" id="' + attrs.inputId + '">' +
                    '<label class="default-text" for="' + attrs.inputId + '" data-ng-class="{\'hidden\': ' + scope.model + '}">' + attrs.title + '</label>';

                var linkFn = $compile(inner);
                elem.append(linkFn(scope.$parent));
                var input = angular.element(elem[0].querySelector('input'));

                if (attrs.onBlur) {
                    input.on('blur', function () {
                        $parse(attrs.onBlur)(scope.$parent);
                    });
                }

                if (type === 'number' || attrs.maxChars) {

                    input.on('keypress', function (e) {

                        if (type === 'number') {
                            var key;
                            var keychar;

                            if (window.event)
                                key = window.event.keyCode;
                            else if (e)
                                key = e.which;
                            else
                                return true;

                            keychar = String.fromCharCode(key);

                            if (key < 48 || key > 57) {
                                e.preventDefault();
                            }
                        }

                        if (attrs.maxChars) {
                            var max = parseInt(attrs.maxChars);
                            try {
                                max += Math.abs(input[0].selectionEnd - input[0].selectionStart);
                            } catch (err) {}

                            if (input.val().length >= max) {
                                e.preventDefault();
                            }
                        }

                    });
                }
            }
        };
    }]);
});