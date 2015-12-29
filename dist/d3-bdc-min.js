var config,renderBDC;config={containerId:"#bdcgraph",width:900,height:500,margins:{top:20,right:70,bottom:30,left:50},colors:{standard:"#D93F8E",done:"#5AA6CB",good:"#97D17A",bad:"#FA6E69",labels:"#113F59"},startLabel:"Start",endLabel:"Ceremony",dateFormat:"%A",xTitle:"Daily meetings",dotRadius:4,standardStrokeWidth:2,doneStrokeWidth:2,goodSuffix:" :)",badSuffix:" :("},renderBDC=function(t,r){var a,e,n,o,l,d,i,s,c,u,f,h,g,p,m,x;return s=t[0],u=t[t.length-1],c=u.standard,f=d3.max(t,function(t){return t.done}),l=d3.select(r.containerId),l.select("*").remove(),g=d3.scale.linear().domain([0,t.length]).range([0,r.width]),m=d3.scale.linear().domain([Math.min(0,c-f),c]).range([r.height,0]),h=d3.svg.line().x(function(t,r){return g(r)}).y(function(t){return m(c-t.standard)}),a=d3.svg.line().x(function(t,r){return g(r)}).y(function(t){return m(c-t.done)}),p=d3.svg.axis().scale(g).orient("bottom").ticks(t.length).tickFormat(function(a,e,n){var o;if(null!=t[e])return null!=r.startLabel&&0===e?r.startLabel:null!=r.endLabel&&e===t.length-1?r.endLabel:(o=d3.time.format(r.dateFormat))(t[e].date)}),x=d3.svg.axis().scale(m).orient("left").innerTickSize(-r.width).outerTickSize(0),d=l.append("svg").attr("class","chart").attr("width",r.width+r.margins.left+r.margins.right).attr("height",r.height+r.margins.top+r.margins.bottom).append("g").attr("transform","translate("+r.margins.left+","+r.margins.top+")").attr("font-size","small"),d.append("defs").append("marker").attr("id","arrowhead").attr("markerWidth","12").attr("markerHeight","12").attr("viewBox","-6 -6 12 12").attr("refX","-2").attr("refY","0").attr("markerUnits","strokeWidth").attr("orient","auto").append("polygon").attr("points","-2,0 -5,5 5,0 -5,-5").attr("fill",r.colors.standard).attr("stroke","#666").attr("stroke-width","1px"),e=function(t){return t.selectAll("line").attr("marker-end",function(t,r){return r>0?void 0:"url(#arrowhead)"})},n=function(t){return t.selectAll("text").attr("fill",r.colors.labels).attr("transform","translate(0, 6)")},o=function(t){return t.selectAll("text").attr("fill",r.colors.labels).attr("transform","translate(-6, 0)")},d.append("g").attr("class","x axis").attr("transform","translate(0,"+r.height+")").call(p).call(n).append("text").attr("class","daily").attr("fill",r.colors.labels).attr("font-weight","bold").attr("transform","translate("+r.width+", 25)").attr("x",20).style("text-anchor","end").text(r.xTitle),d.append("g").attr("class","y axis").call(x).call(o).call(e),d.selectAll(".axis path, .axis line").attr("fill","none").attr("stroke","rgba(0, 1, 0, 0.2)").attr("color","rgba(0, 1, 0, 0.5)").attr("shape-rendering","crispEdges"),d.append("path").attr("class","standard").attr("d",h(t)).attr("stroke",r.colors.standard).attr("stroke-width",r.standardStrokeWidth).attr("stroke-dasharray","10 5").attr("fill","none"),d.append("path").attr("class","done-line").attr("d",a(function(){var r,a,e;for(e=[],r=0,a=t.length;a>r;r++)i=t[r],null!=i.done&&e.push(i);return e}())).attr("stroke",r.colors.done).attr("stroke-width",r.doneStrokeWidth).attr("fill","none"),d.selectAll("circle .standard-point").data(t).enter().append("circle").attr("class","standard-point").attr("cx",function(t,r){return g(r)}).attr("cy",function(t){return m(c-t.standard)}).attr("r",r.dotRadius).attr("fill",r.colors.standard),d.selectAll("circle .done-point").data(function(){var r,a,e;for(e=[],r=0,a=t.length;a>r;r++)i=t[r],null!=i.done&&e.push(i);return e}()).enter().append("circle").attr("class","done-point").attr("cx",function(t,r){return g(r)}).attr("cy",function(t){return m(c-t.done)}).attr("r",r.dotRadius).attr("fill",r.colors.done),d.selectAll("text .done-values").data(t).enter().append("text").attr("font-size","16px").attr("class",function(t,r){return null!=t.done||0===r?t.done-t.standard>=0?"good done-values":"bad done-values":void 0}).attr("x",function(t,r){return g(r)}).attr("y",function(t){return-10+m(c-Math.min(t.standard,t.done))}).attr("fill",function(t,a){return null!=t.done||0===a?t.done-t.standard>=0?r.colors.good:r.colors.bad:void 0}).attr("text-anchor","start").text(function(t,a){var e;if(0!==a&&null!=t.done)return e=t.done-t.standard,e>=0?"+"+e.toFixed(1)+r.goodSuffix:e.toFixed(1)+r.badSuffix})};