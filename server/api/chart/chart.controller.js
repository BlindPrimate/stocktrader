'use strict';

var _ = require('lodash');
var Chart = require('./chart.model');
var Stock = require('../stock/stock.model')
var yahoo = require('yahoo-finance');
var async = require('async');


// returns formatted list of chart labels
function formatDate(date) {
  var months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
  var month = date.getMonth();
  var day = date.getDate();
  var year = date.getFullYear() ;
  return months[month] + ' ' + day + ', ' + year
}

// returns date x months ago from current time
function xMonthsAgo(months) {
  var date = new Date();
  date.setMonth(date.getMonth() - months);
  return date;
}


// get historical graph data for all symbols in db
exports.graphSet = function (req, res) {
  // optional parameters
  // allows range of dates to be selected for chart data
  // defaults to six months
  if (req.query.fromDate && req.query.toDate) {
    var fromDate = req.query.fromDate;
    var toDate = req.query.toDate;
  } else {
    var fromDate = xMonthsAgo(6);
    var toDate = new Date();
  }

  // end optional parameters

  var symbols,
      compiled = {
      series: [],
      labels: [],
      prices: []
  };

  Stock.find(function (err, stocks) {
    if(err) { return handleError(res, err); }

    if (req.query.symbols) {
      symbols = req.query.symbols.split(',');
    } else {
      symbols = _.map(stocks, 'symbol');
    }

    yahoo.historical({
      symbols: symbols,
      from: fromDate,
      to: toDate
    }, function (err, quotes) {
      _.each(quotes, function(quote, companySymbol) {
        compiled.series.push(companySymbol);
        var prices = _.map(quote, function (day) {
          return day.close.toFixed(2);
        });
        compiled.prices.push(prices);
        var dates = _.map(quote, function(day) {
          return formatDate(day.date);
        });
        compiled.labels = dates;
      });
      return res.status(200).json(compiled);
    });
  });
};



function handleError(res, err) {
  return res.status(500).send(err);
}
