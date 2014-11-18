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


exports = module.exports = function(logger, options) {
  options = options || {};

  return function connect(done) {
    if (!options.url) { throw new Error('Misconfigured message queue: missing URL'); }
    
    var url = uri.parse(options.url);
    var host = url.hostname;
    var port = url.port || DEFAULT_PORT[url.protocol];
    var exchange;
    if (options.exchange) {
      exchange = {
        name: options.exchange,
        options: {
          type: options.type,
          durable: options.durable,
          autoDelete: options.autoDelete,
          confirm: options.confirm
        }
      };
    }
  
    logger.info('Connecting to message queue %s:%d', host, port);
    this.connect({ host: host, port: port, exchange: exchange }, function() {
      logger.debug('Connected to message queue %s:%d', host, port);
      return done();
    });
    
    // NOTE: By default, if an error is encountered from the message queue it
    //       will be rethrown.  This will cause an `uncaughtException` within
    //       Node and the process will exit.  In accordance with a microservices
    //       architecture, it is expected that a process monitor will detect
    //       this condition and restart as necessary.
    this.on('error', function(err) {
      logger.error('Unexpected error from message queue: %s', err.message);
      logger.error(err.stack);
      throw err;
    });
  }
}
