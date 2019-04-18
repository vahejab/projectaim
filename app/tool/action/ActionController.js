angular.module('Action').controller('ActionController', ['$http', '$resource', '$scope', '$state', '$timeout', '$q', 'DTOptionsBuilder', function($http, $resource, $scope, $state, $timeout, $q, DTOptionsBuilder){
        $scope.actionitems = {};    
    
        function GetActionItems2()
        {
           return $resource('actionitems.json').query().$promise;
        }
     
        function GetActionItems() {           
            var defer = $q.defer();
            $http.get('api/actionitems')
                 .then(function(response){
                     defer.resolve(response);
                 });
            return defer.promise;
        }   
        
        var getRes = function(res){
            $.each(res, function(key, actionitem){
                res[key] =  [ 
                                actionitem.actionitemid, 
                                actionitem.actionitemtitle,
                                actionitem.criticality,
                                actionitem.assignor,
                                actionitem.owner,
                                actionitem.altowner,
                                actionitem.approver,
                                actionitem.assigneddate,
                                actionitem.duedate,
                                actionitem.ecd,
                                actionitem.completiondate,
                                actionitem.closeddate
                            ];
                console.log(actionitem)
                console.log(JSON.stringify(res[key]));            
                
            })
            $scope.actionitems = res;
        }
        
        function apply(scope, fn, res) {
            (scope.$$phase || scope.$root.$$phase) ? 
                        fn(res) : 
                        scope.$apply(fn(res));
        }
       
        $scope.init = function(){
            var vm = this;
            vm.dtOptions = DTOptionsBuilder.fromFnPromise(function() {
                var defer = $q.defer();

                GetActionItems().then(function(result){
                    apply($scope, getRes, result.data);
                    defer.resolve(result.data);
                });
                
                return defer.promise;
            })
            .withPaginationType('full_numbers')
            //.withOption('drawCallback', reload)
            .withDisplayLength(10)
            //.withOption('order', [1, 'desc'])
            .withOption('scrollY', 500)
            .withOption('scrollX', '100%')
            .withDOM('lftrpi')
            .withScroller();
        }           
}]);
