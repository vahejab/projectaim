angular.module('Risk').controller('EditRiskController', ['$http', '$resource', '$stateParams', '$scope', '$state', '$timeout', '$sce', 'CommonService', /*'DTOptionsBuilder',*/ function($http, $resource, $stateParams, $scope, $state, $timeout, $sce, CommonService/*, DTOptionsBuilder*/){
        refresh = false;
        
        $scope.risk = {
                riskid: 0,
                risktitle: '',
                status: 'Open',
                risklevel: '',
                assignor: 0,
                owner: 0,
                approver: 0,
                assessmentdate: '',
                risktitle: '',
                riskstatement: '',
                context: '',
                closurecriteria: '',
                approvernotes: '',
                ownercomments: ''
        }
        
            
        $scope.risklevels = {
            riskmaximum: '',
            riskhigh: '',
            riskmedium: '',
            riskminimum: ''
        };
        $scope.riskMatrix = [];
        for(var l = 1; l <= 5; l++)
        {
            $scope.riskMatrix[l] = [];
            for (var c = 1; c <= 5; c++)
            {
                $scope.riskMatrix[l][c] = '';  
            }
        }      
            
        $scope.users = [];
                             
        $scope.$on("$destroy", function(){
             angular.element(document.querySelector('link[href="/app/tool/risk/EditRisk.css"]')).remove();
        });

        
        $scope.initUsers = function(){
            return $http.get('api/users').then(function(response){
                if (response.data.Succeeded){
                
                   for (var key = 0; key < response.data.Result.length; key++){
                        user = response.data.Result[key];     
                        $scope.users.push({id: user.id, value: user.name});
                   }
            
                   return response.data.Result;
                }
                else{
                     $scope.msg += "<br />"+ $sce.trustAsHtml(response.data);
                }
            }); 
        }
                     
        $scope.getRisk = function(l, t, s, c){
            
            likelihood = Number(l);
            technical = Number(t);
            schedule = Number(s);
            cost = Number(c);
            consequence = Math.max(technical, schedule, cost);
            level = $scope.riskMatrix[likelihood][consequence];
            risk = $scope.getLevel(level, likelihood, consequence);
            return risk;
        }    
     
            
        $scope.getLevel = function(level, l, c){
           if (level >= $scope.risklevels.riskhigh)
           {
               return  {level: 'H ' + l + '-' + c, cls: 'high', threshold: level};
               //leveldiv.setAttribute('class', 'high'); 
           }
           else if (level < $scope.risklevels.riskhigh  && level >= $scope.risklevels.riskmedium)
           {
                return {level: 'M ' + l + '-' + c, cls: 'med', threshold: level};
                //leveldiv.setAttribute('class', 'med'); 
           }
           else if (level < $scope.risklevels.riskmedium)
           {
                return {level:'L ' + l + '-' + c, cls: 'low', threshold: level};
                //leveldiv.setAttribute('class', 'low'); 
           }
        }  
         
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
         
        $scope.init = function(){
            //var vm = this;
            //vm.dtOptions = DTOptionsBuilder
            //.fromFnPromise(function(){
            return $scope.getConfig().then(function(){
                $http.get('api/risks/'+$stateParams.id).then(function(response){
                  if (response.data.Succeeded){  
                        $scope.risk.riskid = response.data.Results.riskid;
                        $scope.risk.risktitle = response.data.Results.risktitle;
                        $scope.risk.status = response.data.Results.status;
                        
                        likelihood = response.data.Results.likelihood;
                        technical = response.data.Results.technical;
                        scheudle = response.data.Results.schedule;
                        cost = response.data.Results.cost;
                        
                        $scope.risk.risklevel = $scope.getRisk(likelihood, technical, scheudle, cost);
                        $scope.risk.assignor = response.data.Results.assignorid;
                        $scope.risk.owner = response.data.Results.ownerid;
                        $scope.risk.approver = response.data.Results.approverid;
                        $scope.risk.assessmentdate = response.data.Results.assessmentdate;
                        $scope.risk.risktitle = response.data.Results.risktitle;
                        $scope.risk.riskstatement = response.data.Results.riskstatement;
                        $scope.risk.context = response.data.Results.context;
                        $scope.risk.closurecriteria = response.data.Results.closurecriteria;
                        $scope.risk.approvernotes = response.data.Results.approvernotes;
                        $scope.risk.ownercomments = response.data.Results.ownercomments;
                        return response.data.Results;
                  }
                  else{
                     $scope.msg += "<br />"+$sce.trustAsHtml(response.data);
                  }
            }).then(function(){
                return $scope.initUsers();
            }); 
        });                                  
       }

       $scope.clearValidation = function(id){
            (document.querySelector('#'+id+' > div.webix_control')).classList.remove("webix_invalid");
       }
        
        $scope.validate = function(elem, id){
            if (typeof elem == 'undefined' || elem == 0 || elem == '' || elem.trim() == '') (document.querySelector('#'+id+' > div.webix_control')).classList.add("webix_invalid");
        }
               

        $scope.validateAll = function(){
        
               (document.querySelector('#assignor > div.webix_control')).classList.remove("webix_invalid");
               (document.querySelector('#duedate > div.webix_control')).classList.remove("webix_invalid");
               (document.querySelector('#owner > div.webix_control')).classList.remove("webix_invalid");
               (document.querySelector('#altowner > div.webix_control')).classList.remove("webix_invalid");
               (document.querySelector('#risktitle > div.webix_control')).classList.remove("webix_invalid");
               (document.querySelector('#approver > div.webix_control')).classList.remove("webix_invalid");
               (document.querySelector('#riskstatement > div.webix_control')).classList.remove("webix_invalid");
               (document.querySelector('#closurecriteria > div.webix_control')).classList.remove("webix_invalid");
               (document.querySelector('#ownernotes > div.webix_control')).classList.remove("webix_invalid");
               (document.querySelector('#approvercomments > div.webix_control')).classList.remove("webix_invalid");
              
               if ($scope.risk.assignor == 0) (document.querySelector('#assignor > div.webix_control')).classList.add("webix_invalid");
               if ($scope.risk.duedate == '') (document.querySelector('#duedate > div.webix_control')).classList.add("webix_invalid");
               if ($scope.risk.owner == 0 ) (document.querySelector('#owner > div.webix_control')).classList.add("webix_invalid");
               if ($scope.risk.altowner == 0 ) (document.querySelector('#altowner > div.webix_control')).classList.add("webix_invalid");
               if ($scope.risk.approver == 0 ) (document.querySelector('#approver > div.webix_control')).classList.add("webix_invalid");
               if ($scope.risk.risktitle.trim() == '' )  (document.querySelector('#risktitle > div.webix_control')).classList.add("webix_invalid");
               if ($scope.risk.riskstatement.trim() == '')  (document.querySelector('#riskstatement > div.webix_control')).classList.add("webix_invalid");
               if ($scope.risk.closurecriteria.trim() == '') (document.querySelector('#closurecriteria > div.webix_control')).classList.add("webix_invalid");
               if ($scope.risk.ownernotes.trim() == '') (document.querySelector('#ownernotes > div.webix_control')).classList.add("webix_invalid");
               if ($scope.risk.approvercomments.trim() == '') (document.querySelector('#approvercomments > div.webix_control')).classList.add("webix_invalid");
        }
        
        $scope.valid = function(){
            return($scope.risk.assignor != 0 &&
                   $scope.risk.owner != 0 &&
                   $scope.risk.altowner != 0 &&
                   $scope.risk.approver != 0 &&
                   $scope.risk.risktitle.trim() != '' &&
                   $scope.risk.riskstatement.trim() != '' &&
                   $scope.risk.closurecriteria.trim() != '' &&
                   $scope.risk.ownernotes != '' &&
                   $scope.risk.approvercomments != '');
        };
       
       
       $scope.getDateValueAndValidate = function(obj, model, field){
            CommonService.getDateValue(obj, model, 'risk', field);       
            $scope.clearValidation(field);
        }               
                                
        $scope.getItemValueAndValidate = function(obj, model, field){
            CommonService.getItemValue(obj, model, 'risk', field);         
            $scope.clearValidation(field);   
        }
        
        $scope.getItemId= function(obj, model, field){
            CommonService.getItemId(obj, model, 'risk', field);       
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
                //$scope.risk.duedate = $scope.split($scope.risk.duedate,'T')[0];
                //$scope.risk.ecd = $scope.split($scope.risk.ecd, 'T')[0];
                $http.put('/api/risks', $scope.risk).then(function(response){
                    if (response.data.Succeeded){
                        $scope.msg = response.data.Result;
                    }
                    else{
                        $scope.msg = $sce.trustAsHtml(response.data);
                    }
                }); 
        }
               
}]).filter('unquote', function () {
    return function(value) {
        if(!angular.isString(value)) {
            return value;
        }  
        return value.replace(/^['"]+$/g, ''); // you could use .trim, but it's not going to work in IE<9
    };
});;
