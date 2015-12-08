define(['angular', 'app'], function (angular, app) {

    // returns a canvas that can be used to draw image background
    return (function () {
        var canvas = document.createElement('CANVAS');
        var context = canvas.getContext('2d');
        canvas.width = 16;
        canvas.height = 16;

        function rect(x, y, x1, y1, color) {
            context.beginPath();
            context.rect(x, y, x1, y1);
            context.fillStyle = color;
            context.fill();
        }
        
        rect(0, 0, 16, 16, '#ffffff');
        rect(8, 0, 16, 8, '#d7d7d7');
        rect(0, 8, 8, 16, '#d7d7d7');

        return canvas;
    }());
});