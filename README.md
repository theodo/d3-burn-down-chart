# d3-burn-down-chart
A d3 librairy to display a burn down chart

[DEMO](http://theodo.github.io/d3-burn-down-chart/)

## Usage

```
bower install --save d3-bdc
```

```html
<!DOCTYPE html>
<meta charset="utf-8">
<body>
  <div id="bdcgraph">
  </div>
</body>
<script src="https://cdnjs.cloudflare.com/ajax/libs/d3/3.5.10/d3.min.js"></script>
<script src="https://cdn.rawgit.com/theodo/d3-burn-down-chart/master/dist/d3-bdc.js"></script>
<script>
 //...
</script>
```

Your script should looks like this:

```javascript
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
    bad: '#FA6E69'
  },
  startLabel: 'Start',
  dateFormat: '%A',
  xTitle: 'Daily meetings',
  dotRadius: 4,
  standardStrokeWidth: 2,
  doneStrokeWidth: 2,
  goodSuffix: ' :)',
  badSuffix: ' :('
};

data = [
  {
    date: new Date(2015,11,30),
    standard: 0,
    done: 0,
  },
  {
    date: new Date(2015,11,31),
    standard: 8,
    done: 12,
  },
  {
    date: new Date(2015,12,1),
    standard: 16,
    done: 13,
  },
  {
    date: new Date(2015,12,4),
    standard: 22,
    done: 24,
  },
  {
    date: new Date(2015,12,5),
    standard: 30,
    done: 28,
  },
  {
    date: new Date(2015,12,6),
    standard: 40,
    done: null,
  },
];

renderBDC(data, config);
```

## install

```
git clone git@github.com:theodo/d3-burn-down-chart.git && cd d3-burn-down-chart
npm install

# change the path in the demo/index.html
# https://cdn.rawgit.com/theodo/d3-burn-down-chart/master/dist/d3-bdc.js -> ../dist/d3-bdc.js
python -m SimpleHTTPServer &
gulp watch
# you can access the BDC on localhost:8000/demo
```

## deploy

Deploy on github pages: http://theodo.github.io/d3-burn-down-chart

```
gulp deploy
```
