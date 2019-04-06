// route-config.js
function configRoutes($stateProvider, $urlRouterProvider, $ocLazyLoadProvider)
{
    $urlRouterProvider
        .when('action', 'action')
        .when('issue',  'issue')
        .when('lesson', 'lesson')
        .when('opportunity', 'opporutnity')
        .when('risk', 'risk')
        .otherwise('main');
    
    
    $ocLazyLoadProvider.config({
        modules: [{
            name: 'action',
            files: ['app/tool/action/ActionController.js']
        }]
    });
    
    $stateProvider
        .state('main', {
            url: "/main",
            //templateUrl: '/app/tool/home/home.html',
        });
     
     $stateProvider
        .state('action', {
            url: "/actionitems",
            resolve: {
                loadDependencies: ['$ocLazyLoad', '$q', function($ocLazyLoad, $q){
                    var deferred = $q.defer();
                    try{
                        $ocLazyLoad.load('action').then(function(){
                            deferred.resolve();
                        });
                    }
                    catch (ex){
                        deferred.reject(ex);
                    }
                    return deferred.promise;
                }]
            },
            templateUrl: '/app/tool/action/ActionItems.html'  
     });
                
     $stateProvider
        .state('action.summary', {
            url: "/actionitems/all",
            templateUrl: '/app/tool/action/ActionItems.html',
            controller: 'ActionController'    
        });     
}