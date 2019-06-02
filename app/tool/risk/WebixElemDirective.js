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
                  
            var config = 
            {
                view: view,
                value: scope.ctrl.risk[attr],      
                on: {
                    "onTimedKeyPress": function(code){  
                        var obj = this.eventSource || this; 
                        scope.ValidationService.handleKeyPress(obj, code, attr);
                        if (type == "level")
                            scope.ctrl.DOMops.assignRiskLevel(scope, obj); 
                    },
                    "onBlur": function(code){  
                        var obj = this.eventSource || this;  
                        scope.ctrl.ValidationService.updateAndValidate(obj,code,attr); 
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
            //$scope.$eval($attrs.onConfig, {$config: $scope.config[$attrs.name]});                    
     // }
   //});  
}       