var common = angular.module('Common', []);
var refresh = false;
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
    
    commonFunctions.getStatus = function(date1, date2){
       return (date1 > date2)? 'Late': 'Timely';    
    }
    
    commonFunctions.formatDate = function(date){
        return date.getFullYear() + "-" + ((date.getMonth() < 10)? '0'+date.getMonth(): date.getMonth()) 
                                  + "-" + ((date.getDate() < 10)? '0'+date.getDate(): date.getDate());
    }
    
    commonFunctions.getDateValueAndValidate = function(obj, model, field){
        if (!obj.data || !obj.data.value){  
             return;
        }

        var value = obj.data.value.toString();
        var year = obj.data.value.getFullYear();
        var month = obj.data.value.getMonth();
        var day = obj.data.value.getDay();
        model[field] = year + "-" + ((month < 10)? '0'+month: month) + "-" + ((day < 10)? '0'+day: day);       
    }               
                                
    commonFunctions.getItemValueAndValidate = function(obj, model, field){
        if (!obj.data || !obj.data.value){
             //scope.validate(field);   
             return;
        }
        model[field] = obj.data.value;          
    }
    
    commonFunctions.getTextValueAndValidate = function(obj, model, field){
        if (!obj.data || !obj.data.value){
             //scope.validate(field);   
             return;
        }
        model[field] = obj.data.value; 
    }

    
    return commonFunctions;
});

angular.module('Home', []);
angular.module('Action', [/*'datatables', 'datatables.scroller', *//*'ngMaterial',*/ 'webix', 'ngResource', 'Common']);        
angular.module('Risk',   [/*'datatables', 'datatables.scroller', */'ngResource', 'Common']);          


angular.module('Action').directive('initData', function(){                     
      return {
            restrict: 'E',
            link: function (scope, element, attrs) {
                  scope.init().then(function(){
                    
                    webix.ready(function(){
                        webix.ui.fullScreen();
                    });
                    
                    function getSelectConfig(attr, options)
                    {
                        var config = 
                        {
                            view: "richselect",
                            value: scope.actionitem[attr], 
                            options: options,
                            on: {
                                //"onChange": function(){var obj = this.eventSource || this; getValueAndValidate(obj, 'assignor')},
                                "onChange": function(){var obj = this.eventSource || this; scope.getItemValueAndValidate(obj, scope.actionitem, attr)}
                                //"onBlur": function(){scope.validate(scope.actionitem.assingor, 'assignor')}
                            },
                            responsive: true,
                            width: "200",
                            height: "30",
                            validate: webix.rules.isSelected,
                            required: true
                        };
                        return config;
                    }
                    
                    function getTextConfig(attr)
                    {
                        var config = 
                        {
                            view:"text",
                            value: scope.actionitem[attr],      
                            on: {
                                "onChange": function(){var obj = this.eventSource || this; scope.getTextValueAndValidate(obj, scope.actionitem, attr)},
                                //"onBlur": function(){scope.validate(scope.actionitem.title, 'title')}
                            },
                           
                            responsive: true,
                            width: "550",
                            height: "30",
                            validate: webix.rules.isNotEmpty,
                            required: true
                        };
                        return config;
                    }
                    
                    function getTextareaConfig(attr)
                    {
                        var config = 
                        {
                            view:"textarea",
                            value: scope.actionitem[attr],
                            on: {                                  
                                "onChange": function(){var obj = this.eventSource || this; scope.getTextValueAndValidate(obj, scope.actionitem, attr)},
                                //"onBlur": function(){scope.validate(scope.actionitem.actionitemstatement, 'actionitemstatement')}
                            },
                            responsive: true,
                            width: "550",
                            height: "97",
                            validate: webix.rules.isSelected,
                            required: true
                        };
                        return config;
                    }
                    
                    function getDatepickerConfig(attr)
                    {
                        var config = 
                        {
                            view: "datepicker", 
                            value: scope.actionitem[attr], 
                            timepicker: false,
                            //multiselect: true,
                            suggest:{
                                type:"calendar", 
                                body:{
                                    minDate:new Date()
                                }
                            },      
                            on: {
                                "onChange": function(){var obj = this.eventSource || this; scope.getDateValueAndValidate(obj, scope.actionitem, attr)},
                                //"onBlur": function(){scope.validate(scope.actionitem.duedate, 'duedate')}  
                            },   
                            responsive: true,
                            width: "200",                       
                            height: "30",
                            validate: webix.rules.isSelected,
                            required: true
                        };
                        return config;
                    }       
                    
                    scope.assignorConfig = getSelectConfig('assignor', scope.users);
                    
                    scope.approverConfig = getSelectConfig('approver', scope.users);
                    
                    scope.ownerConfig = getSelectConfig('owner', scope.users);
                    
                    scope.altownerConfig = getSelectConfig('altowner', scope.users);
                    
                    scope.critConfig = getSelectConfig('criticality', scope.critlevels);
                    
                    scope.titleConfig = getTextConfig('title');
                    
                    scope.closurecriteriaConfig = getTextareaConfig('closurecriteria');
                    
                    scope.statementConfig = getTextareaConfig('actionitemstatement');
                   
                    scope.duedateConfig = getDatepickerConfig('duedate');     
                    
                    scope.assigneddateConfig = getDatepickerConfig('assigneddate');
                     
                    scope.ecdConfig = getDatepickerConfig('ecd');
                    
                    scope.completiondateConfig = getDatepickerConfig('completiondate');
                   
                    scope.closeddateConfig = getDatepickerConfig('closeddate');
                    
                    scope.approvercommentsConfig = getTextareaConfig('approvercomments');
                    
                    scope.ownernotesConfig = getTextareaConfig('ownernotes');
                        
            });
      }
}            
});







var app = angular.module('Main', ['ui.router', 'oc.lazyLoad',/* 'datatables',*/ 'ngResource', 'ngSanitize', /*'ngMaterial'*/ 'webix', 'Common', 'Home', 'Action', 'Risk']);
  
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