define(['angular', 'app'], function (angular, app) {

    /** FACTORY: Global Cache **/
    app.factory('cache', function () {
        
        var cache = {};
        
        return {
            get: function (key) {
                return cache[key];  
            },
            
            set: function (key, value) {
                cache[key] = value;
            }
        };
    });
});