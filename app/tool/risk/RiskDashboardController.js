angular.module('Risk').controller('RiskDashboardController', ['$http', '$resource', '$scope', '$state', '$window', '$timeout', '$interval', '$sce', 'CommonService', 'DOMops', 'ValidationService', function($http, $resource, $scope, $state, $window, $timeout, $interval, $sce, CommonService, DOMops, ValidationService){
        
        var ctrl = this;
        ctrl.DOMops = DOMops;
        ctrl.ValidationService = ValidationService;
        ctrl.riskConfigFetched = false;
        ctrl.onlyRiskMatrix = true;    
        $scope.riskChart = {};
        $scope.openChart = {};
        $scope.gridsterOpts = {
            columns: 6, // the width of the grid, in columns
            pushing: true, // whether to push other items out of the way on move or resize
            floating: true, // whether to automatically float items up so they stack (you can temporarily disable if you are adding unsorted items with ng-repeat)
            swapping: false, // whether or not to have items of the same size switch places instead of pushing down if they are the same size
            width: 'auto', // can be an integer or 'auto'. 'auto' scales gridster to be the full width of its containing element
            colWidth: 'auto', // can be an integer or 'auto'.  'auto' uses the pixel width of the element divided by 'columns'
            rowHeight: 'match', // can be an integer or 'match'.  Match uses the colWidth, giving you square widgets.
            margins: [10, 10], // the pixel distance between each widget
            outerMargin: true, // whether margins apply to outer edges of the grid
            sparse: true, // "true" can increase performance of dragging and resizing for big grid (e.g. 20x50)
            isMobile: true, // stacks the grid items if true
            mobileBreakPoint: 600, // if the screen is not wider that this, remove the grid layout and stack the items
            mobileModeEnabled: true, // whether or not to toggle mobile mode when screen width is less than mobileBreakPoint
            minColumns: 1, // the minimum columns the grid must have
            minRows: 1, // the minimum height of the grid, in rows
            maxRows: 10,
            defaultSizeX: 2, // the default width of a gridster item, if not specifed
            defaultSizeY: 1, // the default height of a gridster item, if not specified
            minSizeX: 1, // minimum column width of an item
            maxSizeX: null, // maximum column width of an item
            minSizeY: 1, // minumum row height of an item
            maxSizeY: null, // maximum row height of an item
            resizable: {
               enabled: true,
               handles: ['n', 'e', 's', 'w', 'ne', 'se', 'sw', 'nw'],
               start: function(event, $element, widget) {}, // optional callback fired when resize is started,
               resize: function(event, $element, widget) {                
                    
                    if ($element[0].id == 'risk-chart')
                        chart = riskChart;
                    else
                        chart = monthlyRiskStatus;
                        
                    resize(chart, $element.width, $element.height, resize, $element[0].id);
               }, // optional callback fired when item is resized,
               stop: function(event, $element, widget) {} // optional callback fired when item is finished resizing
            },
            draggable: {
               enabled: true, // whether dragging items is supported
               handle: '.my-class', // optional selector for drag handle
               start: function(event, $element, widget) {}, // optional callback fired when drag is started,
               drag: function(event, $element, widget) {}, // optional callback fired when item is moved,
               stop: function(event, $element, widget) {} // optional callback fired when item is finished dragging
            }
        };
    
    var monthlyRiskStatus = {};
    var riskChart  = {};
    var categoryChart = {};
    var cycleChart = {}; 
    var burnupChart = {};
    
    
    var widthCycleChart;
    var heightCycleChart;
    
    var widthBurnupChart;
    var heightBurnupChart;
    
    // these map directly to gridsterItem options
    $scope.standardItems = [{
        id: "risk-chart",
        sizeX: 1,
        sizeY: 1,
        row: 0,
        col: 0
    }, {
        id: "risk-status-by-month",
        sizeX: 5,
        sizeY: 1,
        row: 0,
        col: 2
    },{
        id: "risk-category-chart",
        sizeX: 2,
        sizeY: 1,
        row: 1,
        col: 0
    },{
        id: "risk-cycle-chart",
        sizeX: 3,
        sizeY: 1,
        row: 1,
        col: 2
    },{
        id: "risk-matrix-chart",
        sizeX: 1,
        sizeY: 1,
        row: 1,
        col: 5
    },{
        id: "risk-burnup-chart",
        sizeX: 3,
        sizeY: 1,
        row: 3,
        col: 0
    },{
        sizeX: 3,
        sizeY: 1,
        row: 3,
        col: 3
    }];


    $scope.emptyItems = [{
        name: 'Item1'
    }, {
        name: 'Item2'
    }, {
        name: 'Item3'
    }, {
        name: 'Item4'
    }];

    // map the gridsterItem to the custom item structure
    $scope.customItemMap = {
        sizeX: 'item.size.x',
        sizeY: 'item.size.y',
        row: 'item.position[0]',
        col: 'item.position[1]'
    };   
          
          
    ctrl.risklevels = {
        riskmaximum: '',
        riskhigh:'' ,
        riskmedium: '',
        riskminimum:'' 
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
                                                         
       
    ctrl.riskMatrix = [];
    for(var l = 1; l <= 5; l++)
    {
        ctrl.riskMatrix[l] = [];
        for (var c = 0; c <= 5; c++)
        {
            ctrl.riskMatrix[l][c] = '';  
        }
    }
     
                               
    $scope.openRiskCharts = function(){
    
         riskChart = new dc.pieChart('#risk-chart', 'risk');
         riskChart.ordinalColors(["#00b050", "#eeee00", "#ee0000"]);
         var levelCounts = [
                    {Level: 'High', Count: 13},
                    {Level: 'Med', Count: 43},
                    {Level: 'Low', Count: 60}
         ];
         
         // set crossfilter
         var ndx = crossfilter(levelCounts),
            levelDim  = ndx.dimension(function(d) {return d.Level;}),
            countPerLevel = levelDim.group().reduceSum(function(d) {return +d.Count});
               
         var chart = document.getElementById('risk-chart'); 
      
      
         heightRiskChart = Math.floor(chart.offsetHeight) 
          - 2*parseInt(window.getComputedStyle(chart, null).getPropertyValue('padding-top'));
         widthRiskChart =  55
            + Math.floor(parseFloat(window.getComputedStyle(chart, null).width))
          - 2*parseInt(window.getComputedStyle(chart, null).getPropertyValue('padding-top'));    
    
         riskChart
            .dimension(levelDim)
            .group(countPerLevel)
            .width(widthRiskChart)
            .height(heightRiskChart)
            .radius(Math.round(heightRiskChart/2.0))
            .innerRadius(Math.round(heightRiskChart/5.0))
            .controlsUseVisibility(true)
            .transitionDuration(250);
            
       riskChart.on('pretransition', function(chart) {             
            d3.select("g.pie-slice-group")
              .append("text") // appent the "text" element
              .attr("dy", '-0.25em')
              .attr("text-anchor", "middle")
              .attr('font-size', '200%')
              .attr('font-weight', "bold")
              .text("142");
              
            d3.select("g.pie-slice-group")
              .append("text")
              .attr("dy", "0.75em")
              .attr("text-anchor", "middle")
              .attr('font-size', '200%')
              .attr("font-weight", "bold")
              .text("Open");     
        }); 
    
                    
    }
    
    $scope.riskStatusByMonth = function(){
 
        var $scope = {};

        var data = [ 
                            {"Month":"Jan","High":12},{"Month":"Jan","Med":14},{"Month":"Jan","Low":2},{"Month":"Jan","Closed":8},
                            {"Month":"Feb","High":12},{"Month":"Feb","Med":14},{"Month":"Feb","Low":2},{"Month":"Feb","Closed":8},
                            {"Month":"Mar","High":12},{"Month":"Mar","Med":14},{"Month":"Mar","Low":2},{"Month":"Mar","Closed":8},
                            {"Month":"Apr","High":12},{"Month":"Apr","Med":14},{"Month":"Apr","Low":2},{"Month":"Apr","Closed":8},
                            {"Month":"May","High":12},{"Month":"May","Med":14},{"Month":"May","Low":2},{"Month":"May","Closed":8},
                            {"Month":"Jun","High":12},{"Month":"Jun","Med":14},{"Month":"Jun","Low":2},{"Month":"Jun","Closed":8},
                            {"Month":"Jul","High":12},{"Month":"Jul","Med":14},{"Month":"Jul","Low":2},{"Month":"Jul","Closed":8},
                            {"Month":"Aug","High":12},{"Month":"Aug","Med":14},{"Month":"Aug","Low":2},{"Month":"Aug","Closed":8},
                            {"Month":"Sep","High":12},{"Month":"Sep","Med":14},{"Month":"Sep","Low":2},{"Month":"Sep","Closed":8},
                            {"Month":"Oct","High":12},{"Month":"Oct","Med":14},{"Month":"Oct","Low":2},{"Month":"Oct","Closed":8},
                            {"Month":"Nov","High":12},{"Month":"Nov","Med":14},{"Month":"Nov","Low":2},{"Month":"Nov","Closed":8},
                            {"Month":"Dec","High":8},{"Month":"Dec","Med":6},{"Month":"Dec","Low":13},{"Month":"Dec","Closed":8},
                       ]
            data.forEach(function(x) {
              x.Total = 0;
            });

            var ndx = crossfilter(data);

            var xdim = ndx.dimension(function (d) {return d.Month;});

            function root_function(dim,stack_names) {
                return dim.group().reduce(
              function(p, v) {
                stack_names.forEach(stack_name => {
                  if(v[stack_name] !== undefined)
                      p[stack_name] = (p[v[stack_name]] || 0) + v[stack_name]
                });
                return p;}, 
              function(p, v) {
                stack_names.forEach(stack_name => {
                  if(v[stack_name] !== undefined)
                      p[stack_name] = (p[v[stack_name]] || 0) + v[stack_name]
                });
                return p;}, 
              function() {
                return {};
              });}

            var levels = ['High', 'Med', 'Low', 'Closed']
                var months = ['Jan','Feb','Mar','Apr','May','Jun','Jul','Aug','Sep','Oct','Nov','Dec'];
            var ygroup = root_function(xdim,levels)
            //console.log(ygroup.all())

            function sel_stack(i) {
            return function(d) {
              return d.value[i];
            };}

            monthlyRiskStatus = new dc.barChart("#risk-status-by-month");


            var chart = document.getElementById('risk-status-by-month'); 
      
      
            heightStatusChart = Math.floor(chart.offsetHeight) 
             - 2*parseInt(window.getComputedStyle(chart, null).getPropertyValue('padding-top'));
            widthStatusChart = Math.floor(parseFloat(window.getComputedStyle(chart, null).width))
             - 2*parseInt(window.getComputedStyle(chart, null).getPropertyValue('padding-top'));    
       

            monthlyRiskStatus
              .x(d3.scaleOrdinal().domain(months))
              .dimension(xdim)
              .group(ygroup, levels[0], sel_stack(levels[0]))
              .xUnits(dc.units.ordinal)
              .margins({left:75, top: 0, right: 0, bottom: 20})
              .width(widthStatusChart) 
              .height(heightStatusChart)
              .legend(dc.legend());
                
            
            for(var i = 1; i<levels.length; ++i)
              monthlyRiskStatus.stack(ygroup, levels[i], sel_stack(levels[i]));
    }
    
    
    $scope.riskCategoryChart = function(){
        categoryChart = new dc.rowChart("#risk-category-chart");
        var chart = document.querySelector("#risk-category-chart");
        var categoryData = ["Category 1", "Category 2", "Category 3", "Category 4", "Category 5", "All Others"];

        var countData = [60, 41, 20, 10, 5, 6];

        heightCategoryChart = Math.floor(chart.offsetHeight) 
             - 2*parseInt(window.getComputedStyle(chart, null).getPropertyValue('padding-top'));
        widthCategoryChart = Math.floor(parseFloat(window.getComputedStyle(chart, null).width))
             - 2*parseInt(window.getComputedStyle(chart, null).getPropertyValue('padding-top'));    
       
                 
        // feed it through crossfilter
        var ndx = crossfilter(countData);
        var x = d3.scaleLinear()
          .range([0,widthCategoryChart]);                                            
        var countByCategory = ndx.dimension(function(d) { return d });
        var countByCategoryGroup = countByCategory.group().reduceSum(function(d) { return d; });
        var y = d3.scaleLinear().range([0,heightCategoryChart]);

          var xAxis = d3.axisBottom()
            .scale(x);

        var yAxis = d3.axisLeft()
          .scale(y)
          .tickSize(0)
          .tickPadding(6);
  
        categoryChart
            .width(widthCategoryChart)
            .height(heightCategoryChart)  
            .dimension(countByCategory)
            .group(countByCategoryGroup);
            
        var svg = d3.select("#risk-category-chart").append("svg")
          .attr("width", widthCategoryChart)
          .attr("height", heightCategoryChart)
          .append("g");
          
           x.domain(d3.extent(categoryData, function(d) {
            return d.value;
          })).nice();
          y.domain(countData.map(function(d) {
            return d;
          }));

          svg.selectAll(".bar")
            .data(y)
            .enter().append("rect")
            .attr("class", function(d) {
              return "bar bar--" + (d.value < 0 ? "negative" : "positive");
            })
            .attr("x", function(d) {
              return x(Math.min(0, d));
            })
            .attr("y", function(d) {
              return y(d);
            })
            .attr("width", function(d) {
              return Math.abs(x(d) - x(0));
            })
            .attr("height", y);

          var left = svg.selectAll(".leftData")
            .data(categoryData)
            .enter().append("g")
            .attr("class", "leftVal")
            .attr("transform", function() {
              return "translate(0,0)";
            });

          left.append("text")
            .attr("x", 0)
            .attr("y", 9)
            .attr("dy", ".35em")
            .style("text-anchor", "end")
            .text(function(d) {
              return d;
            });

          var right = svg.selectAll(".rightData")
            .data(countData)
            .enter().append("g")
            .attr("class", "rightVal")
            .attr("transform", function(d, i) {
              return "translate(0,0)";
            });

          right.append("text")
            .attr("x", widthCategoryChart + 30)
            .attr("y", 9)
            .attr("dy", ".35em")
            .style("text-anchor", "end")
            .text(function(d) {
              return d;
            });

           svg.append("g")
            .attr("class", "x axis")
            .attr("transform", "translate(0," + heightCategoryChart + ")")
            .call(xAxis);
            
                   
          svg.append("g")
            .attr("class", "y axis")
            .attr("transform", "translate(" + 0 + ",0)")
            .call(yAxis); 

        function type(d) {
          d.value = +d;
          return d;
        }
    }
    
    $scope.avgCycleTime = function(){
      
        
        var data = [ 
                        {"Project":"Expedition","Stage": "Created", "Days":12, "Color": "rgb(166, 206, 227)"},
                        {"Project":"Expedition","Stage": "Active", "Days":14, "Color": "rgb(253, 180, 98)"},
                        {"Project":"Expedition","Stage": "Closing", "Days":2, "Color": "rgb(179, 222, 105)"}
        ];
      
      
        var tbl = document.createElement("table");
        tbl.setAttribute("style", "width: 100%");
        var tblBody = document.createElement("tbody");

        // table row creation
        var row = document.createElement("tr");

        for (var i = 0; i <= 2; i++) {
          // create element <td> and text node 
          //Make text node the contents of <td> element
          // put <td> at end of the table row
          var cell = document.createElement("td");
          cell.setAttribute('style', 'font-size: 7pt; width: ' + data[i].Days * 100 + "px; background-color: " + data[i].Color);
          var cellText = document.createTextNode(data[i].Stage + " " + data[i].Days + ' days');

          cell.appendChild(cellText);
          row.appendChild(cell);
        }

        //row added to end of table body
        tblBody.appendChild(row);

        // append the <tbody> inside the <table>
        tbl.appendChild(tblBody);
        var tblDiv = document.createElement("div");
        tblDiv.setAttribute("style", "width: 100%;  display: block;");
        tblDiv.appendChild(tbl);
        // put <table> in the <body>
        document.querySelector("#risk-cycle-chart").appendChild(tblDiv);

        
        var tblDivNewLine = document.createElement("div");
        tblDivNewLine.setAttribute("style", "width: 100%: display: block");
        var tblNewLine = document.createElement("table");
        tblNewLine.setAttribute("style", "width: 100%; height: 0px");

        var tblbodyNewLine = document.createElement("tbody");

        // table row creation
        var rowNewLine = document.createElement("tr");
   
        
        var cellNewLine = document.createElement("td");
        var cellText = document.createTextNode(" ");
        cellNewLine.appendChild(cellText);
        rowNewLine.appendChild(cellNewLine);
        tblbodyNewLine.appendChild(rowNewLine);
        tblNewLine.appendChild(tblbodyNewLine);
        tblDivNewLine.appendChild(tblNewLine);
        document.querySelector("#risk-cycle-chart").appendChild(tblDivNewLine);
 
        
          
        var tbl2 = document.createElement("table");
        tbl2.setAttribute("style", "width: 100%");
        tbl2.setAttribute("border", "1");
        var tblBody2 = document.createElement("tbody");

        // table row creation
        var row = document.createElement("tr");
   
       
        var cell = document.createElement("td");
        cell.setAttribute('style', 'font-size:8pt; font-style: italic; font wight: bold; background-color: #0038a8; color: white');
        var cellText = document.createTextNode("Team");
        cell.appendChild(cellText);
        row.appendChild(cell);
      
        var cell = document.createElement("td");
        cell.setAttribute('style', 'font-size:8pt; font-style: italic; font wight: bold; background-color: #0038a8; color: white');
        var cellText = document.createTextNode("Leader");
        cell.appendChild(cellText);
        row.appendChild(cell);
        
        var cell = document.createElement("td");
        cell.setAttribute('style', 'font-size:8pt; font-style: italic; font wight: bold; background-color: #0038a8; color: white');
        var cellText = document.createTextNode("Open H");
        cell.appendChild(cellText);
        row.appendChild(cell);
        
        var cell = document.createElement("td");
        cell.setAttribute('style', 'font-size:8pt; font-style: italic; font wight: bold; background-color: #0038a8; color: white');
        var cellText = document.createTextNode("Open M");
        cell.appendChild(cellText);
        row.appendChild(cell);
                
        var cell = document.createElement("td");
        cell.setAttribute('style', 'font-size:8pt; font-style: italic; font wight: bold; background-color: #0038a8; color: white');
        var cellText = document.createTextNode("Open L");
        cell.appendChild(cellText);
        row.appendChild(cell);
        
        var cell = document.createElement("td");
        cell.setAttribute('style', 'font-size:8pt; font-style: italic; font wight: bold; background-color: #0038a8; color: white');
        var cellText = document.createTextNode("Avg Days Open");
        cell.appendChild(cellText);
        row.appendChild(cell);
        
        var cell = document.createElement("td");
        cell.setAttribute('style', 'font-size:8pt; font-style: italic; font wight: bold; background-color: #0038a8; color: white');
        var cellText = document.createTextNode("Past Due");
        cell.appendChild(cellText);
        row.appendChild(cell);
        
        
        var cell = document.createElement("td");
        cell.setAttribute('style', 'font-size:8pt; font-style: italic; font wight: bold; background-color: #0038a8; color: white');
        cellText = document.createTextNode("Closed H");
        cell.appendChild(cellText);
        row.appendChild(cell);
        
        var cell = document.createElement("td");
        cell.setAttribute('style', 'font-size:8pt; font-style: italic; font wight: bold; background-color: #0038a8; color: white');
        var cellText = document.createTextNode("Closed M");
        cell.appendChild(cellText);
        row.appendChild(cell);
                
        var cell = document.createElement("td");
        cell.setAttribute('style', 'font-size:8pt; font-style: italic; font wight: bold; background-color: #0038a8; color: white');
        var cellText = document.createTextNode("Closed L");
        cell.appendChild(cellText);
        row.appendChild(cell);
        
        var cell = document.createElement("td");
        cell.setAttribute('style', 'font-size:8pt; font-style: italic; font wight: bold; background-color: #0038a8; color: white');
        var cellText = document.createTextNode("Avg Cyc Time");
        cell.appendChild(cellText);
        row.appendChild(cell);
        
        var cell = document.createElement("td");
        cell.setAttribute('style', 'font-size:8pt; font-style: italic; font wight: bold; background-color: #0038a8; color: white');
        var cellText = document.createTextNode("Closed Past Due");
        cell.appendChild(cellText);
        row.appendChild(cell);
        
        var cell = document.createElement("td");
        cell.setAttribute('style', 'font-size:8pt; font-style: italic; font wight: bold; background-color: #0038a8; color: white');
        var cellText = document.createTextNode("Tot Items");
        cell.appendChild(cellText);
        row.appendChild(cell);
        //row added to end of table body
        tblBody2.appendChild(row);                                                                       

        var cycleData = [
          ['Team1', 'Smith, John', 6, 5, 4, '105d', '60%',  10, 2, 2, '', '', 29],
          ['Team2', 'Smith, John', 6, 5, 4, '15d', '45%',  10, 2, 2, '', '', 29],
          ['Team3', 'Smith, John', 6, 5, 4, '145d', '23%',  10, 2, 2, '', '10%', 29],
          ['Team4', 'Smith, John', 6, 5, 4, '10d', '10%',  10, 2, 2, '', '15%', 29],
          ['Team5', 'Jabagchourian, Vahe', 6, 5, 4, '105d', '60%',  10, 2, 2, '', '', 29],
          ['Team6', 'Jabagchourian, Harry', 6, 5, 4, '15d', '45%',  10, 2, 2, '', '', 29],
          ['Team7', 'Smith, Sue', 6, 5, 4, '145d', '23%',  10, 2, 2, '', '10%', 29],
          ['Team8', 'Smith, John', 6, 5, 4, '10d', '10%',  10, 2, 2, '', '15%', 29],
          ['Team9', 'Jabagchourian, Vahe', 6, 5, 4, '105d', '60%',  10, 2, 2, '', '', 29],
          ['Team10', 'Jabagchourian, Harry', 6, 5, 4, '15d', '45%',  10, 2, 2, '', '', 29],
          ['Team11', 'Smith, Sue', 6, 5, 4, '145d', '23%',  10, 2, 2, '', '10%', 29],
          ['Team11', 'Smith, Sue', 6, 5, 4, '145d', '23%',  10, 2, 2, '', '10%', 29],
          ['', 'Totals', 6, 5, 4, '105d', '60%',  10, 2, 2, '', '', 29]
          
        ];         
        for (var r = 0; r < cycleData.length; r++)
        {
        
                // table row creation
                 var row = document.createElement("tr");

                 for (var i = 0; i <= 12; i++) {
                  // create element <td> and text node 
                  //Make text node the contents of <td> element
                  // put <td> at end of the table row
                  var cell = document.createElement("td");
                  cell.setAttribute("sytle", "font-weight: bold");
                  var cellText = document.createTextNode(cycleData[r][i]);

                  cell.appendChild(cellText);
                  row.appendChild(cell);
                }
                //row added to end of table body
                tblBody2.appendChild(row);

        }

          // append the <tbody> inside the <table>
          tbl2.appendChild(tblBody2);
          // put <table> in the <body>        '
          
          
          var tblDiv2 = document.createElement("div");
        tblDiv2.setAttribute("style", "width: 100%; height: 255px;  display: block;");
        tblDiv2.setAttribute("class", "tableDiv");
        tblDiv2.appendChild(tbl2);
        // put <table> in the <body>
        document.querySelector("#risk-cycle-chart").appendChild(tblDiv2);
            
    }
   
        $scope.riskMatrixChart = function(){
          var countRisk = 
          [[],
           [null,'','','2','','7'],
           [null,'','','3','',''],
           [null,'30','','30','','2'],
           [null,'','20','','10','3'],
           [null,'5','','5','','']
          ];
        var titlediv = document.createElement("div");
        titlediv.setAttribute("style", "width: 100%; text-align: center");
        var title = document.createTextNode("Matrix Totals (Risks)");
        titlediv.appendChild(title);
        
        document.querySelector("#risk-matrix-chart").appendChild(titlediv);
      
      
          var tblDiv = document.createElement("div");
          tblDiv.setAttribute("style", "width: 100%;  display: block");
            // table row creation
             var table = document.createElement("table");
             table.setAttribute("class", "matrix");
             table.setAttribute("id", "riskmatrix");
                    
         
           var tblBody = document.createElement("tbody");

            for (var l = 5; l >= 1; l--)
            {
                var row = document.createElement("tr");
                var cell = document.createElement("td");
                if (l == 2)
                {
                    cell.setAttribute("class", "vlabel");
                    var textNode = document.createTextNode("Likelihood");
                    cell.appendChild(textNode);
                }
                row.appendChild(cell);
                 
                var cell = document.createElement("td");
                cell.setAttribute("class", "likelihood");
                var textNode = document.createTextNode(l);
                cell.appendChild(textNode);
          
                row.appendChild(cell);
                
                  
                 for (var c = 1; c <= 5; c++) {
                  var cell = document.createElement("td");
                  cell.setAttribute("name", "riskMatrix["+l+"]["+c+"]");
                  cell.setAttribute("class", ctrl.riskLevel(l,c));
                  var textNode = document.createTextNode(countRisk[l][c]);
                  cell.appendChild(textNode);
                  row.appendChild(cell);
                }
                //row added to end of table body
                tblBody.appendChild(row);

        }
        var row = document.createElement("tr");
        var cell = document.createElement("td");
        row.appendChild(cell);
        var cell = document.createElement("td");
        row.appendChild(cell);

         for (var c = 1; c <= 5; c++) {
            var cell = document.createElement("td");
            var textNode = document.createTextNode(c);
            cell.appendChild(textNode);
            row.appendChild(cell); 
         }
        
          // append the <tbody> inside the <table>
          tblBody.appendChild(row);
          // put <table> in the <body>        '
          
            var row = document.createElement("tr"); 
                var cell = document.createElement("td");  
                row.appendChild(cell);
                var cell= document.createElement("td");
                row.appendChild(cell);
             var cell = document.createElement("td");
             cell.setAttribute("colspan", "5");
             cell.setAttribute("style", "text-align: center");
            var textNode = document.createTextNode("Consequence");
            cell.appendChild(textNode);
            row.appendChild(cell);
            
            
            
          tblBody.appendChild(row);
          table.appendChild(tblBody);
          tblDiv.appendChild(table);
        
        document.querySelector("#risk-matrix-chart").appendChild(tblDiv); 
    }
        
        
    $scope.eventBurnupChart = function(){
        burnupData = {"totalEvents":[{"x":1459296000000,"y":1},{"x":1459382400000,"y":2},{"x":1459468800000,"y":2},{"x":1459555200000,"y":3},{"x":1459641600000,"y":3},{"x":1459728000000,"y":3},{"x":1459814400000,"y":4},{"x":1459900800000,"y":4},{"x":1459987200000,"y":4},{"x":1460073600000,"y":4},{"x":1460160000000,"y":4},{"x":1460246400000,"y":4},{"x":1460332800000,"y":6},{"x":1460419200000,"y":6},{"x":1460505600000,"y":6},{"x":1460592000000,"y":6},{"x":1460678400000,"y":6},{"x":1460764800000,"y":6},{"x":1460851200000,"y":6},{"x":1460937600000,"y":8},{"x":1461024000000,"y":8},{"x":1461110400000,"y":8},{"x":1461196800000,"y":8},{"x":1461283200000,"y":8},{"x":1461369600000,"y":8},{"x":1461456000000,"y":8},{"x":1461542400000,"y":8},{"x":1461628800000,"y":8},{"x":1461715200000,"y":9},{"x":1461801600000,"y":9},{"x":1461888000000,"y":9},{"x":1461974400000,"y":9},{"x":1462060800000,"y":9},{"x":1462147200000,"y":12},{"x":1462233600000,"y":13},{"x":1462320000000,"y":13},{"x":1462406400000,"y":13},{"x":1462492800000,"y":13},{"x":1462579200000,"y":13},{"x":1462665600000,"y":13},{"x":1462752000000,"y":16},{"x":1462838400000,"y":19},{"x":1462924800000,"y":22},{"x":1463011200000,"y":24},{"x":1463097600000,"y":27},{"x":1463184000000,"y":27},{"x":1463270400000,"y":27},{"x":1463356800000,"y":28},{"x":1463443200000,"y":29},{"x":1463529600000,"y":29},{"x":1463616000000,"y":30},{"x":1463702400000,"y":31},{"x":1463788800000,"y":31},{"x":1463875200000,"y":31},{"x":1463961600000,"y":31},{"x":1464048000000,"y":31},{"x":1464134400000,"y":31},{"x":1464220800000,"y":31},{"x":1464307200000,"y":31},{"x":1464393600000,"y":31},{"x":1464480000000,"y":31},{"x":1464566400000,"y":31},{"x":1464652800000,"y":31},{"x":1464739200000,"y":31},{"x":1464825600000,"y":31},{"x":1464912000000,"y":31},{"x":1464998400000,"y":31},{"x":1465084800000,"y":31},{"x":1465171200000,"y":31},{"x":1465257600000,"y":32},{"x":1465344000000,"y":32},{"x":1465430400000,"y":32},{"x":1465516800000,"y":32},{"x":1465603200000,"y":32},{"x":1465689600000,"y":32},{"x":1465776000000,"y":32},{"x":1465862400000,"y":32},{"x":1465948800000,"y":32},{"x":1466035200000,"y":32},{"x":1466121600000,"y":32},{"x":1466208000000,"y":32},{"x":1466294400000,"y":32},{"x":1466380800000,"y":32},{"x":1466467200000,"y":32},{"x":1466553600000,"y":32},{"x":1466640000000,"y":32},{"x":1466726400000,"y":32},{"x":1466812800000,"y":32},{"x":1466899200000,"y":32},{"x":1466985600000,"y":32},{"x":1467072000000,"y":32},{"x":1467158400000,"y":33},{"x":1467244800000,"y":33},{"x":1467331200000,"y":33},{"x":1467417600000,"y":33},{"x":1467504000000,"y":33},{"x":1467590400000,"y":33},{"x":1467676800000,"y":33},{"x":1467763200000,"y":33},{"x":1467849600000,"y":33},{"x":1467936000000,"y":33},{"x":1468022400000,"y":33},{"x":1468108800000,"y":33},{"x":1468195200000,"y":33},{"x":1468281600000,"y":33},{"x":1468368000000,"y":33},{"x":1468454400000,"y":33},{"x":1468540800000,"y":33},{"x":1468627200000,"y":33},{"x":1468713600000,"y":33},{"x":1468800000000,"y":33},{"x":1468886400000,"y":33},{"x":1468972800000,"y":33},{"x":1469059200000,"y":33},{"x":1469145600000,"y":33},{"x":1469232000000,"y":33},{"x":1469318400000,"y":33},{"x":1469404800000,"y":33},{"x":1469491200000,"y":33},{"x":1469577600000,"y":33},{"x":1469664000000,"y":33},{"x":1469750400000,"y":33},{"x":1469836800000,"y":33},{"x":1469923200000,"y":33},{"x":1470009600000,"y":33},{"x":1470096000000,"y":33},{"x":1470182400000,"y":33},{"x":1470268800000,"y":33},{"x":1470355200000,"y":33},{"x":1470441600000,"y":33},{"x":1470528000000,"y":33},{"x":1470614400000,"y":33},{"x":1470700800000,"y":33},{"x":1470787200000,"y":33},{"x":1470873600000,"y":33},{"x":1470960000000,"y":33},{"x":1471046400000,"y":33},{"x":1471132800000,"y":33},{"x":1471219200000,"y":33},{"x":1471305600000,"y":33},{"x":1471392000000,"y":33},{"x":1471478400000,"y":33},{"x":1471564800000,"y":33},{"x":1471651200000,"y":33},{"x":1471737600000,"y":33},{"x":1471824000000,"y":33},{"x":1471910400000,"y":33},{"x":1471996800000,"y":33},{"x":1472083200000,"y":33},{"x":1472169600000,"y":33},{"x":1472256000000,"y":33},{"x":1472342400000,"y":33},{"x":1472428800000,"y":33},{"x":1472515200000,"y":33},{"x":1472601600000,"y":33},{"x":1472688000000,"y":33},{"x":1472774400000,"y":33},{"x":1472860800000,"y":33},{"x":1472947200000,"y":33},{"x":1473033600000,"y":33},{"x":1473120000000,"y":33},{"x":1473206400000,"y":33},{"x":1473292800000,"y":33},{"x":1473379200000,"y":33},{"x":1473465600000,"y":33},{"x":1473552000000,"y":33},{"x":1473638400000,"y":33},{"x":1473724800000,"y":33},{"x":1473811200000,"y":33},{"x":1473897600000,"y":33},{"x":1473984000000,"y":33},{"x":1474070400000,"y":33},{"x":1474156800000,"y":33},{"x":1474243200000,"y":33},{"x":1474329600000,"y":33},{"x":1474416000000,"y":33},{"x":1474502400000,"y":33},{"x":1474588800000,"y":33},{"x":1474675200000,"y":33},{"x":1474761600000,"y":33},{"x":1474848000000,"y":33},{"x":1474934400000,"y":33},{"x":1475020800000,"y":33},{"x":1475107200000,"y":33},{"x":1475193600000,"y":33},{"x":1475280000000,"y":33},{"x":1475366400000,"y":33},{"x":1475452800000,"y":33},{"x":1475539200000,"y":33},{"x":1475625600000,"y":33},{"x":1475712000000,"y":33},{"x":1475798400000,"y":33},{"x":1475884800000,"y":33},{"x":1475971200000,"y":33},{"x":1476057600000,"y":33},{"x":1476144000000,"y":33},{"x":1476230400000,"y":33},{"x":1476316800000,"y":33},{"x":1476403200000,"y":33},{"x":1476489600000,"y":33},{"x":1476576000000,"y":33},{"x":1476662400000,"y":33},{"x":1476748800000,"y":33},{"x":1476835200000,"y":33},{"x":1476921600000,"y":33},{"x":1477008000000,"y":33},{"x":1477094400000,"y":33},{"x":1477180800000,"y":33},{"x":1477267200000,"y":33},{"x":1477353600000,"y":33},{"x":1477440000000,"y":33},{"x":1477526400000,"y":33},{"x":1477612800000,"y":33},{"x":1477699200000,"y":33},{"x":1477785600000,"y":33},{"x":1477872000000,"y":33},{"x":1477958400000,"y":33},{"x":1478044800000,"y":33},{"x":1478131200000,"y":33},{"x":1478217600000,"y":33},{"x":1478304000000,"y":33},{"x":1478390400000,"y":33},{"x":1478476800000,"y":33},{"x":1478563200000,"y":33},{"x":1478649600000,"y":33},{"x":1478736000000,"y":33},{"x":1478822400000,"y":33},{"x":1478908800000,"y":33},{"x":1478995200000,"y":33},{"x":1479081600000,"y":33},{"x":1479168000000,"y":33},{"x":1479254400000,"y":33},{"x":1479340800000,"y":33},{"x":1479427200000,"y":33},{"x":1479513600000,"y":33},{"x":1479600000000,"y":33},{"x":1479686400000,"y":33},{"x":1479772800000,"y":33},{"x":1479859200000,"y":33},{"x":1479945600000,"y":33},{"x":1480032000000,"y":33},{"x":1480118400000,"y":33},{"x":1480204800000,"y":33},{"x":1480291200000,"y":33},{"x":1480377600000,"y":33},{"x":1480464000000,"y":33},{"x":1480550400000,"y":33},{"x":1480636800000,"y":33},{"x":1480723200000,"y":33},{"x":1480809600000,"y":33},{"x":1480896000000,"y":33},{"x":1480982400000,"y":33},{"x":1481068800000,"y":33},{"x":1481155200000,"y":33},{"x":1481241600000,"y":33},{"x":1481328000000,"y":33},{"x":1481414400000,"y":33},{"x":1481500800000,"y":33},{"x":1481587200000,"y":33},{"x":1481673600000,"y":33},{"x":1481760000000,"y":33},{"x":1481846400000,"y":33},{"x":1481932800000,"y":33},{"x":1482019200000,"y":33},{"x":1482105600000,"y":33},{"x":1482192000000,"y":33},{"x":1482278400000,"y":33},{"x":1482364800000,"y":33},{"x":1482451200000,"y":33},{"x":1482537600000,"y":33},{"x":1482624000000,"y":33},{"x":1482710400000,"y":33},{"x":1482796800000,"y":33},{"x":1482883200000,"y":33},{"x":1482969600000,"y":33},{"x":1483056000000,"y":33},{"x":1483142400000,"y":33},{"x":1483228800000,"y":33},{"x":1483315200000,"y":33},{"x":1483401600000,"y":33},{"x":1483488000000,"y":33},{"x":1483574400000,"y":33},{"x":1483660800000,"y":33},{"x":1483747200000,"y":33},{"x":1483833600000,"y":33},{"x":1483920000000,"y":33},{"x":1484006400000,"y":33},{"x":1484092800000,"y":33},{"x":1484179200000,"y":33},{"x":1484265600000,"y":33},{"x":1484352000000,"y":33},{"x":1484438400000,"y":33},{"x":1484524800000,"y":33},{"x":1484611200000,"y":33},{"x":1484697600000,"y":33},{"x":1484784000000,"y":33},{"x":1484870400000,"y":33},{"x":1484956800000,"y":33},{"x":1485043200000,"y":33},{"x":1485129600000,"y":33},{"x":1485216000000,"y":33},{"x":1485302400000,"y":33},{"x":1485388800000,"y":33},{"x":1485475200000,"y":33},{"x":1485561600000,"y":33},{"x":1485648000000,"y":33},{"x":1485734400000,"y":33},{"x":1485820800000,"y":33},{"x":1485907200000,"y":33},{"x":1485993600000,"y":33},{"x":1486080000000,"y":33},{"x":1486166400000,"y":33},{"x":1486252800000,"y":33},{"x":1486339200000,"y":33},{"x":1486425600000,"y":33},{"x":1486512000000,"y":33},{"x":1486598400000,"y":33},{"x":1486684800000,"y":33},{"x":1486771200000,"y":33},{"x":1486857600000,"y":33},{"x":1486944000000,"y":33},{"x":1487030400000,"y":33},{"x":1487116800000,"y":33},{"x":1487203200000,"y":33},{"x":1487289600000,"y":33},{"x":1487376000000,"y":33},{"x":1487462400000,"y":33},{"x":1487548800000,"y":33},{"x":1487635200000,"y":33},{"x":1487721600000,"y":33},{"x":1487808000000,"y":33},{"x":1487894400000,"y":33},{"x":1487980800000,"y":33},{"x":1488067200000,"y":33},{"x":1488153600000,"y":33},{"x":1488240000000,"y":33},{"x":1488326400000,"y":33},{"x":1488412800000,"y":33},{"x":1488499200000,"y":33},{"x":1488585600000,"y":33},{"x":1488672000000,"y":33},{"x":1488758400000,"y":33},{"x":1488844800000,"y":33},{"x":1488931200000,"y":33},{"x":1489017600000,"y":33},{"x":1489104000000,"y":33},{"x":1489190400000,"y":33},{"x":1489276800000,"y":33},{"x":1489363200000,"y":33},{"x":1489449600000,"y":33},{"x":1489536000000,"y":33},{"x":1489622400000,"y":33},{"x":1489708800000,"y":33},{"x":1489795200000,"y":33},{"x":1489881600000,"y":33},{"x":1489968000000,"y":33},{"x":1490054400000,"y":33},{"x":1490140800000,"y":33},{"x":1490227200000,"y":33},{"x":1490313600000,"y":33},{"x":1490400000000,"y":33},{"x":1490486400000,"y":33},{"x":1490572800000,"y":33},{"x":1490659200000,"y":33},{"x":1490745600000,"y":33},{"x":1490832000000,"y":33},{"x":1490918400000,"y":33},{"x":1491004800000,"y":33},{"x":1491091200000,"y":33},{"x":1491177600000,"y":33},{"x":1491264000000,"y":33},{"x":1491350400000,"y":33},{"x":1491436800000,"y":33},{"x":1491523200000,"y":33},{"x":1491609600000,"y":33},{"x":1491696000000,"y":33},{"x":1491782400000,"y":33},{"x":1491868800000,"y":33},{"x":1491955200000,"y":33},{"x":1492041600000,"y":33},{"x":1492128000000,"y":33},{"x":1492214400000,"y":33},{"x":1492300800000,"y":33},{"x":1492387200000,"y":33},{"x":1492473600000,"y":33},{"x":1492560000000,"y":33},{"x":1492646400000,"y":33},{"x":1492732800000,"y":33},{"x":1492819200000,"y":33},{"x":1492905600000,"y":33},{"x":1492992000000,"y":33},{"x":1493078400000,"y":33},{"x":1493164800000,"y":33},{"x":1493251200000,"y":33},{"x":1493337600000,"y":33},{"x":1493424000000,"y":33},{"x":1493510400000,"y":33},{"x":1493596800000,"y":33},{"x":1493683200000,"y":33},{"x":1493769600000,"y":33},{"x":1493856000000,"y":33},{"x":1493942400000,"y":33},{"x":1494028800000,"y":33},{"x":1494115200000,"y":33},{"x":1494201600000,"y":33},{"x":1494288000000,"y":33},{"x":1494374400000,"y":33},{"x":1494460800000,"y":33},{"x":1494547200000,"y":33},{"x":1494633600000,"y":33},{"x":1494720000000,"y":33},{"x":1494806400000,"y":33},{"x":1494892800000,"y":33},{"x":1494979200000,"y":33},{"x":1495065600000,"y":33},{"x":1495152000000,"y":33},{"x":1495238400000,"y":33},{"x":1495324800000,"y":33},{"x":1495411200000,"y":33},{"x":1495497600000,"y":33},{"x":1495584000000,"y":33},{"x":1495670400000,"y":33},{"x":1495756800000,"y":33},{"x":1495843200000,"y":33},{"x":1495929600000,"y":33},{"x":1496016000000,"y":33},{"x":1496102400000,"y":33},{"x":1496188800000,"y":33},{"x":1496275200000,"y":33},{"x":1496361600000,"y":33},{"x":1496448000000,"y":33},{"x":1496534400000,"y":33},{"x":1496620800000,"y":33},{"x":1496707200000,"y":33},{"x":1496793600000,"y":33},{"x":1496880000000,"y":33},{"x":1496966400000,"y":33},{"x":1497052800000,"y":33},{"x":1497139200000,"y":33},{"x":1497225600000,"y":33},{"x":1497312000000,"y":33},{"x":1497398400000,"y":33},{"x":1497484800000,"y":33},{"x":1497571200000,"y":33},{"x":1497657600000,"y":33},{"x":1497744000000,"y":33},{"x":1497830400000,"y":33},{"x":1497916800000,"y":33},{"x":1498003200000,"y":33},{"x":1498089600000,"y":33},{"x":1498176000000,"y":33},{"x":1498262400000,"y":33},{"x":1498348800000,"y":33},{"x":1498435200000,"y":33},{"x":1498521600000,"y":33},{"x":1498608000000,"y":33},{"x":1498694400000,"y":33},{"x":1498780800000,"y":33},{"x":1498867200000,"y":33},{"x":1498953600000,"y":33},{"x":1499040000000,"y":33},{"x":1499126400000,"y":33},{"x":1499212800000,"y":33},{"x":1499299200000,"y":33},{"x":1499385600000,"y":33},{"x":1499472000000,"y":33},{"x":1499558400000,"y":33},{"x":1499644800000,"y":33},{"x":1499731200000,"y":33},{"x":1499817600000,"y":33},{"x":1499904000000,"y":33},{"x":1499990400000,"y":33},{"x":1500076800000,"y":33},{"x":1500163200000,"y":33},{"x":1500249600000,"y":33},{"x":1500336000000,"y":33},{"x":1500422400000,"y":33},{"x":1500508800000,"y":33},{"x":1500595200000,"y":33},{"x":1500681600000,"y":33},{"x":1500768000000,"y":33},{"x":1500854400000,"y":33},{"x":1500940800000,"y":33},{"x":1501027200000,"y":33},{"x":1501113600000,"y":33},{"x":1501200000000,"y":33},{"x":1501286400000,"y":33},{"x":1501372800000,"y":33},{"x":1501459200000,"y":33},{"x":1501545600000,"y":33},{"x":1501632000000,"y":33},{"x":1501718400000,"y":33},{"x":1501804800000,"y":33},{"x":1501891200000,"y":33},{"x":1501977600000,"y":33},{"x":1502064000000,"y":33},{"x":1502150400000,"y":33},{"x":1502236800000,"y":33},{"x":1502323200000,"y":33},{"x":1502409600000,"y":33},{"x":1502496000000,"y":33},{"x":1502582400000,"y":33},{"x":1502668800000,"y":33},{"x":1502755200000,"y":33},{"x":1502841600000,"y":33},{"x":1502928000000,"y":33},{"x":1503014400000,"y":33},{"x":1503100800000,"y":33},{"x":1503187200000,"y":33},{"x":1503273600000,"y":33},{"x":1503360000000,"y":33},{"x":1503446400000,"y":33},{"x":1503532800000,"y":33},{"x":1503619200000,"y":33},{"x":1503705600000,"y":33},{"x":1503792000000,"y":33},{"x":1503878400000,"y":33},{"x":1503964800000,"y":33},{"x":1504051200000,"y":33},{"x":1504137600000,"y":33},{"x":1504224000000,"y":33},{"x":1504310400000,"y":33},{"x":1504396800000,"y":33},{"x":1504483200000,"y":33},{"x":1504569600000,"y":33},{"x":1504656000000,"y":33},{"x":1504742400000,"y":33},{"x":1504828800000,"y":33},{"x":1504915200000,"y":33},{"x":1505001600000,"y":33},{"x":1505088000000,"y":33},{"x":1505174400000,"y":33},{"x":1505260800000,"y":33},{"x":1505347200000,"y":33},{"x":1505433600000,"y":33},{"x":1505520000000,"y":33},{"x":1505606400000,"y":33},{"x":1505692800000,"y":33},{"x":1505779200000,"y":33},{"x":1505865600000,"y":33},{"x":1505952000000,"y":33},{"x":1506038400000,"y":33},{"x":1506124800000,"y":33},{"x":1506211200000,"y":33},{"x":1506297600000,"y":33},{"x":1506384000000,"y":33},{"x":1506470400000,"y":33},{"x":1506556800000,"y":33},{"x":1506643200000,"y":33},{"x":1506729600000,"y":33},{"x":1506816000000,"y":33},{"x":1506902400000,"y":33},{"x":1506988800000,"y":33},{"x":1507075200000,"y":33},{"x":1507161600000,"y":33},{"x":1507248000000,"y":33},{"x":1507334400000,"y":33},{"x":1507420800000,"y":33},{"x":1507507200000,"y":33},{"x":1507593600000,"y":33},{"x":1507680000000,"y":33},{"x":1507766400000,"y":33},{"x":1507852800000,"y":33},{"x":1507939200000,"y":33},{"x":1508025600000,"y":33},{"x":1508112000000,"y":33},{"x":1508198400000,"y":33},{"x":1508284800000,"y":33},{"x":1508371200000,"y":33},{"x":1508457600000,"y":33},{"x":1508544000000,"y":33},{"x":1508630400000,"y":33},{"x":1508716800000,"y":33},{"x":1508803200000,"y":33},{"x":1508889600000,"y":33},{"x":1508976000000,"y":33},{"x":1509062400000,"y":33},{"x":1509148800000,"y":33},{"x":1509235200000,"y":33},{"x":1509321600000,"y":33},{"x":1509408000000,"y":33},{"x":1509494400000,"y":33},{"x":1509580800000,"y":33},{"x":1509667200000,"y":33},{"x":1509753600000,"y":33},{"x":1509840000000,"y":33},{"x":1509926400000,"y":33},{"x":1510012800000,"y":33},{"x":1510099200000,"y":33},{"x":1510185600000,"y":33},{"x":1510272000000,"y":33},{"x":1510358400000,"y":33},{"x":1510444800000,"y":33},{"x":1510531200000,"y":33},{"x":1510617600000,"y":33},{"x":1510704000000,"y":33},{"x":1510790400000,"y":33},{"x":1510876800000,"y":33},{"x":1510963200000,"y":33},{"x":1511049600000,"y":33},{"x":1511136000000,"y":33},{"x":1511222400000,"y":33},{"x":1511308800000,"y":33},{"x":1511395200000,"y":33},{"x":1511481600000,"y":33},{"x":1511568000000,"y":33},{"x":1511654400000,"y":33},{"x":1511740800000,"y":33},{"x":1511827200000,"y":33},{"x":1511913600000,"y":33},{"x":1512000000000,"y":33},{"x":1512086400000,"y":33},{"x":1512172800000,"y":33},{"x":1512259200000,"y":33},{"x":1512345600000,"y":33},{"x":1512432000000,"y":33},{"x":1512518400000,"y":33},{"x":1512604800000,"y":33},{"x":1512691200000,"y":33},{"x":1512777600000,"y":33},{"x":1512864000000,"y":33},{"x":1512950400000,"y":33},{"x":1513036800000,"y":33},{"x":1513123200000,"y":33},{"x":1513209600000,"y":33},{"x":1513296000000,"y":33},{"x":1513382400000,"y":33},{"x":1513468800000,"y":33},{"x":1513555200000,"y":33},{"x":1513641600000,"y":33},{"x":1513728000000,"y":33},{"x":1513814400000,"y":33},{"x":1513900800000,"y":33},{"x":1513987200000,"y":33},{"x":1514073600000,"y":33},{"x":1514160000000,"y":33},{"x":1514246400000,"y":33},{"x":1514332800000,"y":33},{"x":1514419200000,"y":33},{"x":1514505600000,"y":33},{"x":1514592000000,"y":33},{"x":1514678400000,"y":33},{"x":1514764800000,"y":33},{"x":1514851200000,"y":33},{"x":1514937600000,"y":33},{"x":1515024000000,"y":33},{"x":1515110400000,"y":33},{"x":1515196800000,"y":33},{"x":1515283200000,"y":33},{"x":1515369600000,"y":33},{"x":1515456000000,"y":33},{"x":1515542400000,"y":33},{"x":1515628800000,"y":33},{"x":1515715200000,"y":33},{"x":1515801600000,"y":33},{"x":1515888000000,"y":33},{"x":1515974400000,"y":33},{"x":1516060800000,"y":33},{"x":1516147200000,"y":33},{"x":1516233600000,"y":33},{"x":1516320000000,"y":33},{"x":1516406400000,"y":33},{"x":1516492800000,"y":33},{"x":1516579200000,"y":33},{"x":1516665600000,"y":33},{"x":1516752000000,"y":33},{"x":1516838400000,"y":33},{"x":1516924800000,"y":33},{"x":1517011200000,"y":33},{"x":1517097600000,"y":33},{"x":1517184000000,"y":33},{"x":1517270400000,"y":33},{"x":1517356800000,"y":33},{"x":1517443200000,"y":33},{"x":1517529600000,"y":33},{"x":1517616000000,"y":33},{"x":1517702400000,"y":33},{"x":1517788800000,"y":33},{"x":1517875200000,"y":33},{"x":1517961600000,"y":33},{"x":1518048000000,"y":33},{"x":1518134400000,"y":33},{"x":1518220800000,"y":33},{"x":1518307200000,"y":33},{"x":1518393600000,"y":33},{"x":1518480000000,"y":33},{"x":1518566400000,"y":33},{"x":1518652800000,"y":33},{"x":1518739200000,"y":33},{"x":1518825600000,"y":33},{"x":1518912000000,"y":33},{"x":1518998400000,"y":33},{"x":1519084800000,"y":33},{"x":1519171200000,"y":33},{"x":1519257600000,"y":33},{"x":1519344000000,"y":33},{"x":1519430400000,"y":33},{"x":1519516800000,"y":33},{"x":1519603200000,"y":33},{"x":1519689600000,"y":33},{"x":1519776000000,"y":33},{"x":1519862400000,"y":33},{"x":1519948800000,"y":33},{"x":1520035200000,"y":33},{"x":1520121600000,"y":33},{"x":1520208000000,"y":33},{"x":1520294400000,"y":33},{"x":1520380800000,"y":33},{"x":1520467200000,"y":33},{"x":1520553600000,"y":33},{"x":1520640000000,"y":33},{"x":1520726400000,"y":33},{"x":1520812800000,"y":33},{"x":1520899200000,"y":33},{"x":1520985600000,"y":33},{"x":1521072000000,"y":33},{"x":1521158400000,"y":33},{"x":1521244800000,"y":33},{"x":1521331200000,"y":33},{"x":1521417600000,"y":33},{"x":1521504000000,"y":33},{"x":1521590400000,"y":33},{"x":1521676800000,"y":33},{"x":1521763200000,"y":33},{"x":1521849600000,"y":33},{"x":1521936000000,"y":33},{"x":1522022400000,"y":33},{"x":1522108800000,"y":33},{"x":1522195200000,"y":33},{"x":1522281600000,"y":33},{"x":1522368000000,"y":33},{"x":1522454400000,"y":33},{"x":1522540800000,"y":33},{"x":1522627200000,"y":33},{"x":1522713600000,"y":33},{"x":1522800000000,"y":33},{"x":1522886400000,"y":33},{"x":1522972800000,"y":33},{"x":1523059200000,"y":33},{"x":1523145600000,"y":33},{"x":1523232000000,"y":33},{"x":1523318400000,"y":33},{"x":1523404800000,"y":33},{"x":1523491200000,"y":33},{"x":1523577600000,"y":33},{"x":1523664000000,"y":33},{"x":1523750400000,"y":33},{"x":1523836800000,"y":33},{"x":1523923200000,"y":33},{"x":1524009600000,"y":33},{"x":1524096000000,"y":33},{"x":1524182400000,"y":33},{"x":1524268800000,"y":33},{"x":1524355200000,"y":33},{"x":1524441600000,"y":33},{"x":1524528000000,"y":33},{"x":1524614400000,"y":33},{"x":1524700800000,"y":33},{"x":1524787200000,"y":33},{"x":1524873600000,"y":33},{"x":1524960000000,"y":33},{"x":1525046400000,"y":33},{"x":1525132800000,"y":33},{"x":1525219200000,"y":33},{"x":1525305600000,"y":33},{"x":1525392000000,"y":33},{"x":1525478400000,"y":33},{"x":1525564800000,"y":33},{"x":1525651200000,"y":33},{"x":1525737600000,"y":33},{"x":1525824000000,"y":33},{"x":1525910400000,"y":33},{"x":1525996800000,"y":33},{"x":1526083200000,"y":33},{"x":1526169600000,"y":33},{"x":1526256000000,"y":33},{"x":1526342400000,"y":33},{"x":1526428800000,"y":33},{"x":1526515200000,"y":33},{"x":1526601600000,"y":33},{"x":1526688000000,"y":33},{"x":1526774400000,"y":33},{"x":1526860800000,"y":33},{"x":1526947200000,"y":33},{"x":1527033600000,"y":33},{"x":1527120000000,"y":33},{"x":1527206400000,"y":33},{"x":1527292800000,"y":33},{"x":1527379200000,"y":33},{"x":1527465600000,"y":33},{"x":1527552000000,"y":33},{"x":1527638400000,"y":33},{"x":1527724800000,"y":33},{"x":1527811200000,"y":33},{"x":1527897600000,"y":33},{"x":1527984000000,"y":33},{"x":1528070400000,"y":33},{"x":1528156800000,"y":33},{"x":1528243200000,"y":33},{"x":1528329600000,"y":33},{"x":1528416000000,"y":33},{"x":1528502400000,"y":33},{"x":1528588800000,"y":33},{"x":1528675200000,"y":33},{"x":1528761600000,"y":33},{"x":1528848000000,"y":33},{"x":1528934400000,"y":33},{"x":1529020800000,"y":33},{"x":1529107200000,"y":33},{"x":1529193600000,"y":33},{"x":1529280000000,"y":33},{"x":1529366400000,"y":33},{"x":1529452800000,"y":33},{"x":1529539200000,"y":33},{"x":1529625600000,"y":33},{"x":1529712000000,"y":33},{"x":1529798400000,"y":33},{"x":1529884800000,"y":33},{"x":1529971200000,"y":33},{"x":1530057600000,"y":33},{"x":1530144000000,"y":33},{"x":1530230400000,"y":33},{"x":1530316800000,"y":33},{"x":1530403200000,"y":33},{"x":1530489600000,"y":33},{"x":1530576000000,"y":33},{"x":1530662400000,"y":33},{"x":1530748800000,"y":33},{"x":1530835200000,"y":33},{"x":1530921600000,"y":33},{"x":1531008000000,"y":33},{"x":1531094400000,"y":33},{"x":1531180800000,"y":33},{"x":1531267200000,"y":33},{"x":1531353600000,"y":33},{"x":1531440000000,"y":33},{"x":1531526400000,"y":33},{"x":1531612800000,"y":33},{"x":1531699200000,"y":33},{"x":1531785600000,"y":33},{"x":1531872000000,"y":33},{"x":1531958400000,"y":33},{"x":1532044800000,"y":33},{"x":1532131200000,"y":33},{"x":1532217600000,"y":33},{"x":1532304000000,"y":33},{"x":1532390400000,"y":33},{"x":1532476800000,"y":33},{"x":1532563200000,"y":33},{"x":1532649600000,"y":33},{"x":1532736000000,"y":33},{"x":1532822400000,"y":33},{"x":1532908800000,"y":33},{"x":1532995200000,"y":33},{"x":1533081600000,"y":33},{"x":1533168000000,"y":33},{"x":1533254400000,"y":33},{"x":1533340800000,"y":33},{"x":1533427200000,"y":33},{"x":1533513600000,"y":33},{"x":1533600000000,"y":33},{"x":1533686400000,"y":33},{"x":1533772800000,"y":33},{"x":1533859200000,"y":33},{"x":1533945600000,"y":33},{"x":1534032000000,"y":33},{"x":1534118400000,"y":33},{"x":1534204800000,"y":33},{"x":1534291200000,"y":33},{"x":1534377600000,"y":33},{"x":1534464000000,"y":33},{"x":1534550400000,"y":33},{"x":1534636800000,"y":33},{"x":1534723200000,"y":33},{"x":1534809600000,"y":33},{"x":1534896000000,"y":33},{"x":1534982400000,"y":33},{"x":1535068800000,"y":33},{"x":1535155200000,"y":33},{"x":1535241600000,"y":33},{"x":1535328000000,"y":33},{"x":1535414400000,"y":33},{"x":1535500800000,"y":33},{"x":1535587200000,"y":33},{"x":1535673600000,"y":33},{"x":1535760000000,"y":33},{"x":1535846400000,"y":33},{"x":1535932800000,"y":33},{"x":1536019200000,"y":33},{"x":1536105600000,"y":33},{"x":1536192000000,"y":33},{"x":1536278400000,"y":33},{"x":1536364800000,"y":33},{"x":1536451200000,"y":33},{"x":1536537600000,"y":33},{"x":1536624000000,"y":33},{"x":1536710400000,"y":33},{"x":1536796800000,"y":33},{"x":1536883200000,"y":33},{"x":1536969600000,"y":33},{"x":1537056000000,"y":33},{"x":1537142400000,"y":33},{"x":1537228800000,"y":33},{"x":1537315200000,"y":33},{"x":1537401600000,"y":33},{"x":1537488000000,"y":33},{"x":1537574400000,"y":33},{"x":1537660800000,"y":33},{"x":1537747200000,"y":33},{"x":1537833600000,"y":33},{"x":1537920000000,"y":33},{"x":1538006400000,"y":33},{"x":1538092800000,"y":33},{"x":1538179200000,"y":33},{"x":1538265600000,"y":33},{"x":1538352000000,"y":33},{"x":1538438400000,"y":33},{"x":1538524800000,"y":33},{"x":1538611200000,"y":33},{"x":1538697600000,"y":33},{"x":1538784000000,"y":33},{"x":1538870400000,"y":33},{"x":1538956800000,"y":33},{"x":1539043200000,"y":33},{"x":1539129600000,"y":33},{"x":1539216000000,"y":33},{"x":1539302400000,"y":33},{"x":1539388800000,"y":33},{"x":1539475200000,"y":33},{"x":1539561600000,"y":33},{"x":1539648000000,"y":33},{"x":1539734400000,"y":33},{"x":1539820800000,"y":33},{"x":1539907200000,"y":33},{"x":1539993600000,"y":33},{"x":1540080000000,"y":33},{"x":1540166400000,"y":33},{"x":1540252800000,"y":33},{"x":1540339200000,"y":33},{"x":1540425600000,"y":33},{"x":1540512000000,"y":33},{"x":1540598400000,"y":33},{"x":1540684800000,"y":33},{"x":1540771200000,"y":33},{"x":1540857600000,"y":33},{"x":1540944000000,"y":33},{"x":1541030400000,"y":33},{"x":1541116800000,"y":33},{"x":1541203200000,"y":33},{"x":1541289600000,"y":33},{"x":1541376000000,"y":33},{"x":1541462400000,"y":33},{"x":1541548800000,"y":33},{"x":1541635200000,"y":33},{"x":1541721600000,"y":33},{"x":1541808000000,"y":33},{"x":1541894400000,"y":33},{"x":1541980800000,"y":33},{"x":1542067200000,"y":33},{"x":1542153600000,"y":33},{"x":1542240000000,"y":33},{"x":1542326400000,"y":33},{"x":1542412800000,"y":33},{"x":1542499200000,"y":33},{"x":1542585600000,"y":33},{"x":1542672000000,"y":33},{"x":1542758400000,"y":33},{"x":1542844800000,"y":33},{"x":1542931200000,"y":33},{"x":1543017600000,"y":33},{"x":1543104000000,"y":33},{"x":1543190400000,"y":33},{"x":1543276800000,"y":33},{"x":1543363200000,"y":33},{"x":1543449600000,"y":33},{"x":1543536000000,"y":33},{"x":1543622400000,"y":33},{"x":1543708800000,"y":33},{"x":1543795200000,"y":33},{"x":1543881600000,"y":33},{"x":1543968000000,"y":33},{"x":1544054400000,"y":33},{"x":1544140800000,"y":33},{"x":1544227200000,"y":33},{"x":1544313600000,"y":33},{"x":1544400000000,"y":33},{"x":1544486400000,"y":33},{"x":1544572800000,"y":33},{"x":1544659200000,"y":33},{"x":1544745600000,"y":33},{"x":1544832000000,"y":33},{"x":1544918400000,"y":33},{"x":1545004800000,"y":33},{"x":1545091200000,"y":33},{"x":1545177600000,"y":33},{"x":1545264000000,"y":33},{"x":1545350400000,"y":33},{"x":1545436800000,"y":33},{"x":1545523200000,"y":33},{"x":1545609600000,"y":33},{"x":1545696000000,"y":33},{"x":1545782400000,"y":33},{"x":1545868800000,"y":33},{"x":1545955200000,"y":33},{"x":1546041600000,"y":33},{"x":1546128000000,"y":33},{"x":1546214400000,"y":33},{"x":1546300800000,"y":33},{"x":1546387200000,"y":33},{"x":1546473600000,"y":33},{"x":1546560000000,"y":33},{"x":1546646400000,"y":33},{"x":1546732800000,"y":33},{"x":1546819200000,"y":33},{"x":1546905600000,"y":33},{"x":1546992000000,"y":33},{"x":1547078400000,"y":33},{"x":1547164800000,"y":33},{"x":1547251200000,"y":33},{"x":1547337600000,"y":33},{"x":1547424000000,"y":33},{"x":1547510400000,"y":33},{"x":1547596800000,"y":33},{"x":1547683200000,"y":33},{"x":1547769600000,"y":33},{"x":1547856000000,"y":33},{"x":1547942400000,"y":33},{"x":1548028800000,"y":33},{"x":1548115200000,"y":33},{"x":1548201600000,"y":33},{"x":1548288000000,"y":33},{"x":1548374400000,"y":33},{"x":1548460800000,"y":33},{"x":1548547200000,"y":33},{"x":1548633600000,"y":33},{"x":1548720000000,"y":33},{"x":1548806400000,"y":33},{"x":1548892800000,"y":33},{"x":1548979200000,"y":33},{"x":1549065600000,"y":33},{"x":1549152000000,"y":33},{"x":1549238400000,"y":33},{"x":1549324800000,"y":33},{"x":1549411200000,"y":33},{"x":1549497600000,"y":33},{"x":1549584000000,"y":33},{"x":1549670400000,"y":33},{"x":1549756800000,"y":33},{"x":1549843200000,"y":33},{"x":1549929600000,"y":33},{"x":1550016000000,"y":33},{"x":1550102400000,"y":33},{"x":1550188800000,"y":33},{"x":1550275200000,"y":33},{"x":1550361600000,"y":33},{"x":1550448000000,"y":33},{"x":1550534400000,"y":33},{"x":1550620800000,"y":33},{"x":1550707200000,"y":33},{"x":1550793600000,"y":33},{"x":1550880000000,"y":33},{"x":1550966400000,"y":33},{"x":1551052800000,"y":33},{"x":1551139200000,"y":33},{"x":1551225600000,"y":33},{"x":1551312000000,"y":33},{"x":1551398400000,"y":33},{"x":1551484800000,"y":33},{"x":1551571200000,"y":33},{"x":1551657600000,"y":33},{"x":1551744000000,"y":33},{"x":1551830400000,"y":33},{"x":1551916800000,"y":33},{"x":1552003200000,"y":33},{"x":1552089600000,"y":33},{"x":1552176000000,"y":33},{"x":1552262400000,"y":33},{"x":1552348800000,"y":33},{"x":1552435200000,"y":33},{"x":1552521600000,"y":33},{"x":1552608000000,"y":33},{"x":1552694400000,"y":33},{"x":1552780800000,"y":33},{"x":1552867200000,"y":33},{"x":1552953600000,"y":33},{"x":1553040000000,"y":33},{"x":1553126400000,"y":33},{"x":1553212800000,"y":33},{"x":1553299200000,"y":33},{"x":1553385600000,"y":33},{"x":1553472000000,"y":33},{"x":1553558400000,"y":33},{"x":1553644800000,"y":33},{"x":1553731200000,"y":33},{"x":1553817600000,"y":33},{"x":1553904000000,"y":33},{"x":1553990400000,"y":33},{"x":1554076800000,"y":33},{"x":1554163200000,"y":33},{"x":1554249600000,"y":33},{"x":1554336000000,"y":33},{"x":1554422400000,"y":33},{"x":1554508800000,"y":33},{"x":1554595200000,"y":33},{"x":1554681600000,"y":33},{"x":1554768000000,"y":33},{"x":1554854400000,"y":33},{"x":1554940800000,"y":33},{"x":1555027200000,"y":33},{"x":1555113600000,"y":33},{"x":1555200000000,"y":33},{"x":1555286400000,"y":33},{"x":1555372800000,"y":33},{"x":1555459200000,"y":33},{"x":1555545600000,"y":33},{"x":1555632000000,"y":33},{"x":1555718400000,"y":33},{"x":1555804800000,"y":33},{"x":1555891200000,"y":33},{"x":1555977600000,"y":33},{"x":1556064000000,"y":33},{"x":1556150400000,"y":33}],"scheduledEventsClosed":[{"x":1459296000000,"y":0},{"x":1459382400000,"y":0},{"x":1459468800000,"y":0},{"x":1459555200000,"y":0},{"x":1459641600000,"y":0},{"x":1459728000000,"y":0},{"x":1459814400000,"y":0},{"x":1459900800000,"y":0},{"x":1459987200000,"y":0},{"x":1460073600000,"y":0},{"x":1460160000000,"y":0},{"x":1460246400000,"y":0},{"x":1460332800000,"y":0},{"x":1460419200000,"y":0},{"x":1460505600000,"y":0},{"x":1460592000000,"y":0},{"x":1460678400000,"y":0},{"x":1460764800000,"y":0},{"x":1460851200000,"y":0},{"x":1460937600000,"y":0},{"x":1461024000000,"y":0},{"x":1461110400000,"y":0},{"x":1461196800000,"y":0},{"x":1461283200000,"y":0},{"x":1461369600000,"y":0},{"x":1461456000000,"y":0},{"x":1461542400000,"y":0},{"x":1461628800000,"y":0},{"x":1461715200000,"y":0},{"x":1461801600000,"y":0},{"x":1461888000000,"y":1},{"x":1461974400000,"y":1},{"x":1462060800000,"y":1},{"x":1462147200000,"y":2},{"x":1462233600000,"y":2},{"x":1462320000000,"y":3},{"x":1462406400000,"y":3},{"x":1462492800000,"y":5},{"x":1462579200000,"y":5},{"x":1462665600000,"y":5},{"x":1462752000000,"y":6},{"x":1462838400000,"y":6},{"x":1462924800000,"y":6},{"x":1463011200000,"y":6},{"x":1463097600000,"y":7},{"x":1463184000000,"y":7},{"x":1463270400000,"y":7},{"x":1463356800000,"y":7},{"x":1463443200000,"y":7},{"x":1463529600000,"y":8},{"x":1463616000000,"y":8},{"x":1463702400000,"y":10},{"x":1463788800000,"y":10},{"x":1463875200000,"y":10},{"x":1463961600000,"y":10},{"x":1464048000000,"y":10},{"x":1464134400000,"y":10},{"x":1464220800000,"y":10},{"x":1464307200000,"y":11},{"x":1464393600000,"y":11},{"x":1464480000000,"y":11},{"x":1464566400000,"y":13},{"x":1464652800000,"y":13},{"x":1464739200000,"y":13},{"x":1464825600000,"y":18},{"x":1464912000000,"y":18},{"x":1464998400000,"y":18},{"x":1465084800000,"y":18},{"x":1465171200000,"y":19},{"x":1465257600000,"y":19},{"x":1465344000000,"y":19},{"x":1465430400000,"y":19},{"x":1465516800000,"y":20},{"x":1465603200000,"y":20},{"x":1465689600000,"y":20},{"x":1465776000000,"y":20},{"x":1465862400000,"y":20},{"x":1465948800000,"y":20},{"x":1466035200000,"y":21},{"x":1466121600000,"y":22},{"x":1466208000000,"y":22},{"x":1466294400000,"y":22},{"x":1466380800000,"y":23},{"x":1466467200000,"y":23},{"x":1466553600000,"y":23},{"x":1466640000000,"y":23},{"x":1466726400000,"y":25},{"x":1466812800000,"y":25},{"x":1466899200000,"y":25},{"x":1466985600000,"y":25},{"x":1467072000000,"y":25},{"x":1467158400000,"y":26},{"x":1467244800000,"y":26},{"x":1467331200000,"y":29},{"x":1467417600000,"y":29},{"x":1467504000000,"y":29},{"x":1467590400000,"y":29},{"x":1467676800000,"y":29},{"x":1467763200000,"y":29},{"x":1467849600000,"y":30},{"x":1467936000000,"y":31},{"x":1468022400000,"y":31},{"x":1468108800000,"y":31},{"x":1468195200000,"y":31},{"x":1468281600000,"y":31},{"x":1468368000000,"y":31},{"x":1468454400000,"y":31},{"x":1468540800000,"y":32},{"x":1468627200000,"y":32},{"x":1468713600000,"y":32},{"x":1468800000000,"y":32},{"x":1468886400000,"y":32},{"x":1468972800000,"y":32},{"x":1469059200000,"y":32},{"x":1469145600000,"y":32},{"x":1469232000000,"y":32},{"x":1469318400000,"y":32},{"x":1469404800000,"y":32},{"x":1469491200000,"y":32},{"x":1469577600000,"y":32},{"x":1469664000000,"y":32},{"x":1469750400000,"y":32},{"x":1469836800000,"y":32},{"x":1469923200000,"y":32},{"x":1470009600000,"y":32},{"x":1470096000000,"y":32},{"x":1470182400000,"y":32},{"x":1470268800000,"y":32},{"x":1470355200000,"y":32},{"x":1470441600000,"y":32},{"x":1470528000000,"y":32},{"x":1470614400000,"y":32},{"x":1470700800000,"y":32},{"x":1470787200000,"y":32},{"x":1470873600000,"y":32},{"x":1470960000000,"y":33},{"x":1471046400000,"y":33},{"x":1471132800000,"y":33},{"x":1471219200000,"y":33},{"x":1471305600000,"y":33},{"x":1471392000000,"y":33},{"x":1471478400000,"y":33},{"x":1471564800000,"y":33},{"x":1471651200000,"y":33},{"x":1471737600000,"y":33},{"x":1471824000000,"y":33},{"x":1471910400000,"y":33},{"x":1471996800000,"y":33},{"x":1472083200000,"y":33},{"x":1472169600000,"y":33},{"x":1472256000000,"y":33},{"x":1472342400000,"y":33},{"x":1472428800000,"y":33},{"x":1472515200000,"y":33},{"x":1472601600000,"y":33},{"x":1472688000000,"y":33},{"x":1472774400000,"y":33},{"x":1472860800000,"y":33},{"x":1472947200000,"y":33},{"x":1473033600000,"y":33},{"x":1473120000000,"y":33},{"x":1473206400000,"y":33},{"x":1473292800000,"y":33},{"x":1473379200000,"y":33},{"x":1473465600000,"y":33},{"x":1473552000000,"y":33},{"x":1473638400000,"y":33},{"x":1473724800000,"y":33},{"x":1473811200000,"y":33},{"x":1473897600000,"y":33},{"x":1473984000000,"y":33},{"x":1474070400000,"y":33},{"x":1474156800000,"y":33},{"x":1474243200000,"y":33},{"x":1474329600000,"y":33},{"x":1474416000000,"y":33},{"x":1474502400000,"y":33},{"x":1474588800000,"y":33},{"x":1474675200000,"y":33},{"x":1474761600000,"y":33},{"x":1474848000000,"y":33},{"x":1474934400000,"y":33},{"x":1475020800000,"y":33},{"x":1475107200000,"y":33},{"x":1475193600000,"y":33},{"x":1475280000000,"y":33},{"x":1475366400000,"y":33},{"x":1475452800000,"y":33},{"x":1475539200000,"y":33},{"x":1475625600000,"y":33},{"x":1475712000000,"y":33},{"x":1475798400000,"y":33},{"x":1475884800000,"y":33},{"x":1475971200000,"y":33},{"x":1476057600000,"y":33},{"x":1476144000000,"y":33},{"x":1476230400000,"y":33},{"x":1476316800000,"y":33},{"x":1476403200000,"y":33},{"x":1476489600000,"y":33},{"x":1476576000000,"y":33},{"x":1476662400000,"y":33},{"x":1476748800000,"y":33},{"x":1476835200000,"y":33},{"x":1476921600000,"y":33},{"x":1477008000000,"y":33},{"x":1477094400000,"y":33},{"x":1477180800000,"y":33},{"x":1477267200000,"y":33},{"x":1477353600000,"y":33},{"x":1477440000000,"y":33},{"x":1477526400000,"y":33},{"x":1477612800000,"y":33},{"x":1477699200000,"y":33},{"x":1477785600000,"y":33},{"x":1477872000000,"y":33},{"x":1477958400000,"y":33},{"x":1478044800000,"y":33},{"x":1478131200000,"y":33},{"x":1478217600000,"y":33},{"x":1478304000000,"y":33},{"x":1478390400000,"y":33},{"x":1478476800000,"y":33},{"x":1478563200000,"y":33},{"x":1478649600000,"y":33},{"x":1478736000000,"y":33},{"x":1478822400000,"y":33},{"x":1478908800000,"y":33},{"x":1478995200000,"y":33},{"x":1479081600000,"y":33},{"x":1479168000000,"y":33},{"x":1479254400000,"y":33},{"x":1479340800000,"y":33},{"x":1479427200000,"y":33},{"x":1479513600000,"y":33},{"x":1479600000000,"y":33},{"x":1479686400000,"y":33},{"x":1479772800000,"y":33},{"x":1479859200000,"y":33},{"x":1479945600000,"y":33},{"x":1480032000000,"y":33},{"x":1480118400000,"y":33},{"x":1480204800000,"y":33},{"x":1480291200000,"y":33},{"x":1480377600000,"y":33},{"x":1480464000000,"y":33},{"x":1480550400000,"y":33},{"x":1480636800000,"y":33},{"x":1480723200000,"y":33},{"x":1480809600000,"y":33},{"x":1480896000000,"y":33},{"x":1480982400000,"y":33},{"x":1481068800000,"y":33},{"x":1481155200000,"y":33},{"x":1481241600000,"y":33},{"x":1481328000000,"y":33},{"x":1481414400000,"y":33},{"x":1481500800000,"y":33},{"x":1481587200000,"y":33},{"x":1481673600000,"y":33},{"x":1481760000000,"y":33},{"x":1481846400000,"y":33},{"x":1481932800000,"y":33},{"x":1482019200000,"y":33},{"x":1482105600000,"y":33},{"x":1482192000000,"y":33},{"x":1482278400000,"y":33},{"x":1482364800000,"y":33},{"x":1482451200000,"y":33},{"x":1482537600000,"y":33},{"x":1482624000000,"y":33},{"x":1482710400000,"y":33},{"x":1482796800000,"y":33},{"x":1482883200000,"y":33},{"x":1482969600000,"y":33},{"x":1483056000000,"y":33},{"x":1483142400000,"y":33},{"x":1483228800000,"y":33},{"x":1483315200000,"y":33},{"x":1483401600000,"y":33},{"x":1483488000000,"y":33},{"x":1483574400000,"y":33},{"x":1483660800000,"y":33},{"x":1483747200000,"y":33},{"x":1483833600000,"y":33},{"x":1483920000000,"y":33},{"x":1484006400000,"y":33},{"x":1484092800000,"y":33},{"x":1484179200000,"y":33},{"x":1484265600000,"y":33},{"x":1484352000000,"y":33},{"x":1484438400000,"y":33},{"x":1484524800000,"y":33},{"x":1484611200000,"y":33},{"x":1484697600000,"y":33},{"x":1484784000000,"y":33},{"x":1484870400000,"y":33},{"x":1484956800000,"y":33},{"x":1485043200000,"y":33},{"x":1485129600000,"y":33},{"x":1485216000000,"y":33},{"x":1485302400000,"y":33},{"x":1485388800000,"y":33},{"x":1485475200000,"y":33},{"x":1485561600000,"y":33},{"x":1485648000000,"y":33},{"x":1485734400000,"y":33},{"x":1485820800000,"y":33},{"x":1485907200000,"y":33},{"x":1485993600000,"y":33},{"x":1486080000000,"y":33},{"x":1486166400000,"y":33},{"x":1486252800000,"y":33},{"x":1486339200000,"y":33},{"x":1486425600000,"y":33},{"x":1486512000000,"y":33},{"x":1486598400000,"y":33},{"x":1486684800000,"y":33},{"x":1486771200000,"y":33},{"x":1486857600000,"y":33},{"x":1486944000000,"y":33},{"x":1487030400000,"y":33},{"x":1487116800000,"y":33},{"x":1487203200000,"y":33},{"x":1487289600000,"y":33},{"x":1487376000000,"y":33},{"x":1487462400000,"y":33},{"x":1487548800000,"y":33},{"x":1487635200000,"y":33},{"x":1487721600000,"y":33},{"x":1487808000000,"y":33},{"x":1487894400000,"y":33},{"x":1487980800000,"y":33},{"x":1488067200000,"y":33},{"x":1488153600000,"y":33},{"x":1488240000000,"y":33},{"x":1488326400000,"y":33},{"x":1488412800000,"y":33},{"x":1488499200000,"y":33},{"x":1488585600000,"y":33},{"x":1488672000000,"y":33},{"x":1488758400000,"y":33},{"x":1488844800000,"y":33},{"x":1488931200000,"y":33},{"x":1489017600000,"y":33},{"x":1489104000000,"y":33},{"x":1489190400000,"y":33},{"x":1489276800000,"y":33},{"x":1489363200000,"y":33},{"x":1489449600000,"y":33},{"x":1489536000000,"y":33},{"x":1489622400000,"y":33},{"x":1489708800000,"y":33},{"x":1489795200000,"y":33},{"x":1489881600000,"y":33},{"x":1489968000000,"y":33},{"x":1490054400000,"y":33},{"x":1490140800000,"y":33},{"x":1490227200000,"y":33},{"x":1490313600000,"y":33},{"x":1490400000000,"y":33},{"x":1490486400000,"y":33},{"x":1490572800000,"y":33},{"x":1490659200000,"y":33},{"x":1490745600000,"y":33},{"x":1490832000000,"y":33},{"x":1490918400000,"y":33},{"x":1491004800000,"y":33},{"x":1491091200000,"y":33},{"x":1491177600000,"y":33},{"x":1491264000000,"y":33},{"x":1491350400000,"y":33},{"x":1491436800000,"y":33},{"x":1491523200000,"y":33},{"x":1491609600000,"y":33},{"x":1491696000000,"y":33},{"x":1491782400000,"y":33},{"x":1491868800000,"y":33},{"x":1491955200000,"y":33},{"x":1492041600000,"y":33},{"x":1492128000000,"y":33},{"x":1492214400000,"y":33},{"x":1492300800000,"y":33},{"x":1492387200000,"y":33},{"x":1492473600000,"y":33},{"x":1492560000000,"y":33},{"x":1492646400000,"y":33},{"x":1492732800000,"y":33},{"x":1492819200000,"y":33},{"x":1492905600000,"y":33},{"x":1492992000000,"y":33},{"x":1493078400000,"y":33},{"x":1493164800000,"y":33},{"x":1493251200000,"y":33},{"x":1493337600000,"y":33},{"x":1493424000000,"y":33},{"x":1493510400000,"y":33},{"x":1493596800000,"y":33},{"x":1493683200000,"y":33},{"x":1493769600000,"y":33},{"x":1493856000000,"y":33},{"x":1493942400000,"y":33},{"x":1494028800000,"y":33},{"x":1494115200000,"y":33},{"x":1494201600000,"y":33},{"x":1494288000000,"y":33},{"x":1494374400000,"y":33},{"x":1494460800000,"y":33},{"x":1494547200000,"y":33},{"x":1494633600000,"y":33},{"x":1494720000000,"y":33},{"x":1494806400000,"y":33},{"x":1494892800000,"y":33},{"x":1494979200000,"y":33},{"x":1495065600000,"y":33},{"x":1495152000000,"y":33},{"x":1495238400000,"y":33},{"x":1495324800000,"y":33},{"x":1495411200000,"y":33},{"x":1495497600000,"y":33},{"x":1495584000000,"y":33},{"x":1495670400000,"y":33},{"x":1495756800000,"y":33},{"x":1495843200000,"y":33},{"x":1495929600000,"y":33},{"x":1496016000000,"y":33},{"x":1496102400000,"y":33},{"x":1496188800000,"y":33},{"x":1496275200000,"y":33},{"x":1496361600000,"y":33},{"x":1496448000000,"y":33},{"x":1496534400000,"y":33},{"x":1496620800000,"y":33},{"x":1496707200000,"y":33},{"x":1496793600000,"y":33},{"x":1496880000000,"y":33},{"x":1496966400000,"y":33},{"x":1497052800000,"y":33},{"x":1497139200000,"y":33},{"x":1497225600000,"y":33},{"x":1497312000000,"y":33},{"x":1497398400000,"y":33},{"x":1497484800000,"y":33},{"x":1497571200000,"y":33},{"x":1497657600000,"y":33},{"x":1497744000000,"y":33},{"x":1497830400000,"y":33},{"x":1497916800000,"y":33},{"x":1498003200000,"y":33},{"x":1498089600000,"y":33},{"x":1498176000000,"y":33},{"x":1498262400000,"y":33},{"x":1498348800000,"y":33},{"x":1498435200000,"y":33},{"x":1498521600000,"y":33},{"x":1498608000000,"y":33},{"x":1498694400000,"y":33},{"x":1498780800000,"y":33},{"x":1498867200000,"y":33},{"x":1498953600000,"y":33},{"x":1499040000000,"y":33},{"x":1499126400000,"y":33},{"x":1499212800000,"y":33},{"x":1499299200000,"y":33},{"x":1499385600000,"y":33},{"x":1499472000000,"y":33},{"x":1499558400000,"y":33},{"x":1499644800000,"y":33},{"x":1499731200000,"y":33},{"x":1499817600000,"y":33},{"x":1499904000000,"y":33},{"x":1499990400000,"y":33},{"x":1500076800000,"y":33},{"x":1500163200000,"y":33},{"x":1500249600000,"y":33},{"x":1500336000000,"y":33},{"x":1500422400000,"y":33},{"x":1500508800000,"y":33},{"x":1500595200000,"y":33},{"x":1500681600000,"y":33},{"x":1500768000000,"y":33},{"x":1500854400000,"y":33},{"x":1500940800000,"y":33},{"x":1501027200000,"y":33},{"x":1501113600000,"y":33},{"x":1501200000000,"y":33},{"x":1501286400000,"y":33},{"x":1501372800000,"y":33},{"x":1501459200000,"y":33},{"x":1501545600000,"y":33},{"x":1501632000000,"y":33},{"x":1501718400000,"y":33},{"x":1501804800000,"y":33},{"x":1501891200000,"y":33},{"x":1501977600000,"y":33},{"x":1502064000000,"y":33},{"x":1502150400000,"y":33},{"x":1502236800000,"y":33},{"x":1502323200000,"y":33},{"x":1502409600000,"y":33},{"x":1502496000000,"y":33},{"x":1502582400000,"y":33},{"x":1502668800000,"y":33},{"x":1502755200000,"y":33},{"x":1502841600000,"y":33},{"x":1502928000000,"y":33},{"x":1503014400000,"y":33},{"x":1503100800000,"y":33},{"x":1503187200000,"y":33},{"x":1503273600000,"y":33},{"x":1503360000000,"y":33},{"x":1503446400000,"y":33},{"x":1503532800000,"y":33},{"x":1503619200000,"y":33},{"x":1503705600000,"y":33},{"x":1503792000000,"y":33},{"x":1503878400000,"y":33},{"x":1503964800000,"y":33},{"x":1504051200000,"y":33},{"x":1504137600000,"y":33},{"x":1504224000000,"y":33},{"x":1504310400000,"y":33},{"x":1504396800000,"y":33},{"x":1504483200000,"y":33},{"x":1504569600000,"y":33},{"x":1504656000000,"y":33},{"x":1504742400000,"y":33},{"x":1504828800000,"y":33},{"x":1504915200000,"y":33},{"x":1505001600000,"y":33},{"x":1505088000000,"y":33},{"x":1505174400000,"y":33},{"x":1505260800000,"y":33},{"x":1505347200000,"y":33},{"x":1505433600000,"y":33},{"x":1505520000000,"y":33},{"x":1505606400000,"y":33},{"x":1505692800000,"y":33},{"x":1505779200000,"y":33},{"x":1505865600000,"y":33},{"x":1505952000000,"y":33},{"x":1506038400000,"y":33},{"x":1506124800000,"y":33},{"x":1506211200000,"y":33},{"x":1506297600000,"y":33},{"x":1506384000000,"y":33},{"x":1506470400000,"y":33},{"x":1506556800000,"y":33},{"x":1506643200000,"y":33},{"x":1506729600000,"y":33},{"x":1506816000000,"y":33},{"x":1506902400000,"y":33},{"x":1506988800000,"y":33},{"x":1507075200000,"y":33},{"x":1507161600000,"y":33},{"x":1507248000000,"y":33},{"x":1507334400000,"y":33},{"x":1507420800000,"y":33},{"x":1507507200000,"y":33},{"x":1507593600000,"y":33},{"x":1507680000000,"y":33},{"x":1507766400000,"y":33},{"x":1507852800000,"y":33},{"x":1507939200000,"y":33},{"x":1508025600000,"y":33},{"x":1508112000000,"y":33},{"x":1508198400000,"y":33},{"x":1508284800000,"y":33},{"x":1508371200000,"y":33},{"x":1508457600000,"y":33},{"x":1508544000000,"y":33},{"x":1508630400000,"y":33},{"x":1508716800000,"y":33},{"x":1508803200000,"y":33},{"x":1508889600000,"y":33},{"x":1508976000000,"y":33},{"x":1509062400000,"y":33},{"x":1509148800000,"y":33},{"x":1509235200000,"y":33},{"x":1509321600000,"y":33},{"x":1509408000000,"y":33},{"x":1509494400000,"y":33},{"x":1509580800000,"y":33},{"x":1509667200000,"y":33},{"x":1509753600000,"y":33},{"x":1509840000000,"y":33},{"x":1509926400000,"y":33},{"x":1510012800000,"y":33},{"x":1510099200000,"y":33},{"x":1510185600000,"y":33},{"x":1510272000000,"y":33},{"x":1510358400000,"y":33},{"x":1510444800000,"y":33},{"x":1510531200000,"y":33},{"x":1510617600000,"y":33},{"x":1510704000000,"y":33},{"x":1510790400000,"y":33},{"x":1510876800000,"y":33},{"x":1510963200000,"y":33},{"x":1511049600000,"y":33},{"x":1511136000000,"y":33},{"x":1511222400000,"y":33},{"x":1511308800000,"y":33},{"x":1511395200000,"y":33},{"x":1511481600000,"y":33},{"x":1511568000000,"y":33},{"x":1511654400000,"y":33},{"x":1511740800000,"y":33},{"x":1511827200000,"y":33},{"x":1511913600000,"y":33},{"x":1512000000000,"y":33},{"x":1512086400000,"y":33},{"x":1512172800000,"y":33},{"x":1512259200000,"y":33},{"x":1512345600000,"y":33},{"x":1512432000000,"y":33},{"x":1512518400000,"y":33},{"x":1512604800000,"y":33},{"x":1512691200000,"y":33},{"x":1512777600000,"y":33},{"x":1512864000000,"y":33},{"x":1512950400000,"y":33},{"x":1513036800000,"y":33},{"x":1513123200000,"y":33},{"x":1513209600000,"y":33},{"x":1513296000000,"y":33},{"x":1513382400000,"y":33},{"x":1513468800000,"y":33},{"x":1513555200000,"y":33},{"x":1513641600000,"y":33},{"x":1513728000000,"y":33},{"x":1513814400000,"y":33},{"x":1513900800000,"y":33},{"x":1513987200000,"y":33},{"x":1514073600000,"y":33},{"x":1514160000000,"y":33},{"x":1514246400000,"y":33},{"x":1514332800000,"y":33},{"x":1514419200000,"y":33},{"x":1514505600000,"y":33},{"x":1514592000000,"y":33},{"x":1514678400000,"y":33},{"x":1514764800000,"y":33},{"x":1514851200000,"y":33},{"x":1514937600000,"y":33},{"x":1515024000000,"y":33},{"x":1515110400000,"y":33},{"x":1515196800000,"y":33},{"x":1515283200000,"y":33},{"x":1515369600000,"y":33},{"x":1515456000000,"y":33},{"x":1515542400000,"y":33},{"x":1515628800000,"y":33},{"x":1515715200000,"y":33},{"x":1515801600000,"y":33},{"x":1515888000000,"y":33},{"x":1515974400000,"y":33},{"x":1516060800000,"y":33},{"x":1516147200000,"y":33},{"x":1516233600000,"y":33},{"x":1516320000000,"y":33},{"x":1516406400000,"y":33},{"x":1516492800000,"y":33},{"x":1516579200000,"y":33},{"x":1516665600000,"y":33},{"x":1516752000000,"y":33},{"x":1516838400000,"y":33},{"x":1516924800000,"y":33},{"x":1517011200000,"y":33},{"x":1517097600000,"y":33},{"x":1517184000000,"y":33},{"x":1517270400000,"y":33},{"x":1517356800000,"y":33},{"x":1517443200000,"y":33},{"x":1517529600000,"y":33},{"x":1517616000000,"y":33},{"x":1517702400000,"y":33},{"x":1517788800000,"y":33},{"x":1517875200000,"y":33},{"x":1517961600000,"y":33},{"x":1518048000000,"y":33},{"x":1518134400000,"y":33},{"x":1518220800000,"y":33},{"x":1518307200000,"y":33},{"x":1518393600000,"y":33},{"x":1518480000000,"y":33},{"x":1518566400000,"y":33},{"x":1518652800000,"y":33},{"x":1518739200000,"y":33},{"x":1518825600000,"y":33},{"x":1518912000000,"y":33},{"x":1518998400000,"y":33},{"x":1519084800000,"y":33},{"x":1519171200000,"y":33},{"x":1519257600000,"y":33},{"x":1519344000000,"y":33},{"x":1519430400000,"y":33},{"x":1519516800000,"y":33},{"x":1519603200000,"y":33},{"x":1519689600000,"y":33},{"x":1519776000000,"y":33},{"x":1519862400000,"y":33},{"x":1519948800000,"y":33},{"x":1520035200000,"y":33},{"x":1520121600000,"y":33},{"x":1520208000000,"y":33},{"x":1520294400000,"y":33},{"x":1520380800000,"y":33},{"x":1520467200000,"y":33},{"x":1520553600000,"y":33},{"x":1520640000000,"y":33},{"x":1520726400000,"y":33},{"x":1520812800000,"y":33},{"x":1520899200000,"y":33},{"x":1520985600000,"y":33},{"x":1521072000000,"y":33},{"x":1521158400000,"y":33},{"x":1521244800000,"y":33},{"x":1521331200000,"y":33},{"x":1521417600000,"y":33},{"x":1521504000000,"y":33},{"x":1521590400000,"y":33},{"x":1521676800000,"y":33},{"x":1521763200000,"y":33},{"x":1521849600000,"y":33},{"x":1521936000000,"y":33},{"x":1522022400000,"y":33},{"x":1522108800000,"y":33},{"x":1522195200000,"y":33},{"x":1522281600000,"y":33},{"x":1522368000000,"y":33},{"x":1522454400000,"y":33},{"x":1522540800000,"y":33},{"x":1522627200000,"y":33},{"x":1522713600000,"y":33},{"x":1522800000000,"y":33},{"x":1522886400000,"y":33},{"x":1522972800000,"y":33},{"x":1523059200000,"y":33},{"x":1523145600000,"y":33},{"x":1523232000000,"y":33},{"x":1523318400000,"y":33},{"x":1523404800000,"y":33},{"x":1523491200000,"y":33},{"x":1523577600000,"y":33},{"x":1523664000000,"y":33},{"x":1523750400000,"y":33},{"x":1523836800000,"y":33},{"x":1523923200000,"y":33},{"x":1524009600000,"y":33},{"x":1524096000000,"y":33},{"x":1524182400000,"y":33},{"x":1524268800000,"y":33},{"x":1524355200000,"y":33},{"x":1524441600000,"y":33},{"x":1524528000000,"y":33},{"x":1524614400000,"y":33},{"x":1524700800000,"y":33},{"x":1524787200000,"y":33},{"x":1524873600000,"y":33},{"x":1524960000000,"y":33},{"x":1525046400000,"y":33},{"x":1525132800000,"y":33},{"x":1525219200000,"y":33},{"x":1525305600000,"y":33},{"x":1525392000000,"y":33},{"x":1525478400000,"y":33},{"x":1525564800000,"y":33},{"x":1525651200000,"y":33},{"x":1525737600000,"y":33},{"x":1525824000000,"y":33},{"x":1525910400000,"y":33},{"x":1525996800000,"y":33},{"x":1526083200000,"y":33},{"x":1526169600000,"y":33},{"x":1526256000000,"y":33},{"x":1526342400000,"y":33},{"x":1526428800000,"y":33},{"x":1526515200000,"y":33},{"x":1526601600000,"y":33},{"x":1526688000000,"y":33},{"x":1526774400000,"y":33},{"x":1526860800000,"y":33},{"x":1526947200000,"y":33},{"x":1527033600000,"y":33},{"x":1527120000000,"y":33},{"x":1527206400000,"y":33},{"x":1527292800000,"y":33},{"x":1527379200000,"y":33},{"x":1527465600000,"y":33},{"x":1527552000000,"y":33},{"x":1527638400000,"y":33},{"x":1527724800000,"y":33},{"x":1527811200000,"y":33},{"x":1527897600000,"y":33},{"x":1527984000000,"y":33},{"x":1528070400000,"y":33},{"x":1528156800000,"y":33},{"x":1528243200000,"y":33},{"x":1528329600000,"y":33},{"x":1528416000000,"y":33},{"x":1528502400000,"y":33},{"x":1528588800000,"y":33},{"x":1528675200000,"y":33},{"x":1528761600000,"y":33},{"x":1528848000000,"y":33},{"x":1528934400000,"y":33},{"x":1529020800000,"y":33},{"x":1529107200000,"y":33},{"x":1529193600000,"y":33},{"x":1529280000000,"y":33},{"x":1529366400000,"y":33},{"x":1529452800000,"y":33},{"x":1529539200000,"y":33},{"x":1529625600000,"y":33},{"x":1529712000000,"y":33},{"x":1529798400000,"y":33},{"x":1529884800000,"y":33},{"x":1529971200000,"y":33},{"x":1530057600000,"y":33},{"x":1530144000000,"y":33},{"x":1530230400000,"y":33},{"x":1530316800000,"y":33},{"x":1530403200000,"y":33},{"x":1530489600000,"y":33},{"x":1530576000000,"y":33},{"x":1530662400000,"y":33},{"x":1530748800000,"y":33},{"x":1530835200000,"y":33},{"x":1530921600000,"y":33},{"x":1531008000000,"y":33},{"x":1531094400000,"y":33},{"x":1531180800000,"y":33},{"x":1531267200000,"y":33},{"x":1531353600000,"y":33},{"x":1531440000000,"y":33},{"x":1531526400000,"y":33},{"x":1531612800000,"y":33},{"x":1531699200000,"y":33},{"x":1531785600000,"y":33},{"x":1531872000000,"y":33},{"x":1531958400000,"y":33},{"x":1532044800000,"y":33},{"x":1532131200000,"y":33},{"x":1532217600000,"y":33},{"x":1532304000000,"y":33},{"x":1532390400000,"y":33},{"x":1532476800000,"y":33},{"x":1532563200000,"y":33},{"x":1532649600000,"y":33},{"x":1532736000000,"y":33},{"x":1532822400000,"y":33},{"x":1532908800000,"y":33},{"x":1532995200000,"y":33},{"x":1533081600000,"y":33},{"x":1533168000000,"y":33},{"x":1533254400000,"y":33},{"x":1533340800000,"y":33},{"x":1533427200000,"y":33},{"x":1533513600000,"y":33},{"x":1533600000000,"y":33},{"x":1533686400000,"y":33},{"x":1533772800000,"y":33},{"x":1533859200000,"y":33},{"x":1533945600000,"y":33},{"x":1534032000000,"y":33},{"x":1534118400000,"y":33},{"x":1534204800000,"y":33},{"x":1534291200000,"y":33},{"x":1534377600000,"y":33},{"x":1534464000000,"y":33},{"x":1534550400000,"y":33},{"x":1534636800000,"y":33},{"x":1534723200000,"y":33},{"x":1534809600000,"y":33},{"x":1534896000000,"y":33},{"x":1534982400000,"y":33},{"x":1535068800000,"y":33},{"x":1535155200000,"y":33},{"x":1535241600000,"y":33},{"x":1535328000000,"y":33},{"x":1535414400000,"y":33},{"x":1535500800000,"y":33},{"x":1535587200000,"y":33},{"x":1535673600000,"y":33},{"x":1535760000000,"y":33},{"x":1535846400000,"y":33},{"x":1535932800000,"y":33},{"x":1536019200000,"y":33},{"x":1536105600000,"y":33},{"x":1536192000000,"y":33},{"x":1536278400000,"y":33},{"x":1536364800000,"y":33},{"x":1536451200000,"y":33},{"x":1536537600000,"y":33},{"x":1536624000000,"y":33},{"x":1536710400000,"y":33},{"x":1536796800000,"y":33},{"x":1536883200000,"y":33},{"x":1536969600000,"y":33},{"x":1537056000000,"y":33},{"x":1537142400000,"y":33},{"x":1537228800000,"y":33},{"x":1537315200000,"y":33},{"x":1537401600000,"y":33},{"x":1537488000000,"y":33},{"x":1537574400000,"y":33},{"x":1537660800000,"y":33},{"x":1537747200000,"y":33},{"x":1537833600000,"y":33},{"x":1537920000000,"y":33},{"x":1538006400000,"y":33},{"x":1538092800000,"y":33},{"x":1538179200000,"y":33},{"x":1538265600000,"y":33},{"x":1538352000000,"y":33},{"x":1538438400000,"y":33},{"x":1538524800000,"y":33},{"x":1538611200000,"y":33},{"x":1538697600000,"y":33},{"x":1538784000000,"y":33},{"x":1538870400000,"y":33},{"x":1538956800000,"y":33},{"x":1539043200000,"y":33},{"x":1539129600000,"y":33},{"x":1539216000000,"y":33},{"x":1539302400000,"y":33},{"x":1539388800000,"y":33},{"x":1539475200000,"y":33},{"x":1539561600000,"y":33},{"x":1539648000000,"y":33},{"x":1539734400000,"y":33},{"x":1539820800000,"y":33},{"x":1539907200000,"y":33},{"x":1539993600000,"y":33},{"x":1540080000000,"y":33},{"x":1540166400000,"y":33},{"x":1540252800000,"y":33},{"x":1540339200000,"y":33},{"x":1540425600000,"y":33},{"x":1540512000000,"y":33},{"x":1540598400000,"y":33},{"x":1540684800000,"y":33},{"x":1540771200000,"y":33},{"x":1540857600000,"y":33},{"x":1540944000000,"y":33},{"x":1541030400000,"y":33},{"x":1541116800000,"y":33},{"x":1541203200000,"y":33},{"x":1541289600000,"y":33},{"x":1541376000000,"y":33},{"x":1541462400000,"y":33},{"x":1541548800000,"y":33},{"x":1541635200000,"y":33},{"x":1541721600000,"y":33},{"x":1541808000000,"y":33},{"x":1541894400000,"y":33},{"x":1541980800000,"y":33},{"x":1542067200000,"y":33},{"x":1542153600000,"y":33},{"x":1542240000000,"y":33},{"x":1542326400000,"y":33},{"x":1542412800000,"y":33},{"x":1542499200000,"y":33},{"x":1542585600000,"y":33},{"x":1542672000000,"y":33},{"x":1542758400000,"y":33},{"x":1542844800000,"y":33},{"x":1542931200000,"y":33},{"x":1543017600000,"y":33},{"x":1543104000000,"y":33},{"x":1543190400000,"y":33},{"x":1543276800000,"y":33},{"x":1543363200000,"y":33},{"x":1543449600000,"y":33},{"x":1543536000000,"y":33},{"x":1543622400000,"y":33},{"x":1543708800000,"y":33},{"x":1543795200000,"y":33},{"x":1543881600000,"y":33},{"x":1543968000000,"y":33},{"x":1544054400000,"y":33},{"x":1544140800000,"y":33},{"x":1544227200000,"y":33},{"x":1544313600000,"y":33},{"x":1544400000000,"y":33},{"x":1544486400000,"y":33},{"x":1544572800000,"y":33},{"x":1544659200000,"y":33},{"x":1544745600000,"y":33},{"x":1544832000000,"y":33},{"x":1544918400000,"y":33},{"x":1545004800000,"y":33},{"x":1545091200000,"y":33},{"x":1545177600000,"y":33},{"x":1545264000000,"y":33},{"x":1545350400000,"y":33},{"x":1545436800000,"y":33},{"x":1545523200000,"y":33},{"x":1545609600000,"y":33},{"x":1545696000000,"y":33},{"x":1545782400000,"y":33},{"x":1545868800000,"y":33},{"x":1545955200000,"y":33},{"x":1546041600000,"y":33},{"x":1546128000000,"y":33},{"x":1546214400000,"y":33},{"x":1546300800000,"y":33},{"x":1546387200000,"y":33},{"x":1546473600000,"y":33},{"x":1546560000000,"y":33},{"x":1546646400000,"y":33},{"x":1546732800000,"y":33},{"x":1546819200000,"y":33},{"x":1546905600000,"y":33},{"x":1546992000000,"y":33},{"x":1547078400000,"y":33},{"x":1547164800000,"y":33},{"x":1547251200000,"y":33},{"x":1547337600000,"y":33},{"x":1547424000000,"y":33},{"x":1547510400000,"y":33},{"x":1547596800000,"y":33},{"x":1547683200000,"y":33},{"x":1547769600000,"y":33},{"x":1547856000000,"y":33},{"x":1547942400000,"y":33},{"x":1548028800000,"y":33},{"x":1548115200000,"y":33},{"x":1548201600000,"y":33},{"x":1548288000000,"y":33},{"x":1548374400000,"y":33},{"x":1548460800000,"y":33},{"x":1548547200000,"y":33},{"x":1548633600000,"y":33},{"x":1548720000000,"y":33},{"x":1548806400000,"y":33},{"x":1548892800000,"y":33},{"x":1548979200000,"y":33},{"x":1549065600000,"y":33},{"x":1549152000000,"y":33},{"x":1549238400000,"y":33},{"x":1549324800000,"y":33},{"x":1549411200000,"y":33},{"x":1549497600000,"y":33},{"x":1549584000000,"y":33},{"x":1549670400000,"y":33},{"x":1549756800000,"y":33},{"x":1549843200000,"y":33},{"x":1549929600000,"y":33},{"x":1550016000000,"y":33},{"x":1550102400000,"y":33},{"x":1550188800000,"y":33},{"x":1550275200000,"y":33},{"x":1550361600000,"y":33},{"x":1550448000000,"y":33},{"x":1550534400000,"y":33},{"x":1550620800000,"y":33},{"x":1550707200000,"y":33},{"x":1550793600000,"y":33},{"x":1550880000000,"y":33},{"x":1550966400000,"y":33},{"x":1551052800000,"y":33},{"x":1551139200000,"y":33},{"x":1551225600000,"y":33},{"x":1551312000000,"y":33},{"x":1551398400000,"y":33},{"x":1551484800000,"y":33},{"x":1551571200000,"y":33},{"x":1551657600000,"y":33},{"x":1551744000000,"y":33},{"x":1551830400000,"y":33},{"x":1551916800000,"y":33},{"x":1552003200000,"y":33},{"x":1552089600000,"y":33},{"x":1552176000000,"y":33},{"x":1552262400000,"y":33},{"x":1552348800000,"y":33},{"x":1552435200000,"y":33},{"x":1552521600000,"y":33},{"x":1552608000000,"y":33},{"x":1552694400000,"y":33},{"x":1552780800000,"y":33},{"x":1552867200000,"y":33},{"x":1552953600000,"y":33},{"x":1553040000000,"y":33},{"x":1553126400000,"y":33},{"x":1553212800000,"y":33},{"x":1553299200000,"y":33},{"x":1553385600000,"y":33},{"x":1553472000000,"y":33},{"x":1553558400000,"y":33},{"x":1553644800000,"y":33},{"x":1553731200000,"y":33},{"x":1553817600000,"y":33},{"x":1553904000000,"y":33},{"x":1553990400000,"y":33},{"x":1554076800000,"y":33},{"x":1554163200000,"y":33},{"x":1554249600000,"y":33},{"x":1554336000000,"y":33},{"x":1554422400000,"y":33},{"x":1554508800000,"y":33},{"x":1554595200000,"y":33},{"x":1554681600000,"y":33},{"x":1554768000000,"y":33},{"x":1554854400000,"y":33},{"x":1554940800000,"y":33},{"x":1555027200000,"y":33},{"x":1555113600000,"y":33},{"x":1555200000000,"y":33},{"x":1555286400000,"y":33},{"x":1555372800000,"y":33},{"x":1555459200000,"y":33},{"x":1555545600000,"y":33},{"x":1555632000000,"y":33},{"x":1555718400000,"y":33},{"x":1555804800000,"y":33},{"x":1555891200000,"y":33},{"x":1555977600000,"y":33},{"x":1556064000000,"y":33},{"x":1556150400000,"y":33}],"baselineEventsClosed":[{"x":1459296000000,"y":0},{"x":1459382400000,"y":0},{"x":1459468800000,"y":0},{"x":1459555200000,"y":0},{"x":1459641600000,"y":0},{"x":1459728000000,"y":0},{"x":1459814400000,"y":0},{"x":1459900800000,"y":0},{"x":1459987200000,"y":0},{"x":1460073600000,"y":0},{"x":1460160000000,"y":0},{"x":1460246400000,"y":0},{"x":1460332800000,"y":0},{"x":1460419200000,"y":0},{"x":1460505600000,"y":0},{"x":1460592000000,"y":0},{"x":1460678400000,"y":1},{"x":1460764800000,"y":1},{"x":1460851200000,"y":1},{"x":1460937600000,"y":1},{"x":1461024000000,"y":1},{"x":1461110400000,"y":1},{"x":1461196800000,"y":1},{"x":1461283200000,"y":1},{"x":1461369600000,"y":1},{"x":1461456000000,"y":1},{"x":1461542400000,"y":2},{"x":1461628800000,"y":2},{"x":1461715200000,"y":2},{"x":1461801600000,"y":2},{"x":1461888000000,"y":4},{"x":1461974400000,"y":4},{"x":1462060800000,"y":4},{"x":1462147200000,"y":4},{"x":1462233600000,"y":4},{"x":1462320000000,"y":4},{"x":1462406400000,"y":5},{"x":1462492800000,"y":7},{"x":1462579200000,"y":7},{"x":1462665600000,"y":7},{"x":1462752000000,"y":7},{"x":1462838400000,"y":7},{"x":1462924800000,"y":7},{"x":1463011200000,"y":7},{"x":1463097600000,"y":7},{"x":1463184000000,"y":7},{"x":1463270400000,"y":7},{"x":1463356800000,"y":7},{"x":1463443200000,"y":7},{"x":1463529600000,"y":8},{"x":1463616000000,"y":8},{"x":1463702400000,"y":10},{"x":1463788800000,"y":10},{"x":1463875200000,"y":10},{"x":1463961600000,"y":10},{"x":1464048000000,"y":10},{"x":1464134400000,"y":10},{"x":1464220800000,"y":10},{"x":1464307200000,"y":11},{"x":1464393600000,"y":11},{"x":1464480000000,"y":11},{"x":1464566400000,"y":13},{"x":1464652800000,"y":13},{"x":1464739200000,"y":13},{"x":1464825600000,"y":18},{"x":1464912000000,"y":18},{"x":1464998400000,"y":18},{"x":1465084800000,"y":18},{"x":1465171200000,"y":19},{"x":1465257600000,"y":19},{"x":1465344000000,"y":19},{"x":1465430400000,"y":19},{"x":1465516800000,"y":20},{"x":1465603200000,"y":20},{"x":1465689600000,"y":20},{"x":1465776000000,"y":20},{"x":1465862400000,"y":20},{"x":1465948800000,"y":20},{"x":1466035200000,"y":21},{"x":1466121600000,"y":22},{"x":1466208000000,"y":22},{"x":1466294400000,"y":22},{"x":1466380800000,"y":22},{"x":1466467200000,"y":22},{"x":1466553600000,"y":22},{"x":1466640000000,"y":22},{"x":1466726400000,"y":24},{"x":1466812800000,"y":24},{"x":1466899200000,"y":24},{"x":1466985600000,"y":24},{"x":1467072000000,"y":24},{"x":1467158400000,"y":25},{"x":1467244800000,"y":25},{"x":1467331200000,"y":29},{"x":1467417600000,"y":29},{"x":1467504000000,"y":29},{"x":1467590400000,"y":29},{"x":1467676800000,"y":29},{"x":1467763200000,"y":29},{"x":1467849600000,"y":30},{"x":1467936000000,"y":31},{"x":1468022400000,"y":31},{"x":1468108800000,"y":31},{"x":1468195200000,"y":31},{"x":1468281600000,"y":31},{"x":1468368000000,"y":31},{"x":1468454400000,"y":31},{"x":1468540800000,"y":31},{"x":1468627200000,"y":31},{"x":1468713600000,"y":31},{"x":1468800000000,"y":31},{"x":1468886400000,"y":31},{"x":1468972800000,"y":31},{"x":1469059200000,"y":31},{"x":1469145600000,"y":32},{"x":1469232000000,"y":32},{"x":1469318400000,"y":32},{"x":1469404800000,"y":32},{"x":1469491200000,"y":32},{"x":1469577600000,"y":32},{"x":1469664000000,"y":32},{"x":1469750400000,"y":32},{"x":1469836800000,"y":32},{"x":1469923200000,"y":32},{"x":1470009600000,"y":32},{"x":1470096000000,"y":32},{"x":1470182400000,"y":32},{"x":1470268800000,"y":32},{"x":1470355200000,"y":32},{"x":1470441600000,"y":32},{"x":1470528000000,"y":32},{"x":1470614400000,"y":32},{"x":1470700800000,"y":32},{"x":1470787200000,"y":32},{"x":1470873600000,"y":32},{"x":1470960000000,"y":33},{"x":1471046400000,"y":33},{"x":1471132800000,"y":33},{"x":1471219200000,"y":33},{"x":1471305600000,"y":33},{"x":1471392000000,"y":33},{"x":1471478400000,"y":33},{"x":1471564800000,"y":33},{"x":1471651200000,"y":33},{"x":1471737600000,"y":33},{"x":1471824000000,"y":33},{"x":1471910400000,"y":33},{"x":1471996800000,"y":33},{"x":1472083200000,"y":33},{"x":1472169600000,"y":33},{"x":1472256000000,"y":33},{"x":1472342400000,"y":33},{"x":1472428800000,"y":33},{"x":1472515200000,"y":33},{"x":1472601600000,"y":33},{"x":1472688000000,"y":33},{"x":1472774400000,"y":33},{"x":1472860800000,"y":33},{"x":1472947200000,"y":33},{"x":1473033600000,"y":33},{"x":1473120000000,"y":33},{"x":1473206400000,"y":33},{"x":1473292800000,"y":33},{"x":1473379200000,"y":33},{"x":1473465600000,"y":33},{"x":1473552000000,"y":33},{"x":1473638400000,"y":33},{"x":1473724800000,"y":33},{"x":1473811200000,"y":33},{"x":1473897600000,"y":33},{"x":1473984000000,"y":33},{"x":1474070400000,"y":33},{"x":1474156800000,"y":33},{"x":1474243200000,"y":33},{"x":1474329600000,"y":33},{"x":1474416000000,"y":33},{"x":1474502400000,"y":33},{"x":1474588800000,"y":33},{"x":1474675200000,"y":33},{"x":1474761600000,"y":33},{"x":1474848000000,"y":33},{"x":1474934400000,"y":33},{"x":1475020800000,"y":33},{"x":1475107200000,"y":33},{"x":1475193600000,"y":33},{"x":1475280000000,"y":33},{"x":1475366400000,"y":33},{"x":1475452800000,"y":33},{"x":1475539200000,"y":33},{"x":1475625600000,"y":33},{"x":1475712000000,"y":33},{"x":1475798400000,"y":33},{"x":1475884800000,"y":33},{"x":1475971200000,"y":33},{"x":1476057600000,"y":33},{"x":1476144000000,"y":33},{"x":1476230400000,"y":33},{"x":1476316800000,"y":33},{"x":1476403200000,"y":33},{"x":1476489600000,"y":33},{"x":1476576000000,"y":33},{"x":1476662400000,"y":33},{"x":1476748800000,"y":33},{"x":1476835200000,"y":33},{"x":1476921600000,"y":33},{"x":1477008000000,"y":33},{"x":1477094400000,"y":33},{"x":1477180800000,"y":33},{"x":1477267200000,"y":33},{"x":1477353600000,"y":33},{"x":1477440000000,"y":33},{"x":1477526400000,"y":33},{"x":1477612800000,"y":33},{"x":1477699200000,"y":33},{"x":1477785600000,"y":33},{"x":1477872000000,"y":33},{"x":1477958400000,"y":33},{"x":1478044800000,"y":33},{"x":1478131200000,"y":33},{"x":1478217600000,"y":33},{"x":1478304000000,"y":33},{"x":1478390400000,"y":33},{"x":1478476800000,"y":33},{"x":1478563200000,"y":33},{"x":1478649600000,"y":33},{"x":1478736000000,"y":33},{"x":1478822400000,"y":33},{"x":1478908800000,"y":33},{"x":1478995200000,"y":33},{"x":1479081600000,"y":33},{"x":1479168000000,"y":33},{"x":1479254400000,"y":33},{"x":1479340800000,"y":33},{"x":1479427200000,"y":33},{"x":1479513600000,"y":33},{"x":1479600000000,"y":33},{"x":1479686400000,"y":33},{"x":1479772800000,"y":33},{"x":1479859200000,"y":33},{"x":1479945600000,"y":33},{"x":1480032000000,"y":33},{"x":1480118400000,"y":33},{"x":1480204800000,"y":33},{"x":1480291200000,"y":33},{"x":1480377600000,"y":33},{"x":1480464000000,"y":33},{"x":1480550400000,"y":33},{"x":1480636800000,"y":33},{"x":1480723200000,"y":33},{"x":1480809600000,"y":33},{"x":1480896000000,"y":33},{"x":1480982400000,"y":33},{"x":1481068800000,"y":33},{"x":1481155200000,"y":33},{"x":1481241600000,"y":33},{"x":1481328000000,"y":33},{"x":1481414400000,"y":33},{"x":1481500800000,"y":33},{"x":1481587200000,"y":33},{"x":1481673600000,"y":33},{"x":1481760000000,"y":33},{"x":1481846400000,"y":33},{"x":1481932800000,"y":33},{"x":1482019200000,"y":33},{"x":1482105600000,"y":33},{"x":1482192000000,"y":33},{"x":1482278400000,"y":33},{"x":1482364800000,"y":33},{"x":1482451200000,"y":33},{"x":1482537600000,"y":33},{"x":1482624000000,"y":33},{"x":1482710400000,"y":33},{"x":1482796800000,"y":33},{"x":1482883200000,"y":33},{"x":1482969600000,"y":33},{"x":1483056000000,"y":33},{"x":1483142400000,"y":33},{"x":1483228800000,"y":33},{"x":1483315200000,"y":33},{"x":1483401600000,"y":33},{"x":1483488000000,"y":33},{"x":1483574400000,"y":33},{"x":1483660800000,"y":33},{"x":1483747200000,"y":33},{"x":1483833600000,"y":33},{"x":1483920000000,"y":33},{"x":1484006400000,"y":33},{"x":1484092800000,"y":33},{"x":1484179200000,"y":33},{"x":1484265600000,"y":33},{"x":1484352000000,"y":33},{"x":1484438400000,"y":33},{"x":1484524800000,"y":33},{"x":1484611200000,"y":33},{"x":1484697600000,"y":33},{"x":1484784000000,"y":33},{"x":1484870400000,"y":33},{"x":1484956800000,"y":33},{"x":1485043200000,"y":33},{"x":1485129600000,"y":33},{"x":1485216000000,"y":33},{"x":1485302400000,"y":33},{"x":1485388800000,"y":33},{"x":1485475200000,"y":33},{"x":1485561600000,"y":33},{"x":1485648000000,"y":33},{"x":1485734400000,"y":33},{"x":1485820800000,"y":33},{"x":1485907200000,"y":33},{"x":1485993600000,"y":33},{"x":1486080000000,"y":33},{"x":1486166400000,"y":33},{"x":1486252800000,"y":33},{"x":1486339200000,"y":33},{"x":1486425600000,"y":33},{"x":1486512000000,"y":33},{"x":1486598400000,"y":33},{"x":1486684800000,"y":33},{"x":1486771200000,"y":33},{"x":1486857600000,"y":33},{"x":1486944000000,"y":33},{"x":1487030400000,"y":33},{"x":1487116800000,"y":33},{"x":1487203200000,"y":33},{"x":1487289600000,"y":33},{"x":1487376000000,"y":33},{"x":1487462400000,"y":33},{"x":1487548800000,"y":33},{"x":1487635200000,"y":33},{"x":1487721600000,"y":33},{"x":1487808000000,"y":33},{"x":1487894400000,"y":33},{"x":1487980800000,"y":33},{"x":1488067200000,"y":33},{"x":1488153600000,"y":33},{"x":1488240000000,"y":33},{"x":1488326400000,"y":33},{"x":1488412800000,"y":33},{"x":1488499200000,"y":33},{"x":1488585600000,"y":33},{"x":1488672000000,"y":33},{"x":1488758400000,"y":33},{"x":1488844800000,"y":33},{"x":1488931200000,"y":33},{"x":1489017600000,"y":33},{"x":1489104000000,"y":33},{"x":1489190400000,"y":33},{"x":1489276800000,"y":33},{"x":1489363200000,"y":33},{"x":1489449600000,"y":33},{"x":1489536000000,"y":33},{"x":1489622400000,"y":33},{"x":1489708800000,"y":33},{"x":1489795200000,"y":33},{"x":1489881600000,"y":33},{"x":1489968000000,"y":33},{"x":1490054400000,"y":33},{"x":1490140800000,"y":33},{"x":1490227200000,"y":33},{"x":1490313600000,"y":33},{"x":1490400000000,"y":33},{"x":1490486400000,"y":33},{"x":1490572800000,"y":33},{"x":1490659200000,"y":33},{"x":1490745600000,"y":33},{"x":1490832000000,"y":33},{"x":1490918400000,"y":33},{"x":1491004800000,"y":33},{"x":1491091200000,"y":33},{"x":1491177600000,"y":33},{"x":1491264000000,"y":33},{"x":1491350400000,"y":33},{"x":1491436800000,"y":33},{"x":1491523200000,"y":33},{"x":1491609600000,"y":33},{"x":1491696000000,"y":33},{"x":1491782400000,"y":33},{"x":1491868800000,"y":33},{"x":1491955200000,"y":33},{"x":1492041600000,"y":33},{"x":1492128000000,"y":33},{"x":1492214400000,"y":33},{"x":1492300800000,"y":33},{"x":1492387200000,"y":33},{"x":1492473600000,"y":33},{"x":1492560000000,"y":33},{"x":1492646400000,"y":33},{"x":1492732800000,"y":33},{"x":1492819200000,"y":33},{"x":1492905600000,"y":33},{"x":1492992000000,"y":33},{"x":1493078400000,"y":33},{"x":1493164800000,"y":33},{"x":1493251200000,"y":33},{"x":1493337600000,"y":33},{"x":1493424000000,"y":33},{"x":1493510400000,"y":33},{"x":1493596800000,"y":33},{"x":1493683200000,"y":33},{"x":1493769600000,"y":33},{"x":1493856000000,"y":33},{"x":1493942400000,"y":33},{"x":1494028800000,"y":33},{"x":1494115200000,"y":33},{"x":1494201600000,"y":33},{"x":1494288000000,"y":33},{"x":1494374400000,"y":33},{"x":1494460800000,"y":33},{"x":1494547200000,"y":33},{"x":1494633600000,"y":33},{"x":1494720000000,"y":33},{"x":1494806400000,"y":33},{"x":1494892800000,"y":33},{"x":1494979200000,"y":33},{"x":1495065600000,"y":33},{"x":1495152000000,"y":33},{"x":1495238400000,"y":33},{"x":1495324800000,"y":33},{"x":1495411200000,"y":33},{"x":1495497600000,"y":33},{"x":1495584000000,"y":33},{"x":1495670400000,"y":33},{"x":1495756800000,"y":33},{"x":1495843200000,"y":33},{"x":1495929600000,"y":33},{"x":1496016000000,"y":33},{"x":1496102400000,"y":33},{"x":1496188800000,"y":33},{"x":1496275200000,"y":33},{"x":1496361600000,"y":33},{"x":1496448000000,"y":33},{"x":1496534400000,"y":33},{"x":1496620800000,"y":33},{"x":1496707200000,"y":33},{"x":1496793600000,"y":33},{"x":1496880000000,"y":33},{"x":1496966400000,"y":33},{"x":1497052800000,"y":33},{"x":1497139200000,"y":33},{"x":1497225600000,"y":33},{"x":1497312000000,"y":33},{"x":1497398400000,"y":33},{"x":1497484800000,"y":33},{"x":1497571200000,"y":33},{"x":1497657600000,"y":33},{"x":1497744000000,"y":33},{"x":1497830400000,"y":33},{"x":1497916800000,"y":33},{"x":1498003200000,"y":33},{"x":1498089600000,"y":33},{"x":1498176000000,"y":33},{"x":1498262400000,"y":33},{"x":1498348800000,"y":33},{"x":1498435200000,"y":33},{"x":1498521600000,"y":33},{"x":1498608000000,"y":33},{"x":1498694400000,"y":33},{"x":1498780800000,"y":33},{"x":1498867200000,"y":33},{"x":1498953600000,"y":33},{"x":1499040000000,"y":33},{"x":1499126400000,"y":33},{"x":1499212800000,"y":33},{"x":1499299200000,"y":33},{"x":1499385600000,"y":33},{"x":1499472000000,"y":33},{"x":1499558400000,"y":33},{"x":1499644800000,"y":33},{"x":1499731200000,"y":33},{"x":1499817600000,"y":33},{"x":1499904000000,"y":33},{"x":1499990400000,"y":33},{"x":1500076800000,"y":33},{"x":1500163200000,"y":33},{"x":1500249600000,"y":33},{"x":1500336000000,"y":33},{"x":1500422400000,"y":33},{"x":1500508800000,"y":33},{"x":1500595200000,"y":33},{"x":1500681600000,"y":33},{"x":1500768000000,"y":33},{"x":1500854400000,"y":33},{"x":1500940800000,"y":33},{"x":1501027200000,"y":33},{"x":1501113600000,"y":33},{"x":1501200000000,"y":33},{"x":1501286400000,"y":33},{"x":1501372800000,"y":33},{"x":1501459200000,"y":33},{"x":1501545600000,"y":33},{"x":1501632000000,"y":33},{"x":1501718400000,"y":33},{"x":1501804800000,"y":33},{"x":1501891200000,"y":33},{"x":1501977600000,"y":33},{"x":1502064000000,"y":33},{"x":1502150400000,"y":33},{"x":1502236800000,"y":33},{"x":1502323200000,"y":33},{"x":1502409600000,"y":33},{"x":1502496000000,"y":33},{"x":1502582400000,"y":33},{"x":1502668800000,"y":33},{"x":1502755200000,"y":33},{"x":1502841600000,"y":33},{"x":1502928000000,"y":33},{"x":1503014400000,"y":33},{"x":1503100800000,"y":33},{"x":1503187200000,"y":33},{"x":1503273600000,"y":33},{"x":1503360000000,"y":33},{"x":1503446400000,"y":33},{"x":1503532800000,"y":33},{"x":1503619200000,"y":33},{"x":1503705600000,"y":33},{"x":1503792000000,"y":33},{"x":1503878400000,"y":33},{"x":1503964800000,"y":33},{"x":1504051200000,"y":33},{"x":1504137600000,"y":33},{"x":1504224000000,"y":33},{"x":1504310400000,"y":33},{"x":1504396800000,"y":33},{"x":1504483200000,"y":33},{"x":1504569600000,"y":33},{"x":1504656000000,"y":33},{"x":1504742400000,"y":33},{"x":1504828800000,"y":33},{"x":1504915200000,"y":33},{"x":1505001600000,"y":33},{"x":1505088000000,"y":33},{"x":1505174400000,"y":33},{"x":1505260800000,"y":33},{"x":1505347200000,"y":33},{"x":1505433600000,"y":33},{"x":1505520000000,"y":33},{"x":1505606400000,"y":33},{"x":1505692800000,"y":33},{"x":1505779200000,"y":33},{"x":1505865600000,"y":33},{"x":1505952000000,"y":33},{"x":1506038400000,"y":33},{"x":1506124800000,"y":33},{"x":1506211200000,"y":33},{"x":1506297600000,"y":33},{"x":1506384000000,"y":33},{"x":1506470400000,"y":33},{"x":1506556800000,"y":33},{"x":1506643200000,"y":33},{"x":1506729600000,"y":33},{"x":1506816000000,"y":33},{"x":1506902400000,"y":33},{"x":1506988800000,"y":33},{"x":1507075200000,"y":33},{"x":1507161600000,"y":33},{"x":1507248000000,"y":33},{"x":1507334400000,"y":33},{"x":1507420800000,"y":33},{"x":1507507200000,"y":33},{"x":1507593600000,"y":33},{"x":1507680000000,"y":33},{"x":1507766400000,"y":33},{"x":1507852800000,"y":33},{"x":1507939200000,"y":33},{"x":1508025600000,"y":33},{"x":1508112000000,"y":33},{"x":1508198400000,"y":33},{"x":1508284800000,"y":33},{"x":1508371200000,"y":33},{"x":1508457600000,"y":33},{"x":1508544000000,"y":33},{"x":1508630400000,"y":33},{"x":1508716800000,"y":33},{"x":1508803200000,"y":33},{"x":1508889600000,"y":33},{"x":1508976000000,"y":33},{"x":1509062400000,"y":33},{"x":1509148800000,"y":33},{"x":1509235200000,"y":33},{"x":1509321600000,"y":33},{"x":1509408000000,"y":33},{"x":1509494400000,"y":33},{"x":1509580800000,"y":33},{"x":1509667200000,"y":33},{"x":1509753600000,"y":33},{"x":1509840000000,"y":33},{"x":1509926400000,"y":33},{"x":1510012800000,"y":33},{"x":1510099200000,"y":33},{"x":1510185600000,"y":33},{"x":1510272000000,"y":33},{"x":1510358400000,"y":33},{"x":1510444800000,"y":33},{"x":1510531200000,"y":33},{"x":1510617600000,"y":33},{"x":1510704000000,"y":33},{"x":1510790400000,"y":33},{"x":1510876800000,"y":33},{"x":1510963200000,"y":33},{"x":1511049600000,"y":33},{"x":1511136000000,"y":33},{"x":1511222400000,"y":33},{"x":1511308800000,"y":33},{"x":1511395200000,"y":33},{"x":1511481600000,"y":33},{"x":1511568000000,"y":33},{"x":1511654400000,"y":33},{"x":1511740800000,"y":33},{"x":1511827200000,"y":33},{"x":1511913600000,"y":33},{"x":1512000000000,"y":33},{"x":1512086400000,"y":33},{"x":1512172800000,"y":33},{"x":1512259200000,"y":33},{"x":1512345600000,"y":33},{"x":1512432000000,"y":33},{"x":1512518400000,"y":33},{"x":1512604800000,"y":33},{"x":1512691200000,"y":33},{"x":1512777600000,"y":33},{"x":1512864000000,"y":33},{"x":1512950400000,"y":33},{"x":1513036800000,"y":33},{"x":1513123200000,"y":33},{"x":1513209600000,"y":33},{"x":1513296000000,"y":33},{"x":1513382400000,"y":33},{"x":1513468800000,"y":33},{"x":1513555200000,"y":33},{"x":1513641600000,"y":33},{"x":1513728000000,"y":33},{"x":1513814400000,"y":33},{"x":1513900800000,"y":33},{"x":1513987200000,"y":33},{"x":1514073600000,"y":33},{"x":1514160000000,"y":33},{"x":1514246400000,"y":33},{"x":1514332800000,"y":33},{"x":1514419200000,"y":33},{"x":1514505600000,"y":33},{"x":1514592000000,"y":33},{"x":1514678400000,"y":33},{"x":1514764800000,"y":33},{"x":1514851200000,"y":33},{"x":1514937600000,"y":33},{"x":1515024000000,"y":33},{"x":1515110400000,"y":33},{"x":1515196800000,"y":33},{"x":1515283200000,"y":33},{"x":1515369600000,"y":33},{"x":1515456000000,"y":33},{"x":1515542400000,"y":33},{"x":1515628800000,"y":33},{"x":1515715200000,"y":33},{"x":1515801600000,"y":33},{"x":1515888000000,"y":33},{"x":1515974400000,"y":33},{"x":1516060800000,"y":33},{"x":1516147200000,"y":33},{"x":1516233600000,"y":33},{"x":1516320000000,"y":33},{"x":1516406400000,"y":33},{"x":1516492800000,"y":33},{"x":1516579200000,"y":33},{"x":1516665600000,"y":33},{"x":1516752000000,"y":33},{"x":1516838400000,"y":33},{"x":1516924800000,"y":33},{"x":1517011200000,"y":33},{"x":1517097600000,"y":33},{"x":1517184000000,"y":33},{"x":1517270400000,"y":33},{"x":1517356800000,"y":33},{"x":1517443200000,"y":33},{"x":1517529600000,"y":33},{"x":1517616000000,"y":33},{"x":1517702400000,"y":33},{"x":1517788800000,"y":33},{"x":1517875200000,"y":33},{"x":1517961600000,"y":33},{"x":1518048000000,"y":33},{"x":1518134400000,"y":33},{"x":1518220800000,"y":33},{"x":1518307200000,"y":33},{"x":1518393600000,"y":33},{"x":1518480000000,"y":33},{"x":1518566400000,"y":33},{"x":1518652800000,"y":33},{"x":1518739200000,"y":33},{"x":1518825600000,"y":33},{"x":1518912000000,"y":33},{"x":1518998400000,"y":33},{"x":1519084800000,"y":33},{"x":1519171200000,"y":33},{"x":1519257600000,"y":33},{"x":1519344000000,"y":33},{"x":1519430400000,"y":33},{"x":1519516800000,"y":33},{"x":1519603200000,"y":33},{"x":1519689600000,"y":33},{"x":1519776000000,"y":33},{"x":1519862400000,"y":33},{"x":1519948800000,"y":33},{"x":1520035200000,"y":33},{"x":1520121600000,"y":33},{"x":1520208000000,"y":33},{"x":1520294400000,"y":33},{"x":1520380800000,"y":33},{"x":1520467200000,"y":33},{"x":1520553600000,"y":33},{"x":1520640000000,"y":33},{"x":1520726400000,"y":33},{"x":1520812800000,"y":33},{"x":1520899200000,"y":33},{"x":1520985600000,"y":33},{"x":1521072000000,"y":33},{"x":1521158400000,"y":33},{"x":1521244800000,"y":33},{"x":1521331200000,"y":33},{"x":1521417600000,"y":33},{"x":1521504000000,"y":33},{"x":1521590400000,"y":33},{"x":1521676800000,"y":33},{"x":1521763200000,"y":33},{"x":1521849600000,"y":33},{"x":1521936000000,"y":33},{"x":1522022400000,"y":33},{"x":1522108800000,"y":33},{"x":1522195200000,"y":33},{"x":1522281600000,"y":33},{"x":1522368000000,"y":33},{"x":1522454400000,"y":33},{"x":1522540800000,"y":33},{"x":1522627200000,"y":33},{"x":1522713600000,"y":33},{"x":1522800000000,"y":33},{"x":1522886400000,"y":33},{"x":1522972800000,"y":33},{"x":1523059200000,"y":33},{"x":1523145600000,"y":33},{"x":1523232000000,"y":33},{"x":1523318400000,"y":33},{"x":1523404800000,"y":33},{"x":1523491200000,"y":33},{"x":1523577600000,"y":33},{"x":1523664000000,"y":33},{"x":1523750400000,"y":33},{"x":1523836800000,"y":33},{"x":1523923200000,"y":33},{"x":1524009600000,"y":33},{"x":1524096000000,"y":33},{"x":1524182400000,"y":33},{"x":1524268800000,"y":33},{"x":1524355200000,"y":33},{"x":1524441600000,"y":33},{"x":1524528000000,"y":33},{"x":1524614400000,"y":33},{"x":1524700800000,"y":33},{"x":1524787200000,"y":33},{"x":1524873600000,"y":33},{"x":1524960000000,"y":33},{"x":1525046400000,"y":33},{"x":1525132800000,"y":33},{"x":1525219200000,"y":33},{"x":1525305600000,"y":33},{"x":1525392000000,"y":33},{"x":1525478400000,"y":33},{"x":1525564800000,"y":33},{"x":1525651200000,"y":33},{"x":1525737600000,"y":33},{"x":1525824000000,"y":33},{"x":1525910400000,"y":33},{"x":1525996800000,"y":33},{"x":1526083200000,"y":33},{"x":1526169600000,"y":33},{"x":1526256000000,"y":33},{"x":1526342400000,"y":33},{"x":1526428800000,"y":33},{"x":1526515200000,"y":33},{"x":1526601600000,"y":33},{"x":1526688000000,"y":33},{"x":1526774400000,"y":33},{"x":1526860800000,"y":33},{"x":1526947200000,"y":33},{"x":1527033600000,"y":33},{"x":1527120000000,"y":33},{"x":1527206400000,"y":33},{"x":1527292800000,"y":33},{"x":1527379200000,"y":33},{"x":1527465600000,"y":33},{"x":1527552000000,"y":33},{"x":1527638400000,"y":33},{"x":1527724800000,"y":33},{"x":1527811200000,"y":33},{"x":1527897600000,"y":33},{"x":1527984000000,"y":33},{"x":1528070400000,"y":33},{"x":1528156800000,"y":33},{"x":1528243200000,"y":33},{"x":1528329600000,"y":33},{"x":1528416000000,"y":33},{"x":1528502400000,"y":33},{"x":1528588800000,"y":33},{"x":1528675200000,"y":33},{"x":1528761600000,"y":33},{"x":1528848000000,"y":33},{"x":1528934400000,"y":33},{"x":1529020800000,"y":33},{"x":1529107200000,"y":33},{"x":1529193600000,"y":33},{"x":1529280000000,"y":33},{"x":1529366400000,"y":33},{"x":1529452800000,"y":33},{"x":1529539200000,"y":33},{"x":1529625600000,"y":33},{"x":1529712000000,"y":33},{"x":1529798400000,"y":33},{"x":1529884800000,"y":33},{"x":1529971200000,"y":33},{"x":1530057600000,"y":33},{"x":1530144000000,"y":33},{"x":1530230400000,"y":33},{"x":1530316800000,"y":33},{"x":1530403200000,"y":33},{"x":1530489600000,"y":33},{"x":1530576000000,"y":33},{"x":1530662400000,"y":33},{"x":1530748800000,"y":33},{"x":1530835200000,"y":33},{"x":1530921600000,"y":33},{"x":1531008000000,"y":33},{"x":1531094400000,"y":33},{"x":1531180800000,"y":33},{"x":1531267200000,"y":33},{"x":1531353600000,"y":33},{"x":1531440000000,"y":33},{"x":1531526400000,"y":33},{"x":1531612800000,"y":33},{"x":1531699200000,"y":33},{"x":1531785600000,"y":33},{"x":1531872000000,"y":33},{"x":1531958400000,"y":33},{"x":1532044800000,"y":33},{"x":1532131200000,"y":33},{"x":1532217600000,"y":33},{"x":1532304000000,"y":33},{"x":1532390400000,"y":33},{"x":1532476800000,"y":33},{"x":1532563200000,"y":33},{"x":1532649600000,"y":33},{"x":1532736000000,"y":33},{"x":1532822400000,"y":33},{"x":1532908800000,"y":33},{"x":1532995200000,"y":33},{"x":1533081600000,"y":33},{"x":1533168000000,"y":33},{"x":1533254400000,"y":33},{"x":1533340800000,"y":33},{"x":1533427200000,"y":33},{"x":1533513600000,"y":33},{"x":1533600000000,"y":33},{"x":1533686400000,"y":33},{"x":1533772800000,"y":33},{"x":1533859200000,"y":33},{"x":1533945600000,"y":33},{"x":1534032000000,"y":33},{"x":1534118400000,"y":33},{"x":1534204800000,"y":33},{"x":1534291200000,"y":33},{"x":1534377600000,"y":33},{"x":1534464000000,"y":33},{"x":1534550400000,"y":33},{"x":1534636800000,"y":33},{"x":1534723200000,"y":33},{"x":1534809600000,"y":33},{"x":1534896000000,"y":33},{"x":1534982400000,"y":33},{"x":1535068800000,"y":33},{"x":1535155200000,"y":33},{"x":1535241600000,"y":33},{"x":1535328000000,"y":33},{"x":1535414400000,"y":33},{"x":1535500800000,"y":33},{"x":1535587200000,"y":33},{"x":1535673600000,"y":33},{"x":1535760000000,"y":33},{"x":1535846400000,"y":33},{"x":1535932800000,"y":33},{"x":1536019200000,"y":33},{"x":1536105600000,"y":33},{"x":1536192000000,"y":33},{"x":1536278400000,"y":33},{"x":1536364800000,"y":33},{"x":1536451200000,"y":33},{"x":1536537600000,"y":33},{"x":1536624000000,"y":33},{"x":1536710400000,"y":33},{"x":1536796800000,"y":33},{"x":1536883200000,"y":33},{"x":1536969600000,"y":33},{"x":1537056000000,"y":33},{"x":1537142400000,"y":33},{"x":1537228800000,"y":33},{"x":1537315200000,"y":33},{"x":1537401600000,"y":33},{"x":1537488000000,"y":33},{"x":1537574400000,"y":33},{"x":1537660800000,"y":33},{"x":1537747200000,"y":33},{"x":1537833600000,"y":33},{"x":1537920000000,"y":33},{"x":1538006400000,"y":33},{"x":1538092800000,"y":33},{"x":1538179200000,"y":33},{"x":1538265600000,"y":33},{"x":1538352000000,"y":33},{"x":1538438400000,"y":33},{"x":1538524800000,"y":33},{"x":1538611200000,"y":33},{"x":1538697600000,"y":33},{"x":1538784000000,"y":33},{"x":1538870400000,"y":33},{"x":1538956800000,"y":33},{"x":1539043200000,"y":33},{"x":1539129600000,"y":33},{"x":1539216000000,"y":33},{"x":1539302400000,"y":33},{"x":1539388800000,"y":33},{"x":1539475200000,"y":33},{"x":1539561600000,"y":33},{"x":1539648000000,"y":33},{"x":1539734400000,"y":33},{"x":1539820800000,"y":33},{"x":1539907200000,"y":33},{"x":1539993600000,"y":33},{"x":1540080000000,"y":33},{"x":1540166400000,"y":33},{"x":1540252800000,"y":33},{"x":1540339200000,"y":33},{"x":1540425600000,"y":33},{"x":1540512000000,"y":33},{"x":1540598400000,"y":33},{"x":1540684800000,"y":33},{"x":1540771200000,"y":33},{"x":1540857600000,"y":33},{"x":1540944000000,"y":33},{"x":1541030400000,"y":33},{"x":1541116800000,"y":33},{"x":1541203200000,"y":33},{"x":1541289600000,"y":33},{"x":1541376000000,"y":33},{"x":1541462400000,"y":33},{"x":1541548800000,"y":33},{"x":1541635200000,"y":33},{"x":1541721600000,"y":33},{"x":1541808000000,"y":33},{"x":1541894400000,"y":33},{"x":1541980800000,"y":33},{"x":1542067200000,"y":33},{"x":1542153600000,"y":33},{"x":1542240000000,"y":33},{"x":1542326400000,"y":33},{"x":1542412800000,"y":33},{"x":1542499200000,"y":33},{"x":1542585600000,"y":33},{"x":1542672000000,"y":33},{"x":1542758400000,"y":33},{"x":1542844800000,"y":33},{"x":1542931200000,"y":33},{"x":1543017600000,"y":33},{"x":1543104000000,"y":33},{"x":1543190400000,"y":33},{"x":1543276800000,"y":33},{"x":1543363200000,"y":33},{"x":1543449600000,"y":33},{"x":1543536000000,"y":33},{"x":1543622400000,"y":33},{"x":1543708800000,"y":33},{"x":1543795200000,"y":33},{"x":1543881600000,"y":33},{"x":1543968000000,"y":33},{"x":1544054400000,"y":33},{"x":1544140800000,"y":33},{"x":1544227200000,"y":33},{"x":1544313600000,"y":33},{"x":1544400000000,"y":33},{"x":1544486400000,"y":33},{"x":1544572800000,"y":33},{"x":1544659200000,"y":33},{"x":1544745600000,"y":33},{"x":1544832000000,"y":33},{"x":1544918400000,"y":33},{"x":1545004800000,"y":33},{"x":1545091200000,"y":33},{"x":1545177600000,"y":33},{"x":1545264000000,"y":33},{"x":1545350400000,"y":33},{"x":1545436800000,"y":33},{"x":1545523200000,"y":33},{"x":1545609600000,"y":33},{"x":1545696000000,"y":33},{"x":1545782400000,"y":33},{"x":1545868800000,"y":33},{"x":1545955200000,"y":33},{"x":1546041600000,"y":33},{"x":1546128000000,"y":33},{"x":1546214400000,"y":33},{"x":1546300800000,"y":33},{"x":1546387200000,"y":33},{"x":1546473600000,"y":33},{"x":1546560000000,"y":33},{"x":1546646400000,"y":33},{"x":1546732800000,"y":33},{"x":1546819200000,"y":33},{"x":1546905600000,"y":33},{"x":1546992000000,"y":33},{"x":1547078400000,"y":33},{"x":1547164800000,"y":33},{"x":1547251200000,"y":33},{"x":1547337600000,"y":33},{"x":1547424000000,"y":33},{"x":1547510400000,"y":33},{"x":1547596800000,"y":33},{"x":1547683200000,"y":33},{"x":1547769600000,"y":33},{"x":1547856000000,"y":33},{"x":1547942400000,"y":33},{"x":1548028800000,"y":33},{"x":1548115200000,"y":33},{"x":1548201600000,"y":33},{"x":1548288000000,"y":33},{"x":1548374400000,"y":33},{"x":1548460800000,"y":33},{"x":1548547200000,"y":33},{"x":1548633600000,"y":33},{"x":1548720000000,"y":33},{"x":1548806400000,"y":33},{"x":1548892800000,"y":33},{"x":1548979200000,"y":33},{"x":1549065600000,"y":33},{"x":1549152000000,"y":33},{"x":1549238400000,"y":33},{"x":1549324800000,"y":33},{"x":1549411200000,"y":33},{"x":1549497600000,"y":33},{"x":1549584000000,"y":33},{"x":1549670400000,"y":33},{"x":1549756800000,"y":33},{"x":1549843200000,"y":33},{"x":1549929600000,"y":33},{"x":1550016000000,"y":33},{"x":1550102400000,"y":33},{"x":1550188800000,"y":33},{"x":1550275200000,"y":33},{"x":1550361600000,"y":33},{"x":1550448000000,"y":33},{"x":1550534400000,"y":33},{"x":1550620800000,"y":33},{"x":1550707200000,"y":33},{"x":1550793600000,"y":33},{"x":1550880000000,"y":33},{"x":1550966400000,"y":33},{"x":1551052800000,"y":33},{"x":1551139200000,"y":33},{"x":1551225600000,"y":33},{"x":1551312000000,"y":33},{"x":1551398400000,"y":33},{"x":1551484800000,"y":33},{"x":1551571200000,"y":33},{"x":1551657600000,"y":33},{"x":1551744000000,"y":33},{"x":1551830400000,"y":33},{"x":1551916800000,"y":33},{"x":1552003200000,"y":33},{"x":1552089600000,"y":33},{"x":1552176000000,"y":33},{"x":1552262400000,"y":33},{"x":1552348800000,"y":33},{"x":1552435200000,"y":33},{"x":1552521600000,"y":33},{"x":1552608000000,"y":33},{"x":1552694400000,"y":33},{"x":1552780800000,"y":33},{"x":1552867200000,"y":33},{"x":1552953600000,"y":33},{"x":1553040000000,"y":33},{"x":1553126400000,"y":33},{"x":1553212800000,"y":33},{"x":1553299200000,"y":33},{"x":1553385600000,"y":33},{"x":1553472000000,"y":33},{"x":1553558400000,"y":33},{"x":1553644800000,"y":33},{"x":1553731200000,"y":33},{"x":1553817600000,"y":33},{"x":1553904000000,"y":33},{"x":1553990400000,"y":33},{"x":1554076800000,"y":33},{"x":1554163200000,"y":33},{"x":1554249600000,"y":33},{"x":1554336000000,"y":33},{"x":1554422400000,"y":33},{"x":1554508800000,"y":33},{"x":1554595200000,"y":33},{"x":1554681600000,"y":33},{"x":1554768000000,"y":33},{"x":1554854400000,"y":33},{"x":1554940800000,"y":33},{"x":1555027200000,"y":33},{"x":1555113600000,"y":33},{"x":1555200000000,"y":33},{"x":1555286400000,"y":33},{"x":1555372800000,"y":33},{"x":1555459200000,"y":33},{"x":1555545600000,"y":33},{"x":1555632000000,"y":33},{"x":1555718400000,"y":33},{"x":1555804800000,"y":33},{"x":1555891200000,"y":33},{"x":1555977600000,"y":33},{"x":1556064000000,"y":33},{"x":1556150400000,"y":33}],"actualEventsClosed":[{"x":1459296000000,"y":0},{"x":1459382400000,"y":0},{"x":1459468800000,"y":0},{"x":1459555200000,"y":0},{"x":1459641600000,"y":0},{"x":1459728000000,"y":0},{"x":1459814400000,"y":0},{"x":1459900800000,"y":0},{"x":1459987200000,"y":0},{"x":1460073600000,"y":0},{"x":1460160000000,"y":0},{"x":1460246400000,"y":0},{"x":1460332800000,"y":0},{"x":1460419200000,"y":0},{"x":1460505600000,"y":0},{"x":1460592000000,"y":0},{"x":1460678400000,"y":0},{"x":1460764800000,"y":0},{"x":1460851200000,"y":0},{"x":1460937600000,"y":0},{"x":1461024000000,"y":0},{"x":1461110400000,"y":0},{"x":1461196800000,"y":0},{"x":1461283200000,"y":0},{"x":1461369600000,"y":0},{"x":1461456000000,"y":0},{"x":1461542400000,"y":0},{"x":1461628800000,"y":0},{"x":1461715200000,"y":0},{"x":1461801600000,"y":0},{"x":1461888000000,"y":1},{"x":1461974400000,"y":1},{"x":1462060800000,"y":1},{"x":1462147200000,"y":1},{"x":1462233600000,"y":1},{"x":1462320000000,"y":1},{"x":1462406400000,"y":1},{"x":1462492800000,"y":2},{"x":1462579200000,"y":2},{"x":1462665600000,"y":2},{"x":1462752000000,"y":2},{"x":1462838400000,"y":2},{"x":1462924800000,"y":2},{"x":1463011200000,"y":2},{"x":1463097600000,"y":2},{"x":1463184000000,"y":2},{"x":1463270400000,"y":2},{"x":1463356800000,"y":2},{"x":1463443200000,"y":2},{"x":1463529600000,"y":3},{"x":1463616000000,"y":3},{"x":1463702400000,"y":3},{"x":1463788800000,"y":3},{"x":1463875200000,"y":3},{"x":1463961600000,"y":3},{"x":1464048000000,"y":3},{"x":1464134400000,"y":3},{"x":1464220800000,"y":3},{"x":1464307200000,"y":3},{"x":1464393600000,"y":3},{"x":1464480000000,"y":3},{"x":1464566400000,"y":4},{"x":1464652800000,"y":5},{"x":1464739200000,"y":6},{"x":1464825600000,"y":6},{"x":1464912000000,"y":6},{"x":1464998400000,"y":6},{"x":1465084800000,"y":6},{"x":1465171200000,"y":6},{"x":1465257600000,"y":6},{"x":1465344000000,"y":6},{"x":1465430400000,"y":6},{"x":1465516800000,"y":6},{"x":1465603200000,"y":6},{"x":1465689600000,"y":6},{"x":1465776000000,"y":6},{"x":1465862400000,"y":6},{"x":1465948800000,"y":6},{"x":1466035200000,"y":6},{"x":1466121600000,"y":6},{"x":1466208000000,"y":6},{"x":1466294400000,"y":6},{"x":1466380800000,"y":6},{"x":1466467200000,"y":6},{"x":1466553600000,"y":6},{"x":1466640000000,"y":6},{"x":1466726400000,"y":6},{"x":1466812800000,"y":6},{"x":1466899200000,"y":6},{"x":1466985600000,"y":6},{"x":1467072000000,"y":6},{"x":1467158400000,"y":6},{"x":1467244800000,"y":6},{"x":1467331200000,"y":6},{"x":1467417600000,"y":6},{"x":1467504000000,"y":6},{"x":1467590400000,"y":7},{"x":1467676800000,"y":7},{"x":1467763200000,"y":7},{"x":1467849600000,"y":7},{"x":1467936000000,"y":8},{"x":1468022400000,"y":8},{"x":1468108800000,"y":8},{"x":1468195200000,"y":8},{"x":1468281600000,"y":8},{"x":1468368000000,"y":8},{"x":1468454400000,"y":8},{"x":1468540800000,"y":8},{"x":1468627200000,"y":8},{"x":1468713600000,"y":8},{"x":1468800000000,"y":9},{"x":1468886400000,"y":9},{"x":1468972800000,"y":9},{"x":1469059200000,"y":9},{"x":1469145600000,"y":9},{"x":1469232000000,"y":9},{"x":1469318400000,"y":9},{"x":1469404800000,"y":10},{"x":1469491200000,"y":10},{"x":1469577600000,"y":10},{"x":1469664000000,"y":10},{"x":1469750400000,"y":10},{"x":1469836800000,"y":10},{"x":1469923200000,"y":10},{"x":1470009600000,"y":10},{"x":1470096000000,"y":11},{"x":1470182400000,"y":11},{"x":1470268800000,"y":11},{"x":1470355200000,"y":11},{"x":1470441600000,"y":11},{"x":1470528000000,"y":12},{"x":1470614400000,"y":12},{"x":1470700800000,"y":12},{"x":1470787200000,"y":12},{"x":1470873600000,"y":12},{"x":1470960000000,"y":12},{"x":1471046400000,"y":12},{"x":1471132800000,"y":12},{"x":1471219200000,"y":12},{"x":1471305600000,"y":12},{"x":1471392000000,"y":12},{"x":1471478400000,"y":12},{"x":1471564800000,"y":12},{"x":1471651200000,"y":12},{"x":1471737600000,"y":12},{"x":1471824000000,"y":12},{"x":1471910400000,"y":12},{"x":1471996800000,"y":12},{"x":1472083200000,"y":12},{"x":1472169600000,"y":12},{"x":1472256000000,"y":12},{"x":1472342400000,"y":12},{"x":1472428800000,"y":12},{"x":1472515200000,"y":12},{"x":1472601600000,"y":12},{"x":1472688000000,"y":12},{"x":1472774400000,"y":12},{"x":1472860800000,"y":12},{"x":1472947200000,"y":12},{"x":1473033600000,"y":12},{"x":1473120000000,"y":12},{"x":1473206400000,"y":12},{"x":1473292800000,"y":12},{"x":1473379200000,"y":12},{"x":1473465600000,"y":12},{"x":1473552000000,"y":12},{"x":1473638400000,"y":12},{"x":1473724800000,"y":12},{"x":1473811200000,"y":12},{"x":1473897600000,"y":12},{"x":1473984000000,"y":12},{"x":1474070400000,"y":12},{"x":1474156800000,"y":12},{"x":1474243200000,"y":12},{"x":1474329600000,"y":12},{"x":1474416000000,"y":12},{"x":1474502400000,"y":12},{"x":1474588800000,"y":12},{"x":1474675200000,"y":12},{"x":1474761600000,"y":12},{"x":1474848000000,"y":12},{"x":1474934400000,"y":12},{"x":1475020800000,"y":12},{"x":1475107200000,"y":12},{"x":1475193600000,"y":12},{"x":1475280000000,"y":12},{"x":1475366400000,"y":12},{"x":1475452800000,"y":12},{"x":1475539200000,"y":12},{"x":1475625600000,"y":12},{"x":1475712000000,"y":12},{"x":1475798400000,"y":12},{"x":1475884800000,"y":12},{"x":1475971200000,"y":12},{"x":1476057600000,"y":12},{"x":1476144000000,"y":12},{"x":1476230400000,"y":12},{"x":1476316800000,"y":12},{"x":1476403200000,"y":12},{"x":1476489600000,"y":12},{"x":1476576000000,"y":12},{"x":1476662400000,"y":12},{"x":1476748800000,"y":12},{"x":1476835200000,"y":12},{"x":1476921600000,"y":12},{"x":1477008000000,"y":12},{"x":1477094400000,"y":12},{"x":1477180800000,"y":12},{"x":1477267200000,"y":12},{"x":1477353600000,"y":12},{"x":1477440000000,"y":12},{"x":1477526400000,"y":12},{"x":1477612800000,"y":12},{"x":1477699200000,"y":12},{"x":1477785600000,"y":12},{"x":1477872000000,"y":12},{"x":1477958400000,"y":12},{"x":1478044800000,"y":12},{"x":1478131200000,"y":12},{"x":1478217600000,"y":12},{"x":1478304000000,"y":12},{"x":1478390400000,"y":12},{"x":1478476800000,"y":12},{"x":1478563200000,"y":12},{"x":1478649600000,"y":12},{"x":1478736000000,"y":12},{"x":1478822400000,"y":12},{"x":1478908800000,"y":12},{"x":1478995200000,"y":12},{"x":1479081600000,"y":12},{"x":1479168000000,"y":12},{"x":1479254400000,"y":12},{"x":1479340800000,"y":12},{"x":1479427200000,"y":12},{"x":1479513600000,"y":12},{"x":1479600000000,"y":12},{"x":1479686400000,"y":12},{"x":1479772800000,"y":12},{"x":1479859200000,"y":12},{"x":1479945600000,"y":12},{"x":1480032000000,"y":12},{"x":1480118400000,"y":12},{"x":1480204800000,"y":12},{"x":1480291200000,"y":12},{"x":1480377600000,"y":12},{"x":1480464000000,"y":12},{"x":1480550400000,"y":12},{"x":1480636800000,"y":12},{"x":1480723200000,"y":12},{"x":1480809600000,"y":12},{"x":1480896000000,"y":12},{"x":1480982400000,"y":12},{"x":1481068800000,"y":12},{"x":1481155200000,"y":12},{"x":1481241600000,"y":12},{"x":1481328000000,"y":12},{"x":1481414400000,"y":12},{"x":1481500800000,"y":12},{"x":1481587200000,"y":12},{"x":1481673600000,"y":12},{"x":1481760000000,"y":12},{"x":1481846400000,"y":12},{"x":1481932800000,"y":12},{"x":1482019200000,"y":12},{"x":1482105600000,"y":12},{"x":1482192000000,"y":12},{"x":1482278400000,"y":12},{"x":1482364800000,"y":12},{"x":1482451200000,"y":12},{"x":1482537600000,"y":12},{"x":1482624000000,"y":12},{"x":1482710400000,"y":12},{"x":1482796800000,"y":12},{"x":1482883200000,"y":12},{"x":1482969600000,"y":12},{"x":1483056000000,"y":12},{"x":1483142400000,"y":12},{"x":1483228800000,"y":12},{"x":1483315200000,"y":12},{"x":1483401600000,"y":12},{"x":1483488000000,"y":12},{"x":1483574400000,"y":12},{"x":1483660800000,"y":12},{"x":1483747200000,"y":12},{"x":1483833600000,"y":12},{"x":1483920000000,"y":12},{"x":1484006400000,"y":12},{"x":1484092800000,"y":12},{"x":1484179200000,"y":12},{"x":1484265600000,"y":12},{"x":1484352000000,"y":12},{"x":1484438400000,"y":12},{"x":1484524800000,"y":12},{"x":1484611200000,"y":12},{"x":1484697600000,"y":12},{"x":1484784000000,"y":12},{"x":1484870400000,"y":12},{"x":1484956800000,"y":12},{"x":1485043200000,"y":12},{"x":1485129600000,"y":12},{"x":1485216000000,"y":12},{"x":1485302400000,"y":12},{"x":1485388800000,"y":12},{"x":1485475200000,"y":12},{"x":1485561600000,"y":12},{"x":1485648000000,"y":12},{"x":1485734400000,"y":12},{"x":1485820800000,"y":12},{"x":1485907200000,"y":12},{"x":1485993600000,"y":12},{"x":1486080000000,"y":12},{"x":1486166400000,"y":12},{"x":1486252800000,"y":12},{"x":1486339200000,"y":12},{"x":1486425600000,"y":12},{"x":1486512000000,"y":12},{"x":1486598400000,"y":12},{"x":1486684800000,"y":12},{"x":1486771200000,"y":12},{"x":1486857600000,"y":12},{"x":1486944000000,"y":12},{"x":1487030400000,"y":12},{"x":1487116800000,"y":12},{"x":1487203200000,"y":12},{"x":1487289600000,"y":12},{"x":1487376000000,"y":12},{"x":1487462400000,"y":12},{"x":1487548800000,"y":12},{"x":1487635200000,"y":12},{"x":1487721600000,"y":12},{"x":1487808000000,"y":12},{"x":1487894400000,"y":12},{"x":1487980800000,"y":12},{"x":1488067200000,"y":12},{"x":1488153600000,"y":12},{"x":1488240000000,"y":12},{"x":1488326400000,"y":12},{"x":1488412800000,"y":12},{"x":1488499200000,"y":12},{"x":1488585600000,"y":12},{"x":1488672000000,"y":12},{"x":1488758400000,"y":12},{"x":1488844800000,"y":12},{"x":1488931200000,"y":12},{"x":1489017600000,"y":12},{"x":1489104000000,"y":12},{"x":1489190400000,"y":12},{"x":1489276800000,"y":12},{"x":1489363200000,"y":12},{"x":1489449600000,"y":12},{"x":1489536000000,"y":12},{"x":1489622400000,"y":12},{"x":1489708800000,"y":12},{"x":1489795200000,"y":12},{"x":1489881600000,"y":12},{"x":1489968000000,"y":12},{"x":1490054400000,"y":12},{"x":1490140800000,"y":12},{"x":1490227200000,"y":12},{"x":1490313600000,"y":12},{"x":1490400000000,"y":12},{"x":1490486400000,"y":12},{"x":1490572800000,"y":12},{"x":1490659200000,"y":12},{"x":1490745600000,"y":12},{"x":1490832000000,"y":12},{"x":1490918400000,"y":12},{"x":1491004800000,"y":12},{"x":1491091200000,"y":12},{"x":1491177600000,"y":12},{"x":1491264000000,"y":12},{"x":1491350400000,"y":12},{"x":1491436800000,"y":12},{"x":1491523200000,"y":12},{"x":1491609600000,"y":12},{"x":1491696000000,"y":12},{"x":1491782400000,"y":12},{"x":1491868800000,"y":12},{"x":1491955200000,"y":12},{"x":1492041600000,"y":12},{"x":1492128000000,"y":12},{"x":1492214400000,"y":12},{"x":1492300800000,"y":12},{"x":1492387200000,"y":12},{"x":1492473600000,"y":12},{"x":1492560000000,"y":12},{"x":1492646400000,"y":12},{"x":1492732800000,"y":12},{"x":1492819200000,"y":12},{"x":1492905600000,"y":12},{"x":1492992000000,"y":12},{"x":1493078400000,"y":12},{"x":1493164800000,"y":12},{"x":1493251200000,"y":12},{"x":1493337600000,"y":12},{"x":1493424000000,"y":12},{"x":1493510400000,"y":12},{"x":1493596800000,"y":12},{"x":1493683200000,"y":12},{"x":1493769600000,"y":12},{"x":1493856000000,"y":12},{"x":1493942400000,"y":12},{"x":1494028800000,"y":12},{"x":1494115200000,"y":12},{"x":1494201600000,"y":12},{"x":1494288000000,"y":12},{"x":1494374400000,"y":12},{"x":1494460800000,"y":12},{"x":1494547200000,"y":12},{"x":1494633600000,"y":12},{"x":1494720000000,"y":12},{"x":1494806400000,"y":12},{"x":1494892800000,"y":12},{"x":1494979200000,"y":12},{"x":1495065600000,"y":12},{"x":1495152000000,"y":12},{"x":1495238400000,"y":12},{"x":1495324800000,"y":12},{"x":1495411200000,"y":12},{"x":1495497600000,"y":12},{"x":1495584000000,"y":12},{"x":1495670400000,"y":12},{"x":1495756800000,"y":12},{"x":1495843200000,"y":12},{"x":1495929600000,"y":12},{"x":1496016000000,"y":12},{"x":1496102400000,"y":12},{"x":1496188800000,"y":12},{"x":1496275200000,"y":12},{"x":1496361600000,"y":12},{"x":1496448000000,"y":12},{"x":1496534400000,"y":12},{"x":1496620800000,"y":12},{"x":1496707200000,"y":12},{"x":1496793600000,"y":12},{"x":1496880000000,"y":12},{"x":1496966400000,"y":12},{"x":1497052800000,"y":12},{"x":1497139200000,"y":12},{"x":1497225600000,"y":12},{"x":1497312000000,"y":12},{"x":1497398400000,"y":12},{"x":1497484800000,"y":12},{"x":1497571200000,"y":12},{"x":1497657600000,"y":12},{"x":1497744000000,"y":12},{"x":1497830400000,"y":12},{"x":1497916800000,"y":12},{"x":1498003200000,"y":12},{"x":1498089600000,"y":12},{"x":1498176000000,"y":12},{"x":1498262400000,"y":12},{"x":1498348800000,"y":12},{"x":1498435200000,"y":12},{"x":1498521600000,"y":12},{"x":1498608000000,"y":12},{"x":1498694400000,"y":12},{"x":1498780800000,"y":12},{"x":1498867200000,"y":12},{"x":1498953600000,"y":12},{"x":1499040000000,"y":12},{"x":1499126400000,"y":12},{"x":1499212800000,"y":12},{"x":1499299200000,"y":12},{"x":1499385600000,"y":12},{"x":1499472000000,"y":12},{"x":1499558400000,"y":12},{"x":1499644800000,"y":12},{"x":1499731200000,"y":12},{"x":1499817600000,"y":12},{"x":1499904000000,"y":12},{"x":1499990400000,"y":12},{"x":1500076800000,"y":12},{"x":1500163200000,"y":12},{"x":1500249600000,"y":12},{"x":1500336000000,"y":12},{"x":1500422400000,"y":12},{"x":1500508800000,"y":12},{"x":1500595200000,"y":12},{"x":1500681600000,"y":12},{"x":1500768000000,"y":12},{"x":1500854400000,"y":12},{"x":1500940800000,"y":12},{"x":1501027200000,"y":12},{"x":1501113600000,"y":12},{"x":1501200000000,"y":12},{"x":1501286400000,"y":12},{"x":1501372800000,"y":12},{"x":1501459200000,"y":12},{"x":1501545600000,"y":12},{"x":1501632000000,"y":12},{"x":1501718400000,"y":12},{"x":1501804800000,"y":12},{"x":1501891200000,"y":12},{"x":1501977600000,"y":12},{"x":1502064000000,"y":12},{"x":1502150400000,"y":12},{"x":1502236800000,"y":12},{"x":1502323200000,"y":12},{"x":1502409600000,"y":12},{"x":1502496000000,"y":12},{"x":1502582400000,"y":12},{"x":1502668800000,"y":12},{"x":1502755200000,"y":12},{"x":1502841600000,"y":12},{"x":1502928000000,"y":12},{"x":1503014400000,"y":12},{"x":1503100800000,"y":12},{"x":1503187200000,"y":12},{"x":1503273600000,"y":12},{"x":1503360000000,"y":12},{"x":1503446400000,"y":12},{"x":1503532800000,"y":12},{"x":1503619200000,"y":12},{"x":1503705600000,"y":12},{"x":1503792000000,"y":12},{"x":1503878400000,"y":12},{"x":1503964800000,"y":12},{"x":1504051200000,"y":12},{"x":1504137600000,"y":12},{"x":1504224000000,"y":12},{"x":1504310400000,"y":12},{"x":1504396800000,"y":12},{"x":1504483200000,"y":12},{"x":1504569600000,"y":12},{"x":1504656000000,"y":12},{"x":1504742400000,"y":12},{"x":1504828800000,"y":12},{"x":1504915200000,"y":12},{"x":1505001600000,"y":12},{"x":1505088000000,"y":12},{"x":1505174400000,"y":12},{"x":1505260800000,"y":12},{"x":1505347200000,"y":12},{"x":1505433600000,"y":12},{"x":1505520000000,"y":12},{"x":1505606400000,"y":12},{"x":1505692800000,"y":12},{"x":1505779200000,"y":12},{"x":1505865600000,"y":12},{"x":1505952000000,"y":12},{"x":1506038400000,"y":12},{"x":1506124800000,"y":12},{"x":1506211200000,"y":12},{"x":1506297600000,"y":12},{"x":1506384000000,"y":12},{"x":1506470400000,"y":12},{"x":1506556800000,"y":12},{"x":1506643200000,"y":12},{"x":1506729600000,"y":12},{"x":1506816000000,"y":12},{"x":1506902400000,"y":12},{"x":1506988800000,"y":12},{"x":1507075200000,"y":12},{"x":1507161600000,"y":12},{"x":1507248000000,"y":12},{"x":1507334400000,"y":12},{"x":1507420800000,"y":12},{"x":1507507200000,"y":12},{"x":1507593600000,"y":12},{"x":1507680000000,"y":12},{"x":1507766400000,"y":12},{"x":1507852800000,"y":12},{"x":1507939200000,"y":12},{"x":1508025600000,"y":12},{"x":1508112000000,"y":12},{"x":1508198400000,"y":12},{"x":1508284800000,"y":12},{"x":1508371200000,"y":12},{"x":1508457600000,"y":12},{"x":1508544000000,"y":12},{"x":1508630400000,"y":12},{"x":1508716800000,"y":12},{"x":1508803200000,"y":12},{"x":1508889600000,"y":12},{"x":1508976000000,"y":12},{"x":1509062400000,"y":12},{"x":1509148800000,"y":12},{"x":1509235200000,"y":12},{"x":1509321600000,"y":12},{"x":1509408000000,"y":12},{"x":1509494400000,"y":12},{"x":1509580800000,"y":12},{"x":1509667200000,"y":12},{"x":1509753600000,"y":12},{"x":1509840000000,"y":12},{"x":1509926400000,"y":12},{"x":1510012800000,"y":12},{"x":1510099200000,"y":12},{"x":1510185600000,"y":12},{"x":1510272000000,"y":12},{"x":1510358400000,"y":12},{"x":1510444800000,"y":12},{"x":1510531200000,"y":12},{"x":1510617600000,"y":12},{"x":1510704000000,"y":12},{"x":1510790400000,"y":12},{"x":1510876800000,"y":12},{"x":1510963200000,"y":12},{"x":1511049600000,"y":12},{"x":1511136000000,"y":12},{"x":1511222400000,"y":12},{"x":1511308800000,"y":12},{"x":1511395200000,"y":12},{"x":1511481600000,"y":12},{"x":1511568000000,"y":12},{"x":1511654400000,"y":12},{"x":1511740800000,"y":12},{"x":1511827200000,"y":12},{"x":1511913600000,"y":12},{"x":1512000000000,"y":12},{"x":1512086400000,"y":12},{"x":1512172800000,"y":12},{"x":1512259200000,"y":12},{"x":1512345600000,"y":12},{"x":1512432000000,"y":12},{"x":1512518400000,"y":12},{"x":1512604800000,"y":12},{"x":1512691200000,"y":12},{"x":1512777600000,"y":12},{"x":1512864000000,"y":12},{"x":1512950400000,"y":12},{"x":1513036800000,"y":12},{"x":1513123200000,"y":12},{"x":1513209600000,"y":12},{"x":1513296000000,"y":12},{"x":1513382400000,"y":12},{"x":1513468800000,"y":12},{"x":1513555200000,"y":12},{"x":1513641600000,"y":12},{"x":1513728000000,"y":12},{"x":1513814400000,"y":12},{"x":1513900800000,"y":12},{"x":1513987200000,"y":12},{"x":1514073600000,"y":12},{"x":1514160000000,"y":12},{"x":1514246400000,"y":12},{"x":1514332800000,"y":12},{"x":1514419200000,"y":12},{"x":1514505600000,"y":12},{"x":1514592000000,"y":12},{"x":1514678400000,"y":12},{"x":1514764800000,"y":12},{"x":1514851200000,"y":12},{"x":1514937600000,"y":12},{"x":1515024000000,"y":12},{"x":1515110400000,"y":12},{"x":1515196800000,"y":12},{"x":1515283200000,"y":12},{"x":1515369600000,"y":12},{"x":1515456000000,"y":12},{"x":1515542400000,"y":12},{"x":1515628800000,"y":12},{"x":1515715200000,"y":12},{"x":1515801600000,"y":12},{"x":1515888000000,"y":12},{"x":1515974400000,"y":12},{"x":1516060800000,"y":12},{"x":1516147200000,"y":12},{"x":1516233600000,"y":12},{"x":1516320000000,"y":12},{"x":1516406400000,"y":12},{"x":1516492800000,"y":12},{"x":1516579200000,"y":12},{"x":1516665600000,"y":12},{"x":1516752000000,"y":12},{"x":1516838400000,"y":12},{"x":1516924800000,"y":12},{"x":1517011200000,"y":12},{"x":1517097600000,"y":12},{"x":1517184000000,"y":12},{"x":1517270400000,"y":12},{"x":1517356800000,"y":12},{"x":1517443200000,"y":12},{"x":1517529600000,"y":12},{"x":1517616000000,"y":12},{"x":1517702400000,"y":12},{"x":1517788800000,"y":12},{"x":1517875200000,"y":12},{"x":1517961600000,"y":12},{"x":1518048000000,"y":12},{"x":1518134400000,"y":12},{"x":1518220800000,"y":12},{"x":1518307200000,"y":12},{"x":1518393600000,"y":12},{"x":1518480000000,"y":12},{"x":1518566400000,"y":12},{"x":1518652800000,"y":12},{"x":1518739200000,"y":12},{"x":1518825600000,"y":12},{"x":1518912000000,"y":12},{"x":1518998400000,"y":12},{"x":1519084800000,"y":12},{"x":1519171200000,"y":12},{"x":1519257600000,"y":12},{"x":1519344000000,"y":12},{"x":1519430400000,"y":12},{"x":1519516800000,"y":12},{"x":1519603200000,"y":12},{"x":1519689600000,"y":12},{"x":1519776000000,"y":12},{"x":1519862400000,"y":12},{"x":1519948800000,"y":12},{"x":1520035200000,"y":12},{"x":1520121600000,"y":12},{"x":1520208000000,"y":12},{"x":1520294400000,"y":12},{"x":1520380800000,"y":12},{"x":1520467200000,"y":12},{"x":1520553600000,"y":12},{"x":1520640000000,"y":12},{"x":1520726400000,"y":12},{"x":1520812800000,"y":12},{"x":1520899200000,"y":12},{"x":1520985600000,"y":12},{"x":1521072000000,"y":12},{"x":1521158400000,"y":12},{"x":1521244800000,"y":12},{"x":1521331200000,"y":12},{"x":1521417600000,"y":12},{"x":1521504000000,"y":12},{"x":1521590400000,"y":12},{"x":1521676800000,"y":12},{"x":1521763200000,"y":12},{"x":1521849600000,"y":12},{"x":1521936000000,"y":12},{"x":1522022400000,"y":12},{"x":1522108800000,"y":12},{"x":1522195200000,"y":12},{"x":1522281600000,"y":12},{"x":1522368000000,"y":12},{"x":1522454400000,"y":12},{"x":1522540800000,"y":12},{"x":1522627200000,"y":12},{"x":1522713600000,"y":12},{"x":1522800000000,"y":12},{"x":1522886400000,"y":12},{"x":1522972800000,"y":12},{"x":1523059200000,"y":12},{"x":1523145600000,"y":12},{"x":1523232000000,"y":12},{"x":1523318400000,"y":12},{"x":1523404800000,"y":12},{"x":1523491200000,"y":12},{"x":1523577600000,"y":12},{"x":1523664000000,"y":12},{"x":1523750400000,"y":12},{"x":1523836800000,"y":12},{"x":1523923200000,"y":12},{"x":1524009600000,"y":12},{"x":1524096000000,"y":12},{"x":1524182400000,"y":12},{"x":1524268800000,"y":12},{"x":1524355200000,"y":12},{"x":1524441600000,"y":12},{"x":1524528000000,"y":12},{"x":1524614400000,"y":12},{"x":1524700800000,"y":12},{"x":1524787200000,"y":12},{"x":1524873600000,"y":12},{"x":1524960000000,"y":12},{"x":1525046400000,"y":12},{"x":1525132800000,"y":12},{"x":1525219200000,"y":12},{"x":1525305600000,"y":12},{"x":1525392000000,"y":12},{"x":1525478400000,"y":12},{"x":1525564800000,"y":12},{"x":1525651200000,"y":12},{"x":1525737600000,"y":12},{"x":1525824000000,"y":12},{"x":1525910400000,"y":12},{"x":1525996800000,"y":12},{"x":1526083200000,"y":12},{"x":1526169600000,"y":12},{"x":1526256000000,"y":12},{"x":1526342400000,"y":12},{"x":1526428800000,"y":12},{"x":1526515200000,"y":12},{"x":1526601600000,"y":12},{"x":1526688000000,"y":12},{"x":1526774400000,"y":12},{"x":1526860800000,"y":12},{"x":1526947200000,"y":12},{"x":1527033600000,"y":12},{"x":1527120000000,"y":12},{"x":1527206400000,"y":12},{"x":1527292800000,"y":12},{"x":1527379200000,"y":12},{"x":1527465600000,"y":12},{"x":1527552000000,"y":12},{"x":1527638400000,"y":12},{"x":1527724800000,"y":12},{"x":1527811200000,"y":12},{"x":1527897600000,"y":12},{"x":1527984000000,"y":12},{"x":1528070400000,"y":12},{"x":1528156800000,"y":12},{"x":1528243200000,"y":12},{"x":1528329600000,"y":12},{"x":1528416000000,"y":12},{"x":1528502400000,"y":12},{"x":1528588800000,"y":12},{"x":1528675200000,"y":12},{"x":1528761600000,"y":12},{"x":1528848000000,"y":13},{"x":1528934400000,"y":13},{"x":1529020800000,"y":13},{"x":1529107200000,"y":13},{"x":1529193600000,"y":13},{"x":1529280000000,"y":13},{"x":1529366400000,"y":13},{"x":1529452800000,"y":13},{"x":1529539200000,"y":13},{"x":1529625600000,"y":13},{"x":1529712000000,"y":13},{"x":1529798400000,"y":13},{"x":1529884800000,"y":13},{"x":1529971200000,"y":13},{"x":1530057600000,"y":13},{"x":1530144000000,"y":13},{"x":1530230400000,"y":13},{"x":1530316800000,"y":13},{"x":1530403200000,"y":13},{"x":1530489600000,"y":13},{"x":1530576000000,"y":13},{"x":1530662400000,"y":13},{"x":1530748800000,"y":13},{"x":1530835200000,"y":13},{"x":1530921600000,"y":13},{"x":1531008000000,"y":13},{"x":1531094400000,"y":13},{"x":1531180800000,"y":13},{"x":1531267200000,"y":13},{"x":1531353600000,"y":13},{"x":1531440000000,"y":13},{"x":1531526400000,"y":13},{"x":1531612800000,"y":13},{"x":1531699200000,"y":13},{"x":1531785600000,"y":13},{"x":1531872000000,"y":13},{"x":1531958400000,"y":13},{"x":1532044800000,"y":13},{"x":1532131200000,"y":13},{"x":1532217600000,"y":13},{"x":1532304000000,"y":13},{"x":1532390400000,"y":13},{"x":1532476800000,"y":13},{"x":1532563200000,"y":13},{"x":1532649600000,"y":13},{"x":1532736000000,"y":13},{"x":1532822400000,"y":13},{"x":1532908800000,"y":13},{"x":1532995200000,"y":13},{"x":1533081600000,"y":13},{"x":1533168000000,"y":13},{"x":1533254400000,"y":13},{"x":1533340800000,"y":13},{"x":1533427200000,"y":13},{"x":1533513600000,"y":13},{"x":1533600000000,"y":13},{"x":1533686400000,"y":13},{"x":1533772800000,"y":13},{"x":1533859200000,"y":13},{"x":1533945600000,"y":13},{"x":1534032000000,"y":13},{"x":1534118400000,"y":13},{"x":1534204800000,"y":13},{"x":1534291200000,"y":13},{"x":1534377600000,"y":13},{"x":1534464000000,"y":13},{"x":1534550400000,"y":13},{"x":1534636800000,"y":13},{"x":1534723200000,"y":13},{"x":1534809600000,"y":13},{"x":1534896000000,"y":13},{"x":1534982400000,"y":13},{"x":1535068800000,"y":13},{"x":1535155200000,"y":13},{"x":1535241600000,"y":13},{"x":1535328000000,"y":13},{"x":1535414400000,"y":13},{"x":1535500800000,"y":13},{"x":1535587200000,"y":13},{"x":1535673600000,"y":13},{"x":1535760000000,"y":13},{"x":1535846400000,"y":13},{"x":1535932800000,"y":13},{"x":1536019200000,"y":13},{"x":1536105600000,"y":13},{"x":1536192000000,"y":13},{"x":1536278400000,"y":13},{"x":1536364800000,"y":13},{"x":1536451200000,"y":13},{"x":1536537600000,"y":13},{"x":1536624000000,"y":13},{"x":1536710400000,"y":13},{"x":1536796800000,"y":13},{"x":1536883200000,"y":13},{"x":1536969600000,"y":13},{"x":1537056000000,"y":13},{"x":1537142400000,"y":13},{"x":1537228800000,"y":13},{"x":1537315200000,"y":13},{"x":1537401600000,"y":13},{"x":1537488000000,"y":13},{"x":1537574400000,"y":13},{"x":1537660800000,"y":13},{"x":1537747200000,"y":13},{"x":1537833600000,"y":13},{"x":1537920000000,"y":13},{"x":1538006400000,"y":13},{"x":1538092800000,"y":13},{"x":1538179200000,"y":13},{"x":1538265600000,"y":13},{"x":1538352000000,"y":13},{"x":1538438400000,"y":13},{"x":1538524800000,"y":13},{"x":1538611200000,"y":13},{"x":1538697600000,"y":13},{"x":1538784000000,"y":13},{"x":1538870400000,"y":13},{"x":1538956800000,"y":13},{"x":1539043200000,"y":13},{"x":1539129600000,"y":13},{"x":1539216000000,"y":13},{"x":1539302400000,"y":13},{"x":1539388800000,"y":13},{"x":1539475200000,"y":13},{"x":1539561600000,"y":13},{"x":1539648000000,"y":13},{"x":1539734400000,"y":13},{"x":1539820800000,"y":13},{"x":1539907200000,"y":13},{"x":1539993600000,"y":13},{"x":1540080000000,"y":13},{"x":1540166400000,"y":13},{"x":1540252800000,"y":13},{"x":1540339200000,"y":13},{"x":1540425600000,"y":13},{"x":1540512000000,"y":13},{"x":1540598400000,"y":13},{"x":1540684800000,"y":13},{"x":1540771200000,"y":13},{"x":1540857600000,"y":13},{"x":1540944000000,"y":13},{"x":1541030400000,"y":13},{"x":1541116800000,"y":13},{"x":1541203200000,"y":13},{"x":1541289600000,"y":13},{"x":1541376000000,"y":13},{"x":1541462400000,"y":13},{"x":1541548800000,"y":13},{"x":1541635200000,"y":13},{"x":1541721600000,"y":13},{"x":1541808000000,"y":13},{"x":1541894400000,"y":13},{"x":1541980800000,"y":13},{"x":1542067200000,"y":13},{"x":1542153600000,"y":13},{"x":1542240000000,"y":13},{"x":1542326400000,"y":13},{"x":1542412800000,"y":13},{"x":1542499200000,"y":13},{"x":1542585600000,"y":13},{"x":1542672000000,"y":13},{"x":1542758400000,"y":13},{"x":1542844800000,"y":13},{"x":1542931200000,"y":13},{"x":1543017600000,"y":13},{"x":1543104000000,"y":13},{"x":1543190400000,"y":13},{"x":1543276800000,"y":13},{"x":1543363200000,"y":13},{"x":1543449600000,"y":13},{"x":1543536000000,"y":13},{"x":1543622400000,"y":13},{"x":1543708800000,"y":13},{"x":1543795200000,"y":13},{"x":1543881600000,"y":13},{"x":1543968000000,"y":13},{"x":1544054400000,"y":13},{"x":1544140800000,"y":13},{"x":1544227200000,"y":13},{"x":1544313600000,"y":13},{"x":1544400000000,"y":13},{"x":1544486400000,"y":13},{"x":1544572800000,"y":13},{"x":1544659200000,"y":13},{"x":1544745600000,"y":13},{"x":1544832000000,"y":13},{"x":1544918400000,"y":13},{"x":1545004800000,"y":13},{"x":1545091200000,"y":13},{"x":1545177600000,"y":13},{"x":1545264000000,"y":13},{"x":1545350400000,"y":13},{"x":1545436800000,"y":13},{"x":1545523200000,"y":13},{"x":1545609600000,"y":13},{"x":1545696000000,"y":13},{"x":1545782400000,"y":13},{"x":1545868800000,"y":13},{"x":1545955200000,"y":13},{"x":1546041600000,"y":13},{"x":1546128000000,"y":13},{"x":1546214400000,"y":13},{"x":1546300800000,"y":13},{"x":1546387200000,"y":13},{"x":1546473600000,"y":13},{"x":1546560000000,"y":13},{"x":1546646400000,"y":13},{"x":1546732800000,"y":13},{"x":1546819200000,"y":13},{"x":1546905600000,"y":13},{"x":1546992000000,"y":13},{"x":1547078400000,"y":13},{"x":1547164800000,"y":13},{"x":1547251200000,"y":13},{"x":1547337600000,"y":13},{"x":1547424000000,"y":13},{"x":1547510400000,"y":13},{"x":1547596800000,"y":13},{"x":1547683200000,"y":13},{"x":1547769600000,"y":13},{"x":1547856000000,"y":13},{"x":1547942400000,"y":13},{"x":1548028800000,"y":13},{"x":1548115200000,"y":13},{"x":1548201600000,"y":13},{"x":1548288000000,"y":13},{"x":1548374400000,"y":13},{"x":1548460800000,"y":13},{"x":1548547200000,"y":13},{"x":1548633600000,"y":13},{"x":1548720000000,"y":13},{"x":1548806400000,"y":13},{"x":1548892800000,"y":13},{"x":1548979200000,"y":13},{"x":1549065600000,"y":13},{"x":1549152000000,"y":13},{"x":1549238400000,"y":13},{"x":1549324800000,"y":13},{"x":1549411200000,"y":13},{"x":1549497600000,"y":13},{"x":1549584000000,"y":13},{"x":1549670400000,"y":13},{"x":1549756800000,"y":13},{"x":1549843200000,"y":13},{"x":1549929600000,"y":13},{"x":1550016000000,"y":13},{"x":1550102400000,"y":13},{"x":1550188800000,"y":13},{"x":1550275200000,"y":13},{"x":1550361600000,"y":13},{"x":1550448000000,"y":13},{"x":1550534400000,"y":13},{"x":1550620800000,"y":13},{"x":1550707200000,"y":13},{"x":1550793600000,"y":13},{"x":1550880000000,"y":13},{"x":1550966400000,"y":13},{"x":1551052800000,"y":13},{"x":1551139200000,"y":13},{"x":1551225600000,"y":13},{"x":1551312000000,"y":13},{"x":1551398400000,"y":13},{"x":1551484800000,"y":13},{"x":1551571200000,"y":13},{"x":1551657600000,"y":13},{"x":1551744000000,"y":13},{"x":1551830400000,"y":13},{"x":1551916800000,"y":13},{"x":1552003200000,"y":13},{"x":1552089600000,"y":13},{"x":1552176000000,"y":13},{"x":1552262400000,"y":13},{"x":1552348800000,"y":13},{"x":1552435200000,"y":13},{"x":1552521600000,"y":13},{"x":1552608000000,"y":13},{"x":1552694400000,"y":13},{"x":1552780800000,"y":13},{"x":1552867200000,"y":13},{"x":1552953600000,"y":13},{"x":1553040000000,"y":13},{"x":1553126400000,"y":13},{"x":1553212800000,"y":13},{"x":1553299200000,"y":13},{"x":1553385600000,"y":13},{"x":1553472000000,"y":13},{"x":1553558400000,"y":13},{"x":1553644800000,"y":13},{"x":1553731200000,"y":13},{"x":1553817600000,"y":13},{"x":1553904000000,"y":13},{"x":1553990400000,"y":13},{"x":1554076800000,"y":13},{"x":1554163200000,"y":13},{"x":1554249600000,"y":13},{"x":1554336000000,"y":13},{"x":1554422400000,"y":13},{"x":1554508800000,"y":13},{"x":1554595200000,"y":13},{"x":1554681600000,"y":13},{"x":1554768000000,"y":13},{"x":1554854400000,"y":13},{"x":1554940800000,"y":13},{"x":1555027200000,"y":13},{"x":1555113600000,"y":13},{"x":1555200000000,"y":13},{"x":1555286400000,"y":13},{"x":1555372800000,"y":13},{"x":1555459200000,"y":13},{"x":1555545600000,"y":13},{"x":1555632000000,"y":13},{"x":1555718400000,"y":13},{"x":1555804800000,"y":13},{"x":1555891200000,"y":13},{"x":1555977600000,"y":13},{"x":1556064000000,"y":13},{"x":1556150400000,"y":13}]};               
        var ndxTotalEvents = crossfilter(burnupData.totalEvents);
        var ndxScheduledEventsClosed = crossfilter(burnupData.scheduledEventsClosed);
        var ndxBaselineEventsClosed = crossfilter(burnupData.baselineEventsClosed);
        var ndxActualEventsClosed = crossfilter(burnupData.actualEventsClosed);
        burnupChart  = new dc.compositeChart("#risk-burnup-chart");
        chart = document.querySelector("#risk-burnup-chart");
        var dateDimTotalEvents = ndxTotalEvents.dimension(function(d) {return d.x;});
        var dateDimScheduledEvents = ndxScheduledEventsClosed.dimension(function(d) {return d.x;});
        var dateDimBaselineEvents = ndxBaselineEventsClosed.dimension(function(d) {return d.x;});
        var dateDimActualEvents = ndxActualEventsClosed.dimension(function(d) {return d.x;});
        var totalEvents = dateDimTotalEvents.group().reduceSum(function(d) {return d.y || 0;});
        var scheduledEvents = dateDimScheduledEvents.group().reduceSum(function(d) {return d.y || 0;});
        var baselineEvents = dateDimBaselineEvents.group().reduceSum(function(d) {return d.y || 0;});
        var actualEvents = dateDimActualEvents.group().reduceSum(function(d) {return d.y || 0;});        
        var minDate = new Date("03/30/2016");
        var maxDate = new Date("02/29/2020");

        
        heightBurnupChart = Math.floor(chart.offsetHeight) 
             - 2*parseInt(window.getComputedStyle(chart, null).getPropertyValue('padding-top'));
        widthBurnupChart = Math.floor(parseFloat(window.getComputedStyle(chart, null).width))
             - 2*parseInt(window.getComputedStyle(chart, null).getPropertyValue('padding-top'));    
  
        burnupChart
        .width(widthBurnupChart)
        .height(heightBurnupChart)  
        .x(d3.scaleTime().domain([minDate, maxDate]))           
        .compose([
            dc.lineChart(burnupChart).colors(["#DD0000"]).dimension(dateDimTotalEvents).x(d3.scaleTime().domain([minDate,maxDate]).nice()).group(totalEvents, "Total"),
            dc.lineChart(burnupChart).colors(["#FFFF00"]).dimension(dateDimScheduledEvents).x(d3.scaleTime().domain([minDate,maxDate]).nice()).group(scheduledEvents, "Scheduled"),
            dc.lineChart(burnupChart).colors(["orange"]).dimension(dateDimBaselineEvents).x(d3.scaleTime().domain([minDate,maxDate]).nice()).group(baselineEvents, "Baseline"),
            dc.lineChart(burnupChart).colors(["#00B050"]).dimension(dateDimActualEvents).x(d3.scaleTime().domain([minDate,maxDate]).nice()).group(actualEvents, "Actual")
        ])
        .elasticX(true)
        .brushOn(false)
        .legend(dc.legend().x(60).y(10).itemHeight(13).gap(5))
        .yAxisLabel("Number of Events")
        .transitionDuration(250)
        ;   
    }
 
    $scope.renderCharts =  function (){
         
         //Set Up Chart
         
         $scope.openRiskCharts();    
         $scope.riskStatusByMonth();
         $scope.riskCategoryChart();
         $scope.avgCycleTime();
         $scope.riskMatrixChart();
         $scope.eventBurnupChart();
         
         //Apply Risizing
         
         apply_resizing(riskChart, widthRiskChart, heightRiskChart, resize, 'risk-chart', true);
         apply_resizing(monthlyRiskStatus, widthStatusChart, heightStatusChart, resize, 'risk-status-by-month', false);
         apply_resizing(categoryChart, widthCategoryChart, heightCategoryChart, resize, 'risk-category-chart', false);
         // apply_resizing(cycleChart, widthCycleChart, heightCycleChart, resize, 'risk-cycle-chart', false);
         apply_resizing(burnupChart, widthBurnupChart, heightBurnupChart, resize, 'risk-burnup-chart', false);
        
         //Render Chart
        
         riskChart.render();
         monthlyRiskStatus.render();
         categoryChart.render();
        // cycleChart.render();
         burnupChart.render();
    }
    
    
    
 
}]);
 