angular.module('Risk').directive('webixUi', WebixElement);

function WebixElement(){                     
      return {
            restrict: 'A',
            scope: {
                elem: '@'
            },
            link: function (scope, element, attrs) {
               
               scope.risk = {
                    likelihood:'',
                    technical:'',
                    schedule:'',
                    cost:'',
                    risktitle:'',
                    closurecriteria: '',
                    riskstatement: '',
                    category: null,
                    context: ''
                }
                
                function updateTextValue(code, obj, field){
                    if (validCharacter(code) || obj.getValue().trim() == '') 
                    {
                        scope.risk[field] = '';
                        return;
                    }
                }     
                        
                function handleKeyPress(elem, code, attr){
                     var obj = elem.eventSource || elem; 
                     getTextValueAndValidate(code, obj, scope, attr); 
                     validate(obj, attr); 
                     assignRiskLevel(obj);
                }
                
                function updateAndValidate(elem, attr){
                    var obj = elem.eventSource || elem; 
                    scope.updateTextValue(obj, attr); 
                    scope.validate(obj, attr);
                }
                
                function getTextValueAndValidate(code, obj, model, field){
                    updateTextValue(code, obj, field);
                    $scope.clearValidation(field);  
                    CommonService.getTextValue(obj, model, 'risk', field); 
                    $scope.validate(obj, field);
                }
                
                function getConfig(attr, type, width, height, maxlength = null)
                {
                    var config = 
                    {
                        view: type,
                        value: scope.risk[attr],      
                        on: {
                            "onTimedKeyPress": function(code){ handleKeyPress(this, code, attr); },
                            "onBlur": function(){ updateAndValidate(this, attr); }
                        },
                        responsive: true,
                        width: width,
                        height: height
                    };
                    if (maxlength)
                        config.attributes = {maxlength : maxlength};
                    return config;
                };

                scope.$parent[attrs.webixUi] = getConfig(attrs.webixUi, attrs.type, attrs.width, attrs.height, attrs.hasOwnProperty('maxlength')? attrs.maxlength: null);
            }
      }            
}