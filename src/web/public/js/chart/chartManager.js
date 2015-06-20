define([
    'd3',
    'js/chart/components/sl',
    'js/chart/MockData',
    'js/chart/utils/tickWidth',
    'js/chart/utils/yScaleTransform',
    'moment',
    'moment-range',
    'js/chart/components/ohlcBarSeries',
    'modernizr',
    'js/chart/zoomChart'
], function (d3, sl, MockData, tickWidth, yScaleTransform, moment) {
    'use strict';

    return {
        makeChart: function(dataSeries){
            var hasVectorEffect = Modernizr.testProp('vectorEffect');

            /*var mockData = new MockData(0, 0.1, 100, 50, function (moment) {
                return !(moment.day() === 0 || moment.day() === 6);
            });

            var fromDate = new Date(2008, 8, 1),
                toDate = new Date(2014, 8, 1);

            var data = mockData.generateOHLC(fromDate, toDate);*/


            var data = dataSeries.stocks;
            var fromDate = data[0].date,
                toDate = data[data.length-1].date;

            var xScale = d3.time.scale(),
                yScale = d3.scale.linear(),
                initialScale;

            var xAxis = d3.svg.axis()
                .scale(xScale)
                .orient('bottom')
                .ticks(5);

            var yAxis = d3.svg.axis()
                .scale(yScale)
                .orient('left');

            var series = sl.series.ohlcBar()
                .xScale(xScale)
                .yScale(yScale);

            var zoom = d3.behavior.zoom()
                .x(xScale)
                .scaleExtent([0.5, 500])
                .on('zoom', zoomed)
                .on('zoomend', zoomend);


            var zoomChart = sl.example.zoomChart(zoom, data, series, xScale, yScale, xAxis, yAxis, fromDate, toDate);
            zoomChart();

            initialScale = zoomChart.initialScale();

            function zoomed() {

                var xDomain = xScale.domain(),
                    yTransform,
                    xTransformTranslate = d3.event.translate[0],
                    xTransformScale = d3.event.scale;

                var range = moment().range(xDomain[0], xDomain[1]);
                var rangeData = [];
                var g = d3.selectAll('svg').select('g');

                for (var i = 0; i < data.length; i += 1) {
                    if (range.contains(data[i].date)) {
                        rangeData.push(data[i]);
                    }
                }

                yScale.domain(
                    [
                        d3.min(rangeData, function (d) {
                            return d.low;
                        }),
                        d3.max(rangeData, function (d) {
                            return d.high;
                        })
                    ]
                );

                yTransform = yScaleTransform(initialScale, yScale);

                g.select('.x.axis')
                    .call(xAxis);

                g.select('.y.axis')
                    .call(yAxis);

                g.select('.series')
                    .attr('transform', 'translate(' + xTransformTranslate + ',' + yTransform.translate+ ')' +
                        ' scale(' + xTransformScale + ',' + yTransform.scale + ')');

            }

            function zoomend() {
                var g, xDomain;

                if (!hasVectorEffect) {
                    g = d3.selectAll('svg').select('g');
                    xDomain = xScale.domain();

                    initialScale = yScale.copy();

                    zoom.x(xScale);
                    series.tickWidth(tickWidth(xScale, xDomain[0], xDomain[1]));

                    g.select('.x.axis')
                        .call(xAxis);

                    g.select('.y.axis')
                        .call(yAxis);

                    g.selectAll('.series')
                        .datum(data);

                    g.select('.series')
                        .call(series);

                    g.select('.series')
                        .attr('transform', 'translate(0,0) scale(1)');
                }
            }

            return zoomChart;
        }
    }
});
