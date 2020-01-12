
dc.starChart =  function(parent, fill) {
    var _chart = {};
    var _count = null, _category = null;
    var _width, _height;
    var _root = null, _svg = null, _g = null;
    var _region;
    var _minHeight = 20;
    var _dispatch = d3.dispatch('jump');
   
    _chart.count = function(count) {
        if(!arguments.length)
            return _count;
        _count = count;
        return _chart;
    };

    _chart.category = function(category) {
        if(!arguments.length)
            return _category
        _category = category;
        return _chart;
    };

   
    function count() {
        return _count;
    }
    
    function category() {
        return _category;
    }

    function y(height) {
        return isNaN(height) ? 3 : _chart.width(0) - _chart.height(height);
    }

   

   _chart.redraw = function(fill) {
        var color = fill;  
        /*_svg
            .append('img')
            .attr("width", "55")
            .attr("height", "55")  
            .attr("src", "http://projectaim/app/assets/images/starlight.svg")
            .attr("transform", function(d) { return "translate(" + 25 + "," + 25 + ")"; }) */
            
            
        _svg.attr("d","M81 101 173 101 173 189 81 189Z")
        .attr("fill-rule","evenodd")
        .attr("clip-rule","evenodd")
                                .append('g')
                .attr("clip-path","url(#clip0)")
                .attr("transform","translate(-275 -195)")
                .append('path')
                .attr("d","M83.5001 145 95.6245 136.75 89.3949 123.75 104.166 122.461 105.5 108.194 118.959 114.211 127.5 102.5 136.041 114.211 149.5 108.194 150.835 122.461 165.605 123.75 159.376 136.75 171.5 145 159.376 153.25 165.605 166.25 150.835 167.539 149.5 181.806 136.041 175.789 127.5 187.5 118.959 175.789 105.5 181.806 104.166 167.539 89.3949 166.25 95.6245 153.25Z")
                .attr("stroke","#B4C7E7")
                 .attr("stroke-miterlimit","8")
                 .attr("fill","#B4C7E7")
                  .attr("fill-rule","evenodd")
                  .style("opacity", 0.0)
                 .transition()
                 .duration(500)
                 .style("opacity", 1.0);
        _svg = _svg
         .append('path')
         .attr("d","M100 144.5C100 129.864 111.864 118 126.5 118 141.136 118 153 129.864 153 144.5 153 159.136 141.136 171 126.5 171 111.864 171 100 159.136 100 144.5Z")
         .attr("fill","#FFFFFF")
         .attr("fill-rule","evenodd").attr("transform","translate(-275 -195)")
         .style("opacity", 0.0)
         .transition()
         .duration(500)
         .style("opacity", 1.0);
        return _chart;
            
    };     

   _chart.render = function() {
        generateSvg();
        
        if (_root.select('svg g.star'))
           _chart.redraw();
       
        return _chart;
    };

   _chart.on = function(event, callback) {
        _dispatch.on(event, callback);
        return _chart;
    };

   _chart.width = function(w) {
        if(!arguments.length)
            return _width;
        _width = w;
        return _chart;
    };

   _chart.height = function(h) {
        if(!arguments.length)
            return _height;
        _height = h;
        return _chart;
    };

   _chart.select = function(s) {
        return this._root.select(s);
    };

   _chart.selectAll = function(s) {
        return this._root.selectAll(s);
    };

    function resetSvg() {
        if (this._root.select('svg'))
           _chart.select('svg').remove();
        generateSvg();
    }

    function generateSvg() {
        _svg = _root.select('svg g:first-of-type').selectAll('path.star').data([0]);
        _svg = _svg.enter()    
            .append("g")
            .attr("width", "55px")
            .attr("height", "55px") 
            .attr("class", "star")
            .merge(_svg);
        
    }

    _root = d3.select(parent);
    return _chart;
}