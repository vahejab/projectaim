angular.module('Risk').controller('RiskSummaryController', ['$http', '$resource', '$scope', '$state', '$window', '$timeout', '$interval', '$sce', 'CommonService', function($http, $resource, $scope, $state, $window, $timeout, $interval, $sce, CommonService){
        refresh = true;
        var ctrl = this;
        ctrl.CommonService = CommonService;
        ctrl.risks = [];                          
        ctrl.risk = {
                riskid: 0,
                risktitletitle: '',
                riskstatement: '',
                context: '',
                closurecriteria: '',
                likelihood: '',
                technical: '',
                schedule: '',
                cost: '',
                risklevel: '',
                assignor: '',
                owner: '',
                approver: '',
                assessmentdate: ''
        }
        ctrl.risksloaded = false;
        ctrl.propertyName = 'riskid';
        ctrl.reverse = false;
                
       ctrl.gridOptions = {
          columnDefs: [
                            {headerName: "Edit", field: ""},
                            {headerName: "ID", field: "riskid"},
                            {headerName: "Risk Title", field: "risktitle"},
                            {headerName: "Risk", field: "riskvalue", width: 200,  filter: 'agNumberColumnFilter', cellRenderer: percentCellRenderer},
                            {headerName: "Creation Date", field: "assessmentdate"},
                            {headerName: "Creator", field: "creator"},
                            {headerName: "Owner", field: "owner"},
                            {headerName: "Approver", field: "approver"}
          ],
          rowSelection: 'multiple',
          suppressRowClickSelection: false,
          defaultColDef: {
                sortable: true,
                filter: true,
                resize: true
          },
          rowData: ctrl.risks
        };
        
        
        
       function percentCellRenderer(params) {
            var value = params.data.riskvalue * 100;
            var eDivPercentBar = document.createElement('div');
            eDivPercentBar.className = 'div-percent-bar';
            eDivPercentBar.style.width = value + '%';
            if (ctrl.getLevel(params.data.riskvalue, params.data.likelihood, params.data.consequence).cls == 'high'){
                eDivPercentBar.style.backgroundColor = '#ee0000';
            } else if (ctrl.getLevel(params.data.riskvalue, params.data.likelihood, params.data.consequence).cls == 'med') {
                eDivPercentBar.style.backgroundColor = '#eeee00';
            } else {
                eDivPercentBar.style.backgroundColor = '#00b050';
            }

            eDivPercentBar.innerHTML = params.data.risklevel;

            var eOuterDiv = document.createElement('div');
            eOuterDiv.className = 'div-outer-div';
            eOuterDiv.appendChild(eDivPercentBar);
            return eOuterDiv;
        }

      ctrl.sort = function(propertyName) {
            ctrl.reverse = (ctrl.propertyName === propertyName) ? !ctrl.reverse : false;
            ctrl.propertyName = propertyName;
        };
        
        ctrl.risklevels = {
            riskmaximum: '',
            riskhigh: '',
            riskmedium: '',
            riskminimum: ''
        };
        
        ctrl.riskMatrix = [];
        for(var l = 1; l <= 5; l++)
        {
            ctrl.riskMatrix[l] = [];
            for (var c = 1; c <= 5; c++)
            {
                ctrl.riskMatrix[l][c] = '';  
            }
        }   
      
        ctrl.devicePixelRatio = window.devicePixelRatio;
        ctrl.flag = 0;
 
        
        $scope.$on("$destroy", function(){
             //angular.element(document.querySelector('link[href="/app/tool/action/ActionItems.css"]')).remove();   
             $timeout.cancel(ctrl.refreshingPromise);
             ctrl.isRefreshing = false;  //stop refreshing
             ctrl.refresh = false;
             refresh = false; //stop refreshing globally
        });

        
        ctrl.formatCriticality = function(value){ 
            return CommonService.formatCriticality(value);
        }
        
        ctrl.getStatus = function(date1, date2){
           return CommonService.getStatus(date1, date2); 
        }
        
        ctrl.getLevel = function(risk, l, c){
           if (risk >= ctrl.risklevels.riskhigh)
               return  {level: 'H ' + l + '-' + c, cls: 'high', threshold: level};
           else if (risk < ctrl.risklevels.riskhigh  && risk >= ctrl.risklevels.riskmedium)
                return {level: 'M ' + l + '-' + c, cls: 'med', threshold: level};
           else if (risk < ctrl.risklevels.riskmedium)
                return {level:'L ' + l + '-' + c, cls: 'low', threshold: level}
        }  
 
        ctrl.getRisk = function(l, t, s, c){
            
            likelihood = Number(l);
            technical = Number(t);
            schedule = Number(s);
            cost = Number(c);
            consequence = Math.max(technical, schedule, cost);
            level = ctrl.riskMatrix[likelihood][consequence];
            risk = ctrl.getLevel(level, likelihood, consequence);
            return risk;
        }                                 
}]);