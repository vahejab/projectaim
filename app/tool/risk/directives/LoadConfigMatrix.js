angular.module('Risk').directive('loadConfigMatrix', loadConfigMatrix); 

function loadConfigMatrix(){
        function link(scope, elem, attrs){
            scope.init().then(function(){
                    for (var likelihood = 1; likelihood <= 5; likelihood++)
                        for (var consequence = 1; consequence <= 5; consequence++)
                            scope.risk[likelihood][consequence] = (((0.9*likelihood*consequence)/25) + 0.05).toFixed(2);  
            }); 
        }
        var directive = {
            restrict: 'A',
            link: link
        };
        
        return directive;
}