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
    commonFunctions.assignRiskLevel = function(ctrl, obj, evt, which){
        var l,t,s,c;
        if (evt < 0)
        {
            l = ctrl.risk.likelihood;
            t = ctrl.risk.technical;
            s = ctrl.risk.schedule;
            c = ctrl.risk.cost;
        }
        else if (evt >=0)
        {
            l = ctrl.evt['likelihood'+evt];
            t = ctrl.evt['technical'+evt];
            s = ctrl.evt['schedule'+evt];
            c = ctrl.evt['cost'+evt];
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
                
                level = commonFunctions.displayLevel(ctrl.riskMatrix[l][c],l,c,evt,ctrl,which);
                if (which == 'matrix')
                {
                    document.querySelector("div#level").innerHTML = level.html.value
                    document.querySelector("div#level").classList.add(level.cls);
                }
                       
                if(evt < 0){
                    commonFunctions.clearDot();
                    commonFunctions.drawDot(l,c);
                }
            }  
        }
        else
        {
            if (evt >=0)
            {
                commonFunctions.clearLevel(evt);
            }
            else (evt < 0)
            {
                commonFunctions.clearRiskLevel();
                commonFunctions.clearDot();   
            }
        }
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
   
    
    commonFunctions.displayLevel = function(level, l, c, evt, ctrl, field){
       var leveldiv = {};                               
       commonFunctions.clearLevel(evt);   
      
       if (evt >= 0)
           leveldiv = document.querySelector("div[name='"+(field || '')+"level'][evt='"+evt+"'] div");
       else
           leveldiv = document.querySelector("div[name='level']");

       if (level && leveldiv)
       {    
           if (level >= ctrl.risklevels.riskhigh)
           {
               leveldiv.html = {value: 'H ' + l + '-' + c};
                leveldiv.cls = 'high';
           }
           else if (level < ctrl.risklevels.riskhigh  && level >= ctrl.risklevels.riskmedium)
           {
                leveldiv.html = {value: 'M ' + l + '-' + c};
                leveldiv.cls = 'med';
           }
           else if (level < ctrl.risklevels.riskmedium)
           {
                leveldiv.html = {value: 'L ' + l + '-' + c};
                leveldiv.cls = 'low';
           }
       }
       else if (evt >= 0)
       {
            ctrl.event[evt][field+"level"] = {levelhtml: '', cls: ''};
            return '';   
       }
       if (evt >= 0)
        ctrl.event[evt][field+"level"] = {levelhtml : leveldiv.html, cls : leveldiv.cls};
       return leveldiv;
    }
    
    return commonFunctions;            
});