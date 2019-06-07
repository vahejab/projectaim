angular.module('Risk').directive('configMatrix', configMatrix);

function configMatrix(){
     return {
        restrict: 'A', 
        link: function(scope, element, attrs){
        },
        controller: function($scope){ 
            $scope.riskLevel = function(l, c){
                elem = document.querySelector("input[name='risk["+l+"]["+c+"]']");
                risk = elem.value;
                
                if (risk == '')
                    return (elem && elem.hasAttribute('class'))?
                            elem.getAttribute('class') : ''; 
                
                if (risk >= $scope.risklevels.riskhigh) 
                    return 'high';
                else if (risk >= $scope.risklevels.riskmedium && risk < $scope.risklevels.riskhigh)
                    return 'med';
                else if (risk < $scope.risklevels.riskmedium)
                    return 'low';
            }
        }
     }       
}