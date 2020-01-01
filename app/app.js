var app;
var refresh = false;
var formcheck = false;
var common;
var jQuery;    



agGrid.initialiseAgGridWithAngular1(angular);
angular.module('Home', []);
angular.module('Action', ['ngResource', 'Common']);
angular.module('Risk', ['ngResource', 'ngAnimate', 'Common', 'agGrid', 'ui.select', 'ui.bootstrap', 'gridster']);

app = angular.module('Main', ['ui.router', 'oc.lazyLoad', 'agGrid', 'gridster', 'ngResource', 'ngSanitize', 'Common', 'Home', 'Action', 'Risk']);

app.controller('MainController',  function(){
     
});


app.config(['$ocLazyLoadProvider', '$stateProvider', '$urlRouterProvider', '$compileProvider', function($ocLazyLoadProvider, $stateProvider, $urlRouterProvider, $compileProvider/*, $mdThemingProvider*/) {

/* $mdThemingProvider.theme('custom')
              .primaryPalette('blue')
              .accentPalette('blue-grey');
$mdThemingProvider.setDefaultTheme('custom')
$mdThemingProvider.alwaysWatchTheme(true);
*/
configRoutes($stateProvider, $urlRouterProvider, $ocLazyLoadProvider);
$compileProvider.aHrefSanitizationWhitelist(/^\s*(https?|ftp|mailto|tel|file|blob):/);

}]);
common = angular.module('Common', []);
      
common.service("CommonService", function() {
    var commonFunctions = {};
    
    commonFunctions.offset = function(el) {
        var rect = el.getBoundingClientRect(),
        scrollLeft = window.pageXOffset || document.documentElement.scrollLeft,
        scrollTop = window.pageYOffset || document.documentElement.scrollTop;
        return { top: rect.top + scrollTop, left: rect.left + scrollLeft }
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
    
    commonFunctions.GetDate = function(date){
        if (date != '' && date != null)
            return new Date(date);    
        return null;
    }
        
    commonFunctions.getStatus = function(date1, date2){
       return (date1 > date2)? 'Late': 'On Time';    
    }
    
    commonFunctions.formatDate = function(date){
        return date.getFullYear() + "-" + ((date.getMonth() < 10)? '0'+date.getMonth(): date.getMonth()) 
                                  + "-" + ((date.getDate() < 10)? '0'+date.getDate(): date.getDate());
    }
    
    commonFunctions.dateValue = function(val){
        var year = val.getFullYear();
        var month = val.getMonth()+1;
        var day = val.getDate();
        dateValue =  year + "-" + ((month < 10)? '0'+month: month) + "-" + ((day < 10)? '0'+day: day);     
        return dateValue;
    }
    
    commonFunctions.getDateValue = function(obj, scope, type, field){
        if (!obj && !obj.getValue()){ 
             scope[type][field] = '';
             return;
        }

        if (obj.data && obj.data.value == ''){
            scope[type][field] = '';
            return;
        }             
        
        scope[type][field] = commonFunctions.dateValue(obj.data.value); 
    }              
                                
    commonFunctions.getItemValue = function(obj, scope, type, field){
        if (!obj && !obj.getValue()){
             scope[type][field] = '';   
             return;
        }
        scope[type][field] = obj.value || obj.data.value;          
    }
    
    commonFunctions.getItemId = function(obj, scope, type, field){
        if (!obj && !obj.getValue()){
             scope[type][field] = 0;  
             return;
        }
        scope[type][field] = obj.value || obj.data.value;         
    }
    
    commonFunctions.getTextValue = function(obj, scope, type, field){
        
        if (!obj && !obj.getValue()){
             scope[type][field] = '';
             return;
        }
        scope[type][field] = obj.getValue(); 
    }
    
    return commonFunctions;
});
   
   
   
    
    
/**
 * AngularJS default filter with the following expression:
 * "person in people | filter: {name: $select.search, age: $select.search}"
 * performs an AND between 'name: $select.search' and 'age: $select.search'.
 * We want to perform an OR.
 */
app.filter('propsFilter', function() {
  return function(items, props) {
    var out = [];

    if (angular.isArray(items)) {
      var keys = Object.keys(props);

      items.forEach(function(item) {
        var itemMatches = false;

        for (var i = 0; i < keys.length; i++) {
          var prop = keys[i];
          var text = props[prop].toLowerCase();
          if (item[prop].toString().toLowerCase().indexOf(text) !== -1) {
            itemMatches = true;
            break;
          }
        }

        if (itemMatches) {
          out.push(item);
        }
      });
    } else {
      // Let the output be the input untouched
      out = items;
    }

    return out;
  };
}); 
                  
   /* 
var require = {
        deps: [  
       // 'app/js/angularjs-1.7.8/angular',
        'app/js/angularAMD/src/angularAMD',
        'app/js/angularjs-1.7.8/angular-resource',
        'app/js/angularjs-1.7.8/angular-animate',
        'app/js/angularjs-1.7.8/angular-messages',
        'app/js/angularjs-1.7.8/angular-sanitize',
        'app/js/angularjs-1.7.8/angular-ui-router',
        'app/js/angularjs-1.7.8/statehelper',
        'app/js/ui-select/dist/select',
        'app/js/ocLazyLoad/ocLazyLoad',
        'app/js/text-encoder-lite/text-encoder-lite',
        'app/js/base64js/base64js.min',
        'app/js/ag-grid/dist/ag-grid-community',                       
        //'app/js/javascript-detect-element-resize/jquery.resize',
        'app/js/moment-2.3.1/moment.min', 
        'app/js/bootstrap-4.0.0/bootstrap',
        'app/js/ui-bootstrap-3.0.6/ui-bootstrap-tpls-3.0.6',
        'app/js/popper-1.12.9/popper',
        'app/js/d3js-4.4.0/d3',
        'app/js/dc.js-3.1.9/dc',
        'app/js/angular-dc/angular-dc',
        'app/js/crossfilter/crossfilter',
       // 'app/js/reductio/src/reductio',
        'app/js/lodash/lodash.min',
        'app/js/ag-grid/dist/ag-grid-community',
       //'app/route-config',
        'app/js/universe/src/universe']
};   
       */
           
       
define('def', [
        'app/js/angularAMD/src/angularAMD',
        'app/js/d3js-4.4.0/d3',
        'app/js/dc.js-3.1.9/dc',
        'app/js/crossfilter/crossfilter',
       // 'app/js/reductio/src/reductio',
        'app/js/lodash/lodash.min',
        'app/js/universe/src/universe'], function () {       
            return angularAMD.bootstrap(app);
});                           
