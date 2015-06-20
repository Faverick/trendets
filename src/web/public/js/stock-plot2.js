sl.series.ohlc = function () {

    var xScale = d3.time.scale(),
        yScale = d3.scale.linear();

    var ohlc = function (selection) {
        selection.each(function (data) {
            // Generate ohlc bars here.
            series = d3.select(this).selectAll('.ohlc-series').data([data]);
            series.enter().append('g').classed('ohlc-series', true);
            
                .data(data, function (d) {
            return d.date;
        });

        bars.enter()
            .append('g')
            .classed('bar', true);

        bars.classed({
            'up-day': function(d) {
                return d.close > d.open;
                },
            'down-day': function (d) {
                return d.close <= d.open;
                }
            });

        bars.exit().remove();
        });
    };

    ohlc.xScale = function (value) {
        if (!arguments.length) {
            return xScale;
        }
        xScale = value;
        return ohlc;
    };

    ohlc.yScale = function (value) {
        if (!arguments.length) {
            return yScale;
        }
        yScale = value;
        return ohlc;
    };

    return ohlc;
};


var highLowLines = function (bars) {

    var paths = bars
        .selectAll('.high-low-line')
        .data(function (d) {
            return [d];
        });

        paths.enter().append('path');

        paths.classed('high-low-line', true)
        .attr('d', function (d) {
            return line([
                { x: xScale(d.date), y: yScale(d.high) },
                { x: xScale(d.date), y: yScale(d.low) }
            ]);
        });
    };

var openCloseTicks = function (bars) {
    var open,
        close,
        tickWidth = 5;

    open = bars.selectAll('.open-tick').data(function (d) {
        return [d];
    });

    close = bars.selectAll('.close-tick').data(function (d) {
        return [d];
    });

    open.enter().append('path');
    close.enter().append('path');

    open.classed('open-tick', true)
        .attr('d', function (d) {
            return line([
                { x: xScale(d.date) - tickWidth, y: yScale(d.open) },
                { x: xScale(d.date), y: yScale(d.open) }
            ]);
        });

    close.classed('close-tick', true)
        .attr('d', function (d) {
            return line([
                { x: xScale(d.date), y: yScale(d.close) },
                { x: xScale(d.date) + tickWidth, y: yScale(d.close) }
            ]);
        });

};

var margin = {top: 20, right: 20, bottom: 30, left: 50},
    width = 900 - margin.left - margin.right,
    height = 800 - margin.top - margin.bottom;

var xScale = d3.time.scale(),
    yScale = d3.scale.linear();

var xAxis = d3.svg.axis()
    .scale(xScale)
    .orient('bottom')
    .ticks(5);

var yAxis = d3.svg.axis()
    .scale(yScale)
    .orient('left');

var series = sl.series.ohlc()
    .xScale(xScale)
    .yScale(yScale);

// Create svg element
var svg = d3.select('#plotContainer').classed('chart', true).append('svg')
    .attr('width', width + margin.left + margin.right)
    .attr('height', height + margin.top + margin.bottom);

// Create chart
var g = svg.append('g')
    .attr('transform', 'translate(' + margin.left + ',' + margin.top + ')');

// Create plot area
var plotArea = g.append('g');
plotArea.append('clipPath')
    .attr('id', 'plotAreaClip')
    .append('rect')
    .attr({ width: width, height: height });
plotArea.attr('clip-path', 'url(#plotAreaClip)');

// Set scale domains
var maxDate = d3.max(data, function (d) {
    return d.date;
});

// There are 8.64e7 milliseconds in a day.
xScale.domain([
    new Date(maxDate.getTime() - (8.64e7 * 31.5)),
    new Date(maxDate.getTime() + 8.64e7)
]);

yScale.domain(
    [
        d3.min(data, function (d) {
            return d.low;
        }),
        d3.max(data, function (d) {
            return d.high;
        })
    ]
).nice();

// Set scale ranges
xScale.range([0, width]);
yScale.range([height, 0]);

// Draw axes
g.append('g')
    .attr('class', 'x axis')
    .attr('transform', 'translate(0,' + height + ')')
    .call(xAxis);

g.append('g')
    .attr('class', 'y axis')
    .call(yAxis);

// Draw the series.
plotArea.append('g')
    .attr('class', 'series')
    .datum(data)
    .call(series);