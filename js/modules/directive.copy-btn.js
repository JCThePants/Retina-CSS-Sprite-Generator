define(['angular', 'app'], function (angular, app) {
    
    /** DIRECTIVE (data-copy-btn) Copy text to the clipboard when button is clicked **/
    CopyBtnDirective.$inject = ['$parse'];
    app.directive('copyBtn', CopyBtnDirective);

    function CopyBtnDirective($parse) {

        return {
            restrict: A,
            link: copyBtnLink
        };

        function copyBtnLink($scope, $elem, $attrs) {
            var textId = $attrs.copyBtn,
                successCallback = $attrs.onSuccess,
                failCallback = $attrs.onFail;

            $elem.on('click', function (e) {
                e.preventDefault();

                // get the element that contains the text
                var textElm = document.getElementById(textId) || document.querySelector(textId);
                if (!textElm)
                    return;

                selectText(textElm);

                // attempt to copy to clipboard
                try {
                    if (document.execCommand('copy')) {
                        successCallback && $parse(successCallback)(scope);
                    } else {
                        failCallback && $parse(failCallback)(scope);
                    }
                } catch (err) {
                    failCallback && $parse(failCallback)(scope);
                }
            });
        }

        // selects all text in a given element
        function selectText(elem) {
            var range = document.createRange();
            range.setStart(elem, 0);
            var i = 0;
            while (i < 999999) {
                try {
                    range.setEnd(elem, i++);
                } catch (err) {
                    break;
                }
            }

            var selection = window.getSelection();
            selection.removeAllRanges();
            selection.addRange(range);
        }
    }

});