/**
 * Module dependencies.
 */
var uri = require('url');


exports = module.exports = function(settings, logger) {
  var config = settings.get('connection') || {};
  if (!config.url) { throw new Error('Misconfigured message queue connection: missing URL'); }
  
  var url = uri.parse(config.url);
  var mod, broker;
  
  switch (url.protocol) {
  case 'amqp:':
    mod = require('crane-amqp');
    broker = new mod.Broker();
    break;
  default:
    throw new Error('Misconfigured message queue connection: unsupported protocol "' + url.protocol + '"');
  }
  
  return broker;
}

/**
 * Component annotations.
 */
exports['@singleton'] = true;
exports['@require'] = [ 'settings', 'logger' ];
