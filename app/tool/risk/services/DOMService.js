angular.module('Risk').service("DOMops", function() {
    var commonFunctions = {};
    var ValidationService = {};
    
    commonFunctions.evt = [];
    
    commonFunctions.setValidationServiceObj = function(obj){
        ValidationService = obj;
    }
    
    commonFunctions.setValue = function(field, obj){
        commonFunctions[field] = obj;
    }
    
    commonFunctions.clearEvtLevel = function(evt){
        leveldiv = document.querySelector("td[evt='"+evt+"']");
        leveldiv.innerHTML = '';
        leveldiv.setAttribute('class', '');
    }  
    
    commonFunctions.clearLevel = function(evt){
        leveldiv = document.querySelector(".level"+evt);
        leveldiv.innerHTML = '';
        leveldiv.setAttribute('class', '');
    }
    commonFunctions.assignRiskLevel = function(obj, evt){
        var l,t,s,c;
        if (!evt)
        {
            l = commonFunctions.risk.likelihood;
            t = commonFunctions.risk.technical;
            s = commonFunctions.risk.schedule;
            c = commonFunctions.risk.cost;
        }
        else if (evt)
        {
            l = commonFunctions.evt['likelihood'+evt];
            t = commonFunctions.evt['technical'+evt];
            s = commonFunctions.evt['schedule'+evt];
            c = commonFunctions.evt['cost'+evt];
        }
        
        if (ValidationService.validLevel(obj) && ValidationService.riskNotEmpty(l,t,s,c))
        {
            if (ValidationService.riskIsValid(l,t,s,c))
            {
                l = Number(l);
                tech = Number(t);
                schd = Number(s);
                cost = Number(c);
                c = Math.max(tech,schd,cost);
                commonFunctions.displayLevel(commonFunctions.riskMatrix[l][c],l,c,evt);

                if(!evt){
                    commonFunctions.clearDot();
                    commonFunctions.drawDot(l,c);
                }
            }  
        }
        else
        {
            if (evt)
            {
                commonFunctions.clearLevel(evt);
            }
            else
            {
                commonFunctions.clearRiskLevel();
                commonFunctions.clearDot();   
            }
        }
    }
      
    commonFunctions.clearValidation = function(id){
        (document.querySelector('#'+id+ ' > div.webix_control')).classList.remove("webix_invalid");
    }
    
    commonFunctions.makeInvalid = function(id){
        (document.querySelector('#'+id+' > div.webix_control')).classList.add("webix_invalid");
    }
     
    commonFunctions.clearElement = function(id){
        (document.querySelector('#'+id)).value = '';
    }
    
    
    commonFunctions.clearDot = function(){                       
        levelDiv = document.querySelector("div.level");
        if (levelDiv)
            levelDiv.parentNode.removeChild(levelDiv);
    }
                                                                                  
    commonFunctions.enableElement = function(id){
        (document.querySelector(id)).removeAttribute('disabled');
    }
    
    commonFunctions.disableElement = function(id){
        (document.querySelector(id)).setAttribute('disabled', 'disabled'); 
    } 
    
    commonFunctions.drawDot = function(l, c){
        document.querySelector("td[name='risk["+l+"]["+c+"]']").innerHTML 
        = "<div class='level' style='width:15px; height:15px; background-color: black'/>";
    }

    commonFunctions.clearRiskLevel = function(){
        element =  document.querySelector("#level");
        element.innerHTML = '';
        element.classList.remove('high');
        element.classList.remove('med');
        element.classList.remove('low');
    }
    
    commonFunctions.clearLevel = function(evt){
        element =  document.querySelector("[name='level'][evt='"+evt+"'] div");
        if (element){
            element.innerHTML = '';
            element.parentNode.classList.remove('high');
            element.parentNode.classList.remove('med');
            element.parentNode.classList.remove('low');
        }
    }
    
    commonFunctions.resetForm = function(risk, fields){
          for (var idx = 0; idx < fields.length; idx++){
            field = fields[idx];
            risk[field] = '';
            commonFunctions.clearElement(field);
          }
          commonFunctions.clearDot();
          commonFunctions.clearLevel()
          commonFunctions.disableElement('#submit');                         
    }
   
    
    commonFunctions.displayLevel = function(level, l, c, evt, scope, field = null){
       var leveldiv = {};                               
       commonFunctions.clearLevel(evt);   
      
       if (evt >= 0 && field != null)
           leveldiv = document.querySelector("div[name='"+field+"level'][evt='"+evt+"'] div");

       if (level && leveldiv)
       {    
           if (level >= scope.ctrl.risklevels.riskhigh)
           {
               leveldiv.html = {value: 'H ' + l + '-' + c};
                leveldiv.cls = 'high';
           }
           else if (level < scope.ctrl.risklevels.riskhigh  && level >= scope.ctrl.risklevels.riskmedium)
           {
                leveldiv.html = {value: 'M ' + l + '-' + c};
                leveldiv.cls = 'med';
           }
           else if (level < scope.ctrl.risklevels.riskmedium)
           {
                leveldiv.html = {value: 'L ' + l + '-' + c};
                leveldiv.cls = 'low';
           }
       }
       else
       {
            scope.ctrl.event[evt][field+"level"] = {levelhtml: '', cls: ''};
            return '';   
       }
       
       scope.ctrl.event[evt][field+"level"] = {levelhtml : leveldiv.html, cls : leveldiv.cls};
       return leveldiv.html;
    }
    
    return commonFunctions;            
});