angular.module('Action').directive('initAction', function(){                     
      return {
            restrict: 'E',
            link: function (scope, element, attrs) {
                  scope.init().then(function(){
                    
                    webix.ready(function(){
                        webix.ui.fullScreen();
                    });
                    
                    function GetDate(date)
                    {
                        if (date != '' && date != null)
                            return new Date(date);    
                        return null;
                    }
                    
                    function getSelectConfig(attr, options)
                    {
                        var config = 
                        {
                            view: "richselect",
                            value: scope.actionitem[attr], 
                            options: options,
                            on: {
                                //"onChange": function(){var obj = this.eventSource || this; getValue(obj, 'assignor')},
                                "onChange": function(){var obj = this.eventSource || this; scope.getItemValueAndValidate(obj, scope, attr)}
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
                    
                    function getSelectTextAndValConfig(attr, attrid, options)
                    {
                        var config = 
                        {
                            view: "richselect",
                            value: scope.actionitem[attrid], 
                            options: options,
                            on: {
                                //"onChange": function(){var obj = this.eventSource || this; getValue(obj, 'assignor')},
                                "onChange": function(){ var obj = this.eventSource || this; scope.getItemValueAndValidate(obj, scope, attr);  scope.getItemId(obj, scope, attrid)}
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
                                "onChange": function(){var obj = this.eventSource || this; scope.getTextValueAndValidate(obj, scope, attr)},
                                //"onBlur": function(){scope.validate(scope.actionitem.title, 'title')}
                            },
                           
                            responsive: true,
                            width: "520",
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
                                "onChange": function(){var obj = this.eventSource || this; scope.getTextValueAndValidate(obj, scope, attr)},
                                //"onBlur": function(){scope.validate(scope.actionitem.actionitemstatement, 'actionitemstatement')}
                            },
                            responsive: true,
                            width: "520",
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
                            value: GetDate(scope.actionitem[attr]),
                            timepicker: false,
                            //multiselect: true,
                            suggest:{
                                type:"calendar", 
                                body:{
                                    minDate:(new Date()).setDate(new Date())
                                }                                         
                            },      
                            on: {
                                "onChange": function(){var obj = this.eventSource || this; scope.getDateValueAndValidate(obj, scope, attr)},
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
                    
                    scope.critConfig = getSelectTextAndValConfig('criticality', 'critlevel', scope.critlevels);
                    
                    scope.titleConfig = getTextConfig('actionitemtitle');
                    
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