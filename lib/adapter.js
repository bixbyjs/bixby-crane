/**
 * Module dependencies.
 */
var uri = require('url')
  , bootable = require('bootable');


exports = module.exports = function(logger, settings) {
  var options = settings.toObject();
  if (!options.url) { throw new Error('Misconfigured message queue: missing URL'); }
  
  var url = uri.parse(options.url);
  var mod, broker;
  
  switch (url.protocol) {
  case 'amqp:':
    mod = require('crane-amqp');
    broker = new mod.Broker();
    break;
  default:
    throw new Error('Misconfigured message queue connection: unsupported protocol "' + url.protocol + '"');
  }
  
  
  // Augument with bootable functionality.
  broker = bootable(broker);
  broker.phase(require('./boot/connect')(logger, options));
  broker.phase(require('./boot/declare')(logger, options));
  broker.phase(require('./boot/subscribe')(logger, options));
  
  return broker;
}

/**
 * Component annotations.
 */
exports['@singleton'] = true;
exports['@require'] = [ 'logger', 'settings' ];
