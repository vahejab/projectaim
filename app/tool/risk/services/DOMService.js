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
    commonFunctions.assignEventLevels = function(ctrl, obj){
            lact = ctrl.event.actuallikelihood;
            tact = ctrl.event.actualtechnical;
            sact = ctrl.event.actualschedule;
            cact = ctrl.event.actualcost;
            
            if (ValidationService.validLevel(obj) && ValidationService.riskNotEmpty(lact,tact,sact,cact))
            {
                if (ValidationService.riskIsValid(lact,tact,sact,cact))
                {
                    l = Number(lact);
                    tech = Number(tact);
                    schd = Number(sact);
                    cost = Number(cact);
                    c = Math.max(tech,schd,cost); 
                    level = commonFunctions.displayLevel(ctrl.riskMatrix[l][c],l,c,ctrl,'event');
                    document.querySelector("div#level").innerHTML = level.html.value
                    document.querySelector("div#level").classList.add(level.cls);
                    commonFunctions.clearDot();
                    commonFunctions.drawDot(l,c,'actual');
                }
            }
            lsch = ctrl.event.scheduledlikelihood;
            tsch = ctrl.event.scheduledtechnical;
            ssch = ctrl.event.scheduledschedule;
            csch = ctrl.event.scheduledcost;
            
            if (ValidationService.validLevel(obj) && ValidationService.riskNotEmpty(lsch,tsch,ssch,csch))
            {
                if (ValidationService.riskIsValid(lsch,tsch,ssch,csch))
                {
                    l = Number(lsch);
                    tech = Number(tact);
                    schd = Number(ssch);
                    cost = Number(csch);
                    c = Math.max(tech,schd,cost); 
                    level = commonFunctions.displayLevel(ctrl.riskMatrix[l][c],l,c,ctrl,'event');
                    document.querySelector("div#level").innerHTML = level.html.value
                    document.querySelector("div#level").classList.add(level.cls);
                    commonFunctions.clearDot();
                    commonFunctions.drawDot(l,c,'schedule');
                }
            }
            
            lbas = ctrl.event.baslinelikelihood;
            tbas = ctrl.event.baslinetechnical;
            sbas = ctrl.event.baslineschedule;
            cbas = ctrl.event.baslinecost;
            
            if (ValidationService.validLevel(obj) && ValidationService.riskNotEmpty(lbas,tbas,sbas,cbas))
            {
                if (ValidationService.riskIsValid(lbas,tbas,sbas,cbas))
                {
                    l = Number(lbas);
                    tech = Number(tbas);
                    schd = Number(sbas);
                    cost = Number(cbas);
                    c = Math.max(tech,schd,cost); 
                    level = commonFunctions.displayLevel(ctrl.riskMatrix[l][c],l,c,ctrl,'event');
                    document.querySelector("div#level").innerHTML = level.html.value
                    document.querySelector("div#level").classList.add(level.cls);
                    commonFunctions.clearDot();
                    commonFunctions.drawDot(l,c,'baselilne');
                }
            }
    }
    
    
    
    commonFunctions.assignRiskLevel = function(ctrl, obj, evt, which, type, field){
        var l,t,s,c;
        if (type == 'event'){
            risk = ctrl.event;
        }
        else {
            risk = ctrl.risk;
        }
        
        if (evt < 0 && !field)
        {
            l = risk.likelihood;
            t = risk.technical;
            s = risk.schedule;
            c = risk.cost;
        }
        else if (field)
        {
            l = risk[field+'likelihood'];
            t = risk[field+'technical'];
            s = risk[field+'schedule'];
            c = risk[field+'cost'];
        }
        else if (evt >=0)
        {
            l = ctrl.evt['likelihood'+evt];
            t = ctrl.evt['technical'+evt];
            s = ctrl.evt['schedule'+evt];
            c = ctrl.evt['cost'+evt];
        }
        
        if ((type != 'event' && ValidationService.validLevel(obj) && ValidationService.riskNotEmpty(l,t,s,c)) || (type == 'event' && ValidationService.riskNotEmpty(l,t,s,c)))
        {
            if (ValidationService.riskIsValid(l,t,s,c))
            {
                l = Number(l);
                tech = Number(t);
                schd = Number(s);
                cost = Number(c);
                c = Math.max(tech,schd,cost);
                
                level = commonFunctions.displayLevel(ctrl.riskMatrix[l][c],l,c,evt,ctrl,which,'risk');
                if (which == 'matrix')
                {
                    document.querySelector("div#level").innerHTML = level.html.value;
                    document.querySelector("div#level").classList.add(level.cls);
                }
                       
                if(evt < 0){
                    commonFunctions.clearDot(field);
                    if (type=='event') {
                        commonFunctions.drawDot(l,c,field); 
                    }
                    else {
                        commonFunctions.drawDot(l,c);
                    }
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
                commonFunctions.clearDot(field);   
            }
        }
    }
    
    commonFunctions.clearElement = function(id){
        (document.querySelector('#'+id)).value = '';
    }
    
    
    commonFunctions.clearDot = function(sel){
        if (sel)
            selector = "table.matrix."+sel;                       
        levelDiv = document.querySelector(selector + " div.level");
        if (levelDiv)
            levelDiv.parentNode.removeChild(levelDiv);
    }
                                                                                  
    commonFunctions.enableElement = function(id){
        (document.querySelector(id)).removeAttribute('disabled');
    }
    
    commonFunctions.disableElement = function(id){
        (document.querySelector(id)).setAttribute('disabled', 'disabled'); 
    } 
    
    commonFunctions.drawDot = function(l, c, sel, which){
        selector = "";
        if (which && l > 0 && c > 0)                                                   
            selector = "table.matrix."+which+"."+sel+" td[name='"+sel+"["+l+"]["+c+"]']";
        else if (l > 0 && c > 0)
            selector = "table.matrix."+sel+" td[name='"+sel+"["+l+"]["+c+"]']";
        if (selector)
            document.querySelector(selector).innerHTML = "<div class='level' style='width:15px; height:15px; background-color: black'/>";
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
   
    
    commonFunctions.displayLevel = function(level, l, c, evt, ctrl, field, riskOrEvt){
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
            if (riskOrEvt  == 'risk')
                ctrl.event[field+"level"] = {levelhtml: '', cls: ''};
            else
                ctrl.event[field+"level"] = {levelhtml: '', cls: ''};
            return '';   
       }
       if (evt >= 0) {
        if (riskOrEvt == 'risk') 
            ctrl.event[field+"level"] = {levelhtml : leveldiv.html, cls : leveldiv.cls};
        else
            ctrl.event[evt][field+"level"] = {levelhtml : leveldiv.html, cls : leveldiv.cls};
       }
       return leveldiv;
    }
    
    return commonFunctions;            
});