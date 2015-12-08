define(['angular', 'app'], function (angular, app) {

    document.registerElement && document.registerElement('sprite-preview');

    /** DIRECTIVE (<sprite-preview>) Display sprite preview in iframe **/
    app.directive('spritePreview', ['$timeout', function ($timeout) {
        return {
            restrict: 'E',
            scope: {
                source: '=source',
                width: '=spriteWidth',
                height: '=spriteHeight',
                imageSrc: '=imageSource',
                background: '=background'
            },
            link: function (scope, elem, attrs) {
                var promise;
                var iframe = angular.element(document.createElement('IFRAME'));
                elem.append(iframe);

                function generateStyles(data) {
                    var result = '.icon{display:inline-block;background:url(' + (scope.imageSrc || data.src) + ') no-repeat top left;';
                    result += 'background-size:' + (scope.width || data.w) + 'px ' + (scope.height || data.h) + 'px}';
                    for (var i = 0, item; item = data[i]; i++) {
                        result += '.icon.' + item.name + '{';
                        result += 'background-position:-' + item.x + 'px -' + item.y + 'px;';
                        result += 'width:' + (item.w || data.cmw) + 'px;';
                        result += 'height:' + (item.h || data.cmh) + 'px;';
                        result += '}';
                    }
                    return result;
                }
                
                scope.$watch('background', function (bg) {
                    iframe.css('background', bg);                    
                });

                scope.$watch('source', function (source) {
                    if (!scope.source || elem.hasClass('ng-hide'))
                        return;
                    
                    if (promise)
                        $timeout.cancel(promise);
                    
                    promise = $timeout(function () {

                        var content = '<!DOCTYPE html><html><head><style>' + generateStyles(scope.source) + '</style></head><body>';

                        for (var i = 0, item; item = scope.source[i]; i++) {
                            content += '<div class="icon ' + item.name + '"></div>';
                        }

                        content += '</body></html>';
                        iframe[0].contentWindow.contents = content;
                        iframe[0].src = 'javascript:window["contents"]';
                        
                        promise = null;

                    }, 10);
                });
            }
        };
    }]);
});