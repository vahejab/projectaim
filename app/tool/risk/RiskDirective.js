angular.module('Risk').directive('configMatrix', function(){
     return {
        restrict: 'E', 
        link: function(scope, element, attrs){
             scope.init().then(function(){
                scope.update();
             });
        },
        controller: function($scope){
     
            $scope.update = function(){
                for (var likelihood = 1; likelihood <= 5; likelihood++)
                {
                    for (var consequence = 1; consequence <= 5; consequence++)
                    {  
                        $scope.risk[likelihood][consequence] = (((0.9*likelihood*consequence)/25) + 0.05).toFixed(2);  
                        //if ($scope.risk[likelihood][consequence] == '' ||
                        //    document.querySelector("input[name='risk["+likelihood+"]["+consequence+"]']").value != $scope.risk[likelihood][consequence])
                        document.querySelector("input[name='risk["+likelihood+"]["+consequence+"]']").value = $scope.risk[likelihood][consequence];
                    }
                }  
            }
             
            $scope.riskLevel = function(l, c){
                elem = document.querySelector("input[name='risk["+l+"]["+c+"]']");
                risk = elem.value;
                
                if (risk == '')
                    return (elem && elem.hasAttribute('class'))?
                            elem.getAttribute('class') : ''; 
                
                if (risk >= $scope.risklevels.riskhigh) 
                    return 'high';
                else if (risk >= $scope.risklevels.riskmedium && risk < $scope.risklevels.riskhigh)
                    return 'med';
                else if (risk < $scope.risklevels.riskmedium)
                    return 'low';
            }
        }
     }       
}).directive('initRisk', function(){                     
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
                         if (elem.getValue().charCodeAt(0)- '0'.charCodeAt(0) < 1 || elem.getValue().charCodeAt(0) - '0'.charCodeAt(0) > 5)
                         {
                            (document.querySelector('#'+id+' > div.webix_control')).classList.add("webix_invalid");
                             scope.clearDot();
                         }
                         else if (elem.getValue() == '' || elem.getValue().trim() == '')
                         {
                            (document.querySelector('#'+id+' > div.webix_control')).classList.add("webix_invalid");
                             scope.clearDot();      
                           
                         }
                   }        
                   else if (typeof elem !== 'undefined' && (elem.getValue() == 0 || elem.getValue() == '' || elem.getValue().trim() == ''))
                   {
                        (document.querySelector('#'+id+' > div.webix_control')).classList.add("webix_invalid");
                   }    
                   if (scope.valid() && elem.getValue() != '' && elem.getValue().trim() != '')
                   {
                      (document.querySelector('#submit')).removeAttribute('disabled');
                   }
                   else
                   {
                      (document.querySelector('#submit')).setAttribute('disabled', 'disabled'); 
                   }
                }
                
                scope.validCharacter = function(c){
                    return (c >= 32 && c <= 126);
                }
                
                scope.validLevel = function(obj){
                    return obj.getValue().charCodeAt(0)- '0'.charCodeAt(0) >= 1 && obj.getValue().charCodeAt(0) - '0'.charCodeAt(0) <= 5;    
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
                
                scope.drawDot = function(){
                    document.querySelector("td[name='risk["+likelihood+"]["+consequence+"]']").innerHTML = "<div class='level' style='width:15px; height:15px; background-color: black'/>";
                }
  
                scope.clearDot = function(){                       
                    levelDiv = document.querySelector("div.level");
                
                    if (levelDiv)
                        levelDiv.parentNode.removeChild(levelDiv);
                }
                
              
                scope.clearLevel = function(){
                    leveldiv =  document.querySelector("div[name='level']");
                    leveldiv.innerHTML = '';
                    leveldiv.setAttribute('class', '');
                }
                
                scope.assignRiskLevel = function(obj)
                {
                    if (scope.validLevel(obj) && scope.risk["likelihood"] != ''
                    &&  scope.risk["technical"] != ''
                    &&  scope.risk["schedule"] != ''
                    &&  scope.risk["cost"] != '')
                    {
                        if (!isNaN(scope.risk.likelihood) && Number(scope.risk.likelihood) >= 1 && Number(scope.risk.likelihood) <= 5 &&
                           !isNaN(scope.risk.technical) && Number(scope.risk.technical) >= 1 && Number(scope.risk.technical) <= 5 &&
                           !isNaN(scope.risk.schedule) && Number(scope.risk.schedule) >= 1 && Number(scope.risk.schedule) <= 5 &&
                           !isNaN(scope.risk.cost) && Number(scope.risk.cost) >= 1 && Number(scope.risk.cost) <= 5 )
                        {
                            
                            likelihood = Number(scope.risk.likelihood);
                            technical = Number(scope.risk.technical);
                            schedule =  Number(scope.risk.schedule);
                            cost = Number(scope.risk.cost);
                            consequence = Math.max(technical, schedule, cost);
                            
                            scope.displayLevel(scope.riskMatrix[likelihood][consequence], likelihood, consequence);
                            
                            scope.clearDot();
                        
                            scope.drawDot();
                        }  
                    }
                    else{
                        scope.clearLevel();
                        scope.clearDot();
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
                            //"onTimedKeyPress": function(){var obj = this.eventSource || this; getValue(obj, 'assignor')},
                            "onChange": function(){var obj = this.eventSource || this; scope.getItemValueAndValidate(obj, scope, attr)}
                            //"onBlur": function(){scope.validate(scope.actionitem.assingor, 'assignor')}
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
}).directive('initRiskTable', function(){
    return {
        restrict: 'A',
        //transclude: true,
        templateUrl: '/app/tool/risk/RiskTable.html',
        controller: function($scope, $timeout) {
            $scope.scrollBarWidth = function(){
                    var outer = document.createElement("div");
                    outer.style.visibility = "hidden";
                    outer.style.width = "100px";
                    outer.style.msOverflowStyle = "scrollbar"; // needed for WinJS apps

                    document.body.appendChild(outer);

                    var widthNoScroll = outer.offsetWidth;
                    // force scrollbars
                    outer.style.overflow = "scroll";

                    // add innerdiv
                    var inner = document.createElement("div");
                    inner.style.width = "100%";  
                    outer.appendChild(inner);        

                    var widthWithScroll = inner.offsetWidth;

                    // remove divs
                    outer.parentNode.removeChild(outer);

                    return widthNoScroll - widthWithScroll;
            }
            $scope.setMarginsWidths = function(){
                $scope.flag = 0;
                refresh = 1;
                var msie = document.documentMode;
                if(refresh){ 
                    $timeout(refreshEvery,1);
                }
                
                function refreshEvery(){
                    if ($scope.flag == 0 || window.devicePixelRatio != $scope.devicePixelRatio)
                    {   
                        $scope.flag = 1;
                        $scope.devicePixelRatio = window.devicePixelRatio;
                        var headers = angular.element(document.querySelector('div.tableheader table.grid thead tr')).children();
                        var cells = angular.element(document.querySelector('div.tablebody table.grid tbody tr:nth-child(1)')).children();
                        angular.forEach(cells, function(cell, idx){
                            var cellwidth = cell.getBoundingClientRect().width;
                            headers[idx].width = cellwidth;
                        });
                    }

                    if (refresh && !msie)
                        $scope.refreshingPromise = $timeout(refreshEvery,1);
                    else{
                         $scope.isRefreshing = false;
                         $timeout.cancel($scope.refreshingPromise);
                    }
                    
                    //angular.element(document.querySelector('html')).attr("style", "margin-right: " + 0*$scope.scrollBarWidth() + "px !important");
                    angular.element(document.querySelector('div.tableheader')).attr("style", "margin-right: " + $scope.scrollBarWidth() + "px !important");
                    angular.element(document.querySelector('div.tablebody')).attr("style", "margin-right " + $scope.scrollBarWidth() + "px !important");    
                }
            }
        },
        link: function (scope, element, attrs) {
            scope.init().then(function(){
                
            });
        }
    }
});  
         
         
         
         
         
         
         
         
         