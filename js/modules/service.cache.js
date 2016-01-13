define(['angular', 'app'], function (angular, app) {

    /** Service: Global Cache **/
    app.service('cache', function () {

        var cache = {};

        this.get = function (key) {
            return cache[key];
        };

        this.set = function (key, value) {
            cache[key] = value;
        };
    });
});