angular.module('Risk').controller('RiskController', ['$resource', '$scope', '$state', 'DTOptionsBuilder', function($resource, $scope, $state, DTOptionsBuilder){
  
        function GetRisks()
        {
            return $resource('risks.json').query().$promise;
        }
       
        $scope.init = function(){
            var vm = this;
            GetRisks().then(function(results){            
                
                $scope. actionitems = results;
                vm.dtOptions = DTOptionsBuilder.newOptions()
                .withPaginationType('full_numbers')
                .withDisplayLength(10)
                //.withOption('order', [1, 'desc'])
                .withOption('scrollY', 500)
                .withOption('scrollX', '100%')
                .withDOM('lftrpi')
                .withScroller();
            });
        }
}]);
