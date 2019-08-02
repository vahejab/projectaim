var common = angular.module('Common', []);
var refresh = false;
var formcheck = false;

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

angular.module('Home', []);
angular.module('Action', ['ngResource', 'Common']);
angular.module('Risk',   ['ngResource', 'ngAnimate', 'Common']);

var app = angular.module('Main', ['ui.router', 'oc.lazyLoad', 'ngResource', 'ngSanitize', 'Common', 'Home', 'Action', 'Risk']);
  
app.controller('MainController',  ['CommonService', '$scope', '$window', '$state', function(CommonService, $scope, $window, $state){
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