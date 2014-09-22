/**
 * Module dependencies.
 */


exports = module.exports = function(adapter, settings, logger) {

  return function declare(done) {
    var config = settings.toObject();
    
    var queues = config.queue || config.queues;
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
      queue.topics = queue.topics || queue.topic || [];
      if (typeof queue.topics == 'string') {
        queue.topics = [ queue.topics ];
      }
      // HACK: TOML parser weirdness
      if (typeof queue.topics == 'object') {
        queue.topics.length = Object.keys(queue.topics).length;
      }
      
      logger.info('Declaring queue %s [%d]', queue.name, queue.topics.length);
      adapter.declare(queue.name, { bind: (queue.topics.length === 0) }, function(err, q) {
        if (err) { return qiter(err); }
      
        var ti = 0;
        function titer(err) {
          if (err) { return qiter(err); }
      
          var topic = queue.topics[ti++];
          if (!topic) { return qiter(); }
      
          logger.info('Binding topic %s to %s', topic, queue.name);
          q.bind(topic, function(err) {
            if (err) { return titer(err); }
            titer();
          });
        }
        titer();
      });
    }
    qiter();
  }
}

/**
 * Component annotations.
 */
exports['@require'] = [ '../adapter', 'settings', 'logger' ];
