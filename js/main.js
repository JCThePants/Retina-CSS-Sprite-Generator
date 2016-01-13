require.config({
    baseUrl: 'js/',
    paths: {
        'requireLib': 'libs/require.min',
        'angular': 'libs/angular.min',
        'angular-drag-drop-lists': 'libs/angular-drag-and-drop-lists.min',
        'ios-drag-drop': 'libs/ios-drag-drop',
        'image-background': 'modules/var-image-background',
        'cache': 'modules/service.cache',
        'rawUI': 'libs/raw-ui.min'
    },
    shim: {
        'main' : {
            deps: ['requireLib', 'angular', 'angular-drag-drop-lists'],
            exports: 'require'
        },
        'angular': {
            exports: 'angular'
        },
        'angular-drag-drop-lists': {
            deps: ['angular'],
            exports: 'angular'
        },
        'ios-drag-drop': {
            deps: ['angular', 'angular-drag-drop-lists', 'app'],
            exports: 'angular'
        },
        'rawUI': {
            deps: ['angular'],
            exports: 'angular'
        }
    }
});

require([
    'angular',
    'angular-drag-drop-lists',
    'ios-drag-drop',
    'app',
    'modules/directive.anchor-smooth-scroll',
    'modules/directive.copy-btn',
    'modules/directive.css-sprite',
    'modules/directive.drag-scroll',
    'modules/directive.ext-template',
    'modules/directive.image-fit',
    'modules/directive.image-upload',
    'modules/directive.save-session-btn',
    'modules/directive.load-session-btn',
    'modules/directive.max-chars',
    'modules/directive.mode',
    'modules/directive.numbers-only',
    'modules/directive.space-indent',
    'modules/directive.sprite-preview'
], function () {

});