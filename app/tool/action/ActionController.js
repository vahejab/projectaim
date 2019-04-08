angular.module('Action').controller('ActionController', ['$resource', '$scope', '$state', '$timeout', '$q', 'DTOptionsBuilder', function($resource, $scope, $state, $timeout, $q, DTOptionsBuilder){
        $scope.actionitems = {};    
    
        function GetActionItems()
        {
           return $resource('actionitems.json').query().$promise;
        }
       
        $scope.init = function(){
            var vm = this;
            vm.dtOptions = DTOptionsBuilder.fromFnPromise(function() {
                var defer = $q.defer();
                GetActionItems().then(function(result) {
                    $scope.actionitems = result;
                    defer.resolve(result);
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
