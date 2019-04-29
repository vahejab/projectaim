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
    
    var devicePixelRatio = window.devicePixelRatio;
    setInterval(function(){                               
        if(window.devicePixelRatio != devicePixelRatio){
            devicePixelRatio = window.devicePixelRatio;
            //there was a resize and so twe set margin in this case
            $scope.setMargin($('html'), 0);
            $scope.setMargin($('div.tableheader'), 2);
            $scope.setMargin($('div.tablebody'), 1);
        }
    }, 0);   
}]).directive('setMarginDirective', ['$window', function ($window) {
     return {
        link: link,
        restrict: 'E'           
     };

     function link(scope, element, attrs){
       
     }    
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