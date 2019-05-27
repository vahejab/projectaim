angular.module('Risk').directive('ValidateElement', validateElement);

function ValidateElement(){                     
      return {
            restrict: 'A',
            link: function (scope, element, attrs) {
                
                function validLevel(lvl){
                    return !isNaN(lvl) && Number(lvl) >= 1 && Number(lvl) <= 5;
                }
                
                function validRisk(l, t, s, c){
                   return validLevel(l) && validLevel(t) && validLevel(s) && validLevel(c);
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
                    return obj.getValue().charCodeAt(0) - '0'.charCodeAt(0) >= 1 
                        && obj.getValue().charCodeAt(0) - '0'.charCodeAt(0) <= 5;    
                } 
                
                  
                function clearDot(){                       
                    levelDiv = document.querySelector("div.level");
                    if (levelDiv)
                        levelDiv.parentNode.removeChild(levelDiv);
                }
                
                function fieldEmpty(elem){
                    return elem.getValue() == '' || elem.getValue().trim() == '';
                }
                
                
                function validate(elem, id){
                   if (isLevelField(id) && (!validLevel(elem) || fieldEmpty(elem)){
                        makeInvalid(id);
                        clearDot();                                                     
                   }        
                   else if (typeof elem !== 'undefined' && (elem.getValue() == 0 || fieldEmpty(elem)))
                        makeInvalid(id);

                   else
                      disableElement("#submit");
                }
                                                                                              
                function enableElement(id){
                    (document.querySelector(id)).removeAttribute('disabled');
                }
                
                function disableElement(id){
                    (document.querySelector(id)).setAttribute('disabled', 'disabled'); 
                }
          

                function validateAll(fields){
                       for (var idx = 0; idx < fields.length; idx++){
                             field = fields[idx];
                             clearValidation(field);
                             if (isLevelField(field) && !validLevel(scope.risk[field]))
                                makeInvalid(field);
                             else if (!isLevelField(field) && scope.risk[field].trim() == '')
                                makeInvalid(field);                                
                       }
                }
                
                function valid(){          
                    for (var idx = 0; idx < fields.length; idx++){
                        field = fields[idx];
                        if (isLevelField(field) && !validLevel(scope.risk[field]))
                            return false;
                        else if (scope.risk[field] == '')
                            reutrn false
                    }
                    
                    return true;
                }
                              
                function drawDot(l, c){
                    document.querySelector("td[name='risk["+l+"]["+c+"]']").innerHTML 
                    = "<div class='level' style='width:15px; height:15px; background-color: black'/>";
                }

              
                function displayLevel(level, l, c){
                   leveldiv =  document.querySelector("div[name='level']");
                   if (level >= scope.risklevels.riskhigh)
                   {
                       leveldiv.innerHTML = 'H ' + l + '-' + c;
                       leveldiv.setAttribute('class', 'high'); 
                   }
                   else if (level < scope.risklevels.riskhigh  && level >= scope.risklevels.riskmedium)
                   {
                        leveldiv.innerHTML = 'M ' + l + '-' + c;
                        leveldiv.setAttribute('class', 'med'); 
                   }
                   else if (level < scope.risklevels.riskmedium)
                   {
                        leveldiv.innerHTML = 'L ' + l + '-' + c;
                        leveldiv.setAttribute('class', 'low'); 
                   }
                }
              
                function clearLevel(){
                    leveldiv = document.querySelector("div[name='level']");
                    leveldiv.innerHTML = '';
                    leveldiv.setAttribute('class', '');
                }
                
                function assignRiskLevel(obj){
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
                            displayLevel(scope.riskMatrix[l][c],l,c);
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
                            "onTimedKeyPress": function(code){ var obj = this.eventSource || this; scope.getTextValueAndValidate(code, obj, scope, attr); validate(obj, attr); assignRiskLevel(obj);},
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

                function getTextConfig(attr, type, width, height)
                {
                    var config = 
                    {
                        view:type,
                        value: scope.risk[attr],
                        on: {                                  
                            "onTimedKeyPress": function(code){ var obj = this.eventSource || this; scope.getTextValueAndValidate(code, obj, scope, attr); scope.validate(obj, attr);},
                            "onBlur": function(){var obj = this.eventSource || this; scope.validate(obj, attr);}
                        },
                        responsive: true,
                        width: width,//"520",
                        height: height//"97"
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
                    scope.risktitleConfig = getTextConfig('risktitle', 'text', '520', '30');                    
                    scope.riskstatementConfig = getTextConfig('riskstatement', 'textarea', '520', '97');
                    scope.contextConfig = getTextConfig('context', 'textarea', '520', '97');                    
                    scope.closurecriteriaConfig = getTextConfig('closurecriteria', 'textarea', '520', '97');
                    scope.ownerntesConfig = getTextConfig('ownernotes', 'textarea', '520', '97');
                    scope.approvercommentsConfig = getTextConfig('approvercomments', 'textarea', '520', '97');                    
                    scope.categoryConfig = getSelectConfig('category');                
                    scope.likelihoodConfig = getLevelConfig('likelihood');                    
                    scope.technicalConfig = getLevelConfig('technical');                    
                    scope.scheduleConfig = getLevelConfig('schedule');                    
                    scope.costConfig = getLevelConfig('cost');                    
                });

      }
}            
});