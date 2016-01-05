var config, renderBDC;

config = {
  containerId: '#bdcgraph',
  width: 900,
  height: 500,
  margins: {
    top: 20,
    right: 70,
    bottom: 30,
    left: 50
  },
  colors: {
    standard: '#D93F8E',
    done: '#5AA6CB',
    good: '#97D17A',
    bad: '#FA6E69',
    labels: '#113F59'
  },
  startLabel: 'Start',
  endLabel: 'Ceremony',
  dateFormat: '%A',
  xTitle: 'Daily meetings',
  dotRadius: 4,
  standardStrokeWidth: 2,
  doneStrokeWidth: 2,
  goodSuffix: ' :)',
  badSuffix: ' :('
};

renderBDC = function(data, cfg) {
  var actualLine, addArrowHead, adjustDaysLabels, adjustPointsLabels, bdcgraph, chart, d, first, initialNumberOfPoints, last, maxDone, standardLine, x, xAxis, y, yAxis;
  first = data[0], last = data[data.length - 1];
  initialNumberOfPoints = last.standard;
  maxDone = d3.max(data, function(datum) {
    return datum.done || 0;
  });
  bdcgraph = d3.select(cfg.containerId);
  bdcgraph.select('*').remove();
  x = d3.scale.linear().domain([0, data.length]).range([0, cfg.width]);
  y = d3.scale.linear().domain([Math.min(0, initialNumberOfPoints - maxDone), initialNumberOfPoints]).range([cfg.height, 0]);
  standardLine = d3.svg.line().x(function(d, i) {
    return x(i);
  }).y(function(d) {
    return y(initialNumberOfPoints - d.standard);
  });
  actualLine = d3.svg.line().x(function(d, i) {
    return x(i);
  }).y(function(d) {
    return y(initialNumberOfPoints - d.done);
  });
  xAxis = d3.svg.axis().scale(x).orient('bottom').ticks(data.length).tickFormat(function(d, i, j) {
    var dateFormat;
    if (data[i] == null) {
      return;
    }
    if ((cfg.startLabel != null) && i === 0) {
      return cfg.startLabel;
    }
    if ((cfg.endLabel != null) && i === data.length - 1) {
      return cfg.endLabel;
    }
    dateFormat = d3.time.format(cfg.dateFormat);
    return dateFormat(data[i].date);
  });
  yAxis = d3.svg.axis().scale(y).orient('left').innerTickSize(-cfg.width).outerTickSize(0);
  chart = bdcgraph.append('svg').attr('class', 'chart').attr('width', cfg.width + cfg.margins.left + cfg.margins.right).attr('height', cfg.height + cfg.margins.top + cfg.margins.bottom).append('g').attr('transform', 'translate(' + cfg.margins.left + ',' + cfg.margins.top + ')').attr('font-size', 'small');
  chart.append('defs').append('marker').attr('id', 'arrowhead').attr('markerWidth', '12').attr('markerHeight', '12').attr('viewBox', '-6 -6 12 12').attr('refX', '-2').attr('refY', '0').attr('markerUnits', 'strokeWidth').attr('orient', 'auto').append('polygon').attr('points', '-2,0 -5,5 5,0 -5,-5').attr('fill', cfg.colors.standard).attr('stroke', '#666').attr('stroke-width', '1px');
  addArrowHead = function(selection) {
    return selection.selectAll('line').attr('marker-end', function(d, i) {
      if (i > 0) {
        return;
      }
      return 'url(#arrowhead)';
    });
  };
  adjustDaysLabels = function(selection) {
    return selection.selectAll('text').attr('fill', cfg.colors.labels).attr('transform', 'translate(0, 6)');
  };
  adjustPointsLabels = function(selection) {
    return selection.selectAll('text').attr('fill', cfg.colors.labels).attr('transform', 'translate(-6, 0)');
  };
  chart.append('g').attr('class', 'x axis').attr('transform', 'translate(0,' + cfg.height + ')').call(xAxis).call(adjustDaysLabels).append('text').attr('class', 'daily').attr('fill', cfg.colors.labels).attr('font-weight', 'bold').attr('transform', 'translate(' + cfg.width + ', 25)').attr('x', 20).style('text-anchor', 'end').text(cfg.xTitle);
  chart.append('g').attr('class', 'y axis').call(yAxis).call(adjustPointsLabels).call(addArrowHead);
  chart.selectAll('.axis path, .axis line').attr('fill', 'none').attr('stroke', 'rgba(0, 1, 0, 0.2)').attr('color', 'rgba(0, 1, 0, 0.5)').attr('shape-rendering', 'crispEdges');
  chart.append('path').attr('class', 'standard').attr('d', standardLine(data)).attr('stroke', cfg.colors.standard).attr('stroke-width', cfg.standardStrokeWidth).attr('stroke-dasharray', '10 5').attr('fill', 'none');
  chart.append('path').attr('class', 'done-line').attr('d', actualLine((function() {
    var k, len, results;
    results = [];
    for (k = 0, len = data.length; k < len; k++) {
      d = data[k];
      if (d.done != null) {
        results.push(d);
      }
    }
    return results;
  })())).attr('stroke', cfg.colors.done).attr('stroke-width', cfg.doneStrokeWidth).attr('fill', 'none');
  chart.selectAll('circle .standard-point').data(data).enter().append('circle').attr('class', 'standard-point').attr('cx', function(d, i) {
    return x(i);
  }).attr('cy', function(d) {
    return y(initialNumberOfPoints - d.standard);
  }).attr('r', cfg.dotRadius).attr('fill', cfg.colors.standard);
  chart.selectAll('circle .done-point').data((function() {
    var k, len, results;
    results = [];
    for (k = 0, len = data.length; k < len; k++) {
      d = data[k];
      if (d.done != null) {
        results.push(d);
      }
    }
    return results;
  })()).enter().append('circle').attr('class', 'done-point').attr('cx', function(d, i) {
    return x(i);
  }).attr('cy', function(d) {
    return y(initialNumberOfPoints - d.done);
  }).attr('r', cfg.dotRadius).attr('fill', cfg.colors.done);
  return chart.selectAll('text .done-values').data(data).enter().append('text').attr('font-size', '16px').attr('class', function(d, i) {
    if (!((d.done != null) || i === 0)) {
      return;
    }
    if (d.done - d.standard >= 0) {
      return 'good done-values';
    } else {
      return 'bad done-values';
    }
  }).attr('x', function(d, i) {
    return x(i);
  }).attr('y', function(d) {
    return -10 + y(initialNumberOfPoints - Math.min(d.standard, d.done));
  }).attr('fill', function(d, i) {
    if (!((d.done != null) || i === 0)) {
      return;
    }
    if (d.done - d.standard >= 0) {
      return cfg.colors.good;
    } else {
      return cfg.colors.bad;
    }
  }).attr('text-anchor', 'start').text(function(d, i) {
    var diff;
    if (i === 0) {
      return;
    }
    if (d.done == null) {
      return;
    }
    diff = d.done - d.standard;
    if (diff >= 0) {
      return '+' + diff.toFixed(1) + cfg.goodSuffix;
    } else {
      return diff.toFixed(1) + cfg.badSuffix;
    }
  });
};
