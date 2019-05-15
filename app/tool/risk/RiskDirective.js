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
                   if (id == 'likelihood' || id == 'technical' || id == 'schedule' || id == 'cost')
                   {
                         if (elem.data.value.charCodeAt(0)- '0'.charCodeAt(0) < 1 || elem.data.value.charCodeAt(0) - '0'.charCodeAt(0) > 5)
                            (document.querySelector('#'+id+' > div.webix_control')).classList.add("webix_invalid");
                         else if (elem.data.value == '' || elem.data.value.trim() == '')
                            (document.querySelector('#'+id+' > div.webix_control')).classList.add("webix_invalid");      
                   }        
                   else if (typeof elem == 'undefined' || elem.data.value == 0 || elem.data.value == '' || elem.data.value.trim() == '')
                        (document.querySelector('#'+id+' > div.webix_control')).classList.add("webix_invalid");                
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
                        
                
                function assignRiskLevel()
                {
                    
                    if (scope.risk["likelihood"] != ''
                    &&  scope.risk["technical"] != ''
                    &&  scope.risk["schedule"] != ''
                    &&  scope.risk["cost"] != '')
                    {
                        if ( !isNaN(scope.risk.likelihood) && Number(scope.risk.likelihood) >= 1 && Number(scope.risk.likelihood) <= 55 &&
                           !isNaN(scope.risk.technical) && Number(scope.risk.technical) >= 1 && Number(scope.risk.technical) <= 5 &&
                           !isNaN(scope.risk.schedule) && Number(scope.risk.schedule) >= 1 && Number(scope.risk.schedule) <= 5 &&
                           !isNaN(scope.risk.cost) && Number(scope.risk.cost) >= 1 && Number(scope.risk.cost) <= 5 )
                        {
                            
                            likelihood = Number(scope.risk.likelihood);
                            technical = Number(scope.risk.technical);
                            schedule =  Number(scope.risk.schedule);
                            cost = Number(scope.risk.cost);
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
                            "onChange": function(){var obj = this.eventSource || this; scope.getTextValueAndValidate(obj, scope, attr); assignRiskLevel();}
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
                            "onChange": function(){ var obj = this.eventSource || this; scope.getTextValueAndValidate(obj, scope, attr)}
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
         
         
         
         
         
         
         
         
         
         