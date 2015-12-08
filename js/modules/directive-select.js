define(['angular', 'app'], function (angular, app) {

    /* DIRECTIVE: (.select) Custom select element */

    // select
    app.directive('select', ['$parse', function ($parse) {

        var index = 200;

        return {
            restrict: 'C',
            scope: {
                model: '=model'
            },
            link: function (scope, elem, attrs) {

                elem.css('z-index', index--);

                scope.isOpen = elem.hasClass('open');

                var btn = angular.element('<span class="btn"></span>');
                var lblTitle = angular.element('<span class="title">' + attrs.title + '</span>');
                var lblValue = angular.element('<span class="value"></span>');
                var ddl = angular.element(elem[0].querySelector('.dropdown'));
                var li = angular.element(elem[0].querySelectorAll('li'));
                var body = angular.element(document.body);
                
                elem.prepend(btn).prepend(lblValue).prepend(lblTitle);

                var close = function () {
                    elem.removeClass('open');
                    body.unbind('click', close);
                    scope.isOpen = false;
                    setTimeout(function () {
                        ddl.css({
                            width: elem[0].getBoundingClientRect().width + 'px'
                        });
                    });
                };

                // select click handler
                elem.on('click', function () {
                    scope.isOpen = !scope.isOpen;
                    if (scope.isOpen) {
                        elem.addClass('open');
                        setTimeout(function () {
                            ddl.css({
                                width: elem[0].getBoundingClientRect().width + 'px'
                            });
                            body.bind('click', close);
                        });
                    } else {
                        close();
                    }
                });

                // prevent clicking in drop down from causing double action
                ddl.on('click', function (e) {
                    e.stopImmediatePropagation();
                });

                // set initial selected value
                var selected = angular.element(ddl[0].querySelector('li[data-value="' + scope.model + '"]'));
                if (selected.length !== 0) {
                    var value = selected.attr('data-value') || selected.text();
                    scope.model = value;
                    lblValue[attrs.showHtml ? 'html' : 'text'](attrs.title + ' - ' + selected[attrs.showHtml ? 'html' : 'text']());
                    elem.addClass('has-value');
                    selected.attr('data-selected', 'true');
                }

                // dropdown item click handler
                li.on('click', function (e) {
                    selected.removeAttr('data-selected');
                    selected = angular.element(this);
                    selected.attr('data-selected', true);
                    scope.model = selected.attr("data-value") || selected.text();
                    lblValue[attrs.showHtml ? 'html' : 'text'](attrs.title + ' - ' + selected[attrs.showHtml ? 'html' : 'text']());
                    elem.addClass('has-value');
                    attrs.onSelect && $parse(attrs.onSelect)(scope.$parent);
                    close();
                    scope.$apply();
                });

                scope.$watch('model', function (value) {
                    selected.removeAttr('data-selected');
                    selected = angular.element(ddl[0].querySelector('li[data-value="' + value + '"]'));
                    if (selected.length !== 0) {
                        lblValue[attrs.showHtml ? 'html' : 'text'](attrs.title + ' - ' + selected[attrs.showHtml ? 'html' : 'text']());
                        elem.addClass('has-value');
                        selected.attr('data-selected', 'true');
                    } else {
                        lblValue.text('');
                        elem.removeClass('has-value');
                    }
                });
            }
        };
    }]);

});