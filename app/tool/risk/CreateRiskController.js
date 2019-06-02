angular.module('Risk').controller('CreateRiskController', ['$http', '$resource', '$scope', '$state', '$window', '$timeout', '$interval', '$sce', 'CommonService', 'DOMops', 'ValidationService', function($http, $resource, $scope, $state, $window, $timeout, $interval, $sce, CommonService, DOMops, ValidationService){
    refresh = false;
    this.DOMops = DOMops;
    this.ValidationService = ValidationService;
    this.initDone = false;
    this.setup = {
        done: false
    }
    this.config = {}
    this.model = { elem: true }
    
    this.risk = {
        risktitle: '',
        riskstatement: '',
        context: '',
        closurecriteria: '',
        likelihood:'',
        technical:'',
        schedule:'',
        cost:''
     }; 
     
    this.fields = [   
        'risktitle',
        'riskstatement',
        'context',
        'closurecriteria',
        'likelihood',
        'technical',
        'schedule',
        'cost'
    ]
    
    this.risklevels = {
        riskmaximum: '',
        riskhigh: '',
        riskmedium: '',
        riskminimum: ''
    }

    this.flags = {
        disabled: true
    }
  
    this.riskMatrix = [];
    for(var l = 1; l <= 5; l++)
    {
        this.riskMatrix[l] = [];
        for (var c = 0; c <= 5; c++)
        {
            this.riskMatrix[l][c] = '';  
        }
    }
     
    this.riskLevel = function(l, c){
        elem = document.querySelector("div[name='risk["+l+"]["+c+"]']");
        risk = this.riskMatrix[l][c];
        if (risk == '')
            return (elem && elem.hasAttribute('class'))?
                    elem.getAttribute('class') : ''; 
        
        if (risk >= this.risklevels.riskhigh) 
            return 'cell high';
        else if (risk >= this.risklevels.riskmedium && risk < this.risklevels.riskhigh)
            return 'cell med';
        else if (risk < this.risklevels.riskmedium)
            return 'cell low';
    }

             
    this.valid = function(){          
        return CommonService.riskFormValid(this.fields, this);
    }
    
    this.getTextValue = function(obj, type, field){
        return CommonService.getTextValue(obj, this, type, field);
    }
  
    this.invalidLevel = function(lvl){
        return CommonService.invalidLevel(lvl);
    }
           
    $scope.$on("$destroy", function(){
         formcheck = 0;
         angular.element(document.querySelector('link[href="/app/tool/risk/CreateRisk.css"]')).remove();   
    });
    
    this.initRisk = function(data){
        this.risklevels.riskmaximum = data.Levels[0].riskmaximum;
        this.risklevels.riskhigh = data.Levels[0].riskhigh;
        this.risklevels.riskmedium = data.Levels[0].riskmedium;
        this.risklevels.riskminimum = data.Levels[0].riskminimum; 
    
     
        for (var idx = 0; idx < data.Thresholds.length; idx++)
        {
            var l = data.Thresholds[idx].likelihood;
            var c = data.Thresholds[idx].consequence;
            v = data.Thresholds[idx].level;
            this.riskMatrix[l][c] = v;
        }
    }
  
    this.submit = function(){
        if (!this.valid())
             this.msg = "Please complete form and resubmit";
        else{ 
            //this.actionitem.duedate = this.split(this.actionitem.duedate,'T')[0];
            //this.actionitem.ecd = this.split(this.actionitem.ecd, 'T')[0];
            $http.post('/api/risks', this.risk).then(function(response){
                if (response.data.Succeeded){
                    this.msg = response.data.Result;
                }
                else{
                    this.msg = $sce.trustAsHtml(response.data);
                }
            });
        } 
    }
}]);