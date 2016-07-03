/******/ (function(modules) { // webpackBootstrap
/******/ 	// The module cache
/******/ 	var installedModules = {};

/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {

/******/ 		// Check if module is in cache
/******/ 		if(installedModules[moduleId])
/******/ 			return installedModules[moduleId].exports;

/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = installedModules[moduleId] = {
/******/ 			exports: {},
/******/ 			id: moduleId,
/******/ 			loaded: false
/******/ 		};

/******/ 		// Execute the module function
/******/ 		modules[moduleId].call(module.exports, module, module.exports, __webpack_require__);

/******/ 		// Flag the module as loaded
/******/ 		module.loaded = true;

/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}


/******/ 	// expose the modules object (__webpack_modules__)
/******/ 	__webpack_require__.m = modules;

/******/ 	// expose the module cache
/******/ 	__webpack_require__.c = installedModules;

/******/ 	// __webpack_public_path__
/******/ 	__webpack_require__.p = "";

/******/ 	// Load entry module and return exports
/******/ 	return __webpack_require__(0);
/******/ })
/************************************************************************/
/******/ ([
/* 0 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';

	window.renderBDC = function (data, userConfig) {
	  var defaultConfig = __webpack_require__(1);

	  var validateData = function validateData(data) {
	    if (!Array.isArray(data)) {
	      console.warn('[d3-burn-down-chart] data is not an array');
	      return false;
	    }

	    if (data.length < 2) {
	      console.warn('[d3-burn-down-chart] data length is less than 2');
	      return false;
	    }

	    return true;
	  };

	  config = Object.assign({}, defaultConfig);
	  Object.assign(config, userConfig);

	  if (!validateData(data)) {
	    return;
	  }

	  var first = data[0];
	  var last = data[data.length - 1];

	  var initialNumberOfPoints = last.standard;
	  var maxDone = d3.max(data, function (datum) {
	    return datum.done || 0;
	  });
	  var bdcgraph = d3.select(config.containerId);
	  bdcgraph.select('*').remove();

	  var x = d3.scale.linear() // x scale can't be d3.time because we don't want to display weekends
	  .domain([0, data.length]).range([0, config.width]);

	  var y = d3.scale.linear().domain([Math.min(0, initialNumberOfPoints - maxDone), initialNumberOfPoints]).range([config.height, 0]);

	  var standardLine = d3.svg.line().x(function (d, i) {
	    return x(i);
	  }).y(function (d) {
	    return y(initialNumberOfPoints - d.standard);
	  });

	  var actualLine = d3.svg.line().x(function (d, i) {
	    return x(i);
	  }).y(function (d) {
	    return y(initialNumberOfPoints - d.done);
	  });

	  var xAxis = d3.svg.axis().scale(x).orient('bottom').ticks(data.length); // number of ticks to display

	  var yAxis = d3.svg.axis().scale(y).orient(config.yScaleOrient).tickPadding(10).outerTickSize(0).tickFormat(function (d, i) {
	    if (i === 0 && config.yScaleOrient === 'right') {
	      return;
	    }
	    return d;
	  });

	  if (config.yScaleOrient === 'left') {
	    yAxis.innerTickSize(-config.width); // display horizontal grids
	  } else {
	    yAxis.innerTickSize(5);
	  }

	  var chart = bdcgraph.append('svg').attr('class', 'chart').attr('width', config.width + config.margins.left + config.margins.right).attr('height', config.height + config.margins.top + config.margins.bottom).append('g').attr('transform', 'translate(' + config.margins.left + ',' + config.margins.top + ')').attr('font-size', 'small');

	  // define the shape of an arrowhead
	  chart.append('defs').append('marker').attr('id', 'arrowhead').attr('markerWidth', '12').attr('markerHeight', '12').attr('viewBox', '-6 -6 12 12').attr('refX', '-2').attr('refY', '0').attr('markerUnits', 'strokeWidth').attr('orient', 'auto').append('polygon').attr('points', '-2,0 -5,5 5,0 -5,-5').attr('fill', config.colors.standard).attr('stroke', '#666').attr('stroke-width', '1px');

	  var addArrowHead = function addArrowHead(selection) {
	    selection.selectAll('line').attr('marker-end', function (d, i) {
	      if (i === 0 && config.yScaleOrient === 'left') {
	        // the arrow is only for the first grid
	        return 'url(#arrowhead)';
	      }
	    });
	  };

	  var drawLabels = function drawLabels(selection, axis, data, format, filter) {
	    axis = axis.tickFormat(function (d, i) {
	      if (!data[i]) {
	        return;
	      }
	      if (config.yScaleOrient === 'right' && i === 0) {
	        return;
	      }
	      if (config.startLabel && i === 0) {
	        return config.startLabel;
	      }
	      if (config.endLabel && i === data.length - 1) {
	        return config.endLabel;
	      }
	      if (!filter(d, i)) {
	        return;
	      }
	      var dateFormat = d3.time.format(format);
	      return dateFormat(data[i].date);
	    });
	    axis(selection);
	  };

	  var adjustDaysLabels = function adjustDaysLabels(axis, selection) {
	    var isLabelOverlaping = function isLabelOverlaping(selection, tickNumber, config) {
	      var availableWidth = config.width / tickNumber;

	      var text = selection.selectAll('text');
	      var maxWidth = 0;
	      text.each(function (label) {
	        var width = d3.select(this).node().getBBox().width;
	        if (width > maxWidth) {
	          maxWidth = width;
	        }
	      });
	      return maxWidth >= availableWidth;
	    };

	    if (isLabelOverlaping(selection, data.length, config)) {
	      drawLabels(selection, axis, data, config.shortDateFormat, function () {
	        return true;
	      });
	    }

	    if (isLabelOverlaping(selection, data.length, config)) {
	      drawLabels(selection, axis, data, config.shortDateFormat, function (d, i) {
	        return i % 2 !== 0;
	      });
	    }

	    selection.selectAll('text').attr('fill', config.colors.labels).attr('transform', 'translate(0, 6)');

	    if (isLabelOverlaping(selection, data.length / 2, config)) {
	      selection.selectAll('text').attr('transform', 'translate(-5, 6) rotate(-30)');
	    }
	  };

	  // display the x-axis
	  var selection = chart.append('g').attr('class', 'x axis').attr('transform', 'translate(0,' + config.height + ')');

	  drawLabels(selection, xAxis, data, config.dateFormat, function () {
	    return true;
	  });

	  adjustDaysLabels(xAxis, selection);

	  selection.append('text').attr('class', 'daily').attr('fill', config.colors.labels).attr('font-weight', 'bold').attr('transform', 'translate(' + config.width + ', 25)').attr('x', 20).style('text-anchor', 'end').text(config.xTitle);

	  // display the y-axis
	  chart.append('g').attr('class', 'y axis').call(yAxis).call(addArrowHead);

	  chart.selectAll('.axis path, .axis line').attr('fill', 'none').attr('stroke', 'rgba(0, 1, 0, 0.2)').attr('color', 'rgba(0, 1, 0, 0.5)').attr('shape-rendering', 'crispEdges');

	  // display the standard line
	  chart.append('path').attr('class', 'standard').attr('d', standardLine(data)).attr('stroke', config.colors.standard).attr('stroke-width', config.standardStrokeWidth).attr('stroke-dasharray', '10 5').attr('fill', 'none');

	  // display the actual line
	  chart.append('path').attr('class', 'done-line').attr('d', actualLine(data.filter(function (d) {
	    return d.done;
	  }))).attr('stroke', config.colors.done).attr('stroke-width', config.doneStrokeWidth).attr('fill', 'none');

	  // display standard dots
	  chart.selectAll('circle .standard-point').data(data).enter().append('circle').attr('class', 'standard-point').attr('cx', function (d, i) {
	    return x(i);
	  }).attr('cy', function (d) {
	    return y(initialNumberOfPoints - d.standard);
	  }).attr('r', config.dotRadius).attr('fill', config.colors.standard);

	  // display done dots
	  chart.selectAll('circle .done-point').data(data.filter(function (d) {
	    return d.done;
	  })).enter().append('circle').attr('class', 'done-point').attr('cx', function (d, i) {
	    return x(i);
	  }).attr('cy', function (d) {
	    return y(initialNumberOfPoints - d.done);
	  }).attr('r', config.dotRadius).attr('fill', config.colors.done);

	  // display difference
	  chart.selectAll('text .done-values').data(data).enter().append('text').attr('font-size', '16px').attr('class', function (d, i) {
	    if (d.done === null || d.done === undefined || i === 0) {
	      return;
	    }
	    if (d.done - d.standard >= 0) {
	      return 'good done-values';
	    } else {
	      return 'bad done-values';
	    }
	  }).attr('x', function (d, i) {
	    return x(i);
	  }).attr('y', function (d) {
	    return -10 + y(initialNumberOfPoints - Math.min(d.standard, d.done));
	  }).attr('fill', function (d, i) {
	    if (d.done === null || d.done === undefined || i === 0) {
	      return;
	    }
	    if (d.done - d.standard >= 0) {
	      return config.colors.good;
	    } else {
	      return config.colors.bad;
	    }
	  }).attr('text-anchor', 'start').text(function (d, i) {
	    if (d.done === null || d.done === undefined || i === 0) {
	      return;
	    }
	    var diff = d.done - d.standard;
	    if (diff >= 0) {
	      return '+' + diff.toFixed(1) + config.goodSuffix;
	    } else {
	      return diff.toFixed(1) + config.badSuffix;
	    }
	  });
	};

	module.exports = {
	  renderBDC: renderBDC
	};

/***/ },
/* 1 */
/***/ function(module, exports) {

	'use strict';

	module.exports = {
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
	  shortDateFormat: '%d/%m',
	  xTitle: 'Daily meetings',
	  yScaleOrient: 'left',
	  dotRadius: 4,
	  standardStrokeWidth: 2,
	  doneStrokeWidth: 2,
	  goodSuffix: ' :)',
	  badSuffix: ' :('
	};

/***/ }
/******/ ]);