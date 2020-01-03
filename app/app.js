var app;
var refresh = false;
var formcheck = false;
var common;

define('App', ['angular', // 'angularjs-1.7.8/angular',
        'angularAMD', // 'angularAMD/src/angularAMD',
        'jquery', // 'jQuery-1.12.1/jQuery.min',
        'crossfilter', // 'crossfilter/src/crossfilter',
        'd3', // 'd3js-4.4.0/d3',
        'dc', // 'dc.js-3.1.9/dc',
        'dc-resizing', // 'dc-reziing/dc-resizing',
        'agGrid', // 'ag-grid/dist/ag-grid-community',
        'gridster', // 'angular-gridster/src/angular-gridster',
        'angular-resource', // 'angularjs-1.7.8/angular-resource',
        'angular-animate', // 'angularjs-1.7.8/angular-animate',
        'angular-messages', // 'angularjs-1.7.8/angular-messages',
        'angular-sanitize', // 'angularjs-1.7.8/angular-sanitize',
        'angular-ui-router', // 'angularjs-1.7.8/angular-ui-router',
        'statehelper', // 'angularjs-1.7.8/statehelper',
        '_', // 'underscore/underscore',
        'lodash', // 'lodash/lodash.min',
        'angularDc', // 'angular-dc/angular-dc',
        'ocLazyLoad', // 'ocLazyLoad/ocLazyLoad'
        'base64js', // 'base64js/base64js.min',
        'select', // 'ui-select/dist/select',
        'popper', // 'popper-1.12.9/popper', 
        'bootstrap', // 'bootstrap-4.0.0/bootstrap',
        'uiBoootstrap', // 'ui-bootstrap-3.0.6/ui-bootstrap-tpls-3.0.6',
        'textEncoderLite', // 'text-encoder-lite/text-encoder-lite', 
        'jqueryResize', // 'javascript-detect-element-resize/jquery.resize',
        'moment'
    ], // 'app/js/moment-2.3.1/moment.min', 

    function (angular, // angularjs-1.7.8/angular,
        angularAMD, // angularAMD/src/angularAMD,
        jquery, // jQuery-1.12.1/jQuery.min,
        crossfilter, // crossfilter/src/crossfilter,
        d3, // d3js-4.4.0/d3,
        dc, // dc.js-3.1.9/dc,
        dcResizing, // dc-resizing/dc-resizing
        agGrid, // ag-grid/dist/ag-grid-community,
        gridster, // angular-gridster/src/angular-gridster,
        angularResource, // angularjs-1.7.8/angular-resource,
        angularAnimate, // angularjs-1.7.8/angular-animate,
        angularMessges, // angularjs-1.7.8/angular-messages,
        angularSanitize, // angularjs-1.7.8/angular-sanitize,
        angularUiRouter, // angularjs-1.7.8/angular-ui-router,
        statehelper, // angularjs-1.7.8/statehelper,
        _, // underscore/underscore
        lodash, // lodash/lodash.min,
        angularDc, // angular-dc/angular-dc,
        ocLazyLoad, // ocLazyLoad/ocLazyLoad.js
        base64js, // base64js/base64js.min,
        select, // ui-select/dist/select,
        popper, // popper-1.12.9/popper, 
        bootstrap, // bootstrap-4.0.0/bootstrap,
        uiBoootstrap, // ui-bootstrap-3.0.6/ui-bootstrap-tpls-3.0.6,
        textEncoderLite, // text-encoder-lite/text-encoder-lite, 
        jqueryResize, // javascript-detect-element-resize/jquery.resize,
        moment) { // app/js/moment-2.3.1/moment.min, ){

        require(['angular', // 'angularjs-1.7.8/angular'
        'angularAMD', // 'angularAMD/src/angularAMD',
        'jquery', // 'jQuery-1.12.1/jQuery.min',
        'crossfilter', // 'crossfilter/src/crossfilter',
        'd3', // 'd3js-4.4.0/d3',
        'dc', // 'dc.js-3.1.9/dc',
        'dc-resizing', // 'dc-reziing/dc-resizing'
        'agGrid', // 'ag-grid/dist/ag-grid-community',
        'gridster', // 'angular-gridster/src/angular-gridster',
        'angular-resource', // 'angularjs-1.7.8/angular-resource',
        'angular-animate', // 'angularjs-1.7.8/angular-animate',
        'angular-messages', // 'angularjs-1.7.8/angular-messages',
        'angular-sanitize', // 'angularjs-1.7.8/angular-sanitize',
        'angular-ui-router', // 'angularjs-1.7.8/angular-ui-router',
        'statehelper', // 'angularjs-1.7.8/statehelper',
        '_', // 'underscore/underscore',
        'lodash', // 'lodash/lodash.min',  
        'angularDc', // 'angular-dc/angular-dc',
        'ocLazyLoad', // 'ocLazyLoad/ocLazyLoad.js'
        'base64js', // 'base64js/base64js.min',
        'select', // 'ui-select/dist/select',
        'popper', // 'popper-1.12.9/popper', 
        'bootstrap', // 'bootstrap-4.0.0/bootstrap',
        'uiBoootstrap', // 'ui-bootstrap-3.0.6/ui-bootstrap-tpls-3.0.6',
        'textEncoderLite', // 'text-encoder-lite/text-encoder-lite', 
        'jqueryResize', // 'javascript-detect-element-resize/jquery.resize',
        'moment'
    ], function (angular, // angularjs-1.7.8/angular,
        angularAMD, // angularAMD/src/angularAMD,
        jquery, // jQuery-1.12.1/jQuery.min,
        crossfilter, // crossfilter/src/crossfilter,
        d3, // d3js-4.4.0/d3,
        dc, // dc.js-3.1.9/dc,
        dcResizing,
        agGrid, // ag-grid/dist/ag-grid-community,
        gridster, // angular-gridster/src/angular-gridster,
        angularResource, // angularjs-1.7.8/angular-resource,
        angularAnimate, // angularjs-1.7.8/angular-animate,
        angularMessges, // angularjs-1.7.8/angular-messages,
        angularSanitize, // angularjs-1.7.8/angular-sanitize,
        angularUiRouter, // angularjs-1.7.8/angular-ui-router,
        statehelper, // angularjs-1.7.8/statehelper,
        underscore, // underscore/underscore
        lodash, // lodash/lodash.min,
        angularDc, // angular-dc/angular-dc,
        ocLazyLoad, // 'ocLazyLoad/ocLazyLoad.js'
        base64js, // base64js/base64js.min,
        select, // ui-select/dist/select,
        popper, // popper-1.12.9/popper, 
        bootstrap, // bootstrap-4.0.0/bootstrap,
        uiBoootstrap, // ui-bootstrap-3.0.6/ui-bootstrap-tpls-3.0.6,
        textEncoderLite, // text-encoder-lite/text-encoder-lite, 
        jqueryResize, // javascript-detect-element-resize/jquery.resize,
        moment) {

        //setTimeout(function () {
            angular = window.angular;
            common = angular.module('Common', ['oc.lazyLoad']);
            common.service("CommonService", function () {
                var commonFunctions = {};

                commonFunctions.offset = function (el) {
                    var rect = el.getBoundingClientRect(),
                        scrollLeft = window.pageXOffset || document.documentElement.scrollLeft,
                        scrollTop = window.pageYOffset || document.documentElement.scrollTop;
                    return {
                        top: rect.top + scrollTop,
                        left: rect.left + scrollLeft
                    }
                }

                commonFunctions.formatCriticality = function (value) {
                    switch (Number(value)) {
                        case 1:
                            return 'red';
                        case 2:
                            return 'yellow';
                        case 3:
                            return 'green';
                    }
                }

                commonFunctions.GetDate = function (date) {
                    if (date != '' && date != null)
                        return new Date(date);
                    return null;
                }

                commonFunctions.getStatus = function (date1, date2) {
                    return (date1 > date2) ? 'Late' : 'On Time';
                }

                commonFunctions.formatDate = function (date) {
                    return date.getFullYear() + "-" + ((date.getMonth() < 10) ? '0' + date.getMonth() : date.getMonth()) +
                        "-" + ((date.getDate() < 10) ? '0' + date.getDate() : date.getDate());
                }

                commonFunctions.dateValue = function (val) {
                    var year = val.getFullYear();
                    var month = val.getMonth() + 1;
                    var day = val.getDate();
                    dateValue = year + "-" + ((month < 10) ? '0' + month : month) + "-" + ((day < 10) ? '0' + day : day);
                    return dateValue;
                }

                commonFunctions.getDateValue = function (obj, scope, type, field) {
                    if (!obj && !obj.getValue()) {
                        scope[type][field] = '';
                        return;
                    }

                    if (obj.data && obj.data.value == '') {
                        scope[type][field] = '';
                        return;
                    }

                    scope[type][field] = commonFunctions.dateValue(obj.data.value);
                }

                commonFunctions.getItemValue = function (obj, scope, type, field) {
                    if (!obj && !obj.getValue()) {
                        scope[type][field] = '';
                        return;
                    }
                    scope[type][field] = obj.value || obj.data.value;
                }

                commonFunctions.getItemId = function (obj, scope, type, field) {
                    if (!obj && !obj.getValue()) {
                        scope[type][field] = 0;
                        return;
                    }
                    scope[type][field] = obj.value || obj.data.value;
                }

                commonFunctions.getTextValue = function (obj, scope, type, field) {

                    if (!obj && !obj.getValue()) {
                        scope[type][field] = '';
                        return;
                    }
                    scope[type][field] = obj.getValue();
                }

                return commonFunctions;
            });
            common.controller('commonController', ['CommonService', function(){
            
            }]);
        

            agGrid.initialiseAgGridWithAngular1(angular);
            angular.module('Home', []);
            angular.module('Action', ['ngResource', 'Common']);
            angular.module('Risk', ['ngResource', 'ngAnimate', 'Common', 'agGrid', 'ui.select', 'ui.bootstrap', 'gridster', 'angularDc']);
            app = angular.module('app', ['ui.router', 'oc.lazyLoad', 'ngResource', 'ngSanitize', 'Common', 'Home', 'Action', 'Risk']);

            app.controller('appController', function () {

            });


            app.config(['$ocLazyLoadProvider', '$stateProvider', '$urlRouterProvider', '$compileProvider', function ($ocLazyLoadProvider, $stateProvider, $urlRouterProvider, $compileProvider /*, $mdThemingProvider*/ ) {


                /**
                 * AngularJS default filter with the following expression:
                 * "person in people | filter: {name: $select.search, age: $select.search}"
                 * performs an AND between 'name: $select.search' and 'age: $select.search'.
                 * We want to perform an OR.
                 */
                app.filter('propsFilter', function () {
                    return function (items, props) {
                        var out = [];

                        if (angular.isArray(items)) {
                            var keys = Object.keys(props);

                            items.forEach(function (item) {
                                var itemMatches = false;

                                for (var i = 0; i < keys.length; i++) {
                                    var prop = keys[i];
                                    var text = props[prop].toLowerCase();
                                    if (item[prop].toString().toLowerCase().indexOf(text) !== -1) {
                                        itemMatches = true;
                                        break;
                                    }
                                }

                                if (itemMatches) {
                                    out.push(item);
                                }
                            });
                        } else {
                            // Let the output be the input untouched
                            out = items;
                        }

                        return out;
                    };
                });

                configRoutes($stateProvider, $urlRouterProvider, $ocLazyLoadProvider);
                $compileProvider.aHrefSanitizationWhitelist(/^\s*(https?|ftp|mailto|tel|file|blob):/);

            }]);

            return angularAMD.bootstrap(app, false, document.querySelector('body'), app);
        });
    });
//});

require(['App'], function () {});
