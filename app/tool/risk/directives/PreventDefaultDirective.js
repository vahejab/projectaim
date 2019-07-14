angular.module('Risk').directive('preventDefault', function() {
    return function(scope, element, attrs) {
        angular.element(element).bind('click', function(event) {
            event.preventDefault();
            event.stopPropagation();
        });
    }
});