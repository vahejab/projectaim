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
        .when('action@edit', 'action/edit')
        .when('issue', 'issue')
        .when('lesson', 'lesson')
        .when('opportunity', 'opporutnity')
        .when('risk@create', 'risk/create')
        .when('home', 'home')
        .otherwise('main');
        
    $ocLazyLoadProvider.config(
    {
        modules: [
        {
            name: 'home',
            files: ['/app/tool/home/HomeController.js'],
        },
        {
            name: 'action@summary',
            files: ['/app/tool/action/ActionItems.css',
                    '/app/tool/action/ActionDirective.js',
                    '/app/tool/action/ActionController.js'
            ],
        },
        {
            name: 'action@create',
            files: [
                    '/app/tool/action/CreateActionItem.css',
                    '/app/tool/action/ActionDirective.js',
                    '/app/tool/action/CreateActionController.js'
            ]
        },
        {
            name: 'action@view',
            files: [
                    '/app/tool/action/ViewActionItem.css',
                    '/app/tool/action/ActionDirective.js',
                    '/app/tool/action/ViewActionController.js'
            ]
        },
        {
            name: 'action@edit',
            files: [
                    '/app/tool/action/EditActionItem.css',
                    '/app/tool/action/ActionDirective.js',
                    '/app/tool/action/EditActionController.js'
            ]
        },
        {
            name: 'risk@create',
            files: ['/app/tool/risk/CreateRisk.css',
                    '/app/tool/risk/RiskDirective.js',
                    '/app/tool/risk/CreateRiskController.js'
            ],
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
        .state('action@edit',
        {
            url: "/action/edit/:id",
            params: {
                id: {
                    array: false
                }
            },
            resolve: res,
            //cache: false,
            templateUrl: '/app/tool/action/EditActionItem.html',
            controller: 'EditActionController'
        })
        .state('risk@create',
        {
            url: "/risk/create",
            resolve: res,
            templateUrl: '/app/tool/risk/CreateRisk.html',
            controller: 'CreateRiskController'
        });
}