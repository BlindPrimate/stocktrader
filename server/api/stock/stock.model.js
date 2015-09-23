'use strict';

var mongoose = require('mongoose'),
    Schema = mongoose.Schema;

var StockSchema = new Schema({
  symbol: String,
});

module.exports = mongoose.model('Stock', StockSchema);
