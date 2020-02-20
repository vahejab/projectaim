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
    
    var widthCycleChart;
    var heightCycleChart;
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

            var ndx = crossfilter(data)

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
 
    $scope.renderCharts =  function (){
         $scope.openRiskCharts();    
         $scope.riskStatusByMonth();
         $scope.riskCategoryChart();
         $scope.avgCycleTime();
         $scope.riskMatrixChart();
         
         apply_resizing(riskChart, widthRiskChart, heightRiskChart, resize, 'risk-chart', true);
         apply_resizing(monthlyRiskStatus, widthStatusChart, heightStatusChart, resize, 'risk-status-by-month', false);
         apply_resizing(categoryChart, widthCategoryChart, heightCategoryChart, resize, 'risk-category-chart', false);
        // apply_resizing(cycleChart, widthCycleChart, heightCycleChart, resize, 'risk-cycle-chart', false);
         
         
         
         riskChart.render();
         monthlyRiskStatus.render();
         categoryChart.render();
        // cycleChart.render();
    }
    
    
    
 
}]);
 