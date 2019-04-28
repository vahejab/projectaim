angular.module('Action').controller('ActionController', ['$http', '$resource', '$scope', '$state', '$timeout', 'DTOptionsBuilder', function($http, $resource, $scope, $state, $timeout, DTOptionsBuilder){
        $scope.actionitems = [];    
        $scope.actionitem = {
                actionitemid: '',
                actionitemtitle: '',
                criticality: '',
                assignor: '',
                owner: '',
                altowner: '',
                approver: '',
                assigneddate: '',
                duedate: '',
                ecd: '',
                completiondate: '',
                closeddate: ''
        };
        function GetActionItems2()
        {
           return $resource('actionitems.json').query().$promise;
        }
    
        $scope.init = function(){
            var vm = this;
            vm.dtOptions = DTOptionsBuilder
            .fromFnPromise(function(){
                return $http.get('api/actionitems').then(function(response){
                   if (response.data.Succeeded){
                        $.each(response.data.Result, function(key, actionitem){
                            response.data.Result[key] =  
                            [ 
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
                        });
                        $scope.actionitems = response.data.Result;
                        return response.data.Result;
                   }
                   else{
                    return [];
                   }
                 
                });
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
