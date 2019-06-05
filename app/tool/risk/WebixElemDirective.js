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
                value: scope.ctrl.risk[attr],      
                on: {
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
                },
                responsive: true,
                width: width,
                height: height
            };
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