angular.module('Risk').controller('RiskSummaryController', ['$http', '$resource', '$scope', '$state', '$window', '$timeout', '$interval', '$sce', 'CommonService', function($http, $resource, $scope, $state, $window, $timeout, $interval, $sce, CommonService){
        refresh = true;
        var ctrl = this;
        ctrl.CommonService = CommonService;
        ctrl.risks = [];                          
        ctrl.risk = {
                editriskid: '',
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
        ctrl.datapoints = {};
        
        ctrl.initialized = false;
        
         var maxLikelihood = 5;
            var maxConsequence = 5;
            var maxLow = 6;
            var minHigh = 15;

        var overlay = [];
        var svg = [];   
          
        ctrl.events = {};            
            var cons = [];
            var risk = [];
           
            
            ctrl.baseline = {}; 
            ctrl.schedule = {};
            ctrl.actual = {};
            
             ctrl.sched = {};
            
            actualrisk = [];
            schedulerisk = [];
            baselinerisk = [];
            
           
            var cellWidth = 50;
            var cellHeight = 50;
            var riskmatrix; 
            
            
            
             function risklevels(d) {
                if (d <= 25 && d >= 13.5) {
                    return "H";
                } else if (d <= 13.5 && d > 7) {
                    return "M";
                }
                return "L";
            } 
            
            
            
            var margin = {top: 20, right: 20, bottom: 30, left: 50};
                var width = 300 - margin.left - margin.right;
                var height = 150 - margin.top - margin.bottom;
                                   
  
            ctrl.riskwaterfall = {};
          
            var xVal, yVal;
            ctrl.focus = [];
        
        
         angular.element($window).on('resize', function(){
          if (ctrl.gridOptions.api)
            ctrl.gridOptions.api.sizeColumnsToFit();
         });             
        ctrl.gridOptions = {
         defaultColDef: {
            resizable: true
         },
          columnDefs: [
                            {resizable: true, headerName: "Risk ID", field: "riskid", cellRenderer: editRisk},
                            {resizable: true, headerName: "Risk Title", field: "risktitle"},
                            {resizable: true, headerName: "Risk", field: "riskvalue",  filter: 'agNumberColumnFilter', cellRenderer: percentCellRenderer},
                            /*{
                                headerName: 'Line Chart',
                                field: 'CloseTrends',
                                width: 115,
                                resizable: false,
                                suppressSizeToFit: true,
                                cellRenderer: lineChartLineRenderer
                            },
                            {
                                headerName: 'Risk Waterfall',
                                field: 'CloseTrends',
                                width: 300,
                                resizable: false,
                                suppressSizeToFit: true,
                                cellRenderer: riskWaterfallRenderer
                            }, */
                            {resizable: true, headerName: "Creation Date", field: "creationdate"},
                            {resizable: true, headerName: "Creator", field: "creator"},
                            {resizable: true, headerName: "Owner", field: "owner"},
                            {resizable: true, headerName: "Approver", field: "approver"}
          ],
          rowSelection: 'multiple',
          suppressRowClickSelection: false,
          defaultColDef: {
                sortable: true,
                filter: true,      
                resize: true
          },
          rowData: ctrl.risks,
          components:{
            lineChartLineRenderer: lineChartLineRenderer,
          },
          onFirstDataRendered: function(params) {
                params.api.sizeColumnsToFit();
          }
        };
        
        function editRisk(params){
            return '<a href=#!/risk/edit/'+params.data.riskid+'>'+ params.data.riskid +'</a>'
        }
        
        function lineChartLineRenderer() {
        }

        lineChartLineRenderer.prototype.init = function (params) {

            var eGui = document.createElement('div');
            this.eGui = eGui;

            // sparklines requires the eGui to be in the dom - so we put into a timeout to allow
            // the grid to complete it's job of placing the cell into the browser.
            setTimeout( function(){
                values = [23.89,21.0,23.89,28.11,27.98,33.81,31.96,27.52,34.65,117.18,164.47,250.56,239.72,238.1,199.56,269.15,211.63,188.34,212.28,199.97,250.48];
                //[{Date: new Date().getTime(), Close: 56}]
                $(eGui).sparkline(values, {height: 100, width: 100});
            }, 0);
        };

        lineChartLineRenderer.prototype.getGui = function () {
            return this.eGui;
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
        
        function riskWaterfallRenderer(params){
            var eDivWaterfall = document.createElement('div');
            eDivWaterfall.id = 'div-risk-waterfall-'+params.data.riskid;
        
            $timeout(function(){
                    ctrl.riskwaterfall[params.data.riskid] = (d3.select('#div-risk-waterfall-'+params.data.riskid).append('svg')
                                              .attr('width', width + margin.left + margin.right)
                                              .attr('height', height + margin.top + margin.bottom)
                                              .append('g')
                                              .attr('transform', 'translate('+margin.left+','+margin.top+')'));
                                 
                 // ctrl.drawGrid(maxLow, minHigh, maxLikelihood, maxConsequence);
                  
                ctrl.initEvents(params.data.riskid);
                
                act = Object.keys(ctrl.actual[params.data.riskid]).map(key => ctrl.actual[params.data.riskid][key]);
                bas = Object.keys(ctrl.baseline[params.data.riskid]).map(key => ctrl.baseline[params.data.riskid][key]);
                sch = Object.keys(ctrl.schedule[params.data.riskid]).map(key => ctrl.schedule[params.data.riskid][key]);
                ctrl.datapoints[params.data.riskid] =  [...act.concat(bas, sch)];
                ctrl.drawWaterfall(params.data.riskid);
                ctrl.drawToolTip(params.data.riskid);                   
            },);
            
          return eDivWaterfall;
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
        
        ctrl.getRiskConfig = function(){
        
            return $http.get('/api/riskconfig').then(function(response){
                   if (response.data.Succeeded){
                        ctrl.risklevels.riskmaximum = response.data.Result.Levels[0].riskmaximum;
                        ctrl.risklevels.riskhigh = response.data.Result.Levels[0].riskhigh;
                        ctrl.risklevels.riskmedium = response.data.Result.Levels[0].riskmedium;
                        ctrl.risklevels.riskminimum = response.data.Result.Levels[0].riskminimum; 
                     
                        for (var idx = 0; idx < response.data.Result.Thresholds.length; idx++)
                        {
                            var l = response.data.Result.Thresholds[idx].likelihood;
                            var c = response.data.Result.Thresholds[idx].consequence;
                            v = response.data.Result.Thresholds[idx].level;
                            ctrl.riskMatrix[l][c] = v;
                        }
                     
                        return response.data.Result;
                        
                   }
                   else{
                        ctrl.msg = $sce.trustAsHtml(response.data);
                   }
              })
        }
        
        ctrl.getRisks = function(){
              return $http.get('api/risks').then(function(response){
                   if (response.data.Succeeded){
                        ctrl.risks = [];
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
                                risklevel: ctrl.getRisk(risk.likelihood, risk.technical, risk.schedule, risk.cost),
                                riskthreshold: 100*ctrl.riskMatrix[risk.likelihood][Math.max(risk.technical, risk.schedule, risk.cost)],
                                assignor: risk.assignor,
                                owner: risk.owner,
                                approver: risk.approver,
                                creator: risk.creator,
                                assessmentdate: risk.assessmentdate
                            };
                            ctrl.risks.push({
                                riskid: '',
                                risktitle: '',
                                risklevel: '',
                                riskvalue: '',
                                assignor: '',
                                owner: '',
                                altowner: '',
                                approver: '',
                                creationdate: ''
                            });
                            ctrl.risks[key].riskid =  response.data.Result[key].riskid;
                            ctrl.risks[key].risktitle = response.data.Result[key].risktitle;
                            ctrl.risks[key].risklevel = response.data.Result[key].risklevel.level;
                            ctrl.risks[key].riskvalue = response.data.Result[key].risklevel.threshold; 
                            ctrl.risks[key].assignor = response.data.Result[key].assignor;
                            ctrl.risks[key].owner = response.data.Result[key].owner;
                            ctrl.risks[key].approver = response.data.Result[key].approver;
                            ctrl.risks[key].creator = response.data.Result[key].creator;
                            dateYMD = response.data.Result[key].assessmentdate.split("-");
                            ctrl.risks[key].creationdate = dateYMD[1] + "/" + dateYMD[2] + "/" + dateYMD[0]; 
                            ctrl.events[ctrl.risks[key].riskid] = [];
                        });
                        ctrl.risksloaded = true;
                        return response.data.Result;
                   }
                   else{  
                    ctrl.msg += "<br />" + $sce.trustAsHtml(response.data);
                   }
                });
        }
        
        
      
        ctrl.getEvents = function(){
            
              return $http.get('api/events').then(function(response){
                    if (response.data.Succeeded){
                        for (var key = 0; key <= response.data.Result.length-1; key++){
                            event = response.data.Result[key];
                            if (ctrl.events[event.riskid])
                                ctrl.events[event.riskid].push({
                                                                    'id' : key,
                                                                    'eventid': event.eventid, 
                                                                    'title' : event.eventtitle,
                                                                    'owner' : event.ownername,
                                                                    'baseline_date' : event.baselinedate,
                                                                    'baseline_likelihood' : event.baselinelikelihood || -1,
                                                                    'baseline_consequence_T' : event.baselinetechnical || -1,
                                                                    'baseline_consequence_S' : event.baselineschedule || -1,
                                                                    'baseline_consequence_C' : event.baselinecost || -1,
                                                                    'baseline_consequence': -1,
                                                                    'actual_date' : event.actualdate,
                                                                    'actual_likelihood' : event.actuallikelihood || -1,
                                                                    'actual_consequence_T' : event.actualtechnical || -1,
                                                                    'actual_consequence_S' : event.actualschedule || -1,
                                                                    'actual_consequence_C' : event.actualcost || -1,
                                                                    'actual_consequence' : -1,
                                                                    'schedule_date' : event.scheduleddate,
                                                                    'schedule_likelihood' : event.scheduledlikelihood || -1,
                                                                    'schedule_consequence_T' : event.scheduledtechnical || -1,
                                                                    'schedule_consequence_S' : event.scheduledschedule || -1,
                                                                    'schedule_consequence_C' : event.scheduledcost || -1,
                                                                    'schedule_consequence' : -1
                                                        });
                         }
                         
                         ctrl.initialized = true; 
                         $timeout(() => {ctrl.setup()});
                    } 
                    return response.data.Result;
               });
        }
        
        
        ctrl.initEvents = function(riskid) {
                
                       
                ctrl.actual[riskid] = [];
                ctrl.schedule[riskid] = [];
                ctrl.baseline[riskid] = [];
                ctrl.sched[riskid] = [];
                
                for (e = 0; e < Object.keys(ctrl.events).length; e++) {
                    risk[e] = {};
                    
                    ctrl.events[riskid][e].baseline_consequence = Math.max(Math.max(ctrl.events[riskid][e]['baseline_consequence_T'], ctrl.events[riskid][e]['baseline_consequence_S']), ctrl.events[riskid][e]['baseline_consequence_C']);

                    ctrl.events[riskid][e].actual_consequence = Math.max(Math.max(ctrl.events[riskid][e]['actual_consequence_T'], ctrl.events[riskid][e]['actual_consequence_S']), ctrl.events[riskid][e]['actual_consequence_C']);

                    ctrl.events[riskid][e].schedule_consequence = Math.max(Math.max(ctrl.events[riskid][e]['schedule_consequence_T'], ctrl.events[riskid][e]['schedule_consequence_S']), ctrl.events[riskid][e]['schedule_consequence_C']);

                    schedulerisk[e] = {
                        id: ctrl.events[riskid][e].id,
                        type: "Schedule",
                        date: ctrl.events[riskid][e]['schedule_date'],
                        eventtitle: ctrl.events[riskid][e].title,
                        owner: ctrl.events[riskid][e].owner,
                        risk: ctrl.events[riskid][e]['schedule_likelihood'] * ctrl.events[riskid][e]['schedule_consequence']
                    };
                    baselinerisk[e] = {
                        id: ctrl.events[riskid][e].id,
                        type: "Baseline",
                        date: ctrl.events[riskid][e]['baseline_date'],
                        eventtitle: ctrl.events[riskid][e].title,
                        owner: ctrl.events[riskid][e].owner,
                        risk: ctrl.events[riskid][e]['baseline_likelihood'] * ctrl.events[riskid][e]['baseline_consequence']
                    };
                    actualrisk[e] = {
                        id: ctrl.events[riskid][e].id,
                        type: "Actual",
                        date: ctrl.events[riskid][e]['actual_date'],
                        eventtitle: ctrl.events[riskid][e].title,
                        owner: ctrl.events[riskid][e].owner,
                        risk: ctrl.events[riskid][e]['actual_likelihood'] * ctrl.events[riskid][e]['actual_consequence']
                    };

                    schedulerisk[e].level = (ctrl.events[riskid][e]['schedule_likelihood'] != -1)? risklevels(schedulerisk[e].risk) + " " + ctrl.events[riskid][e]['schedule_likelihood'] + "-" + ctrl.events[riskid][e]['schedule_likelihood'] : 0;
                    actualrisk[e].level = (ctrl.events[riskid][e]['actual_likelihood'] != -1)? risklevels(actualrisk[e].risk) + " " + ctrl.events[riskid][e]['actual_likelihood'] + "-" + ctrl.events[riskid][e]['actual_likelihood'] : 0;
                    baselinerisk[e].level = (ctrl.events[riskid][e]['baseline_likelihood'] != -1)? risklevels(baselinerisk[e].risk) + " " + ctrl.events[riskid][e]['baseline_likelihood'] + "-" + ctrl.events[riskid][e]['baseline_likelihood'] : 0;
       
                    if (schedulerisk[e].date != null)
                        ctrl.schedule[riskid].push(schedulerisk[e]);
                    if (baselinerisk[e].date != null)
                        ctrl.baseline[riskid].push(baselinerisk[e]);
                    if (actualrisk[e].date != null)
                        ctrl.actual[riskid].push(actualrisk[e]);
                }
        }

        
        ctrl.initialize = function(){
            return ctrl.getRiskConfig().then(() => {
                 return ctrl.getRisks().then(() => {
                    return ctrl.getEvents();
                 });
            });   
        }
        
        ctrl.setup = function(){
              
             // lookup the container we want the Grid to use
            var eGridDiv = document.querySelector('#myGrid');
            // create the grid passing in the div to use together with the columns & data we want to use
            new agGrid.Grid(eGridDiv, ctrl.gridOptions);
            ctrl.gridOptions.api.setRowData(ctrl.risks);
        }
        
        
ctrl.drawMatrixPath = function() {
    series = ['actual', 'schedule', 'baseline'];
    for (g = 0; g < series.length; g++) {
        var graph = series[g];

        for (var e = 0; e < events.length - 1; e++) {
            var e1 = {};
            var e2 = {};


            if (ctrl.events[e + 1]['actual_date'] != null) {
                e1.likelihood = ctrl.events[riskid][e]['actual_likelihood'];
                e1.consequence = ctrl.events[riskid][e]['actual_consequence'];

                e2.likelihood = ctrl.events[riskid][e + 1]['actual_likelihood'];
                e2.consequence = ctrl.events[riskid][e + 1]['actual_consequence'];
            } else if (ctrl.events[e]['actual_date'] == null && ctrl.events[riskid][e + 1]['actual_date'] == null) {
                e1.likelihood = ctrl.events[riskid][e]['schedule_likelihood'];
                e1.consequence = ctrl.events[riskid][e]['schedule_consequence'];

                e2.likelihood = ctrl.events[riskid][e + 1]['schedule_likelihood'];
                e2.consequence = ctrl.events[riskid][e + 1]['schedule_consequence'];
            } else if (ctrl.events[e + 1]['actual_date'] == null && ctrl.events[riskid][e + 1]['schedule_date'] != null) {
                e1.likelihood = ctrl.events[riskid][e]['actual_likelihood'];
                e1.consequence = ctrl.events[riskid][e]['actual_consequence'];

                e2.likelihood = ctrl.events[riskid][e + 1]['schedule_likelihood'];
                e2.consequence = ctrl.events[riskid][e + 1]['schedule_consequence'];
            }

            if (graph == 'baseline') {

                e1.likelihood = ctrl.events[riskid][e]['baseline_likelihood'];
                e1.consequence = ctrl.events[riskid][e]['baseline_consequence'];

                e2.likelihood = ctrl.events[riskid][e + 1]['baseline_likelihood'];
                e2.consequence = ctrl.events[riskid][e + 1]['baseline_consequence'];
            }

            e1y = (maxLikelihood - e1.likelihood - 1) * cellHeight + cellHeight / 2;
            e1x = e1.consequence * cellWidth + cellWidth / 2;


            e2y = (maxLikelihood - e2.likelihood - 1) * cellHeight + cellHeight / 2;
            e2x = e2.consequence * cellWidth + cellWidth / 2;

            drawMatrixMath(e1, e2, e, graph);
        }
    }
}


ctrl.drawEventPath = function(e1, e2, e, graph) {

    if (graph == 'baseline') {
        stroke = 'gray';
        strokewidth = '1px';


        riskmatrix.append('line')
            .style('stroke', stroke)
            .style('stroke-width', strokewidth)
            .attr('x1', e1x)
            .attr('y1', e1y + 100)
            .attr('x2', e2x)
            .attr('y2', e2y + 100);
    }
    if (graph == 'actual') {
        stroke = 'blue';
        strokewidth = '1px';
        fill = 'none'

        riskmatrix.append('line')
            .style('stroke', stroke)
            .style('fill', fill)
            .style('stroke-width', strokewidth)
            .attr('x1', e1x)
            .attr('y1', e1y + 100)
            .attr('x2', e2x)
            .attr('y2', e2y + 100);
    }
    if (graph == 'schedule') {
        stroke = 'black';
        strokewidth = '2px';


        riskmatrix.append('line')
            .style('stroke', stroke)
            .style('stroke-width', strokewidth)
            .style("stroke-dasharray", ("3, 3")) // <== This line here!!
            .attr('x1', e1x)
            .attr('y1', e1y + 100)
            .attr('x2', e2x)
            .attr('y2', e2y + 100);
    }



    if (graph == 'actual') {
        if (e == 0)
            riskmatrix.append('rect')
            .attr('fill', 'black')
            .attr('stroke', 'black')
            .attr('x', e1x - 2.5)
            .attr('y', e1y + 100 - 2.5)
            .attr('width', 5)
            .attr('height', 5);

        riskmatrix.append('rect')
            .attr('x', e2x - 2.5)
            .attr('y', e2y + 100 - 2.5)
            .attr('width', 5)
            .attr('height', 5);
    }

    if (graph == 'schedule') {
        if (e == 0)
            riskmatrix.append('rect')
            .attr('fill', 'black')
            .attr('stroke', 'black')
            .attr('x', e1x - 2.5)
            .attr('y', e1y + 100 - 2.5)
            .attr('width', 5)
            .attr('height', 5);

        riskmatrix.append('rect')
            .attr('x', e2x - 2.5)
            .attr('y', e2y + 100 - 2.5)
            .attr('width', 5)
            .attr('height', 5);
    } else if (graph == 'baseline') {
        if (e == 0)
            riskmatrix.append('rect')
            .attr('fill', 'none')
            .attr('stroke', 'blue')
            .attr('x', e1x - 2.5)
            .attr('y', e1y + 100 - 2.5)
            .attr('width', 5)
            .attr('height', 5);

        riskmatrix.append('rect')
            .attr('x', e2x - 2.5)
            .attr('y', e2y + 100 - 2.5)
            .attr('width', 5)
            .attr('height', 5);
    }
}

ctrl.getFill = function(likelihood, consequence, maxLow, minHigh) {
    var risk = likelihood * consequence;
    if (risk <= maxLow)
        return '#00b050';
    else if (risk > maxLow && risk < minHigh)
        return '#eeee00';
    else if (risk >= minHigh)
        return '#ee0000';
}

ctrl.drawGrid = function(maxLow, minHigh, maxLikelihood, maxConsequence) {
    var cellWidth = 50;
    var cellHeight = 50;

    riskmatrix = d3.select('#riskmatrix')
        .append('svg')
        .attr('width', cellWidth * (maxConsequence + 2))
        .attr('height', cellHeight * (maxLikelihood + 2))
        .append('g');

    for (var l = 0; l <= maxLikelihood; l++) {
        for (c = 0; c <= maxConsequence; c++) {
            y = (maxLikelihood - (l - 1)) * cellHeight;
            x = c * cellWidth;

            if (l > 0 && c > 0) {
                riskmatrix.append('rect')
                    .attr('x', x)
                    .attr('y', y)
                    .attr('width', cellWidth)
                    .attr('height', cellHeight)
                    .attr('stroke', 'black')
                    .attr('stroke-width', '2px')
                    .attr('fill', ctrl.getFill(l, c, maxLow, minHigh));
            } else if (l == 0 || c == 0) {
                block = riskmatrix
                    .attr('x', x)
                    .attr('y', y)
                    .attr('width', cellWidth)
                    .attr('height', cellHeight);

                if (l == 0 && c != 0) {
                    riskmatrix.append('text')
                        .attr('x', x + (cellWidth / 2))
                        .attr('y', y + (cellHeight / 2) + 3)
                        .attr('text-anchor', 'middle')
                        .style('font-size', '14px')
                        .style('font-family', '"Open Sans", sans-serif')
                        .style('font-weight', '500')
                        .text(c);
                } else if (l != 0 && c == 0) {
                    riskmatrix.append('text')
                        .attr('x', x + (cellWidth / 2))
                        .attr('y', y + (cellHeight / 2) + 3)
                        .attr('text-anchor', 'middle')
                        .style('font-size', '14px')
                        .style('font-family', '"Open Sans", sans-serif')
                        .style('font-weight', '500')
                        .text(l);
                }
            }
        }
    }
}



ctrl.drawWaterfall = function(id) {

    dt = new Date();
    //dt.setMonth(dt.getMonth()+6);

    xVal = d3.scaleTime()
        .rangeRound([0, width]);

    yVal = d3.scaleLinear()
        .rangeRound([height, 0]);


    var xAxis = d3.axisBottom(xVal);

    var yAxis = d3.axisLeft(yVal).tickFormat(risklevels).tickValues([3.5, 9.75, 18.125]).tickSize(0);

    var parseDate = d3.timeParse("%Y-%m-%d");


    ctrl.riskwaterfall[id].append('rect')
        .attr('class', 'high')
        .attr("x", 0) // start rectangle on the good position
        .attr("y", 0) // no vertical translate
        .attr("width", width) // correct size
        .attr("height", height * ((25.0 - 13.5) / 25.0) + height * 0.5 / 25)
        .attr("fill", "#ee0000"); // full height   

    ctrl.riskwaterfall[id].append('rect')
        .attr('class', 'med')
        .attr("x", 0) // start rectangle on the good position
        .attr("y", height * ((25.0 - 13.5) / 25.0) + height * 0.5 / 25.0) // no vertical translate
        .attr("width", width) // correct size
        .attr("height", height * ((13.5 - 7.0) / 25.0))
        .attr("fill", "#eeee00"); // full height 

    ctrl.riskwaterfall[id].append('rect')
        .attr('class', 'low')
        .attr("x", 0) // start rectangle on the good position
        .attr("y", (25 - 7) * height / 25 + height * 0.5 / 25.0) // no vertical translate
        .attr("width", width) // correct size
        .attr("height", 7 * height / 25 - height * 0.5 / 25.0)
        .attr("fill", "#00b050"); // full height

    ctrl.riskwaterfall[id].append('rect')
        .attr("x", -24.5) // start rectangle on the good position
        .attr("y", 0) // no vertical translate
        .attr("width", 25) // correct size
        .attr("height", height * ((25.0 - 13.5) / 25.0) + height * 0.5 / 25)
        .attr("stroke", "#000000")
        .attr("fill", "none");


    ctrl.riskwaterfall[id].append('rect')
        .attr("x", -24.5) // start rectangle on the good position
        .attr("y", height * ((25.0 - 13.5) / 25.0) + height * 0.5 / 25) // no vertical translate
        .attr("width", 25) // correct size
        .attr("height", height * ((13.5 - 7.0) / 25.0))
        .attr("stroke", "#000000")
        .attr("fill", "none");

    ctrl.riskwaterfall[id].append('rect')
        .attr("x", -24.5) // start rectangle on the good position
        .attr("y", (25 - 7) * height / 25 + height * 0.5 / 25.0) // no vertical translate
        .attr("width", 25) // correct size
        .attr("height", 7 * height / 25 + 0.5 - height * 0.5 / 25.0)
        .attr("stroke", "#000000")
        .attr("fill", "none");

    ctrl.riskwaterfall[id].append('rect')
        .attr("x", 0) // start rectangle on the good position
        .attr("y", 0) // no vertical translate
        .attr("width", width) // correct size
        .attr("height", height)
        .attr("stroke", "#000000")
        .attr("fill", "none");



    var line = d3.line()
        .curve(d3.curveStepAfter)
        .x(function(d) {
            return xVal(d.parsedate);
        })
        .y(function(d) {
            return yVal(d.risk);
        });

    //line('step-after');
  
    for (idx = -1; idx <  ctrl.schedule[id].length; idx++) {
        if (idx == -1) {
            act =  ctrl.actual[id][ ctrl.actual[id].length - 1];
            if (act && act.risk != -1 && act.date != null)
                ctrl.sched[id].push({
                    date: act.date,
                    risk: act.risk
                });
        } else
            ctrl.sched[id].push(ctrl.schedule[id][idx]);
    }

     ctrl.actual[id].forEach(function(d) {
        d.parsedate = parseDate(d.date);
        d.risk = +d.risk;
    });


    ctrl.sched[id].forEach(function(d) {
        d.parsedate = parseDate(d.date);
        d.risk = +d.risk;
    });

    ctrl.baseline[id].forEach(function(d) {
        d.parsedate = parseDate(d.date);
        d.risk = +d.risk;
    });
    
    
    if (ctrl.actual[id].length > 0) {
        xVal.domain(d3.extent([d3.min( ctrl.actual[id], function(d) {
            return d.parsedate;
        }), dt,  ctrl.actual[id][Object.keys(ctrl.actual[id]).length - 1].parsedate])).nice();
        yVal.domain(d3.extent( ctrl.actual[id], function(d) {
            return d.risk / 1.11 - 1.35;
        }));
    }
    
    if (ctrl.sched[id].length > 0)
    {
        xVal.domain(d3.extent([d3.min(ctrl.sched[id], function(d) {
            return d.date;
        }), dt, ctrl.sched[id][Object.keys(ctrl.sched[id]).length - 1].parsedate])).nice();
        yVal.domain(d3.extent(ctrl.sched[id], function(d) {
            return d.risk / 1.11 - 1.35;
        }));
    }

    if (ctrl.baseline[id].length > 0)
    {
        xVal.domain(d3.extent([d3.min( ctrl.baseline[id], function(d) {
            return d.parsedate;
        }), dt,  ctrl.baseline[id][Object.keys(ctrl.baseline[id]).length - 1].parsedate])).nice();
        yVal.domain(d3.extent( ctrl.baseline[id], function(d) {
            return d.risk * 1.11 - 1.35;
        }));
    }

    if (ctrl.baseline[id].length)
        ctrl.riskwaterfall[id].append('path')
            .datum(ctrl.baseline[id])
            .attr('d', line(ctrl.baseline[id]))
            .attr('stroke', 'blue');

    if (ctrl.actual[id].length)
        ctrl.riskwaterfall[id].append('path')
            .datum(ctrl.actual[id])
            .attr('d', line(ctrl.actual[id]))
            .attr('stroke', 'black')
            .attr("stroke-width", "1px");

    if (ctrl.sched[id].length)
        ctrl.riskwaterfall[id].append('path')
            .datum(ctrl.sched[id])
            .attr('d', line(ctrl.sched[id]))
            .attr('stroke', 'grey')
            .attr("stroke-width", "1px");


    for (var i = 0; i <  ctrl.actual.length; i++) {
        ctrl.riskwaterfall[id].append('rect')
            .datum( ctrl.actual[i])
            .attr("x", function(d) {
                return xVal(d.parsedate) - 2.5;
            })
            .attr("y", function(d) {
                return yVal(d.risk) - 2.5;
            })
            .attr("width", 5)
            .attr("height", 5)
            .attr("stroke-width", "2px")
            .attr("fill", "black")
            //.attr("fill-opacity", .5)
            //.attr("visibility", "hidden")
            .attr("r", 5);
    }

    for (var i = 0; i < ctrl.baseline.length; i++) {
        ctrl.riskwaterfall[id].append('rect')
            .datum( ctrl.baseline[i])
            .attr("x", function(d) {
                return xVal(d.parsedate) - 2.5;
            })
            .attr("y", function(d) {
                return yVal(d.risk) - 2.5;
            })
            .attr("width", 5)
            .attr("height", 5)
            .attr("stroke-width", "2px")
            .attr("fill", "black")
            //.attr("fill-opacity", .5)
            //.attr("visibility", "hidden")
            .attr("r", 5);
    }

    for (var i = 0; i < ctrl.sched.length; i++) {
        ctrl.riskwaterfall[id].append('rect')
            .datum(sched[i])
            .attr("x", function(d) {
                return xVal(d.parsedate) - 2.5;
            })
            .attr("y", function(d) {
                return yVal(d.risk) - 2.5;
            })
            .attr("width", 5)
            .attr("height", 5)
            .attr("stroke-width", "2px")
            .attr("fill", "black")
            //.attr("fill-opacity", .5)
            //.attr("visibility", "hidden")
            .attr("r", 5);
    }

    ctrl.riskwaterfall[id].append('g')
        .attr('class', 'x axis')
        .attr('transform', 'translate(0,' + height + ')')
        .call(xAxis).call(d3.axisBottom(xVal)
            .ticks(5));



    ctrl.riskwaterfall[id].append('g')
        .attr('class', 'y axis')
        .call(yAxis)
        .selectAll("text")
        .attr("transform", "translate(-10,5)rotate(-90)translate(22,-5)")
        .append('text')
        .attr('transform', "")
        .attr('y', 6)
        .attr('dy', '.71em')
        .style('text-anchor', 'end');




    ctrl.riskwaterfall[id].append('line')
        .style('stroke', 'black')
        .attr('x1', function() {
            return xVal(dt);
        })
        .attr('y1', 0)
        .attr('x2', function() {
            return xVal(dt);
        })
        .attr('y2', height)
        .style("stroke-dasharray", "3,3"); //dashed array for line


    dtText = dt.getMonth() + 1 + "/" + dt.getDate() + "/" + dt.getFullYear();

    ctrl.riskwaterfall[id].append('text')
        .text(dtText)
        .style('font-size', '14px')
        .style('font-family', '"Open Sans", sans-serif')
        .style('font-weight', '500')
        .attr('transform', 'translate(-55,35)')
        .attr('x', function() {
            return xVal(dt) - 25;
        })
        .attr('y', height - 50);
}


ctrl.first = true;

ctrl.drawToolTip = function(id) {
   
   
   ctrl.focus[id] = ctrl.riskwaterfall[id].append("g")
        .attr("class", "focus")
        .style("display", "none");

    ctrl.focus[id].append("circle")
        .attr("r", 1);

    ctrl.focus[id].append("rect")
        .attr("class", "tooltip")
        .attr("width", 170)
        .attr("height", 80)
        .attr("x", 10)
        .attr("y", -22)
        .attr("rx", 4)
        .attr("ry", 4);

    ctrl.focus[id].append("text")
        .attr("class", "tooltip-date")
        .attr("x", 18)
        .attr("y", -2);

    ctrl.focus[id].append("text")
        .attr("x", 18)
        .attr("y", 18)
        .text('');

    ctrl.focus[id].append("text")
        .attr("class", "tooltip-risk")
        .attr("x", 60)
        .attr("y", 18);

    ctrl.focus[id].append("text")
        .attr("x", 18)
        .attr("y", 18)
        .text("Risk: ");

    ctrl.focus[id].append("text")
        .attr("class", "tooltip-eventowner")
        .attr("x", 60)
        .attr("y", 36);


    ctrl.focus[id].append("text")
        .attr("x", 18)
        .attr("y", 36)
        .text("Owner: ");

    ctrl.focus[id].append("text")
        .attr("class", "tooltip-eventtitle")
        .attr("x", 60)
        .attr("y", 54);


    ctrl.focus[id].append("text")
        .attr("x", 18)
        .attr("y", 54)
        .text("Title: ");


    // var parseDate = d3.time.format("%m/%e/%Y").parse,
    bisectDate = d3.bisector(function(d) {
        return d.parsedate;
    }).left
    
  ctrl.riskwaterfall[id].append("rect")
        .attr("class", "overlay"+id)
        .attr("width", 300)
        .attr("height", 150);
        
        
    ctrl.riskwaterfall[id].on("mouseover", function() {
            ctrl.focus[id].style("opacity", "1");
        })
        .on("mousemove", function() {ctrl.focus[id].style("display", "block").style("opacity", "1"); ctrl.renderToolTip(id);})
        .on("mouseout", function() {
            ctrl.focus[id].style("display", "none");
        });
    
}

ctrl.renderToolTip = function(id){
          var overlay = d3.select('.overlay'+id);
                
                var x0 = xVal.invert(d3.mouse(overlay.node())[0]),
                    i = bisectDate(ctrl.datapoints[id], x0, 1),
                    d0 = ctrl.datapoints[id][i - 1],
                    d1 = ctrl.datapoints[id][i];
                if (d0 && d1) {

                    d = (x0 - d0.parsedate > d1.parsedate - x0) ? d1 : d0;
                    ctrl.focus[id].attr("transform", "translate(" + xVal(d.parsedate) + "," + yVal(d.risk) + ")");
                    ctrl.focus[id].select(".tooltip-date").text(d.type + " #" + d.id + " " + (d.parsedate.getMonth() + 1) + '/' + d.parsedate.getDate() + '/' + d.parsedate.getFullYear());
                    ctrl.focus[id].select(".tooltip-risk").text(d.level);
                    ctrl.focus[id].select(".tooltip-eventtitle").text(d.eventtitle);
                    ctrl.focus[id].select(".tooltip-eventowner").text(d.owner);
                    ctrl.focus[id].style("display", "block !important");
                }
      }
}]);



