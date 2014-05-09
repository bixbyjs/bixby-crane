/**
 * Module dependencies.
 */


exports = module.exports = function(adapter, settings, logger, options) {

  return function declare(done) {
    options = options || settings.get('connection') || {};
    
    var queues = options.queue || options.queues
      , topics = options.topic || options.topics
      , bind = true;
      
    if (!queues) { throw new Error('Misconfigured connection: missing queue'); }
      
    if (typeof queues == 'string') {
      queues = [ queues ];
    }
    if (typeof topics == 'string') {
      topics = [ topics ];
    }
    bind = topics === undefined ? true : false;
    topics = topics || [];
    
    // TODO: if multiple queues are specified with topics, throw error
    
    var qi = 0;
    function qiter(err) {
      if (err) { return done(err); }
  
      var queue = queues[qi++];
      if (!queue) { return done(); }
      
      logger.info('Declaring queue %s', queue, bind);
      adapter.declare(queue, { bind: bind }, function(err, q) {
        if (err) { return qiter(err); }
      
        var ti = 0;
        function titer(err) {
          if (err) { return qiter(err); }
      
          var topic = topics[ti++];
          if (!topic) { return qiter(); }
      
          logger.info('Binding queue %s to %s', queue, topic);
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
