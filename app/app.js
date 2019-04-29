var common = angular.module('Common', []);

common.service("CommonService", function() {
    var commonFunctions = {};
    commonFunctions.initTableScrolling = function(){
        $('div.tablebody').on("scroll", function(){  //activate when #center scrolls
            var left = $('div.tablebody').scrollLeft();  //save #center position to var left
            $('div.tableheader').scrollLeft(left);        //set #top to var left
        });
    }                                    
    
    commonFunctions.getScrollBarWidth = function(){
            var outer = document.createElement("div");
            outer.style.visibility = "hidden";
            outer.style.width = "100px";
            outer.style.msOverflowStyle = "scrollbar"; // needed for WinJS apps

            document.body.appendChild(outer);

            var widthNoScroll = outer.offsetWidth;
            // force scrollbars
            outer.style.overflow = "scroll";

            // add innerdiv
            var inner = document.createElement("div");
            inner.style.width = "100%";
            outer.appendChild(inner);        

            var widthWithScroll = inner.offsetWidth;

            // remove divs
            outer.parentNode.removeChild(outer);

            commonFunctions.scrollBarWidth =  widthNoScroll - widthWithScroll;
    }
    
    commonFunctions.setMargin = function(elem, factor){
         commonFunctions.getScrollBarWidth();
         $(elem).attr("style", "margin-right: " + factor*commonFunctions.scrollBarWidth + "px !important");
    }

    commonFunctions.assignHeaderWidths = function(){
        var headers = $('div.tableheader table thead th');
        var cells = $('div.tablebody table tbody tr:nth-child(1) td');
        for (var idx in headers){
            var cellwidth = $(cells[idx]).width();
            $(headers[idx]).attr('style', 'width: ' + cellwidth + "px !important");
        }
    }
    
    commonFunctions.formatCriticality = function(value){ 
        switch(Number(value)){
            case 1:
                return 'red';
            case 2:
                return 'yellow';
            case 3:
                return 'green'; 
        }
    }
    
    commonFunctions.getStatus = function(date1, date2){
       return (date1 > date2)? 'Late': 'Timely';    
    }

    return commonFunctions;
});

angular.module('Home', []);
angular.module('Action', [/*'datatables', 'datatables.scroller', */'ngMaterial', 'ngResource', 'Common']);          
angular.module('Risk',   [/*'datatables', 'datatables.scroller', */'ngResource', 'Common']);          

var app = angular.module('Main', ['ui.router', 'oc.lazyLoad',/* 'datatables',*/ 'ngResource', 'ngSanitize', 'Common', 'Home', 'Action', 'Risk']);
  
app.controller('MainController',  ['CommonService', '$scope', function(CommonService, $scope){
    $scope.setMargin = function(elem, factor){
         CommonService.setMargin(elem, factor);
    }

    $scope.assignHeaderWidths = function(){
        CommonService.assignHeaderWidths();
    }
    
    var devicePixelRatio = window.devicePixelRatio;
    var flag = 1;
    setInterval(function(){
                                     
        if (flag && window.devicePixelRatio == .25){
            $scope.setMargin($('html'), 0);
            $scope.setMargin($('div.tableheader'), 2);
            $scope.setMargin($('div.tablebody'), 1);
            $scope.assignHeaderWidths();
            flag = 0
        }  
        if(window.devicePixelRatio != devicePixelRatio){
            flag = 1;
            devicePixelRatio = window.devicePixelRatio;
            //there was a resize and so then we set margin in this case
            $scope.setMargin($('html'), 0);
            $scope.setMargin($('div.tableheader'), 2);
            $scope.setMargin($('div.tablebody'), 1);
            //Set header width to ensure they will match on any zoom
            $scope.assignHeaderWidths();
        }
    }, 1);   
}]);

app.config(['$ocLazyLoadProvider', '$stateProvider', '$urlRouterProvider', /*'$mdThemingProvider', */function($ocLazyLoadProvider, $stateProvider, $urlRouterProvider, $mdThemingProvider) {
   /* $mdThemingProvider.theme('custom')
                      .primaryPalette('blue')
                      .accentPalette('blue-grey');
    $mdThemingProvider.setDefaultTheme('custom')
    $mdThemingProvider.alwaysWatchTheme(true);
    */
    configRoutes($stateProvider, $urlRouterProvider, $ocLazyLoadProvider);
    
}]);