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
        .when('action@summary', 'action/summary')
        .when('action@create', 'action/create')
        .when('issue', 'issue')
        .when('lesson', 'lesson')
        .when('opportunity', 'opporutnity')
        .when('risk', 'risk')
        .when('home', 'home')
        .otherwise('main');
        
    $ocLazyLoadProvider.config(
    {
        modules: [
        {
            name: 'home',
            files: ['/app/tool/home/HomeController.js']
        },
        {
            name: 'action@summary',
            files: ['/app/tool/action/ActionController.js']
        },
        {
            name: 'action@createaction',
            files: ['/app/tool/action/CreateActionController.js']
        },
        {
            name: 'risk',
            files: ['/app/tool/risk/RiskController.js']
        }]
    });

    $stateProvider
        .state('home',
        {
            url: "/home",
            resolve: res,
            templateUrl: '/app/tool/home/Home.html'
        }).state('action@summary',
        {
            url: "/action/summary",
            resolve: res,
            templateUrl: '/app/tool/action/ActionItems.html'
        })
        .state('action@createaction',
        {
            url: "/action/create",
            resolve: res,
            //cache: false,
            templateUrl: '/app/tool/action/CreateActionItem.html',
            controller: 'CreateActionController'
        }).state('risk',
        {
            url: "/risks",
            resolve: res,
            templateUrl: '/app/tool/risk/Risks.html'
        });
}