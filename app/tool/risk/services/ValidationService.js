angular.module('Risk').service("ValidationService", function() {
    var commonFunctions = {};
    var DOMops = {};
   
    commonFunctions.setDOMobj = function(obj){
        DOMops = obj;
    }
     
    commonFunctions.setValue = function(field, obj){
        commonFunctions[field] = obj; 
    }
    
    commonFunctions.isLevelField = function(id){
            return (id == 'likelihood' || id == 'technical' || id == 'schedule' || id == 'cost');
    }
    
    commonFunctions.validLevel = function(obj){
        if (obj == null)
            return true;
        if (!isNaN(obj.getValue()))
           return obj.getValue() >= 1 && obj.getValue() <= 5;
        return obj.getValue().charCodeAt(0) - '0'.charCodeAt(0) >= 1 
            && obj.getValue().charCodeAt(0) - '0'.charCodeAt(0) <= 5;    
    }
    
    commonFunctions.isLevelField = function(id){
        return (id == 'likelihood' || id == 'technical' || id == 'schedule' || id == 'cost');
    } 
           
    commonFunctions.invalidLevel = function(lvl){
        if (typeof lvl === "number") 
            return (lvl < 1 || lvl > 5)
            return (typeof lvl === "undefined") || (lvl == '') || (lvl.charCodeAt(0) - '0'.charCodeAt(0) < 1) || (lvl.charCodeAt(0) - '0'.charCodeAt(0) > 5);
    }
    
    commonFunctions.valid = function(scope, fields){
          for (var idx = 0; idx < fields.length; idx++){
            field = fields[idx];
            if (commonFunctions.isLevelField(field) && commonFunctions.invalidLevel(scope.risk[field]))
                return false;
            else if (scope.risk[field] == '')
                return false;
          }
          return true; 
    }
   
    commonFunctions.riskIsValid = function(l,t,s,c){
        var lvl = [l,t,s,c];
        valid = true;
        for (var idx = 0; idx < lvl.length; idx++)
            if (commonFunctions.invalidLevel(lvl[idx]))
                valid = false;
        return valid;
    }
          
    commonFunctions.riskNotEmpty = function(l, t, s, c){
        if (l != '' && t != '' && s != '' && c != '')
            return true;
        return false;
    }
    
    commonFunctions.fieldEmpty = function(elem){
        return elem.getValue() == '' || elem.getValue().trim() == '';
    }
    
    
    commonFunctions.evtValid = function(evt, scope){
         var valid = !(scope.ctrl.event[evt] == {}) && ((scope.ctrl.event[evt].eventtitle || "") != ""   &&
                      (scope.ctrl.event[evt].ownerid || "") != "" && 
                      (scope.ctrl.event[evt].actualdate || "") != "" &&
                      (scope.ctrl.event[evt].scheduledate || "") != ""  &&
                      (scope.ctrl.event[evt].scheduledlikelihood ||  "") != ""  &&
                      (scope.ctrl.event[evt].scheduledtechnical ||  "") != ""  &&
                      (scope.ctrl.event[evt].scheduledschedule ||  "") != ""  &&
                      (scope.ctrl.event[evt].scheduledcost ||  "") != ""  &&
                      
                      !commonFunctions.invalidLevel(scope.ctrl.event[evt].scheduledlikelihood) &&
                      !commonFunctions.invalidLevel(scope.ctrl.event[evt].scheduledtechnical) &&
                      !commonFunctions.invalidLevel(scope.ctrl.event[evt].scheduledschedule) &&
                      !commonFunctions.invalidLevel(scope.ctrl.event[evt].scheduledcost));
                      
         commonFunctions.hasData(evt, scope);         
         scope.ctrl.event[evt].valid = valid;
         return valid;   
    } 
     
    commonFunctions.hasData = function(evt, scope){
         var hasData = !(scope.ctrl.event[evt] == {}) || ((scope.ctrl.event[evt].eventtitle || "") != ""   ||
                      (scope.ctrl.event[evt].ownerid || "") != "" || 
                      (scope.ctrl.event[evt].actualdate || "") != "" ||
                      (scope.ctrl.event[evt].scheduledate || "") != ""  ||
                      (scope.ctrl.event[evt].scheduledlikelihood ||  "") != ""  ||
                      (scope.ctrl.event[evt].scheduledtechnical ||  "") != ""  ||
                      (scope.ctrl.event[evt].scheduledschedule ||  "") != ""  ||
                      (scope.ctrl.event[evt].scheduledcost ||  "") != "");
         scope.ctrl.event[evt].hasData = hasData;
    } 
              
    commonFunctions.validCharacter = function(c){
        return (c >= 32 && c <= 126);
    }
  
    commonFunctions.clearTextValue = function(code, scope, obj, field){
        if (!commonFunctions.validCharacter(code) || obj.getValue().trim() == '') 
        {
            scope.risk[field] = '';
            return;
        }
    }     
            
    commonFunctions.handleKeyPress = function(code, scope, obj, attr){   
         commonFunctions.getTextValueAndValidate(code, scope, obj, attr); 
         commonFunctions.validate(obj, scope, attr);
    }
    
    commonFunctions.updateAndValidate = function(code, scope, obj, attr){ 
        commonFunctions.clearTextValue(code, scope, obj, attr); 
        commonFunctions.validate(obj, scope, attr);
    }
    
    commonFunctions.getTextValueAndValidate = function(code, scope, obj, field){
        commonFunctions.clearTextValue(code, scope, obj, field);
        DOMops.clearValidation(field);  
        scope.getTextValue(obj, 'risk', field); 
        commonFunctions.validate(obj, scope, field);
    }
    
    return commonFunctions;
});