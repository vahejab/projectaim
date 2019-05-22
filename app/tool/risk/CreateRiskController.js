angular.module('Risk').controller('CreateRiskController', ['$http', '$resource', '$scope', '$state', '$window', '$timeout', '$interval', '$sce', 'CommonService', function($http, $resource, $scope, $state, $window, $timeout, $interval, $sce, CommonService){
    refresh = false;
    
    $scope.risk = {
        likelihood:'',
        technical:'',
        schedule:'',
        cost:'',
        risktitle:'',
        closurecriteria: '',
        riskstatement: '',
        category: null,
        context: ''
    }
    
     $scope.risklevels = {
        riskmaximum: '',
        riskhigh: '',
        riskmedium: '',
        riskminimum: ''
    }
    
    $scope.riskMatrix = [];
    for(var l = 1; l <= 5; l++)
    {
        $scope.riskMatrix[l] = [];
        for (var c = 0; c <= 5; c++)
        {
            $scope.riskMatrix[l][c] = '';  
        }
    }         

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
    
    $scope.updateTextValue = function(code, obj, field){
        if (!$scope.validCharacter(code) || obj.getValue().trim() == '') 
        {
            $scope['risk'][field] = '';
            return;
        }
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
    
    $scope.init = function(){
      angular.element(document.querySelector('link[href="/app/tool/risk/CreateRisk.css"]')).remove();
      angular.element(document.querySelector('head')).append('<link type="text/css" rel="stylesheet" href="/app/tool/risk/CreateRisk.css"/>'); 
      
      $scope.getConfig();
    }
    
              
    $scope.$on("$destroy", function(){
         formcheck = 0;
         angular.element(document.querySelector('link[href="/app/tool/risk/CreateRisk.css"]')).remove();   
    });
     
     
    $scope.getConfig = function(){
       return $http.get('/api/riskconfig').then(function(response){
           if (response.data.Succeeded){
                $scope.risklevels.riskmaximum = response.data.Result.Levels[0].riskmaximum;
                $scope.risklevels.riskhigh = response.data.Result.Levels[0].riskhigh;
                $scope.risklevels.riskmedium = response.data.Result.Levels[0].riskmedium;
                $scope.risklevels.riskminimum = response.data.Result.Levels[0].riskminimum; 
            
             
                for (var idx = 0; idx < response.data.Result.Thresholds.length; idx++)
                {
                    var l = response.data.Result.Thresholds[idx].likelihood;
                    var c = response.data.Result.Thresholds[idx].consequence;
                    v = response.data.Result.Thresholds[idx].level;
                    $scope.riskMatrix[l][c] = v;
                }
             
                return response.data.Result;
                
           }
           else{
                $scope.msg = $sce.trustAsHtml(response.data);
           }
      });
    }
    
 
    $scope.submit = function(){
        
        $scope.validateAll();
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
