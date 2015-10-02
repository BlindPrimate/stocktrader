'use strict';

var mongoose = require('mongoose'),
    Schema = mongoose.Schema;

var StockSchema = new Schema({
  symbol: String,
  name: String,
  exchange: String,
  currPrice: Number
});

module.exports = mongoose.model('Stock', StockSchema);
