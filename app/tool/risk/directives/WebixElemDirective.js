angular.module('Risk').directive('config', ConfigElement);

function ConfigElement(){
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
                        scope.ctrl.ValidationService.handleKeyPress(code, scope.ctrl, obj, attr);
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
                config.on = {
                    "onItemClick": function(id) {
                        this.editRow(id);
                    }
                }
                
                config.columns = [
                    { id:"rank",    header:"",              width:50},
                    { id:"title",   header:"Film title",    width:200},
                    { id:"year",    header:"Released",      width:80},
                    { id:"votes",   header:"Votes",         width:100}
                ]
                
                config.data = [
                    { id:1, title:"The Shawshank Redemption", year:1994, votes:678790, rank:1},
                    { id:2, title:"The Godfather", year:1972, votes:511495, rank:2}
                ]
            }
            else if (view == "richselect")
            {
                config.value = scope.ctrl.risk[attr] || 0; 
                config.options = scope.ctrl[options];
                
                config.on =  {
                    "onChange": function(){
                        var obj = this.eventSource || this; 
                        scope.ctrl.getItemValueAndValidate(obj, scope.ctrl, attr);
                    }
                };
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