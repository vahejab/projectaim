angular.module('Risk').service("ValidationService", function() {
    var commonFunctions = {};

    commonFunctions.isLevelField = function(id){
            return (id == 'likelihood' || id == 'technical' || id == 'schedule' || id == 'cost');
    }
    
    commonFunctions.validLevel = function(obj){
        return obj.getValue().charCodeAt(0) - '0'.charCodeAt(0) >= 1 
            && obj.getValue().charCodeAt(0) - '0'.charCodeAt(0) <= 5;    
    }
    
    commonFunctions.isLevelField = function(id){
        return (id == 'likelihood' || id == 'technical' || id == 'schedule' || id == 'cost');
    } 
           
    commonFunctions.invalidLevel = function(lvl){
        return (lvl.charCodeAt(0) - '0'.charCodeAt(0) < 1) || (lvl.charCodeAt(0) - '0'.charCodeAt(0) > 5);
    }
    
    commonFunctions.valid = function(fields, $scope){
          for (var idx = 0; idx < fields.length; idx++){
            field = fields[idx];
            if (commonFunctions.isLevelField(field) && commonFunctions.invalidLevel($scope.risk[field]))
                return false;
            else if ($scope.risk[field] == '')
                return false;
        }
        return true; 
    }
   
    commonFunctions.riskIsValid = function(scope,l,t,s,c){
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
    
    commonFunctions.validate = function(elem, id){
       if (DOMops.isLevelField(id) && (!commonFunctions.validLevel(elem) || commonFunctions.fieldEmpty(elem))){
            DOMops.makeInvalid(id);
            DOMops.clearDot();                                                     
       }        
       else if (typeof elem !== 'undefined' && (elem.getValue() == 0 || commonFunctions.fieldEmpty(elem)))
            DOMops.makeInvalid(id);

       if (commonFunctions.valid())
          DOMops.enableElement("#submit");
       else
          DOMops.disableElement("#submit");
    }
               
    commonFunctions.validCharacter = function(c){
        return (c >= 32 && c <= 126);
    }
  
    commonFunctions.clearTextValue = function(scope, code, obj, field){
        if (!commonFunctions.validCharacter(code) || obj.getValue().trim() == '') 
        {
            scope.risk[field] = '';
            return;
        }
    }     
            
    commonFunctions.handleKeyPress = function(obj, code, attr){   
         commonFunctions.getTextValueAndValidate(code, obj, attr); 
         commonFunctions.validate(obj, attr);
    }
    
    commonFunctions.updateAndValidate = function(code, obj, attr){ 
        commonFunctions.clearTextValue(code, obj, attr); 
        commonFunctions.validate(obj, attr);
    }
    
    commonFunctions.getTextValueAndValidate = function(scope, code, obj, field){
        commonFunctions.clearTextValue(scope, code, obj, field);
        commonFunctions.clearValidation(field);  
        scope.getTextValue(obj, scope, 'risk', field); 
        commonFunctions.validate(obj, field);
    }
    
    return commonFunctions;
});