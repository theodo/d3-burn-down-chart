config =
  containerId: '#bdcgraph'
  width: 900
  height: 500
  margins:
    top: 20
    right: 70
    bottom: 30
    left: 50
  colors:
    standard: '#D93F8E'
    done: '#5AA6CB'
    good: '#97D17A'
    bad: '#FA6E69'
    labels: '#113F59'
  startLabel: 'Start'
  endLabel: 'Ceremony'
  dateFormat: '%A'
  xTitle: 'Daily meetings'
  dotRadius: 4
  standardStrokeWidth: 2
  doneStrokeWidth: 2
  goodSuffix: ' :)'
  badSuffix: ' :('

renderBDC = (data, cfg) ->
  [first, ..., last] = data
  initialNumberOfPoints = last.standard

  bdcgraph = d3.select cfg.containerId
  bdcgraph.select('*').remove()

  x = d3.scale.linear() # x scale can't be d3.time because we don't want to display weekends
  .domain [0, data.length]
  .range [0, cfg.width]

  y = d3.scale.linear()
  .domain [
    Math.min(0, initialNumberOfPoints - last.done)
    initialNumberOfPoints
  ]
  .range [cfg.height, 0]

  standardLine = d3.svg.line()
  .x (d, i) -> x(i)
  .y (d) -> y initialNumberOfPoints - d.standard

  actualLine = d3.svg.line()
  .x (d, i) -> x(i)
  .y (d) -> y initialNumberOfPoints - d.done

  xAxis = d3.svg.axis()
  .scale x
  .orient 'bottom'
  .ticks data.length # number of ticks to display
  .tickFormat (d, i, j) ->
    return unless data[i]?
    return cfg.startLabel if cfg.startLabel? and i == 0
    return cfg.endLabel if cfg.endLabel? and i == data.length - 1
    dateFormat = d3.time.format cfg.dateFormat
    dateFormat data[i].date

  yAxis = d3.svg.axis()
  .scale y
  .orient 'left'
  .innerTickSize -cfg.width # display horizontal grids
  .outerTickSize 0

  chart = bdcgraph.append 'svg'
  .attr 'class', 'chart'
  .attr 'width', cfg.width + cfg.margins.left + cfg.margins.right
  .attr 'height', cfg.height + cfg.margins.top + cfg.margins.bottom
  .append 'g'
  .attr 'transform', 'translate(' + cfg.margins.left + ',' + cfg.margins.top + ')'
  .attr 'font-size', 'small'

  # define the shape of an arrowhead
  chart.append 'defs'
  .append 'marker'
  .attr 'id', 'arrowhead'
  .attr 'markerWidth', '12'
  .attr 'markerHeight', '12'
  .attr 'viewBox', '-6 -6 12 12'
  .attr 'refX', '-2'
  .attr 'refY', '0'
  .attr 'markerUnits', 'strokeWidth'
  .attr 'orient', 'auto'
  .append 'polygon'
  .attr 'points', '-2,0 -5,5 5,0 -5,-5'
  .attr 'fill', cfg.colors.standard
  .attr 'stroke', '#666'
  .attr 'stroke-width', '1px'

  addArrowHead = (selection) ->
    selection.selectAll 'line'
    .attr 'marker-end', (d, i) ->
      return if i > 0 # the arrow is only for the first grid
      'url(#arrowhead)'

  adjustDaysLabels = (selection) ->
    selection.selectAll 'text'
    .attr 'fill', cfg.colors.labels
    .attr 'transform', 'translate(0, 6)'

  adjustPointsLabels = (selection) ->
    selection.selectAll 'text'
    .attr 'fill', cfg.colors.labels
    .attr 'transform', 'translate(-6, 0)'

  # display the x-axis
  chart.append 'g'
  .attr 'class', 'x axis'
  .attr 'transform', 'translate(0,' + cfg.height + ')'
  .call xAxis
  .call adjustDaysLabels
  .append 'text'
  .attr 'class', 'daily'
  .attr 'fill', cfg.colors.labels
  .attr 'font-weight', 'bold'
  .attr 'transform', 'translate(' + cfg.width + ', 25)'
  .attr 'x', 20
  .style 'text-anchor', 'end'
  .text cfg.xTitle

  # display the y-axis
  chart.append 'g'
  .attr 'class', 'y axis'
  .call yAxis
  .call adjustPointsLabels
  .call addArrowHead

  chart.selectAll '.axis path, .axis line'
  .attr 'fill', 'none'
  .attr 'stroke', 'rgba(0, 1, 0, 0.2)'
  .attr 'color', 'rgba(0, 1, 0, 0.5)'
  .attr 'shape-rendering', 'crispEdges'

  # display the standard line
  chart.append 'path'
  .attr 'class', 'standard'
  .attr 'd', standardLine data
  .attr 'stroke', cfg.colors.standard
  .attr 'stroke-width', cfg.standardStrokeWidth
  .attr 'stroke-dasharray', '10 5'
  .attr 'fill', 'none'

  # display the actual line
  chart.append 'path'
  .attr 'class', 'done-line'
  .attr 'd', actualLine (d for d in data when d.done?)
  .attr 'stroke', cfg.colors.done
  .attr 'stroke-width', cfg.doneStrokeWidth
  .attr 'fill', 'none'

  # display standard dots
  chart.selectAll 'circle .standard-point'
  .data data
  .enter()
  .append 'circle'
  .attr 'class', 'standard-point'
  .attr 'cx', (d, i) -> x(i)
  .attr 'cy', (d) -> y initialNumberOfPoints - d.standard
  .attr 'r', cfg.dotRadius
  .attr 'fill', cfg.colors.standard


  # display done dots
  chart.selectAll 'circle .done-point'
  .data (d for d in data when d.done?)
  .enter()
  .append 'circle'
  .attr 'class', 'done-point'
  .attr 'cx', (d, i) -> x(i)
  .attr 'cy', (d) -> y initialNumberOfPoints - d.done
  .attr 'r', cfg.dotRadius
  .attr 'fill', cfg.colors.done

  # display difference
  chart.selectAll 'text .done-values'
  .data data
  .enter()
  .append 'text'
  .attr 'font-size', '16px'
  .attr 'class', (d, i) ->
    return unless d.done? or i == 0
    if d.done - d.standard >= 0
      'good done-values'
    else
      'bad done-values'
  .attr 'x', (d, i) -> x(i)
  .attr 'y', (d) ->
    - 10 + y(initialNumberOfPoints - Math.min(d.standard, d.done))
  .attr 'fill', (d, i) ->
    return unless d.done? or i == 0
    if d.done - d.standard >= 0
      return cfg.colors.good
    else
      return cfg.colors.bad
  .attr 'text-anchor', 'start'
  .text (d, i) ->
    return if i == 0
    return unless d.done?
    diff = d.done - d.standard
    if diff >= 0
      return '+' + diff.toFixed(1) + cfg.goodSuffix
    else
      return diff.toFixed(1) + cfg.badSuffix
