'use strict';

var _ = require('lodash');
var Chart = require('./chart.model');
var Stock = require('../stock/stock.model')
var yahoo = require('yahoo-finance');
var async = require('async');


// returns series data (stock symbols)
function retrieveSeries(stockData) {
  return stockData.map(function (stock) {
    return stock.symbol;
  });
}

// returns formatted list of chart labels
function retrieveLabels(quoteData) {
  var labels = [];
  var months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
  quoteData.forEach(function (quote) {
    var month = quote.date.getMonth() + 1;
    var day = quote.date.getDate();
    var year = quote.date.getFullYear() ;
    labels.push(months[month] + ' ' + day + ', ' + year);
  });
  return labels;
}

// returns formatted list of stock price data
function retrievePrices(quoteData) {
  var prices = [];
  quoteData.forEach(function (quote) {
    prices.push(quote.close);
  });
  return prices;
}

// returns date x months ago from current time
function xMonthsAgo(months) {
  var date = new Date();
  date.setMonth(date.getMonth() - months);
  return date;
}


// get historical graph data for all symbols in db
exports.graphAll = function (req, res) {

  // optional parameters
  // allows range of dates to be selected for chart data
  // defaults to six months
  if (req.query.fromDate) {
    var fromDate = req.query.fromDate;
  } else {
    var fromDate = xMonthsAgo(6);
  }

  if (req.query.toDate) {
    var toDate = req.query.toDate;
  } else {
    var toDate = new Date();
  }
  // end optional parameters


  Stock.find(function (err, stocks) {
    if(err) { return handleError(res, err); }
    var compiled = {
      series: [],
      labels: [],
      prices: []
    };
    async.forEach(stocks, function (stock, callback) {
      yahoo.historical({
        symbol: stock.symbol,
        from: fromDate,
        to: toDate
      }, function (err, quotes) {
        if (err) {
          callback(err);
        } else {
          var prices = retrievePrices(quotes);
          compiled.prices.push(prices);
          compiled.series.push(stock.symbol);
          if (compiled.labels.length < 1) {
            compiled.labels = retrieveLabels(quotes);
          }
          callback();
        }
      });
    }, function (err) {
      if (err) {return handleError(res, err); }
      return res.status(200).json(compiled);
    });
  });
};


function handleError(res, err) {
  return res.status(500).send(err);
}
