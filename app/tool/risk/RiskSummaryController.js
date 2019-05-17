angular.module('Risk').controller('RiskSummaryController', ['$http', '$resource', '$scope', '$state', '$window', '$timeout', '$interval', '$sce', 'CommonService', /*'DTOptionsBuilder',*/ function($http, $resource, $scope, $state, $window, $timeout, $interval, $sce, CommonService/*, DTOptionsBuilder*/){
        refresh = true;
        $scope.CommonService = CommonService;
        $scope.risks = [];                          
        $scope.risk = {
                riskid: 0,
                risktitletitle: '',
                riskstatement: '',
                context: '',
                closurecriteria: '',
                likelihood: '',
                technical: '',
                schedule: '',
                cost: '',
                assignor: '',
                owner: '',
                approver: '',
                assessmentdate: ''
        }
       
        $scope.propertyName = 'riskid';
        $scope.reverse = false;
                
        $scope.sort = function(propertyName) {
            $scope.reverse = ($scope.propertyName === propertyName) ? !$scope.reverse : false;
            $scope.propertyName = propertyName;
        };
        
        
      
        $scope.devicePixelRatio = window.devicePixelRatio;
        $scope.flag = 0;
 
        
        $scope.$on("$destroy", function(){
             //angular.element(document.querySelector('link[href="/app/tool/action/ActionItems.css"]')).remove();   
             $timeout.cancel($scope.refreshingPromise);
             $scope.isRefreshing = false;  //stop refreshing
             $scope.refresh = false;
             refresh = false; //stop refreshing globally
        });

        
        $scope.formatCriticality = function(value){ 
            return CommonService.formatCriticality(value);
        }
        
        $scope.getStatus = function(date1, date2){
           return CommonService.getStatus(date1, date2); 
        }
        
        $scope.init = function(){  
            return $http.get('api/risks').then(function(response){
               if (response.data.Succeeded){
                    angular.forEach(response.data.Result, function(risk, key){
                        response.data.Result[key] =  
                        { 
                            riskid: risk.riskid,
                            risktitle: risk.risktitle,
                            riskstatement: risk.riskstatement,
                            context: risk.riskcontext,
                            closurecriteria: risk.closurecriteria,
                            likelihood: risk.likelihood,
                            technical: risk.technical,
                            schedule: risk.schedule,
                            cost: risk.cost,
                            assignor: risk.assignor,
                            owner: risk.owner,
                            approver: risk.approver,
                            assessmentdate: risk.assessmentdate
                        };    
                    });
                    $scope.risks = response.data.Result;
                    return response.data.Result;
               }
               else{  
                $scope.msg += "<br />" + $sce.trustAsHtml(response.data);
               }
            });                                   
       }

}]);