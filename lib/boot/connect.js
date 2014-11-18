/**
 * Module dependencies.
 */
var uri = require('url');

/**
 * Default port constants.
 */
var DEFAULT_PORT = {
  'amqp:': 5672
};


exports = module.exports = function(adapter, settings, logger) {

  return function connect(done) {
    var config = settings.toObject();
    if (!config.url) { throw new Error('Misconfigured message queue: missing URL'); }
    
    var url = uri.parse(config.url);
    var host = url.hostname;
    var port = url.port || DEFAULT_PORT[url.protocol];
    var exchange;
    if (config.exchange) {
      exchange = {
        name: config.exchange,
        options: {
          type: config.type,
          durable: config.durable,
          autoDelete: config.autoDelete || config.auto_delete,
          confirm: config.confirm
        }
      };
    }
  
    logger.info('Connecting to message queue %s:%d', host, port);
    adapter.connect({ host: host, port: port, exchange: exchange }, function() {
      logger.debug('Connected to message queue %s:%d', host, port);
      return done();
    });
    
    // NOTE: By default, if an error is encountered from the message queue it
    //       will be rethrown.  This will cause an `uncaughtException` within
    //       Node and the process will exit.  In accordance with a microservices
    //       architecture, it is expected that a process monitor will detect
    //       this condition and restart as necessary.
    adapter.on('error', function(err) {
      logger.error('Unexpected error from message queue: %s', err.message);
      logger.error(err.stack);
      throw err;
    });
  }
}

/**
 * Component annotations.
 */
exports['@require'] = [ '../adapter', 'settings', 'logger' ];
