angular.module('Action').controller('ActionController', ['$resource', '$scope', 'DTOptionsBuilder', function($resource, $scope, DTOptionsBuilder){
       
        function GetActionItems()
        {
            return $resource('actionitems.json').query().$promise;
        }
       
        $scope.init = function(){
            var vm = this;
            GetActionItems().then(function(results){            
                
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
