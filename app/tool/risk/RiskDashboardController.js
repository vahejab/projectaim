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
                    resize($scope.riskChart, $element.width, $element.height, resize, 'risk-chart');
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
    
           
    // these map directly to gridsterItem options
    $scope.standardItems = [{
        id: "risk-chart",
        sizeX: 2,
        sizeY: 1,
        row: 0,
        col: 0
    }, {
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

    $scope.renderOpenChart = function(fill){
          $scope.openChart = new dc.starChart('#risk-chart');
          $scope.openChart.render(); 
    }
    
    $scope.openRiskLevels = function(){
    
        $scope.riskChart = new dc.pieChart('#risk-chart', 'risk');
         
 
         $scope.ndx = crossfilter([{dd: new Date(), volume: 35}, {dd: new Date(), volume: 6}, {dd: new Date(), volume: 8}]);
         $scope.quarter = $scope.ndx.dimension(d => {
            
            const month = d.dd.getMonth();
            if (month <= 2) {
                return 'Q1';
            } else if (month > 2 && month <= 5) {
                return 'Q2';
            } else if (month > 5 && month <= 8) {
                return 'Q3';
            } else {
                return 'Q4';
            }
        });            
        $scope.quarterGroup = $scope.quarter.group().reduceSum(d => d.volume);   
    
       // $timeout(()=>{
       var riskchart = document.getElementById('risk-chart'); 
       height = Math.floor(riskchart.offsetHeight) 
              - 2*parseInt(window.getComputedStyle(riskchart, null).getPropertyValue('padding-top'));
       width = Math.floor(parseFloat(window.getComputedStyle(riskchart, null).width)) 
       - 2*parseInt(window.getComputedStyle(riskchart, null).getPropertyValue('padding-top'));          
                
       $scope.riskChart /* dc.pieChart('#quarter-chart', 'chartGroup') */
            .width(width)
            .height(height)
            .radius(Math.round(height/2.0))
            .innerRadius(Math.round(height/4.0))
            .dimension($scope.quarter)
            .group($scope.quarterGroup)
            .transitionDuration(250);
       // });

       $scope.riskChart.render();
    }
    
    $scope.renderCharts =  function (){
         $scope.openRiskLevels();
         $scope.renderOpenChart('blue');  
         dc.renderAll();
        // apply_resizing($scope.riskChart, width, height, resize, 'risk-chart');
    }
}]);
 