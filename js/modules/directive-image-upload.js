define(['app', 'modules/directive-css-sprite'], function (app) {

    /* DIRECTIVE: (data-image-upload) Image upload button */
    app.directive('imageUpload', ['$timeout', '$parse', function ($timeout, $parse) {

        var directive = {
            priority: 2,
            restrict: 'EA',
            scope: {
                output: '=output'
            },
            link: function (scope, elem, attrs) {

                // dnd drag compatibility
                if (elem.parent().hasClass('dndPlaceholder'))
                    return;

                scope.onInvalidSize = attrs.onInvalidSize;
                scope.onUpload = attrs.onUpload;
                scope.isMultiple = typeof attrs.multiple !== 'undefined';
                scope.requiredWidth = attrs.requiredWidth;
                scope.requiredHeight = attrs.requiredHeight;

                var title = attrs.title ? ' title="' + attrs.title + '"' : '';
                var accept = ' accept="' + (attrs.accept || 'image/*') + '"';
                var multiple = scope.isMultiple ? ' multiple="multiple"' : '';

                var input = angular.element('<input type="file"' + multiple + accept + title + '>');
                elem.append(input);

                input.on('change', function (e) {
                    readFiles(scope, e.target.files);
                    input.val(null);
                });
            }
        };

        // read all uploaded files and prepare data objects to place into the scope files
        function readFiles(scope, files) {

            var loader;
            var callback = function (data) {
                $timeout(function () {

                    if (loader.isInvalidSize())
                        return;

                    if (scope.isMultiple) {
                        scope.output = scope.output || [];

                        for (var i = 0, img; img = data[i]; i++) {
                            scope.output.push(img);
                        }
                    } else {
                        scope.output = data[0];
                    }

                    scope.onUpload && $parse(scope.onUpload)(scope.$parent);
                }, 0);
            };
            loader = new ImageLoader(scope, callback);

            // iterate files for processing
            for (var i = 0, file; file = files[i]; i++) {

                // must be an image file
                if (!file.type.match('image.*'))
                    continue;

                loader.add({

                    name: (function () {
                        var name = file.name.substr(0, file.name.lastIndexOf('.')) || file.name;
                        return name.replace(/ ./g, '_');
                    }()),
                    type: file.type

                }, file, i);

                if (loader.isInvalidSize())
                    break;
            }

            loader.complete();
        }

        // Image Loader: loads images and runs callback when complete
        function ImageLoader(scope, callback) {

            var dataArray = [];
            var loading = 0;
            var isComplete = false;
            var isInvalidSize = false;

            var requiredWidth = typeof scope.requiredWidth !== 'undefined' ? $parse(scope.requiredWidth)(scope.$parent) : false;
            var requiredHeight = typeof scope.requiredHeight !== 'undefined' ? $parse(scope.requiredHeight)(scope.$parent) : false;

            // check size to make sure it meets required size
            function checkSize(required, actual) {
                required = Math.ceil(required);
                return required === actual || required - 1 === actual;
            }

            /**
             * Determine if an uploaded image had an invalid file size.
             */
            this.isInvalidSize = function () {
                return isInvalidSize;
            };

            /**
             * Add Image file to load
             * @param   {object} img   The data object to put data into.
             * @param   {File}   file  The file to load.
             * @param   {Number} index The file index.
             */
            this.add = function (img, file, index) {
                if (isInvalidSize)
                    return;

                loading++;

                var reader = new FileReader();
                reader.onload = function (e) {
                    dataArray[index] = img;
                    img.src = e.target.result;

                    var image = new Image();
                    image.onload = function () {
                        img.w = image.width;
                        img.h = image.height;
                        img.title = img.name + ' (' + img.w + ' x ' + img.h + ')';
                        loading--;

                        if ((requiredWidth && !checkSize(requiredWidth, img.w)) || (requiredHeight && !checkSize(requiredHeight, img.h))) {
                            isInvalidSize = true;
                            scope.onInvalidSize && $timeout(function () {
                                $parse(scope.onInvalidSize)(scope.$parent);
                            }, 0);
                        } else {
                            isComplete && loading === 0 && callback && callback(dataArray);
                        }
                    }
                    image.src = img.src;
                };

                // Read in the image file as a data URL.
                reader.readAsDataURL(file);
            }

            /**
             * Invoke once all files have been added to the loader.
             */
            this.complete = function () {
                if (loading === 0) {
                    callback && callback(dataArray);
                }
                isComplete = true;
            }
        }

        return directive;
        }]);
});