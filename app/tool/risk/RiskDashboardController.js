angular.module('Risk').controller('RiskDashboardController', ['$http', '$resource', '$scope', '$state', '$window', '$timeout', '$interval', '$sce', 'CommonService', 'DOMops', 'ValidationService', function($http, $resource, $scope, $state, $window, $timeout, $interval, $sce, CommonService, DOMops, ValidationService){
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
    // these map directly to gridsterItem options
    $scope.standardItems = [{
        id: "risk-chart",
        sizeX: 2,
        sizeY: 1,
        row: 0,
        col: 0
    }, {
        id: "risk-status-by-month",
        sizeX: 4,
        sizeY: 1,
        row: 0,
        col: 2
    },{
        sizeX: 2,
        sizeY: 1,
        row: 1,
        col: 0
    },{
        sizeX: 2,
        sizeY: 1,
        row: 1,
        col: 2
    },{
        sizeX: 2,
        sizeY: 1,
        row: 1,
        col: 4
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
               
         var riskchart = document.getElementById('risk-chart'); 
      
      
         heightRiskChart = Math.floor(riskchart.offsetHeight) 
          - 2*parseInt(window.getComputedStyle(riskchart, null).getPropertyValue('padding-top'));
         widthRiskChart =  55
            + Math.floor(parseFloat(window.getComputedStyle(riskchart, null).width))
          - 2*parseInt(window.getComputedStyle(riskchart, null).getPropertyValue('padding-top'));    
    
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
            console.log(ygroup.all())

            function sel_stack(i) {
            return function(d) {
              return d.value[i];
            };}

            monthlyRiskStatus = new dc.barChart("#risk-status-by-month");


            var riskchart = document.getElementById('risk-status-by-month'); 
      
      
            heightStatusChart = Math.floor(riskchart.offsetHeight) 
             - 2*parseInt(window.getComputedStyle(riskchart, null).getPropertyValue('padding-top'));
            widthStatusChart = Math.floor(parseFloat(window.getComputedStyle(riskchart, null).width))
             - 2*parseInt(window.getComputedStyle(riskchart, null).getPropertyValue('padding-top'));    
       

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
 
    $scope.renderCharts =  function (){
         $scope.openRiskCharts();    
         $scope.riskStatusByMonth();
         
         apply_resizing(riskChart, widthRiskChart, heightRiskChart, resize, 'risk-chart', true);
         apply_resizing(monthlyRiskStatus, widthStatusChart, heightStatusChart, resize, 'risk-status-by-month', false);
    
         riskChart.render();
         monthlyRiskStatus.render();
    }
 
}]);
 