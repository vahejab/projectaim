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

         if (onresize) {
                onresize(chart, width, height, false, id);
         }
            var elem = document.getElementById(id); 
            var padding = parseInt(window.getComputedStyle(elem, null).getPropertyValue('padding-top'));
                    
            var height = (Math.floor(elem.offsetHeight)) 
                        - 2.0*parseInt(padding) - padding;
            var width = height;
           
              
           window.onresize = function(){
                resize(chart, width, height, onresize, id);
           }                 
}


var resize = function(chart, width, height, onresize, id) {
    setTimeout(function(){
        
        if (onresize) {
            onresize(chart, width, height, false, id);
        }
        
        
        var elem = document.getElementById(id); 
        var padding = parseInt(window.getComputedStyle(elem, null).getPropertyValue('padding-top'));
        
        var height = (Math.floor(elem.offsetHeight)) 
                   - 2.0*parseInt(padding);
        var width = (Math.floor(parseFloat(window.getComputedStyle(elem,null).width))) 
                   - 2.0*parseInt(padding);
        
           
         
    
        chart
        .width(width)
        .height(height)
        .radius(height/2.0)
        .innerRadius(height/4.0)
        .transitionDuration(0);
      
        var left = (elem.getBoundingClientRect().width-padding)/2.0 -(width)/2.0 - 2.0*padding;
        
        var top = elem.getBoundingClientRect().top + padding/2.0;
      
        if ((document.querySelectorAll("risk-chart svg")).length > 0)
           (document.querySelectorAll("risk-chart svg:first-of-type g:first-of-type")[0]).setAttribute("transform", "translate(" + Math.floor(left) + ", " + Math.floor(top - 55) + ")");
        if (chart.rescale) {
            chart.rescale();
        }
        chart.render();
        svg = document.querySelector("svg:first-of-type");
        svg.setAttribute('width', width);
        svg.setAttribute('height', height);
        
        
        svg2 = document.querySelector("svg g.star");
        svg2.setAttribute('width', 55);
        svg2.setAttribute('height', 55);
      
        
        chart.redraw();
    }, 200);  
};
