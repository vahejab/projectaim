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
        .when('action@view', 'action/view')
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
            files: ['/app/tool/home/HomeController.js'],
            serie: true
        },
        {
            name: 'action@summary',
            files: ['/app/tool/action/ActionController.js'],
            serie: true
        },
        {
            name: 'action@create',
            files: [
                    '/app/tool/action/style.css',
                    '/app/tool/action/CreateActionController.js'
            ],
            serie: true
        },
        {
            name: 'action@view',
            files: [
                    '/app/tool/action/ViewActionItem.css',
                    '/app/tool/action/ViewActionController.js'
            ],
            serie: true
        },
        {
            name: 'risk',
            files: ['/app/tool/risk/RiskController.js'],
            serie: true
        }]
    });

    $stateProvider
        .state('home',
        {
            url: "/home",
            resolve: res,
            templateUrl: '/app/tool/home/Home.html'
        })
        .state('action@summary',
        {
            url: "/action/summary",
            resolve: res,
            templateUrl: '/app/tool/action/ActionItems.html'
        })
        .state('action@create',
        {
            url: "/action/create",
            resolve: res,
            //cache: false,
            templateUrl: '/app/tool/action/CreateActionItem.html',
            controller: 'CreateActionController'
        })
        .state('action@view',
        {
            url: "/action/view/:id",
            params: {
                id: {
                    array: false
             }
            },
            resolve: res,
            //cache: false,
            templateUrl: '/app/tool/action/ViewActionItem.html',
            controller: 'ViewActionController'
        })
        .state('risk',
        {
            url: "/risks",
            resolve: res,
            templateUrl: '/app/tool/risk/Risks.html'
        });
}