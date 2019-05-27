angular.module('Risk').directive('webixUi', WebixElement);

function WebixElement(){                     
      return {
            restrict: 'A',
            scope: {
                elem: '@'
            },
            controller: function($scope, CommonService){
                $scope.getTextValue = function(obj, model, type, field){
                     CommonService.getTextValue(obj, model, type, field); 
                }
            }, 
            link: function (scope, element, attrs) {
                    
                function clearLevel(){
                    leveldiv = document.querySelector("div[name='level']");
                    leveldiv.innerHTML = '';
                    leveldiv.setAttribute('class', '');
                }
                
                
                function assignRiskLevel(obj){
                    l = scope.$parent.risk.likelihood;
                    t = scope.$parent.risk.technical;
                    s = scope.$parent.risk.schedule;
                    c = scope.$parent.risk.cost;
                    
                    if (validLevel(obj) && riskNotEmpty(l,t,s,c))
                    {
                        if (riskIsValid(l,t,s,c))
                        {
                            l = Number(l);
                            t = Number(t);
                            s = Number(s);
                            c = Number(c);
                            consequence = Math.max(t,s,c);
                            displayLevel(scope.$parent.riskMatrix[l][c],l,c);
                            clearDot();
                            drawDot(l,c);
                        }  
                    }
                    else
                    {
                        clearLevel();
                        clearDot();
                    }
                }
                
                function isLevelField(id){
                        return (id == 'likelihood' || id == 'technical' || id == 'schedule' || id == 'cost');
                }
                
                function clearValidation(id){
                    (document.querySelector('#'+id+ ' > div.webix_control')).classList.remove("webix_invalid");
                }
                
                function makeInvalid(id){
                    (document.querySelector('#'+id+' > div.webix_control')).classList.add("webix_invalid");
                } 
                
                function validLevel(obj){
                    return obj.getValue().charCodeAt(0) - '0'.charCodeAt(0) >= 1 
                        && obj.getValue().charCodeAt(0) - '0'.charCodeAt(0) <= 5;    
                }
               
                function riskIsValid(l,t,s,c){
                    var lvl = [l,t,s,c];
                    valid = true;
                    for (var idx = 0; idx < lvl.length; idx++)
                        if ((lvl[idx].charCodeAt(0) - '0'.charCodeAt(0) < 1) || (lvl[idx].charCodeAt(0) - '0'.charCodeAt(0) > 5))
                            valid = false;
                    return valid;
                }
                
                       
                function riskNotEmpty(l, t, s, c){
                    if (l != '' && t != '' && s != '' && c != '')
                        return true;
                    return false;
                }
               
                function clearDot(){                       
                    levelDiv = document.querySelector("div.level");
                    if (levelDiv)
                        levelDiv.parentNode.removeChild(levelDiv);
                }
                
                function fieldEmpty(elem){
                    return elem.getValue() == '' || elem.getValue().trim() == '';
                }
                
                 
                function formValid(){          
                    for (var idx = 0; idx < scope.$parent.fields.length; idx++){
                        field = scope.$parent.fields[idx];
                        if (isLevelField(field) && !validLevel(scope.$parent.risk[field]))
                            return false;
                        else if (scope.$parent.risk[field] == '')
                            return false;
                    }
                    
                    return true;
                }
                
                function validate(elem, id){
                   if (isLevelField(id) && (!validLevel(elem) || fieldEmpty(elem))){
                        makeInvalid(id);
                        clearDot();                                                     
                   }        
                   else if (typeof elem !== 'undefined' && (elem.getValue() == 0 || fieldEmpty(elem)))
                        makeInvalid(id);

                   if (formValid())
                      enableElement("#submit");
                   else
                      disableElement("#submit");
                }
               
                                                                                              
                function enableElement(id){
                    (document.querySelector(id)).removeAttribute('disabled');
                }
                
                function disableElement(id){
                    (document.querySelector(id)).setAttribute('disabled', 'disabled'); 
                }
                                
                function validCharacter(c){
                    return (c >= 32 && c <= 126);
                }
                
                
                function clearTextValue(code, obj, field){
                    if (!validCharacter(code) || obj.getValue().trim() == '') 
                    {
                        scope.$parent.risk[field] = '';
                        return;
                    }
                }     
                        
                function handleKeyPress(obj, code, attr){   
                     getTextValueAndValidate(code, obj, attr); 
                     validate(obj, attr);
                }
                
                function updateAndValidate(code, obj, attr){ 
                    clearTextValue(code, obj, attr); 
                    validate(obj, attr);
                }
                
                function getTextValueAndValidate(code, obj, field){
                    clearTextValue(code, obj, field);
                    clearValidation(field);  
                    scope.getTextValue(obj, scope.$parent, 'risk', field); 
                    validate(obj, field);
                }
                
                function drawDot(l, c){
                    document.querySelector("td[name='risk["+l+"]["+c+"]']").innerHTML 
                    = "<div class='level' style='width:15px; height:15px; background-color: black'/>";
                }
                
                function displayLevel(level, l, c){
                   leveldiv =  document.querySelector("div[name='level']");
                   if (level >= scope.$parent.risklevels.riskhigh)
                   {
                       leveldiv.innerHTML = 'H ' + l + '-' + c;
                       leveldiv.setAttribute('class', 'high'); 
                   }
                   else if (level < scope.$parent.risklevels.riskhigh  && level >= scope.$parent.risklevels.riskmedium)
                   {
                        leveldiv.innerHTML = 'M ' + l + '-' + c;
                        leveldiv.setAttribute('class', 'med'); 
                   }
                   else if (level < scope.$parent.risklevels.riskmedium)
                   {
                        leveldiv.innerHTML = 'L ' + l + '-' + c;
                        leveldiv.setAttribute('class', 'low'); 
                   }
                }
                
                function getConfig(attr, type, width, height, maxlength)
                {
                    var view;
                    if (type == "level")
                        view = "text";
                    else
                        view = type;
                        
                    var config = 
                    {
                        view: view,
                        value: scope.$parent.risk[attr],      
                        on: {
                            "onTimedKeyPress": function(code){  
                                var obj = this.eventSource || this; 
                                handleKeyPress(obj, code, attr);
                                if (type == "level")
                                    assignRiskLevel(obj); 
                            },
                            "onBlur": function(code){  
                                var obj = this.eventSource || this;  
                                updateAndValidate(code, obj, attr); 
                            }
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