/**
 * Broadcast updates to client when the model changes
 */

'use strict';

var Chart = require('./chart.model');

exports.register = function(socket) {
  Chart.schema.post('save', function (doc) {
    onSave(socket, doc);
  });
  Chart.schema.post('remove', function (doc) {
    onRemove(socket, doc);
  });
}

function onSave(socket, doc, cb) {
  socket.emit('chart:save', doc);
}

function onRemove(socket, doc, cb) {
  socket.emit('chart:remove', doc);
}