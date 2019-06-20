angular.module('Risk').directive('config', ['$timeout', ConfigElement]);

function ConfigElement($timeout){
      var directive = {
            restrict: 'A',
            link: linkFn,
            controller: ConfigController
      }
      
      function linkFn(scope, elem, attrs){
            var attr = attrs.config;
            var type = attrs.type;
            var width = attrs.width;
            var height = attrs.height;
            var maxlength = attrs.hasOwnProperty('maxlength')? attrs.maxlength: null;  
            var options = attrs.hasOwnProperty('options')? attrs.options : null;
            var view;
            var evt = {};
            if (type == "level")
                view = "text";
            else
                view = type;
                
            scope.ctrl.DOMops.setValidationServiceObj(scope.ctrl.ValidationService);
            scope.ctrl.DOMops.setValue('risk', scope.ctrl.risk);
            scope.ctrl.DOMops.setValue('riskMatrix', scope.ctrl.riskMatrix);   
            scope.ctrl.DOMops.setValue('risklevels', scope.ctrl.risklevels);
            
            scope.ctrl.ValidationService.setValue('risk', scope.ctrl.risk);
            scope.ctrl.ValidationService.setDOMobj(scope.ctrl.DOMops);
            
            
            var config = 
            {
                view: view,     
                responsive: true,
                width: width,
                height: height
            };
            
            if (view == "text" || view == "textarea")
            {
                config.on = {
                    "onTimedKeyPress": function(){  
                        var obj = this.eventSource || this; 
                        code = this.getValue();                                                 
                        if (type == "level")
                            scope.ctrl.DOMops.assignRiskLevel(obj); 
                    },
                    "onBlur": function(){  
                        var obj = this.eventSource || this;  
                        code = this.getValue();
                        scope.ctrl.ValidationService.getTextValueAndValidate(code, scope.ctrl, obj, attr); 
                    }
                }
                config.value = scope.ctrl.risk[attr];
            }
            else if (view == "datatable")      
            {         
                config.columns = [
                    { id:"id",           header:"#",              width: 25,   editor: "text"},
                    { id:"title",        header:"Event Title",    width:200,   editor: "text"},
                    { id:"eventowner",   header:"Event Owner",    width:200,   editor: "richselect"},
                    { id:"actualdate",   header:"Actual Date",    width: 85,   editor: "datepicker"},
                    { id:"scheduledate", header:"Schedule Date",  width: 85,   editor: "datepicker"},
                    { id:"risklevel",    header:"Risk Level",     width: 50},
                    { id:"likelihood",   header:"Like",           width: 50,   editor: "text"},
                    { id:"technical",    header:"Tech",           width: 50,   editor: "text"},
                    { id:"schedule",     header:"Schd",           width: 50,   editor: "text"},
                    { id:"cost",         header:"Cost",           width: 50,   editor: "text"},
                ]
                
                for (idx = 0; idx < config.columns.length; idx++)
                    config.columns[idx].editor = "text";    
            
                //config.editaction = "custom";
                config.editable = true;
                config.autowidth = true;
                config.autoheight = true;
                config.editaction = "click";
                
                config.data = [
                    {id: 1, title: "Risk Identified", eventowner: "Jabagchourian, Vahe", actualdate: "7/28/2011", risklevel: "M 3-4", likelihood: 3, technical: 3, schedule: 4, cost: 3},
                    {id: 2, title: "Risk Identified", eventowner: "Jabagchourian, Vahe", actualdate: "7/28/2011", risklevel: "M 3-4", likelihood: 3, technical: 3, schedule: 4, cost: 3},
                    {id: 3, title: "Risk Identified", eventowner: "Jabagchourian, Vahe", actualdate: "7/28/2011", risklevel: "M 3-4", likelihood: 3, technical: 3, schedule: 4, cost: 3},
                    {id: 4, title: "Risk Identified", eventowner: "Jabagchourian, Vahe", actualdate: "7/28/2011", risklevel: "M 3-4", likelihood: 3, technical: 3, schedule: 4, cost: 3},
                    {id: 5, title: "Risk Identified", eventowner: "Jabagchourian, Vahe", actualdate: "7/28/2011", risklevel: "M 3-4", likelihood: 3, technical: 3, schedule: 4, cost: 3},
                    {id: 6, title: "Risk Identified", eventowner: "Jabagchourian, Vahe", actualdate: "7/28/2011", risklevel: "M 3-4", likelihood: 3, technical: 3, schedule: 4, cost: 3},
                ]
                
                config.css = "custom";
            
                config.on = {
                    "onItemClick": function(id) {
                        this.editRow(id);
                    }
                }
            }
            else if (view == "richselect")
            {
                config.value = scope.ctrl.risk[attr];
                config.options = scope.ctrl[options];
                
                config.on =  {
                    "onChange": function(){
                        var obj = this.eventSource || this; 
                        scope.ctrl.getItemValueAndValidate(obj, scope.ctrl, attr);
                        config.value = obj.getValue();
                    }
                }
            }
            else if (view = "datepicker")
            {
                config.timepicker = false;
                //multiselect: true,
                config.suggest = {
                    type:"calendar", 
                    body:{
                        minDate:(new Date()).setDate(new Date())
                    }                                         
                }      
                config.on = {
                    "onChange": function(){
                        var obj = this.eventSource || this; 
                        scope.ctrl.getDateValueAndValidate(obj, scope.ctrl, attr);
                        config.value = obj.getValue();
                    }
                }   
            }
              
            if (maxlength)
                config.attributes = {maxlength : maxlength};
            config.done = true;
            scope.ctrl.config[attr] = config;
      }
       
      return directive;     
}
                    

function ConfigController($scope, $element, $attrs){
    $scope.ctrl.config[$attrs.config] = {done: false};
}       