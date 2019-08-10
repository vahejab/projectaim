angular.module('Risk').directive('ngRepeatEventsDone', repeatEventsDone);

function repeatEventsDone(){
        return {
            restrict: 'A',
            controller: function($scope, $timeout){
                $('.datepicker-here').each(function(){
                    $(this).datepicker();
                });
            }
        }
} 
