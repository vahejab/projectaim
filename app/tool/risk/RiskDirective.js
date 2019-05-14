angular.module('Risk').directive('initRisk', function(){                     
      return {
            restrict: 'E',
            link: function (scope, element, attrs) {
  
                webix.ready(function(){
                    webix.ui.fullScreen();
                });
                
                function GetDate(date)
                {
                    if (date != '' && date != null)
                        return new Date(date);    
                    return null;
                }
                
                
                scope.clearValidation = function(id){
                    (document.querySelector('#'+id+' > div.webix_control')).classList.remove("webix_invalid");
                }
                
                scope.validate = function(elem, id){
                   if (typeof elem == 'undefined' || elem == 0 || elem == '' || elem.trim() == '') (document.querySelector('#'+id+' > div.webix_control')).classList.add("webix_invalid");
                }
                       

                scope.validateAll = function(){
                
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
                       if (scope.risk.likelihood - '0' < 1 || scope.risk.likelihood - '0' > 5 ) (document.querySelector('#likelihood > div.webix_control')).classList.add("webix_invalid");
                       if (scope.risk.technical - '0' < 1 || scope.risk.technical - '0' > 5 ) (document.querySelector('#technical > div.webix_control')).classList.add("webix_invalid");
                       if (scope.risk.schedule - '0' < 1 || scope.risk.schedule - '0' > 5 )  (document.querySelector('#schedule > div.webix_control')).classList.add("webix_invalid");
                       if (scope.risk.cost - '0' < 1 || scope.risk.cost - '0' > 5 )  (document.querySelector('#cost > div.webix_control')).classList.add("webix_invalid");
                }
                
                scope.valid = function(){
                    return(scope.risk.risktitle.trim() != '' &&
                           scope.risk.riskstatement.trim() != '' &&
                           scope.risk.context.trim() != '' &&
                           scope.risk.closurecriteria.trim() != '' &&
                           scope.risk.likelihood -'0' >= 1 && scope.risk.likelihood -'0' <= 5 &&
                           scope.risk.technical -'0' >= 1 && scope.risk.technical -'0' <= 5 && 
                           scope.risk.schedule - '0' >= 1 && scope.risk.schedule-'0' <= 5 && 
                           scope.risk.cost - '0' >= 1 && scope.risk.cost-'0' <= 5
                           );
                };
                        
                
                function assignRiskLevel()
                {
                    if (scope.risk["likelihood"] != ''
                    &&  scope.risk["technical"] != ''
                    &&  scope.risk["schedule"] != ''
                    &&  scope.risk["cost"] != '')
                    {
                        if (scope.risk["likelihood"]-'0' >= 1 && scope.risk['likelihood']-'0' <= 5
                        &&  scope.risk["technical"]-'0' >= 1 && scope.risk["technical"]-'0' <= 5
                        &&  scope.risk["schedule"]-'0' >= 1 && scope.risk["schedule"]-'0' <= 5
                        &&  scope.risk["cost"]-'0' >= 1 && scope.risk["cost"]-'0' <= 5)
                        {
                            
                            likelihood = scope.risk["likelihood"]-'0';
                            technical = scope.risk["technical"]-'0'; 
                            schedule =  scope.risk["schedule"]-'0';
                            cost = scope.risk["cost"]-'0';
                            consequence = Math.max(technical, schedule, cost);
                            
                            levelDiv = document.querySelector("div.level");
                        
                            if (levelDiv)
                                levelDiv.parentNode.removeChild(levelDiv);
                        
                            document.querySelector("td[name='risk["+likelihood+"]["+consequence+"]']").innerHTML = "<div class='level' style='width:15px; height:15px; background-color: black'/>";
                        }
                        
                    }
                }
                
                function getLevelConfig(attr)
                {
                    var config = 
                    {
                        view:"text",
                        value: scope.risk[attr],      
                        on: {
                            "onBlur": function(){var obj = this.eventSource || this; scope.getTextValueAndValidate(obj, scope, attr); assignRiskLevel();},
                            //"onBlur": function(){scope.validate(scope.actionitem.title, 'title')}
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
                        value: scope.risk[attr],
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
                
                function getSelectConfig(attr, options)
                {
                    var config = 
                    {
                        view: "richselect",
                        value: scope.risk[attr], 
                        options: options,
                        on: {
                            //"onChange": function(){var obj = this.eventSource || this; getValue(obj, 'assignor')},
                            "onChange": function(){var obj = this.eventSource || this; scope.getItemValueAndValidate(obj, scope, attr)}
                            //"onBlur": function(){scope.validate(scope.actionitem.assingor, 'assignor')}
                        },
                        responsive: true,
                        width: "520",
                        height: "30",
                        validate: webix.rules.isSelected,
                        required: true
                    };
                    return config;
                }
                
                
                scope.risktitleConfig = getTextConfig('risktitle');
                
                scope.riskstatementConfig = getTextareaConfig('riskstatement');
                
                scope.contextConfig = getTextareaConfig('context');
                
                scope.closurecriteriaConfig = getTextareaConfig('closurecriteria');
                
                scope.categoryConfig = getSelectConfig('category');
                              
                scope.likelihoodConfig = getLevelConfig('likelihood');
                
                scope.technicalConfig = getLevelConfig('technical');
                
                scope.scheduleConfig = getLevelConfig('schedule');
                
                scope.costConfig = getLevelConfig('cost');
      }
}            
}); 
         
         
         
         
         
         
         
         
         
         