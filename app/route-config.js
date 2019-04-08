var state = '';

function load($ocLazyLoad, $q)
{
    var deferred = $q.defer();
    try
    {
        $ocLazyLoad.load(state).then(function ()
        {
            deferred.resolve();
        });
    }
    catch (ex)
    {
        deferred.reject(ex);
    }
    return deferred.promise;
}


function configRoutes($stateProvider, $urlRouterProvider, $ocLazyLoadProvider)
{
    var res = 
    {
        loadDependencies: ['$ocLazyLoad', '$q', load],
        allowed: function ($state$)
        {
            state = $state$.name;
        }
    };
       
    $urlRouterProvider
        .when('action', 'action')
        .when('issue', 'issue')
        .when('lesson', 'lesson')
        .when('opportunity', 'opporutnity')
        .when('risk', 'risk')
        .otherwise('main');
        
    $ocLazyLoadProvider.config(
    {
        modules: [
        {
            name: 'action',
            files: ['app/tool/action/ActionController.js']
        },
        {
            name: 'risk',
            files: ['app/tool/risk/RiskController.js']
        }]
    });

    $stateProvider
       .state('action',
        {
            url: "/actionitems",
            resolve: res,
            templateUrl: '/app/tool/action/ActionItems.html'
        });
        
        $stateProvider
            .state('risk',
        {
            url: "/risks",
            resolve: res,
            templateUrl: '/app/tool/risk/Risks.html'
        });
}