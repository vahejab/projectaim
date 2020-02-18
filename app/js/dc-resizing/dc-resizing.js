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

function apply_resizing(chart, width, height, onresize, id, widthEqualsHeight = true) {
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
        var width; 
        if (widthEqualsHeight == true)
            width = height;
        else
            width = Math.floor(elem.offsetWidth) - 2.0*parseInt(padding) - padding;

            
        chart.render();
        window.onresize = function(){

             resize(chart, width, height, onresize, id);
        }                 
}


var resize = function(chart, width, height, onresize, id) {
    setTimeout(function(){
        
        if (onresize) {
            onresize(chart, width, height, false, id);
        }
        
        
        var elem = document.getElementById(id); console.log(id); 
        var padding = parseInt(window.getComputedStyle(elem, null).getPropertyValue('padding-top'));
        
        var height = (Math.floor(elem.offsetHeight)) 
                   - 2.0*parseInt(padding);
        var width = (Math.floor(parseFloat(window.getComputedStyle(elem,null).width))) 
                   - 2.0*parseInt(padding);
        
        var left;   
        var top; 
        if (id == 'risk-chart'){
          chart
            .width(width)
            .height(height)
            .radius(height/2.0)
            .innerRadius(height/4.0)
            .transitionDuration(0);
          
            left = (elem.getBoundingClientRect().width-padding)/2.0 -(width)/2.0 - 2.0*padding - elem.offsetLeft;
            top = elem.getBoundingClientRect().top - padding/2.0 - elem.offsetTop;
            console.log(Math.floor(left));
            if ((document.querySelectorAll("#" + id + " svg")).length > 0)
                (document.querySelectorAll("#" + id + " svg:first-of-type g:first-of-type")[0]).setAttribute("transform", "translate(" + Math.floor(left) + ", " + Math.floor(top - 55) + ")");
      
        }
        
        else{ 
            chart.width(width)
                 .height(height)
                 .transitionDuration(0);
                 
            //(document.querySelectorAll("#" + id + " svg:first-of-type g:first-of-type")[0]).setAttribute("transform", "translate(0,0)");

        }
        
        
        
       
       if (chart.rescale) {
            chart.rescale();
        }
        
        chart.render();
        svg = document.querySelector("#" + id + " svg:first-of-type g:first-of-type");

        
        svg.setAttribute('width', width);
        svg.setAttribute('height', height);
        
        chart.redraw();
    }, 200);  
};
