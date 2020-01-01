'use strict'
  
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