'use strict';

var _ = require('lodash');
var Chart = require('./chart.model');
var Stock = require('../stock/stock.model')
var yahoo = require('yahoo-finance');
var async = require('async');


function retrieveSeries(stockData) {
  return stockData.map(function (stock) {
    return stock.symbol;
  });
}

function retrieveLabels(quoteData) {
  var labels = [];
  quoteData.forEach(function (quote) {
    var month = quote.date.getMonth() + 1;
    var day = quote.date.getDate();
    var year = quote.date.getFullYear() ;
    labels.push(month + '-' + day + '-' + year);
  });
  return labels;
}

function retrievePrices(quoteData) {
  var prices = [];
  quoteData.forEach(function (quote) {
    prices.push(quote.close);
  });
  return prices;
}

//function pruneData(yahooData) {
  //var currLength = yahooData.length;
  //if (currLength > 10) {
     
  //} else {
    //return yahooData;
  //}
//}


// get historical graph data for all symbols in db
exports.graphAll = function (req, res) {
  Stock.find(function (err, stocks) {
    if(err) { return handleError(res, err); }
    var compiled = {
      series: retrieveSeries(stocks),
      labels: [],
      prices: []
    };
    async.forEach(stocks, function (stock, callback) {
      yahoo.historical({
        symbol: stock.symbol,
        from: '2015-08-01',
        to: '2015-08-24',
      }, function (err, quotes) {
        if (err) {
          callback(err);
        } else {
          var prices = retrievePrices(quotes);
          compiled.prices.push(prices);
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
