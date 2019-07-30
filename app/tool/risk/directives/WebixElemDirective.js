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
            
            var evt = attrs.event;

            var disabled = false;
            if (attrs.hasOwnProperty('enabled') && attrs.enabled == 'false')
                disabled = true;
            var maxlength = attrs.hasOwnProperty('maxlength')? attrs.maxlength: null;  
            var options = attrs.hasOwnProperty('options')? attrs.options : null;
            var view;
            
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
                height: height,
                disabled: disabled,
                id: attrs.id
            };
               
            if (view == "text" || view == "textarea")
            {
                config.on = {
                    "onTimedKeyPress": function(){  
                        var obj = this.eventSource || this; 
                        if (obj.data.value == "" && obj.getValue() == "")
                            return;
                        code = this.getValue();                                                 
                        scope.ctrl.ValidationService.getTextValueAndValidate(code, scope.ctrl, obj, attr);  
                        if (attrs.type == "level")
                        {
                            scope.ctrl.DOMops.evt[attrs.config] = code;
                            scope.ctrl.DOMops.assignRiskLevel(obj, attrs.evt);
                        }
                        if (evt != null) {
                            scope.ctrl.evt[evt].valid = scope.ctrl.ValidationService.evtValid(evt);
                            if (attrs.input && !isNaN(code))
                                scope.ctrl.event[evt][attrs.input] = parseInt(code);
                            else if (attrs.input && isNaN(code))
                                scope.ctrl.event[evt][attrs.input] = code;
                        }
                    },
                    "onAfterRender": function(){
                        var obj = this.eventSource || this; 
                        if (obj.data.value == "" && obj.getValue() == "")
                            return;
                        code = this.getValue();                                                 
                        if (attrs.type == "level")
                        {
                            scope.ctrl.DOMops.evt[attrs.config] = code;
                            scope.ctrl.DOMops.assignRiskLevel(obj, attrs.evt);
                        } 
                    }
                }
                if (attrs.type == "level" && attrs.category == "event")
                    config.value = scope.ctrl.evt[attr];
                else
                    config.value = scope.ctrl.risk[attr];
            }
            else if (view == "richselect")
            {
                config.value = scope.ctrl.risk[attr];
                config.options = scope.ctrl[options];
                config.editable = true;
                config.on =  {
                    "onChange": function(){    
                        var obj = this.eventSource || this;   
                        scope.ctrl.getItemValueAndValidate(obj, scope.ctrl, attr);
                        config.value = obj.getValue(); 
                        if (evt != null)
                        {
                            scope.ctrl.evt[evt].valid = scope.ctrl.ValidationService.evtValid(evt); 
                            if (attrs.input)  
                                scope.ctrl.event[evt][attrs.input] =  config.value;
                        }
                    }
                    
                }
            }
            else if (view = "datepicker")
            {                                                                                  
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
                        if (config.value == null)
                              return;
                        if (evt != null)
                        {
                            scope.ctrl.evt[evt].valid = scope.ctrl.ValidationService.evtValid(evt); 
                            if (attrs.input)
                               scope.ctrl.event[evt][attrs.input] = scope.ctrl.CommonService.dateValue(obj.data.value || new Date(obj.$view.textContent));
                        } 
                    },
                    "onKeyPress": function(code, e){
                        if (code == 9){
                              var obj = this.eventSource || this; 
                              scope.ctrl.getDateValueAndValidate(obj, scope.ctrl, attr);
                              config.value = obj.getValue();
                              if (evt != null)
                              {
                                    scope.ctrl.evt[evt].valid = scope.ctrl.ValidationService.evtValid(evt); 
                                    if (attrs.input)
                                       scope.ctrl.event[evt][attrs.input] = scope.ctrl.CommonService.dateValue(obj.data.value || new Date(obj.$view.textContent));
                              }
                        }   
                     }
                }   
            }
            if (attrs.hasOwnProperty('event'))
                config.value = scope.ctrl.event[attrs.event][attrs.input];
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