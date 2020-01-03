var find_query = function () {
    var _map = window.location.search.substr(1).split('&').map(function (a) {
        return a.split('=');
    }).reduce(function (p, v) {
        if (v.length > 1)
            p[v[0]] = decodeURIComponent(v[1].replace(/\+/g, " "));
        else
            p[v[0]] = true;
        return p;
    }, {});
    return function (field) {
        return _map[field] || null;
    };
}();
var resizeMode = find_query('resize') || 'widhei';

function apply_resizing(chart, width, height, onresize, id) {
    /*if (resizeMode.toLowerCase() === 'viewbox') {
        chart
            .width(600)
            .height(400)
            .useViewBoxResizing(true);
        d3.select(chart.anchor()).classed('fullsize', true);
    } else {*/

        setTimeout(function(){
            
        var elem = document.getElementById(id); 
        var padding = parseInt(window.getComputedStyle(elem, null).getPropertyValue('padding-top'));
                
        var height = (Math.floor(elem.offsetHeight)) 
                    - 2.0*parseInt(padding) - padding;
        var width = height;
                        
        var left = (elem.getBoundingClientRect().width-padding)/2.0 -(width)/2.0 - padding;
        var top = padding/2.0;
        if (document.querySelectorAll(chart.anchor() + " svg").length > 0)
        (document.querySelectorAll(chart.anchor() + " svg")[0]).setAttribute("transform", "translate(" + Math.floor(left) + ", " + Math.floor(top) + ")")
        }, 200);
        window.onresize = function () {
            
            setTimeout(function(){
               
                if (onresize) {
                    onresize(chart);
                }
                var elem = document.getElementById(id); 
                var padding = parseInt(window.getComputedStyle(elem, null).getPropertyValue('padding-top'));
                
                var height = (Math.floor(elem.offsetHeight)) 
                           - 2.0*parseInt(padding) - padding;
                var width = height;
                
                chart
                .width(width)
                .height(height)
                .radius(width/2.0)
                .innerRadius(width/4.0);
               
                var left = (elem.getBoundingClientRect().width-padding)/2.0 -(width)/2.0 - padding;
                var top = padding/2.0;
            debugger;
               if (document.querySelectorAll(chart.anchor() + " svg").length > 0)
                (document.querySelectorAll(chart.anchor() + " svg")[0]).setAttribute("transform", "translate(" + Math.floor(left) + ", " + Math.floor(top) + ")")
                if (chart.rescale) {
                    chart.rescale();
                }
               chart.redraw();
            }, 200);  
        };
// }
}
