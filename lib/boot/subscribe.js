exports = module.exports = function(adapter, logger, settings) {

  return function subscribe(done) {
    var options = settings.toObject();
    var queues = options.queue || options.queues || [];
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
      
      if (queue.subscribe === false) {
        process.nextTick(qiter);
      } else {
        logger.info('Subscribing to queue %s [%s%d]', queue.name, queue.exclusive ? 'x' : '', queue.prefetchCount || 1);
        adapter.subscribe(queue.name, { exclusive: queue.exclusive, prefetchCount: queue.prefetchCount }, function(err) {
          if (err) {
            logger.error(err.message);
            return qiter(err);
          }
          logger.debug('Subscribed to queue %s', queue.name);
          qiter();
        });
      }
    }
    qiter();
  }
}

/**
 * Component annotations.
 */
exports['@require'] = [ '../adapter', 'logger', 'settings' ];
