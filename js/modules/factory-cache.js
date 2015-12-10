define(['angular', 'app'], function (angular, app) {

    /** DIRECTIVE (<A>) Prevent clicks on disabled buttons **/
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