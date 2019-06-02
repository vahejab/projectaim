angular.module('Risk').service("DOMops", function() {
    var commonFunctions = {};

    commonFunctions.clearLevel = function(){
        leveldiv = document.querySelector("div[name='level']");
        leveldiv.innerHTML = '';
        leveldiv.setAttribute('class', '');
    }     

    commonFunctions.assignRiskLevel = function(scope, obj){
        l = scope.risk.likelihood;
        t = scope.risk.technical;
        s = scope.risk.schedule;
        c = scope.risk.cost;
        
        if (ValidationService.validLevel(obj) && ValidationService.riskNotEmpty(l,t,s,c))
        {
            if (riskIsValid(l,t,s,c))
            {
                l = Number(l);
                tech = Number(t);
                schd = Number(s);
                cost = Number(c);
                c = Math.max(tech,schd,cost);
                commonFunctions.displayLevel(scope.riskMatrix[l][c],l,c);
                commonFucntions.clearDot();
                commonFunctions.drawDot(l,c);
            }  
        }
        else
        {
            commonFunctions.clearLevel();
            commonFunctions.clearDot();
        }
    }
    
    commonFunctions.clearValidation = function(id){
        (document.querySelector('#'+id+ ' > div.webix_control')).classList.remove("webix_invalid");
    }
    
    commonFunctions.makeInvalid = function(id){
        (document.querySelector('#'+id+' > div.webix_control')).classList.add("webix_invalid");
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
    
    commonFunctions.displayLevel = function(level, l, c){
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
    
    return commonFunctions;            
});