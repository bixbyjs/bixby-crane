/**
 * Module dependencies.
 */


exports = module.exports = function(adapter, settings, logger) {

  return function subscribe(done) {
    var config = settings.toObject()
      , queues = config.queue || config.queues;
      
    if (!queues) { throw new Error('Misconfigured message queue: no queues'); }
    
    if (typeof queues == 'string') {
      queues = [ queues ];
    }
    
    var qi = 0;
    function qiter(err) {
      if (err) { return done(err); }
  
      var queue = queues[qi++];
      if (!queue) { return done(); }
      
      if (typeof queue == 'string') {
        queue = { name: queue };
      }
      queue.exclusive = queue.exclusive || false;
      queue.prefetchCount = queue.prefetch_count;
      
      if (queue.subscribe === false) {
        process.nextTick(qiter);
      } else {
        logger.info('Subscribing to queue %s (%s) [%d]', queue.name, queue.exclusive ? 'x' : ' ', queue.prefetch_count || 1);
        adapter.subscribe(queue.name, { exclusive: queue.exclusive, prefetchCount: queue.prefetchCount }, function(err) {
          if (err) {
            logger.error(err.message);
            return qiter(err);
          }
          logger.debug('Subscribed to queue %s', queue.name);
          return qiter();
        });
      }
    }
    qiter();
  }
}

/**
 * Component annotations.
 */
exports['@require'] = [ '../adapter', 'settings', 'logger' ];
