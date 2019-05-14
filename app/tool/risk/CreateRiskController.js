angular.module('Risk').controller('CreateRiskController', ['$http', '$resource', '$scope', '$state', '$window', '$timeout', '$interval', '$sce', 'CommonService', function($http, $resource, $scope, $state, $window, $timeout, $interval, $sce, CommonService){
  
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

  $scope.getTextValueAndValidate = function(obj, model, field){
    CommonService.getTextValue(obj, model, 'risk', field); 
    $scope.clearValidation(field);  
  }
  
   $scope.submit = function(){
        
            $scope.validateAll();
            if (!$scope.valid())
                 $scope.msg = "Please complete form and resubmit";
            else 
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
       
        
}]);