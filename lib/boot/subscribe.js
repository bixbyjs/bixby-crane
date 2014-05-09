/**
 * Module dependencies.
 */


exports = module.exports = function(adapter, settings, logger) {

  return function subscribe(done) {
    var config = settings.get('connection') || {}
      , queues = config.queue || config.queues
      , opts = {
        exclusive: config.exclusive || false
      };
      
    if (!queues) { throw new Error('Misconfigured connection: missing queue'); }
    
    if (typeof queues == 'string') {
      queues = [ queues ];
    }
    
    var qi = 0;
    function qiter(err) {
      if (err) { return done(err); }
  
      var queue = queues[qi++];
      if (!queue) { return done(); }
      
      logger.info('Subscribing to queue %s', queue);
      adapter.subscribe(queue, opts, function(err) {
        if (err) {
          logger.error(err.message);
          return qiter(err);
        }
        logger.info('Subscribed to queue %s', queue);
        return qiter();
      });
    }
    qiter();
  }
}

/**
 * Component annotations.
 */
exports['@require'] = [ '../adapter', 'settings', 'logger' ];
