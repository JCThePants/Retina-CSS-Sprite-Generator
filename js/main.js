require.config({
    baseUrl: 'js/',
    paths: {
        'requireLib': 'libs/require.min',
        'angular': 'libs/angular.min',
        'angular-drag-drop-lists': 'libs/angular-drag-and-drop-lists.min',
        'image-background': 'modules/var-image-background'
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
        }
    }
});

require([
        'angular',
        'angular-drag-drop-lists',
        'app',
        'modules/directive-a',
        'modules/directive-anchor-smooth-scroll',
        'modules/directive-copy-btn',
        'modules/directive-css-sprite',
        'modules/directive-drag-scroll',
        'modules/directive-ext-template',
        'modules/directive-image-fit',
        'modules/directive-image-upload',
        'modules/directive-save-session-btn',
        'modules/directive-load-session-btn',
        'modules/directive-popup',
        'modules/directive-select',
        'modules/directive-show-mode',
        'modules/directive-space-indent',
        'modules/directive-sprite-preview',
        'modules/directive-text-box'
    ], function () {
    
});