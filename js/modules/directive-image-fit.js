define(['angular', 'app', 'image-background'], function (angular, app, bgImage) {

    /* DIRECTIVE: (data-image-fit) Use on an image element. Gets the image and resizes it to fit the width and height of the container while
                maintaining the aspect ratio of the displayed image. If the image is smaller than the element, it is simply centered. */
    app.directive('imageFit', function () {
        return {
            restrict: 'A',
            link: function (scope, elem, attrs) {

                var currentSrc = null;
                elem.css('opacity', 0);

                function update(src) {
                    if (!src || currentSrc === src)
                        return;

                    elem.css('opacity', 0);

                    currentSrc = src;

                    var image = new Image();
                    image.onload = function () {

                        var canvas = document.createElement('CANVAS');
                        var context = canvas.getContext('2d');
                        var rect = elem[0].getBoundingClientRect();
                        canvas.width = rect.width;
                        canvas.height = rect.height;

                        // draw background
                        var totalX = Math.ceil(canvas.width / bgImage.width);
                        var totalY = Math.ceil(canvas.height / bgImage.height);
                        for (var x = 0; x < totalX; x++) {
                            for (var y = 0; y < totalY; y++) {
                                context.drawImage(bgImage, x * bgImage.width, y * bgImage.height,
                                    bgImage.width, bgImage.height);
                            }
                        }

                        var ratio = image.height / image.width;
                        var imgWidth = Math.min(canvas.width, image.width);
                        var imgHeight = imgWidth * ratio;
                        var top = (canvas.height - imgHeight) / 2;
                        var left = (canvas.width - imgWidth) / 2;

                        context.drawImage(image, left, top, imgWidth, imgHeight);
                        elem[0].src = canvas.toDataURL('image/png');
                        elem.css('opacity', 1);
                    }
                    image.src = src;
                }

                scope.$watch(function () {
                    return elem[0].src;
                }, function (src) {
                    src && update(src);
                })
            }
        }
    });


});