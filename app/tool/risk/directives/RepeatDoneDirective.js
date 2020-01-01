angular.module('Risk').directive('ngRepeatDone', repeatDone);
alert();

function repeatDone(){
  return {
    restrict: 'A',
    controller: function($scope, $element, $attrs) {
          if ($scope.$last) {
            $scope.$eval(a$ttrs.ngRepeatDone);
          }
    }
  }
}
