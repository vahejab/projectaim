angular.module('Risk').controller('CreateRiskController', ['$http', '$resource', '$scope', '$state', '$window', '$timeout', '$interval', '$sce', 'CommonService', function($http, $resource, $scope, $state, $window, $timeout, $interval, $sce, CommonService){
    refresh = false;
    
    $scope.formFields = [   
        'risktitle',
        'riskstatement',
        'context',
        'closurecriteria',
        'likelihood',
        'technical',
        'schedule',
        'cost'
    ]
    
    $scope.flags = {
        disabled: true
    }
    
    $scope.categoryConfig = function(){
        CommonService.categoryConfig();
    }

    $scope.likelihoodConfig = function(){
        CommonService.likelihoodConfig();
    }
     
    $scope.technicalConfig = function(){
        CommonService.technicalConfig();

    }

    $scope.scheduleConfig = function(){
        CommonService.scheduleConfig();
    }

    $scope.costConfig = function(){
        CommonService.costConfig();
    } 
    
    
    
    $scope.riskLevel = function(l, c){
        elem = document.querySelector("div[name='risk["+l+"]["+c+"]']");
        risk = $scope.riskMatrix[l][c];
        if (risk == '')
            return (elem && elem.hasAttribute('class'))?
                    elem.getAttribute('class') : ''; 
        
        if (risk >= $scope.risklevels.riskhigh) 
            return 'cell high';
        else if (risk >= $scope.risklevels.riskmedium && risk < $scope.risklevels.riskhigh)
            return 'cell med';
        else if (risk < $scope.risklevels.riskmedium)
            return 'cell low';
    }

    $scope.getTextValueAndValidate = function(code, obj, model, field){
        if (!$scope.validCharacter(code) && obj.getValue().trim() == '') 
        {
            $scope['risk'][field] = '';
            return;
        }
        $scope.clearValidation(field);  
        CommonService.getTextValue(obj, model, 'risk', field); 
        $scope.validate(obj, field);
    }
    
    
              
    $scope.$on("$destroy", function(){
         formcheck = 0;
         angular.element(document.querySelector('link[href="/app/tool/risk/CreateRisk.css"]')).remove();   
    }); 

    $scope.submit = function(){
        
        $scope.validateAll($scope.formFields);
        if (!$scope.valid())
             $scope.msg = "Please complete form and resubmit";
        else{ 
            //$scope.actionitem.duedate = $scope.split($scope.actionitem.duedate,'T')[0];
            //$scope.actionitem.ecd = $scope.split($scope.actionitem.ecd, 'T')[0];
            $http.post('/api/risks', $scope.risk).then(function(response){
                if (response.data.Succeeded){
                    $scope.msg = response.data.Result;
                }
                else{
                    $scope.msg = $sce.trustAsHtml(response.data);
                }
            });
        } 
    }
}]);
