define('app', ['angular', 'angular-drag-drop-lists'], function (angular, dnd) {
    
    function isDefined(obj) { return typeof obj !== 'undefined'; }

    var app = angular.module('app', ['dndLists'])
        .controller('AppCtrl', ['$scope', '$timeout', function ($scope, $timeout) {

            var retinaMode = {};
            var normalMode = [];

            var gen = $scope.g = {
                mode: 'retina', // the generator mode

                sprites: {
                    showSettings: false,
                    spacing: 2, // the amount of spacing between images in the sprite (px)
                    padding: 0, // the amount of extra empty space added around the images in the sprite (px)
                    orientation: 'vertical', // the sprite orientation. Possible values are 'vertical', 'horizontal', 'diagonal' and 'packed'
                    forcedWidth: '', // A pixel value that forces the width of all images added to the sprite
                    forcedHeight: '' // A pixel value that forces the height of all images added to the sprite
                },

                styles: {
                    showSettings: false,
                    indent: 4, // stylesheet indent spaces
                    type: 'css', // The stylehseet type. Possible values are 'css' and 'scss'.
                    prefix: '', // css image name prefix
                    suffix: '', // css image name suffix
                    spriteName: '', // the name of the stylesheet sprite class
                    imageName: '', // the name of the normal sprite file
                    retinaName: '', // the name of the retian sprite file
                },
                
                preview: {
                    bg: '#808080' // The background color to display behind sprite preview icons
                },

                // images
                images: []
            };

            // state variables
            var state = $scope.s = {
                retina: {
                    trigger: 0
                },
                normal: {
                    trigger: 0
                },
                msg: {
                    invalidSize: null,
                    copy: null
                },
                promise: {
                    invalidSize: null
                },
                trash: []
            };

            // sprite data used to generate stylesheet.
            $scope.spriteData = (function () {
                var data = [];
                data.width = 0;
                data.height = 0;
                return data;
            }());

            // retina sprite data used to only to display information.
            $scope.retinaSpriteData = (function () {
                var data = [];
                data.width = 0;
                data.height = 0;
                return data;
            }());

            // clear trash
            $scope.$watch("s.trash.length", function () {
                state.trash.length = 0;
            });

            // swap retina and normal files when mode is changed so they can
            // be restored if the mode is changed back
            $scope.$watch("g.mode", function (mode) {
                if (mode === 'retina') {
                    normalMode.images = gen.images;
                    normalMode.sprites = angular.extend(normalMode.sprites || {}, gen.sprites);
                    normalMode.styles = angular.extend(normalMode.styles || {}, gen.styles);
                    normalMode.preview = angular.extend(normalMode.preview || {}, gen.preview);

                    gen.images = retinaMode.images || [];
                    if (retinaMode.sprites) {
                        gen.sprites = angular.extend(gen.sprites, retinaMode.sprites);
                        gen.styles = angular.extend(gen.styles, retinaMode.styles);
                        gen.preview = angular.extend(gen.preview, retinaMode.preview);
                    }
                } else if (mode === 'normal') {
                    retinaMode.images = gen.images;
                    retinaMode.sprites = angular.extend(retinaMode.sprites || {}, gen.sprites);
                    retinaMode.styles = angular.extend(retinaMode.styles || {}, gen.styles);
                    retinaMode.preview = angular.extend(retinaMode.preview || {}, gen.preview);

                    gen.images = normalMode.images || [];
                    if (normalMode.sprites) {
                        gen.sprites = angular.extend(gen.sprites, normalMode.sprites);
                        gen.styles = angular.extend(gen.styles, normalMode.styles);
                        gen.preview = angular.extend(gen.preview, normalMode.preview);
                    }
                }
            });

            // Validate generator session object
            $scope.validateGen = function (session) {

                var isValid = (function () {

                    if (!session.mode || !session.styles || !session.sprites || !session.images) {
                        console.log("Missing property");
                        return false;
                    }

                    for (var name in gen.sprites) {
                        if (!isDefined(session.sprites[name])) {
                            console.log("Missing sprites property: " + name);
                            return false;
                        }
                    }

                    for (var name in gen.styles) {
                        if (!isDefined(typeof session.styles[name])) {
                            console.log("Missing styles property: " + name);
                            return false;
                        }
                    }

                    for (var i = 0, img; img = session.images[i]; i++) {
                        if (!img.name || !isDefined(img.w) || !isDefined(img.h) || !img.src) {
                            console.log("Invalid image data");
                            return false;
                        }

                        if (img.normal) {
                            if (!img.normal.name || !isDefined(img.normal.w) || !isDefined(img.normal.h) || !img.normal.src) {
                                console.log("Invalid normal image data");
                                return false;
                            }
                        }
                    }

                    return true;
                }());

                // TODO show error message
                
                return isValid;
            };

            // Set generator session
            $scope.setGen = function (session) {
                gen.mode = session.mode;
                
                // wait for mode change update
                $timeout(function () {}, 0);
                
                $timeout(function () {
                    gen.sprites = session.sprites;
                    gen.styles = session.styles;
                    session.preview && (gen.preview = session.preview);
                    gen.images.length = 0;
                    for (var i = 0, img; img = session.images[i]; i++) {
                        gen.images.push(img);
                    }
                    
                }, 100);
            };

            // update image data title
            $scope.updateDataTitle = function (data) {
                data.title = data.name + ' (' + data.w + ' x ' + data.h + ')';
                if (data.normal) {
                    data.title += '\n' + data.normal.name + ' (' + data.normal.w + ' x ' + data.normal.h + ')';
                }
            };

            // Set invalid size for image data and show error message.
            $scope.setInvalidSize = function (data) {

                if (state.promise.invalidSize) {
                    $timeout.cancel(state.promise.invalidSize);
                    state.promise.invalidSize = null;
                }

                state.msg.invalidSize = {
                    requiredWidth: Math.ceil(data.w * 0.5),
                    requiredHeight: Math.ceil(data.h * 0.5)
                };
                state.promise.invalidSize = $timeout(function () {
                    state.msg.invalidSize = null;
                    state.promise.invalidSize = null
                }, 5000);
            };

            // manually trigger sprites to regenerate
            $scope.triggerSprites = function () {

                $scope.spriteData.length = 0;

                $timeout(function () {
                    $scope.g.mode === 'retina' ? state.retina.trigger++ : state.normal.trigger++;
                }, 0);
            };

            // invoke to display "copy to clipboard confirmation"
            $scope.confirmCopy = function (isSuccess) {
                state.msg.copy = {
                    isSuccess: isSuccess
                };
                $timeout(function () {});
                $timeout(function () {
                    state.msg.copy = null;
                }, 4000);
            };

            // prevent browser from loading files dragged onto the page
            window.addEventListener('dragover', function (e) {
                e = e || event;

                if (!e.toElement || e.toElement.nodeName !== 'INPUT')
                    e.preventDefault();

            }, false);
            window.addEventListener('drop', function (e) {
                e = e || event;

                if (!e.toElement || e.toElement.nodeName !== 'INPUT')
                    e.preventDefault();

            }, false);
        }]);

    
    angular.element(document).ready(function () {
        angular.bootstrap(document.body, ['app']);
    });

    return app;
});