'use strict'

var module; 
var angularDC; 
var crossFilter;
var reductIO;
var lodash; 

var jQuery;
var moment;     
var app;
          
var define;

require.config({
    paths: {
        angular: './../../app/js/angularjs-1.7.8/angular',
        angularAMD: './../app/js/angularAMD/angularAMD',
        angularResource: './../../app/js/angularjs-1.7.8/angular-resource',
        angularAnimate: './../../app/js/angularjs-1.7.8/angular-animate',
        angularMessages: './../../app/js/angularjs-1.7.8/angular-messages',
        angularSanitize: './../../app/js/angularjs-1.7.8/angular-sanitize',
        angularRoute: './../../app/js/angularjs-1.7.8/angular-ui-router',
        stateHelper: './../../app/js/angularjs-1.7.8/statehelper',
        uiSelect: './../../app/js/ui-select/dist/select',
        ocLazyLoad: './../../app/js/ocLazyLoad/ocLazyLoad',
        textEncoderLite: './../../app/js/text-encoder-lite/text-encoder-lite',
        base64js: './../../app/js/base64js/base64js.min',
        angularGridster: './../../app/js/ag-grid/dist/ag-grid-community',
        jquery: './../../app/js/jquery-1.12.1/jquery.min',                       
        jqueryResize: './../../app/js/javascript-detect-element-resize/jquery.resize',
        momentJS: './../../app/js/moment-2.3.1/moment.min', 
        bootstrapJS: './../../app/js/bootstrap-4.0.0/bootstrap',
        uiBootstrap: './../../app/js/ui-bootstrap-3.0.6/ui-bootstrap-tpls-3.0.6',
        popper: './../../app/js/popper-1.12.9/popper',
        d3JS: './../../app/js/d3js-4.4.0/d3',
        angularDC: './../../app/js/angular-dc/angular-dc',
        crossFilter: './crossfilter',
        reductIO: './../../redutio/src/reductio',
        lodash: './lodash',
        agGrid: './../../app/js/ag-grid/dist/ag-grid-community',
        routeConfig: './../../app/route-config',
        app: './../../app/app'
    }
});

 define('dependencies',
         ['require',   
         'angular',
         'angularAMD',
         'angularResource', 
         'angularAnimate', 
         'angularMessages', 
         'angularSanitize', 
         'angularRoute', 
         'stateHelper',
         'uiSelect',
         'ocLazyLoad',
         'textEncoderLite',
         'base64js',
         'angularGridster',
         'jquery',
         'jqueryResize',
         'momentJS',
         'bootstrapJS',
         'uiBootstrap', 
         'popper',
         'd3JS', 
         'angularDC', 
         'crossFilter', 
         'reductIo', 
         'lodash',
         'agGrid',
         'routeConfig',
         'app'
         ], function(require, angular
 /*angularJS,
             angularResource, 
             angularAnimate, 
             angularMessages, 
             angularSanitize, 
             angularRoute, 
             stateHelper,
             uiSelect,
             ocLazyLoad,
             textEncoderLite,
             base64js,
             angularGridster,
             jquery,
             jqueryResize,
             momentJS,
             bootstrapJS,
             uiBootstrap, 
             popper,
             d3JS, 
             angularDC, 
             crossFilter, 
             reductIo, 
             lodash,
             agGrid,
             routeConfig*/){
                 require('angular');
                 require('angularAMD'),
                 require('angularResource'); 
                 require('angularAnimate'); 
                 require('angularMessages'); 
                 require('angularSanitize'); 
                 require('angularRoute'); 
                 require('stateHelper');
                 require('uiSelect');
                 require('ocLazyLoad');
                 require('textEncoderLite');
                 require('base64js');
                 require('angularGridster');
                 require('bootstrapJS');
                 require('jquery');
                 require('jqueryResize');
                 require('momentJS');
                 require('uiBootstrap'); 
                 require('popper');
                 require('d3JS'); 
                 require('angularDC'); 
                 require('crossFilter'); 
                 require('reductIo'); 
                 require('lodash');
                 require('agGrid');
                 require('routeConfig');
                 require('app');               
});               
   
   
function universe(data, options) {
      var service = {
        options: _.assign({}, options),
        columns: [],
        filters: {},
        dataListeners: [],
        filterListeners: [],
      }

      var cf = require('./crossfilter')(service)
      var filters = require('./filters')(service)

      data = cf.generateColumns(data)

      return cf.build(data)
        .then(function (data) {
          service.cf = data
          return _.assign(service, {
            add: cf.add,
            remove: cf.remove,
            column: require('./column')(service),
            query: require('./query')(service),
            filter: filters.filter,
            filterAll: filters.filterAll,
            applyFilters: filters.applyFilters,
            clear: require('./clear')(service),
            destroy: require('./destroy')(service),
            onDataChange: onDataChange,
            onFilter: onFilter,
          })
        })

      function onDataChange(cb) {
        service.dataListeners.push(cb)
        return function () {
          service.dataListeners.splice(service.dataListeners.indexOf(cb), 1)
        }
      }

      function onFilter(cb) {
        service.filterListeners.push(cb)
        return function () {
          service.filterListeners.splice(service.filterListeners.indexOf(cb), 1)
        }
      }
  }  