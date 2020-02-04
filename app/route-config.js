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
        .when('risk@summary', 'risk/summary')
        .when('risk@create', 'risk/create')
        .when('risk@edit', 'risk/edit')
        .when('risk@config', 'risk/config')
        .when('risk@dashboard', 'risk/dashboard')
        .when('home', 'home')
        .otherwise('main');
        
    $ocLazyLoadProvider.config(
    {
        modules: [
        {
            name: 'home',
            serie: true,
            files: ['/app/tool/home/HomeController.js'],
        },
        {
            name: 'action@summary',
            serie: true,
            files: ['/app/tool/action/ActionItems.css',
                    '/app/tool/action/ActionDirective.js',
                    '/app/tool/action/ActionController.js'
            ],
        },
        {
            name: 'action@create',
            serie: true,
            files: [
                    '/app/tool/action/CreateActionItem.css',
                    '/app/tool/action/ActionDirective.js',
                    '/app/tool/action/CreateActionController.js'
            ]
        },
        {
            name: 'action@view',
            serie: true,
            files: [
                    '/app/tool/action/ViewActionItem.css',
                    '/app/tool/action/ActionDirective.js',
                    '/app/tool/action/ViewActionController.js'
            ]
        },
        {
            name: 'action@edit',
            serie: true,
            files: [
                    '/app/tool/action/EditActionItem.css',   
                    '/app/tool/action/ActionDirective.js',
                    '/app/tool/action/EditActionController.js'
            ]
        },
        {
            name: 'risk@summary',
            serie: true,
            files: [
                    '/app/tool/risk/RiskSummary.css', 
                    '/app/tool/risk/directives/RiskDirective.js',
                    '/app/tool/risk/directives/GetRisksDirective.js',
                    '/app/tool/risk/RiskSummaryController.js'
            ],
        },
        {
            name: 'risk@create',
            serie: true,
            files: [
                    '/app/tool/risk/CreateRisk.css',   
                   // '/app/css/bootstrap/bootstrap.min.css',  
                    '/app/tool/risk/services/DOMService.js',
                    '/app/tool/risk/services/ValidationService.js', 
                    '/app/tool/risk/directives/RiskDirective.js',
                    '/app/tool/risk/directives/GetUsersDirective.js',
                    '/app/tool/risk/CreateRiskController.js'
            ]                                                             
        },
        {
            name: 'risk@edit',
            serie: true,
            files: [
                    '/app/tool/risk/EditRisk.css',
                    '/app/css/bootstrap/bootstrap.min.css',
                    '/app/tool/risk/services/DOMService.js',
                    '/app/tool/risk/services/ValidationService.js',
                    '/app/tool/risk/directives/RepeatEventsDone.js',
                    '/app/tool/risk/directives/GetRiskDirective.js',
                    '/app/tool/risk/directives/RiskDirective.js',
                    '/app/tool/risk/EditRiskController.js'
            ]
        },
        {
            name: 'risk@config',
            serie: true,
            files: ['/app/tool/risk/RiskMatrixConfig.css',
                    '/app/tool/risk/directives/RiskDirective.js',
                    '/app/tool/risk/RiskMatrixConfigController.js'
            ]
        },
        {
            name: 'risk@dashboard',
            serie: true,
            files: ['/app/tool/risk/RiskDashboard.css', 
                    //'/app/css/bootstrap/bootstrap.min.css',
                    '/app/tool/risk/services/DOMService.js',
                    '/app/tool/risk/directives/RepeatDoneDirective.js',
                    '/app/tool/risk/services/ValidationService.js',
                    '/app/tool/risk/directives/RiskDirective.js',
                    '/app/tool/risk/RiskDashboardController.js'
            ]
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
            templateUrl: '/app/tool/action/ActionItems.html',
            controller: 'ActionController'
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
        .state('risk@summary',
        {
            url: "/risk/summary",
            resolve: res,
            templateUrl: '/app/tool/risk/RiskSummary.html',
            controller: 'RiskSummaryController'
        })
        .state('risk@create',
        {
            url: "/risk/create",
            resolve: res,
            templateUrl: '/app/tool/risk/CreateRisk.html',
            controller: 'CreateRiskController'
        })
        .state('risk@edit',
        {
            url: "/risk/edit/:id",
            params: {
                id: {
                    array: false
                }
            },
            resolve: res,
            templateUrl: '/app/tool/risk/EditRisk.html',
            controller: 'EditRiskController'
        })
        .state('risk@config',
        {
            url: "/risk/config",
            resolve: res,
            templateUrl: '/app/tool/risk/RiskMatrixConfig.html',
            controller: 'RiskMatrixConfigController'
        })
        .state('risk@dashboard',
        {
            url: "/risk/dashboard",
            resolve: res,
            templateUrl: '/app/tool/risk/RiskDashboard.html',
            controller: 'RiskDashboardController'
        });
}