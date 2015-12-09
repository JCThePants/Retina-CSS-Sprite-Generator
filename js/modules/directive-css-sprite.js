define(['angular', 'app', 'modules/lib-box-packing', 'image-background'], function (angular, app, bp, bgImage) {

    document.registerElement && document.registerElement('css-sprite');

    /* DIRECTIVE: (<sprite>) Renders sprite from an input array and optionally outputs data for use in generating a stylesheet. */
    app.directive('cssSprite', ['$timeout', '$parse', function ($timeout, $parse) {

        var self = {
            restrict: 'E',
            scope: {
                scale: '=scale',
                source: '=source',
                spacing: '=spacing',
                padding: '=padding',
                orientation: '=orientation',
                output: '=output',
                trigger: '=trigger'
            },
            link: function (scope, elem, attrs) {

                scope.canvas = document.createElement("CANVAS");
                scope.canvas.style.background = 'url(' + bgImage.toDataURL() + ')';
                elem.append(angular.element(scope.canvas));

                scope.unparsedIconWidth = attrs.iconWidth;
                scope.unparsedIconHeight = attrs.iconHeight;
                scope.itemSource = attrs.itemSource;
                scope.renderChild = typeof attrs.renderChild !== 'undefined';
                var promise;

                scope.$watchGroup(['source.length', 'scale', 'spacing', 'padding', 'orientation', 'iconWidth', 'iconHeight', 'trigger'], function (e) {
                    if (!scope.source || elem.hasClass('ng-hide'))
                        return;

                    if (scope.promise) {
                        $timeout.cancel(scope.promise);
                        scope.promise = null;
                    }

                    if (scope.boxPromise) {
                        $timeout.cancel(scope.boxPromise);
                        scope.boxPromise = null;
                    }

                    scope.iconWidth = parseInt($parse(scope.unparsedIconWidth)(scope.$parent));
                    scope.iconHeight = parseInt($parse(scope.unparsedIconHeight)(scope.$parent));
                    
                    if (promise)
                        $timeout.cancel(promise);

                    promise = $timeout(function () {
                        var imgLoader = new RefImageLoader(scope, function (images) {

                            if (scope.orientation === 'packed') {
                                renderPack(images, scope);
                            } else {
                                renderImages(images, scope);
                            }
                            scope.refImages = images;
                        });

                        for (var i = 0, data; data = scope.source[i]; i++) {
                            imgLoader.add(data, i);
                        }
                        imgLoader.complete();
                        promise = null;
                    }, 10);
                });
            }
        };


        // Creates and loads image objects for reference and invoke callback when complete.
        function RefImageLoader(scope, callback) {

            var images = [];
            var loading = 0;
            var isComplete = false;

            /**
             * Add image data to load.
             * @param {object}   img   The image data object.
             * @param {Number}   index The image index position.
             */
            this.add = function (img, index) {
                loading++;

                if (scope.renderChild && img.normal) {
                    img.normal.parent = img; // add circular reference for use by getImageSizes function, will be removed
                    img = img.normal;
                }

                var image = new Image();
                image.onload = function () {
                    image.data = img;
                    images[index] = image;
                    loading--;
                    if (isComplete && loading === 0) {
                        callback && callback(images);
                    }
                }

                image.src = img.src;
            }

            /**
             * Invoke after all image data has been added.
             */
            this.complete = function () {
                if (loading === 0) {
                    callback && callback(images);
                }
                isComplete = true;
            }
        }


        // render images into sprite canvase
        function renderImages(images, scope) {
            var s = getScopeData(scope);

            s.context.clearRect(0, 0, s.canvas.width, s.canvas.height);

            var canvasSize = getCanvasSize(images, s);
            var width = s.canvas.width = canvasSize.w;
            var height = s.canvas.height = canvasSize.h;
            var common = canvasSize.common;
            s.canvas.style.width = width + 'px';
            s.canvas.style.height = height + 'px';

            // draw images into canvas
            scope.promise = $timeout(function () {

                s.context.clearRect(0, 0, s.canvas.width, s.canvas.height);

                var output = scope.output = [];

                // set overall sprite size
                output.w = width;
                output.h = height;

                // set most common width and height of individual images
                output.cmw = common.width;
                output.cmh = common.height;

                // render
                for (var i = 0, y = 0, x = 0, image; image = images[i]; i++) {

                    var sizes = image.dimensions;

                    s.context.drawImage(image, x + sizes.x, y + sizes.y, sizes.dw, sizes.dh);

                    var outData = {
                        name: image.data.name,
                        y: y,
                        x: x
                    };

                    // increment sprite position X
                    if (s.orientation === 'horizontal' || s.orientation === 'diagonal') {
                        x += sizes.cw + s.spacing;
                    }

                    // increment sprite position Y
                    if (s.orientation === 'vertical' || s.orientation == 'diagonal') {
                        y += sizes.ch + s.spacing;
                    }

                    // only add sizes if they deviate from the most common sizes
                    if (common.width !== sizes.cw)
                        outData.w = sizes.cw;

                    if (common.height !== sizes.ch)
                        outData.h = sizes.ch;

                    output.push(outData);
                }

                output.compr = width * height * (s.canvas.toDataURL("image/jpeg", 0.5).length / s.canvas.toDataURL("image/jpeg", 1).length);
                output.src = s.canvas.toDataURL();
                scope.promise = null;
            }, 10);
        }

        // render images into canvas using box packing dimensions
        function renderPack(images, scope) {

            var s = getScopeData(scope);
            var sizeTracker = new SizeTracker();
            var box = [];

            // compile data for the box packer
            for (var i = 0, image; image = images[i]; i++) {

                var sizes = image.dimensions = getImageSizes(image.data, s);
                sizeTracker.add(sizes.cw, sizes.ch);

                box.push({
                    w: sizes.cw + s.spacing,
                    h: sizes.ch + s.spacing,
                    index: i,

                    // these are for use in rendering and are not used by box packer
                    image: image,
                    sizes: sizes
                });
            }

            bp(box);

            s.canvas.width = box.w;
            s.canvas.height = box.h;
            s.canvas.style.width = box.w + 'px';
            s.canvas.style.height = box.h + 'px';
            var common = sizeTracker.mostCommon(0.55);

            // draw images into canvas
            scope.boxPromise = $timeout(function () {

                s.context.clearRect(0, 0, s.canvas.width, s.canvas.height);

                var output = scope.output = [];

                // set overall sprite size
                output.w = box.w;
                output.h = box.h;

                // set most common width and height of individual images
                output.cmw = common.width;
                output.cmh = common.height;

                for (var i = 0, item; item = box[i]; i++) {
                    var x = item.fit.x;
                    var y = item.fit.y;
                    s.context.drawImage(item.image, (x || 0) + item.sizes.x, (y || 0) + item.sizes.y, item.sizes.dw, item.sizes.dh);

                    var outData = {
                        name: item.image.data.name,
                        y: y,
                        x: x
                    };

                    // only add sizes if they deviate from the most common sizes
                    if (common.width !== item.sizes.cw)
                        outData.w = item.sizes.cw;

                    if (common.height !== item.sizes.ch)
                        outData.h = item.sizes.ch;

                    output.push(outData);
                }
                output.compr = box.w * box.h * (s.canvas.toDataURL("image/jpeg", 0.5).length / s.canvas.toDataURL("image/jpeg", 1).length);
                output.src = s.canvas.toDataURL();
                scope.boxPromise = null;
            }, 10);
        }


        function getScopeData(scope) {
            return {
                canvas: scope.canvas,
                context: scope.canvas.getContext("2d"),
                scale: scope.scale || 1,
                spacing: Math.ceil((typeof scope.spacing !== 'undefined' ? scope.spacing : 2) * (scope.scale || 1)),
                padding: Math.ceil((typeof scope.spacing !== 'undefined' ? scope.padding : 2) * (scope.scale || 1)),
                orientation: scope.orientation || 'vertical',
                iconWidth: scope.iconWidth,
                iconHeight: scope.iconHeight
            };
        }

        // tracks images sizes for the purpose of optimizing data output
        function SizeTracker() {
            var total = 0;

            var widths = [];
            var heights = [];

            /**
             * Add a size
             */
            this.add = function (width, height) {
                _add(width, widths);
                _add(height, heights);
                _sort(widths);
                _sort(heights);
                total++;
            }

            /**
             * Calculate the most common width and/or height.
             * @param   {Float} thresh Percentage of total sizes that must be matched or exceeded.
             * @returns {Object} { width, height } Either property may return false if there is no common size.
             */
            this.mostCommon = function (thresh) {
                var commonWidth = widths[0];
                var commonHeight = heights[0];

                var result = {
                    width: false,
                    height: false
                };

                if (total && widths[0].length / total >= thresh) {
                    result.width = widths[0][0];
                }

                if (total && heights[0].length / total >= thresh) {
                    result.height = heights[0][0];
                }

                return result;
            }

            // util. Add size to array
            function _add(size, array) {
                size = Math.ceil(size);
                for (var i = 0, e; e = array[i]; i++) {
                    if (e[0] === size) {
                        e.push(size);
                        return;
                    }
                }
                array.push([size]);
            }

            // util. sort array by sizes
            function _sort(array) {
                array.sort(function (a, b) {
                    return b.length - a.length;
                });
            }
        }

        // calculate the size of the canvas for all orientations except 'pack'
        function getCanvasSize(images, s) {

            var width = 0;
            var height = 0;
            var sizeTracker = new SizeTracker();

            // measure first
            for (var i = 0, image; image = images[i]; i++) {

                var sizes = image.dimensions = getImageSizes(image.data, s);
                sizeTracker.add(sizes.cw, sizes.ch);

                // increment/set total image size
                if (s.orientation === 'horizontal') {
                    width += sizes.cw + s.spacing;
                    height = Math.max(sizes.ch, height);
                } else if (s.orientation === 'vertical') {
                    width = Math.max(sizes.cw, width);
                    height += sizes.ch + s.spacing;
                } else if (s.orientation === 'diagonal') {
                    width += sizes.cw + s.spacing;
                    height += sizes.ch + s.spacing;
                }
            }

            return {
                w: width,
                h: height,
                common: sizeTracker.mostCommon(0.55)
            }
        }

        // get sizes for an image
        function getImageSizes(data, s) {

            var result = {
                dw: Math.ceil(data.w * (data.parent ? 1 : s.scale)),
                dh: Math.ceil(data.h * (data.parent ? 1 : s.scale)),
                cw: Math.ceil((data.parent ? data.parent.w : data.w) * s.scale) + (s.padding * 2),
                ch: Math.ceil((data.parent ? data.parent.h : data.h) * s.scale) + (s.padding * 2),
                y: s.padding,
                x: s.padding
            };

            // force image to fit into constraints
            if (s.iconWidth || s.iconHeight) {
                var slotWidth = (result.cw = s.iconWidth ? s.iconWidth : result.cw);
                var slotHeight = (result.ch = s.iconHeight ? s.iconHeight : result.ch);
                var width = result.dw;
                var height = result.dh;

                if (width > slotWidth || height > slotHeight) {

                    var ratio = result.dh / result.dw;
                    width = slotWidth;
                    height = slotWidth * ratio;
                    if (height > slotHeight) {
                        ratio = result.dw / result.dh;
                        width = slotHeight * ratio;
                        height = slotHeight;
                    }
                }

                result.dw = width;
                result.dh = height;
                result.y = s.padding + Math.ceil((slotHeight - height) / 2);
                result.x = s.padding + Math.ceil((slotWidth - width) / 2);
            }
            // remove circular reference since it is no longer required and
            // causes issues with drag drop json conversion.
            data.parent = undefined;

            return result;
        }

        return self;
 }]);
});