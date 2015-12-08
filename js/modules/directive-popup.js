define(['angular', 'app'], function (angular, app) {

    document.registerElement && document.registerElement('popup-button');
    document.registerElement && document.registerElement('popup-container');

    // Popup display states
    var popup = (function () {

        var self;

        // close popup if clicking outside of box
        window.addEventListener('click', function (e) {
            var elem = e.target;
            while (elem) {
                if (typeof angular.element(elem).attr('data-popup-element') !== 'undefined')
                    return;
                elem = elem.parentElement;
            }
            self.closeAll();
        });

        return self = {
            states: {},
            containers: {},
            toggle: function (stateName) {
                self.closeAll(stateName);
                var isOpen = self.states[stateName] = !self.states[stateName];
                self.update(stateName, isOpen);
                return self.states[stateName];
            },
            closeAll: function (except) {
                for (var name in self.states) {
                    if (name === except)
                        continue;

                    self.states[name] = false;
                    self.update(name, false);
                }
            },
            isShown: function (stateName) {
                return self.states[stateName];
            },
            update: function (name, isOpen) {
                var container = document.getElementById(name);
                angular.element(container)[isOpen ? 'addClass' : 'removeClass']('open');
            }
        }

    }());


    /** DIRECTIVE (<popup-btn>) Popup toggle button. Requires 'data-container-id' 
        attribute with the ID of the popup container. **/
    app.directive('popupButton', ['$timeout', function ($timeout) {
        
        return {
            restrict: 'E',
            link: function (scope, elem, attrs) {
                var id = attrs.containerId;
                if (!id)
                    return;
                
                elem.attr('data-popup-element', true);
                elem.on('click', function (e) {
                    popup.toggle(id);
                });
            }
        };
    }]);
    
    
    /** DIRECTIVE (<popup-container>) Popup element container. Prevents the popup from closing 
        when clicked. Requires ID attribute to work with toggle button **/
    app.directive('popupContainer', function () {
        return {
            restrict: 'E',
            link: function (scope, elem, attrs) {
                elem.attr('data-popup-element', true);
            }
        };
    });
    
});