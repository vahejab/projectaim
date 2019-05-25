angular.module('Risk').directive('validateRisk', validateRisk);

function validateRisk(){                     
      return {
            restrict: 'E',
            link: function (scope, element, attrs) {
  
                webix.ready(function(){
                    webix.ui.fullScreen();
                });
                
                function validRisk(l, t, s, c){
                   return (!isNaN(l) && Number(l) >= 1 && Number(l) <= 5 &&
                           !isNaN(t) && Number(t) >= 1 && Number(t) <= 5 &&
                           !isNaN(s) && Number(s) >= 1 && Number(s) <= 5 &&
                           !isNaN(c) && Number(c) >= 1 && Number(c) <= 5); 
                
                }
                
                function isLevelField(id){
                    return (id == 'likelihood' || id == 'technical' || id == 'schedule' || id == 'cost');
                }
  
                function riskNotEmpty(l, t, s, c){
                  return
                   (l != '' &&
                    t != '' &&
                    s != '' && 
                    c != '');
                }
                
                function validLevel(obj){
                    return obj.getValue().charCodeAt(0)- '0'.charCodeAt(0) >= 1 
                        && obj.getValue().charCodeAt(0)- '0'.charCodeAt(0) <= 5;    
                } 
                
                  
                function clearDot(){                       
                    levelDiv = document.querySelector("div.level");
                    if (levelDiv)
                        levelDiv.parentNode.removeChild(levelDiv);
                }
                                                                                              
                function clearValidation(id){
                    (document.querySelector('#'+id+' > div.webix_control')).classList.remove("webix_invalid");
                }
                
                function makeInvalid(id){
                   (document.querySelector('#'+id+' > div.webix_control')).classList.add("webix_invalid");
                }
                
                function fieldEmpty(elem){
                    return elem.getValue() == '' || elem.getValue().trim() == '';
                }
                
                function enableElement(id){
                    (document.querySelector(id)).removeAttribute('disabled');
                }
                
                function disableElement(id){
                    (document.querySelector(id)).setAttribute('disabled', 'disabled'); 
                }

                
                function validate (elem, id){
                   if (isLevelField(id) && (!validLevel(elem) || fieldEmpty(elem)){
                        makeInvalid(id);
                        clearDot();                                                     
                   }        
                   else if (typeof elem !== 'undefined' && (elem.getValue() == 0 || fieldEmpty(elem)))
                        makeInvalid(id);
                     
                   if (scope.valid() && !fieldEmpty(elem))
                      enableElement("#submit");
                   else
                      disableElement("#submit");
                }
                
                scope.validCharacter = function(c){
                    return (c >= 32 && c <= 126);
                }
                
  

                function validateAll(){
                       (document.querySelector('#risktitle > div.webix_control')).classList.remove("webix_invalid");
                       (document.querySelector('#riskstatement > div.webix_control')).classList.remove("webix_invalid");
                       (document.querySelector('#context > div.webix_control')).classList.remove("webix_invalid");
                       (document.querySelector('#closurecriteria > div.webix_control')).classList.remove("webix_invalid");
                       (document.querySelector('#likelihood > div.webix_control')).classList.remove("webix_invalid");
                       (document.querySelector('#technical > div.webix_control')).classList.remove("webix_invalid");
                       (document.querySelector('#schedule > div.webix_control')).classList.remove("webix_invalid");
                       (document.querySelector('#cost > div.webix_control')).classList.remove("webix_invalid");
                      
                       if (scope.risk.risktitle.trim() == '') (document.querySelector('#risktitle > div.webix_control')).classList.add("webix_invalid");
                       if (scope.risk.riskstatement.trim() == '') (document.querySelector('#riskstatement > div.webix_control')).classList.add("webix_invalid");
                       if (scope.risk.context.trim() == '' )   (document.querySelector('#context > div.webix_control')).classList.add("webix_invalid");
                       if (scope.risk.closurecriteria.trim() == '') (document.querySelector('#closurecriteria > div.webix_control')).classList.add("webix_invalid");
                       if (isNaN(scope.risk.likelihood) && Number(scope.risk.likelihood) < 1 && Number(scope.risk.likelihood) > 5)  (document.querySelector('#likelihood > div.webix_control')).classList.add("webix_invalid");
                       if (isNaN(scope.risk.technical) && Number(scope.risk.technical) < 1 && Number(scope.risk.technical) > 5)  (document.querySelector('#technical > div.webix_control')).classList.add("webix_invalid");
                       if (isNaN(scope.risk.schedule) && Number(scope.risk.schedule) < 1 && Number(scope.risk.schedule) > 5)   (document.querySelector('#schedule > div.webix_control')).classList.add("webix_invalid");
                       if (isNaN(scope.risk.cost) && Number(scope.risk.cost) < 1 && Number(scope.risk.cost) > 5) (document.querySelector('#cost > div.webix_control')).classList.add("webix_invalid");
                }
                
                scope.valid = function(){
                    return(scope.risk.risktitle.trim() != '' &&
                           scope.risk.riskstatement.trim() != '' &&
                           scope.risk.context.trim() != '' &&
                           scope.risk.closurecriteria.trim() != '' &&
                           scope.risk.likelihood.trim() != '' &&
                           scope.risk.technical.trim() != '' &&
                           scope.risk.technical.trim() != '' &&
                           scope.risk.cost.trim() != '' &&
                           !isNaN(scope.risk.likelihood) && Number(scope.risk.likelihood) >= 1 && Number(scope.risk.likelihood) <= 5 &&
                           !isNaN(scope.risk.technical) && Number(scope.risk.technical) >= 1 && Number(scope.risk.technical) <= 5 && 
                           !isNaN(scope.risk.schedule) && Number(scope.risk.schedule) >= 1 && Number(scope.risk.schedule) <= 5 &&
                           !isNaN(scope.risk.cost) && Number(scope.risk.cost) >= 1 && Number(scope.risk.cost) <= 5);
                }
                
                scope.drawDot = function(l, c){
                    document.querySelector("td[name='risk["+l+"]["+c+"]']").innerHTML 
                    = "<div class='level' style='width:15px; height:15px; background-color: black'/>";
                }

              
                scope.clearLevel = function(){
                    leveldiv =  document.querySelector("div[name='level']");
                    leveldiv.innerHTML = '';
                    leveldiv.setAttribute('class', '');
                }
                
                scope.assignRiskLevel = function(obj)
                {
                    l = scope.risk.likelihood;
                    t = scope.risk.technical;
                    s = scope.risk.schedule;
                    c = scope.risk.cost;                              
                    if (scope.validLevel(obj) && riskNotEmpty(l,t,s,c))
                    {
                        if (riskIsValid(l,t,s,c))
                        {
                            l = Number(l);
                            t = Number(t);
                            s = Number(s);
                            c = Number(c);
                            consequence = Math.max(t,s,c);
                            scope.displayLevel(scope.riskMatrix[l][c],l,c);
                            clearDot();
                            drawDot(l,c);
                        }  
                    }
                    else
                    {
                        scope.clearLevel();
                        clearDot();
                    }
                }
                
                function getLevelConfig(attr)
                {
                    var config = 
                    {
                        view:"text",
                        value: scope.risk[attr],      
                        on: {
                            "onTimedKeyPress": function(code){ var obj = this.eventSource || this; scope.getTextValueAndValidate(code, obj, scope, attr); scope.validate(obj, attr);  scope.assignRiskLevel(obj);},
                            "onBlur": function(){var obj = this.eventSource || this; scope.updateTextValue(obj, attr); scope.validate(obj, attr);}
                        },
                        attributes: {
                            maxlength: 1
                        },
                        responsive: true,
                        width: "36",
                        height: "30",
                        required: true
                    };
                    return config;
                }
              
                function getTextConfig(attr)
                {
                    var config = 
                    {
                        view:"text",
                        value: scope.risk[attr],      
                        on: {
                            "onTimedKeyPress": function(code){ var obj = this.eventSource || this; scope.getTextValueAndValidate(code, obj, scope, attr);  scope.validate(obj, attr);},
                            "onBlur": function(){var obj = this.eventSource || this; scope.validate(obj, attr);}
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
                        value: scope.risk[attr],
                        on: {                                  
                            "onTimedKeyPress": function(code){ var obj = this.eventSource || this; scope.getTextValueAndValidate(code, obj, scope, attr); scope.validate(obj, attr);},
                            "onBlur": function(){var obj = this.eventSource || this; scope.validate(obj, attr);}
                        },
                        responsive: true,
                        width: "520",
                        height: "97",
                        validate: webix.rules.isSelected,
                        required: true
                    };
                 
                    return config;
                }
                
                function getSelectConfig(attr, options)
                {
                    var config = 
                    {
                        view: "richselect",
                        value: scope.risk[attr], 
                        options: options,
                        on: {
                            "onChange": function(){var obj = this.eventSource || this; scope.getItemValueAndValidate(obj, scope, attr)}
                        },
                        responsive: true,
                        width: "200",
                        height: "30",
                        validate: webix.rules.isSelected,
                        required: true
                    };
                    return config;
                }
                
                
                scope.init().then(function(){
                    scope.assignorConfig = getSelectConfig('assignor', scope.users);
                    scope.approverConfig = getSelectConfig('approver', scope.users);
                    scope.ownerConfig = getSelectConfig('owner', scope.users);
                    scope.risktitleConfig = getTextConfig('risktitle');                    
                    scope.riskstatementConfig = getTextareaConfig('riskstatement');
                    scope.contextConfig = getTextareaConfig('context');                    
                    scope.closurecriteriaConfig = getTextareaConfig('closurecriteria');
                    scope.ownerntesConfig = getTextareaConfig('ownernotes');
                    scope.approvercommentsConfig = getTextareaConfig('approvercomments');                    
                    scope.categoryConfig = getSelectConfig('category');                
                    scope.likelihoodConfig = getLevelConfig('likelihood');                    
                    scope.technicalConfig = getLevelConfig('technical');                    
                    scope.scheduleConfig = getLevelConfig('schedule');                    
                    scope.costConfig = getLevelConfig('cost');                    
                });

      }
}            
})