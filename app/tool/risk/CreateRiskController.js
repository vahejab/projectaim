angular.module('Risk').controller('CreateRiskController', ['$http', '$resource', '$scope', '$state', '$window', '$timeout', '$interval', '$sce', 'CommonService', 'DOMops', 'ValidationService', function($http, $resource, $scope, $state, $window, $timeout, $interval, $sce, CommonService, DOMops, ValidationService){
    refresh = false;
    var ctrl = this;
    
    ctrl.DOMops = DOMops;
    ctrl.ValidationService = ValidationService;
    ctrl.DOMops.setValidationServiceObj(ValidationService);
    ctrl.initDone = false;
    ctrl.usersFetched = {done: false};
    ctrl.setup = {
        done: false
    }
    ctrl.users = []
    ctrl.config = {}
    ctrl.model = { elem: true }
    ctrl.riskid = 0;
    ctrl.riskownerid = 0;
    ctrl.risk = { 
        ownerid: '',
        risktitle: '',
        riskstatement:'',
        context: '',
        closurecriteria:'',
        likelihood:'',
        technical:'',
        schedule:'',
        cost: ''
    }; 
     
    ctrl.fields = [   
        'risktitle',
        'riskstatement',
        'context',
        'closurecriteria',
        'likelihood',
        'technical',
        'schedule',
        'cost'
    ]
    
    ctrl.risklevels = {
        riskmaximum: '',
        riskhigh:'' ,
        riskmedium: '',
        riskminimum:'' 
    }

    ctrl.flags = {
        disabled: true
    }
  
    ctrl.riskMatrix = [];
    for(var l = 1; l <= 5; l++)
    {
        ctrl.riskMatrix[l] = [];
        for (var c = 0; c <= 5; c++)
        {
            ctrl.riskMatrix[l][c] = '';  
        }
    }
         
    ctrl.riskLevel = function(l, c){
        elem = document.querySelector("div[name='risk["+l+"]["+c+"]']");
        risk = ctrl.riskMatrix[l][c];
        if (risk == '' )
            return (elem && elem.hasAttribute('class'))?
                    elem.getAttribute('class') :''; 
        
        if (risk >= ctrl.risklevels.riskhigh) 
            return 'cell high';
        else if (risk >= ctrl.risklevels.riskmedium && risk < ctrl.risklevels.riskhigh)
            return 'cell med';
        else if (risk < ctrl.risklevels.riskmedium)
            return 'cell low';
    }

             
    ctrl.valid = function(){          
        return ValidationService.valid($scope, ctrl.fields);
    }
    
    ctrl.getTextValue = function(obj, type, field){
        return CommonService.getTextValue(obj, ctrl, type, field);
    }
  
    ctrl.invalidLevel = function(lvl){
        return CommonService.invalidLevel(lvl);
    } 
      
    $scope.init = function(){
            angular.element(document.querySelector('link[href="/app/tool/CreateRisk.css"]')).remove();
            angular.element(document.querySelector('link[href="/app/css/bootstrap/bootstrap.min.css"]')).remove();   
            angular.element(document.querySelector('head')).append('<link type="text/css" rel="stylesheet" href="/app/tool/risk/CreateRisk.css"/>');
            angular.element(document.querySelector('head')).append('<link type="text/css" rel="stylesheet" href="/app/css/bootstrap/bootstrap.min.css"/>');
    }
              
           
    $scope.$on("$destroy", function(){
         angular.element(document.querySelector('link[href="/app/tool/risk/CreateRisk.css"]')).remove();  
         angular.element(document.querySelector('link[href="/app/css/bootstrap/bootstrap.min.css"]')).remove();
    });
    
    
    ctrl.initRisk = function(data){
        ctrl.risklevels.riskmaximum = data.Levels[0].riskmaximum;
        ctrl.risklevels.riskhigh = data.Levels[0].riskhigh;
        ctrl.risklevels.riskmedium = data.Levels[0].riskmedium;
        ctrl.risklevels.riskminimum = data.Levels[0].riskminimum; 
    
     
        for (var idx = 0; idx < data.Thresholds.length; idx++)
        {
            var l = data.Thresholds[idx].likelihood;
            var c = data.Thresholds[idx].consequence;
            v = data.Thresholds[idx].level;
            ctrl.riskMatrix[l][c] = v;
        }
    }
    
    ctrl.resetForm = function(){ 
        DOMops.resetForm(ctrl.risk, ctrl.fields);
    }
  
    ctrl.submit = function(){
        if (!ctrl.valid())
             ctrl.msg = "Please complete form and resubmit";
        else{ 
            ctrl.risk.ownerid = ctrl.riskownerid;
            return $http.post('/api/risks', ctrl.risk).then(function(response){
                if (response.data.Succeeded){     
                    ctrl.riskid = response.data.RiskID;
                    $scope.msg = $sce.trustAsHtml(response.data.Result + "<b><a href='/#!/risk/edit/"+ctrl.riskid+"'>View Risk " + ctrl.riskid + "</a></b>");
                    return response.data.Result;
                }
                else{
                    $scope.msg = $sce.trustAsHtml(response.data);
                }
            }).then(function(){
            
                    today = new Date().getFullYear() + "-" + (new Date().getMonth() + 1) + "-" + new Date().getDate();
                    payload = {riskid: ctrl.riskid, events: [{
                        eventid : 0,
                        eventtitle : 'Risk Identified',
                        eventownerid : ctrl.riskownerid,
                        
                        actualdate: today,
                        actuallikelihood : ctrl.risk.likelihood,
                        actualtechnical : ctrl.risk.technical,
                        actualschedule : ctrl.risk.schedule,
                        actualcost : ctrl.risk.cost,
              
                        
                        scheduledate : null,//today,
                        scheduledlikelihood : null,//ctrl.risk.likelihood,
                        scheduledtechnical : null, //ctrl.risk.technical,
                        scheduledschedule : null,//ctrl.risk.schedule,
                        scheduledcost : null, //ctrl.risk.cost,
                        
                        baselinedate : today,
                        baselinelikelihood : ctrl.risk.likelihood,
                        baselinetechnical : ctrl.risk.technical,
                        baselineschedule : ctrl.risk.schedule,
                        baselinecost : ctrl.risk.cost
                    }]
                };
                return $http.post('/api/risks/'+ ctrl.riskid + '/events', payload).then(function(response){
                        if (response.data.Succeeded){
                            ctrl.msg = response.data.Result;
                            //ctrl.resetForm();
                            return response.data.Result;
                        }
                        else{
                             $scope.msg = $sce.trustAsHtml(response.data);
                        }
                });
            });
        }
    }
}]); 