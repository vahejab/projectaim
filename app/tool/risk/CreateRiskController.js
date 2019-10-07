angular.module('Risk').controller('CreateRiskController', ['$http', '$resource', '$scope', '$state', '$window', '$timeout', '$interval', '$sce', 'CommonService', 'DOMops', 'ValidationService', function($http, $resource, $scope, $state, $window, $timeout, $interval, $sce, CommonService, DOMops, ValidationService){
    refresh = false;
    var ctrl = this;
    
    ctrl.DOMops = DOMops;
    ctrl.ValidationService = ValidationService;
    ctrl.initDone = false;
    ctrl.setup = {
        done: false
    }
    ctrl.users = {}
    ctrl.config = {}
    ctrl.model = { elem: true }
    ctrl.risk = {
        risktitle: '',
        riskstatement: '',
        context: '',
        closurecriteria: '',
        likelihood:'',
        technical:'',
        schedule:'',
        cost:''
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
        riskhigh: '',
        riskmedium: '',
        riskminimum: ''
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
        if (risk == '')
            return (elem && elem.hasAttribute('class'))?
                    elem.getAttribute('class') : ''; 
        
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
           
    $scope.$on("$destroy", function(){
         formcheck = 0;
         angular.element(document.querySelector('link[href="/app/tool/risk/CreateRisk.css"]')).remove();   
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
            return $http.post('/api/risks', ctrl.risk).then(function(response){
                if (response.data.Succeeded){
                    $scope.msg = response.data.Result;
                    ctrl.resetForm();
                    return response.data.Result;
                }
                else{
                    $scope.msg = $sce.trustAsHtml(response.data);
                }
            });
        } 
    }
}]); 