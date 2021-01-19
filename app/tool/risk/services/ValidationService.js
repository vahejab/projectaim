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
        if (!isNaN(obj))
           return (obj >= 1 && obj <= 5);
        return (obj.charCodeAt(0) - '0'.charCodeAt(0) >= 1 
            && obj.charCodeAt(0) - '0'.charCodeAt(0) <= 5);    
    }
    
    commonFunctions.isLevelField = function(id){
        return (id == 'likelihood' || id == 'technical' || id == 'schedule' || id == 'cost');
    } 
           
    commonFunctions.invalidLevel = function(lvl){
        if (typeof lvl === "number") 
            return (lvl < 1 || lvl > 5)
            return (typeof lvl === "undefined") || (lvl == '') || (lvl == null) || (lvl.charCodeAt(0) - '0'.charCodeAt(0) < 1) || (lvl.charCodeAt(0) - '0'.charCodeAt(0) > 5);
    }
    
    commonFunctions.valid = function(scope, fields){
          for (var idx = 0; idx < fields.length; idx++){
            field = fields[idx];
            if (commonFunctions.isLevelField(field) && commonFunctions.invalidLevel(scope.ctrl.risk[field]))
                return false;
            else if (scope.ctrl.risk[field] == '')
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
    
    commonFunctions.actualValid = function(evt, scope, event){                                    
        event = event || scope.ctrl.event[evt];
        var valid = event &&
                    !(event == {}) &&
                       (event.hasOwnProperty('actualdate') && event.actualdate || "") != "" &&  
                       (event.hasOwnProperty('actuallikelihood') && event.actuallikelihood ||  "") != ""  &&
                       (event.hasOwnProperty('actualtechnical') && event.actualtechnical ||  "") != ""  &&
                       (event.hasOwnProperty('actualschedule') && event.actualschedule ||  "") != ""  &&
                       (event.hasOwnProperty('actualcost') && event.actualcost ||  "") != ""  &&
                      
                       !commonFunctions.invalidLevel(event.actuallikelihood) &&
                      !commonFunctions.invalidLevel(event.actualtechnical) &&
                      !commonFunctions.invalidLevel(event.actualschedule) &&
                      !commonFunctions.invalidLevel(event.actualcost);
                    
        return valid;
    }
    
       commonFunctions.scheduleValid = function(evt, scope, event){
           event = event || scope.ctrl.event[evt];
           var valid = event &&
                    !(event == {}) &&
                       (event.hasOwnProperty('scheduledate') && event.scheduledate || "") != "" &&  
                       (event.hasOwnProperty('scheduledlikelihood') && event.scheduledlikelihood ||  "") != ""  &&
                       (event.hasOwnProperty('scheduledtechnical') && event.scheduledtechnical ||  "") != ""  &&
                       (event.hasOwnProperty('scheduledschedule') && event.scheduledschedule ||  "") != ""  &&
                       (event.hasOwnProperty('scheduledcost') && event.scheduledcost ||  "") != ""  &&
                      
                       !commonFunctions.invalidLevel(event.scheduledlikelihood) &&
                      !commonFunctions.invalidLevel(event.scheduledtechnical) &&
                      !commonFunctions.invalidLevel(event.scheduledschedule) &&
                      !commonFunctions.invalidLevel(event.scheduledcost);
                      
       return valid;
                    
    }
    
       commonFunctions.baselineValid = function(evt, scope, event){
           event = event || scope.ctrl.event[evt];
           var valid = event &&
                    !(event == {}) &&
                       (event.hasOwnProperty('baselinedate') && event.baselinedate || "") != "" &&  
                       (event.hasOwnProperty('baselinelikelihood') && event.baselinelikelihood ||  "") != ""  &&
                       (event.hasOwnProperty('baselinetechnical') && event.baselinetechnical ||  "") != ""  &&
                       (event.hasOwnProperty('baselineschedule') && event.baselineschedule ||  "") != ""  &&
                       (event.hasOwnProperty('baselinecost') && event.baselinecost ||  "") != ""  &&
                      
                       !commonFunctions.invalidLevel(event.baselinelikelihood) &&
                      !commonFunctions.invalidLevel(event.baselinetechnical) &&
                      !commonFunctions.invalidLevel(event.baselineschedule) &&
                      !commonFunctions.invalidLevel(event.baselinecost);
                    
        return valid;
       }
    
    
    
    commonFunctions.evtValid = function(evt, scope){
         var valid = !(scope.ctrl.event[evt] == {}) && (scope.ctrl.event[evt]) && ((scope.ctrl.event[evt].eventtitle || "") != "")   &&
                      ((scope.ctrl.event[evt].eventownerid || "") != "" || evt == 0) && 
                      (scope.ctrl.event[evt].baselinedate || "") != "" &&
                      
                      
                     
                      (scope.ctrl.event[evt].baselinelikelihood ||  "") != ""  &&
                      (scope.ctrl.event[evt].baselinetechnical ||  "") != ""  &&
                      (scope.ctrl.event[evt].baselinecost ||  "") != ""  &&
                      (scope.ctrl.event[evt].baselineschedule ||  "") != ""  &&
                       
                      !commonFunctions.invalidLevel(scope.ctrl.event[evt].baselinelikelihood) &&
                      !commonFunctions.invalidLevel(scope.ctrl.event[evt].baselinetechnical) &&
                      !commonFunctions.invalidLevel(scope.ctrl.event[evt].baselineschedule) &&
                      !commonFunctions.invalidLevel(scope.ctrl.event[evt].baselinecost) 
                      
                      
                      &&
                      (
                      ( 
                      (scope.ctrl.event[evt].scheduledate || "") != "" &&  
                      (scope.ctrl.event[evt].scheduledlikelihood ||  "") != ""  &&
                      (scope.ctrl.event[evt].scheduledtechnical ||  "") != ""  &&
                      (scope.ctrl.event[evt].scheduledschedule ||  "") != ""  &&
                      (scope.ctrl.event[evt].scheduledcost ||  "") != ""  &&        
                      !commonFunctions.invalidLevel(scope.ctrl.event[evt].scheduledlikelihood) &&
                      !commonFunctions.invalidLevel(scope.ctrl.event[evt].scheduledtechnical) &&
                      !commonFunctions.invalidLevel(scope.ctrl.event[evt].scheduledschedule) &&
                      !commonFunctions.invalidLevel(scope.ctrl.event[evt].scheduledcost)
                      
                       )
                       ||
                       (
                       (scope.ctrl.event[evt].actualdate || "") != "" &&  
                       (scope.ctrl.event[evt].actuallikelihood ||  "") != ""  &&
                       (scope.ctrl.event[evt].actualtechnical ||  "") != ""  &&
                       (scope.ctrl.event[evt].actualschedule ||  "") != ""  &&
                       (scope.ctrl.event[evt].actualcost ||  "") != ""  &&
                      
                       !commonFunctions.invalidLevel(scope.ctrl.event[evt].actuallikelihood) &&
                      !commonFunctions.invalidLevel(scope.ctrl.event[evt].actualtechnical) &&
                      !commonFunctions.invalidLevel(scope.ctrl.event[evt].actualschedule) &&
                      !commonFunctions.invalidLevel(scope.ctrl.event[evt].actualcost)
                      )
                      );   
         commonFunctions.hasData(evt, scope); 
         if (scope.ctrl.event[evt])      
            scope.ctrl.event[evt].valid = valid;
         return valid;   
    }
    
    commonFunctions.evtDirty = function(evt, scope){
         var dirty = !(scope.ctrl.event[evt] == {}) && ((scope.ctrl.event[evt].eventtitle || "") != "")   ||
                      (scope.ctrl.event[evt].ownerid || "") != "" || 
                      (scope.ctrl.event[evt].baselinedate || "") != "" ||
                      
                      (scope.ctrl.event[evt].baselinelikelihood ||  "") != "" ||
                      (scope.ctrl.event[evt].baselinetechnical ||  "") != "" ||
                      (scope.ctrl.event[evt].baselinecost ||  "") != ""  ||
                      (scope.ctrl.event[evt].baselineschedule ||  "") != ""  ||
                     
                      (
                      ( 
                      (scope.ctrl.event[evt].scheduledate || "") != "" ||  
                      (scope.ctrl.event[evt].scheduledlikelihood ||  "") != ""  ||
                      (scope.ctrl.event[evt].scheduledtechnical ||  "") != ""  ||
                      (scope.ctrl.event[evt].scheduledschedule ||  "") != ""  ||
                      (scope.ctrl.event[evt].scheduledcost ||  "") != ""
                      
                       )
                       ||
                       (
                       (scope.ctrl.event[evt].actualdate || "") != "" ||  
                       (scope.ctrl.event[evt].actuallikelihood ||  "") != ""  ||
                       (scope.ctrl.event[evt].actualtechnical ||  "") != ""  ||
                       (scope.ctrl.event[evt].actualschedule ||  "") != "" ||
                       (scope.ctrl.event[evt].actualcost ||  "") != ""
                      )
                      );
                      if (scope.ctrl.event[evt])             
                        scope.ctrl.event[evt].dirty = dirty;
         return dirty;   
    }  
     
    commonFunctions.hasData = function(evt, scope){
         var hasData = !(scope.ctrl.event[evt] == {}) || ((scope.ctrl.event[evt].eventtitle || "") != ""   ||
                      (scope.ctrl.event[evt].eventownerid || "") != "" || 
                      (scope.ctrl.event[evt].actualdate || "") != "" ||
                      (scope.ctrl.event[evt].scheduledate || "") != ""  ||
                      (scope.ctrl.event[evt].scheduledlikelihood ||  "") != ""  ||
                      (scope.ctrl.event[evt].scheduledtechnical ||  "") != ""  ||
                      (scope.ctrl.event[evt].scheduledschedule ||  "") != ""  ||
                      (scope.ctrl.event[evt].scheduledcost ||  "") != "");
         
         if (scope.ctrl.event[evt])
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