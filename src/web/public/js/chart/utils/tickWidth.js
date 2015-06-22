define([
    'moment',
    'moment-range'
], function (moment) {
    'use strict';

    /*var countDays = function (range, timeFrame) {
        switch (timeFrame) {
            case "timeFrame5": return range / (1000 * 60 * 5);
            case "timeFrame15": return range / (1000 * 60 * 15);
            case "timeFrame30": return range / (1000 * 60 * 30);
            case "timeFrame1H": return range / (1000 * 60 * 60);
            case "timeFrame1D": return range / (1000 * 60 * 60 * 24);
            case "timeFrame1W": return range / (1000 * 60 * 60 * 24 * 7);
            case "timeFrame1M": return range / (1000 * 60 * 60 * 24 * 30);
        }
        return range / (1000 * 60 * 60 * 24);
    };

    return function calculateTickWidth(scale, fromDate, toDate, timeFrame) {
        var scaleRange = scale.range(),
            dayRange = moment().range(fromDate, toDate);
        return (scaleRange[1] - scaleRange[0]) / (countDays(dayRange, timeFrame) * 2.5);
    };*/
    var countDays = function (fromDate, toDate, timeFrame) {
        switch (timeFrame) {
            case "timeFrame5": return fromDate.diff(toDate, 'minutes') * 5 + 1;
            case "timeFrame15": return fromDate.diff(toDate, 'minutes') * 15 + 1;
            case "timeFrame30": return fromDate.diff(toDate, 'minutes') * 30 + 1;
            case "timeFrame1H": return fromDate.diff(toDate, 'hours') + 1;
            case "timeFrame1D": return fromDate.diff(toDate, 'days') + 1;
            case "timeFrame1W": return fromDate.diff(toDate, 'week') + 1;
            case "timeFrame1M": return fromDate.diff(toDate, 'month') + 1;
        }
        return range / (1000 * 60 * 60 * 24);
    };

    return function calculateTickWidth(scale, fromDate, toDate, timeFrame) {
        var scaleRange = scale.range();
        return (scaleRange[1] - scaleRange[0]) / (countDays(moment(fromDate), moment(toDate), timeFrame) * 2.5);
    };
});