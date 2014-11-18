exports = module.exports = function(logger, options) {
  options = options || {};

  return function declare(done) {
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
      queue.topics = queue.topics || queue.topic || [];
      if (typeof queue.topics == 'string') {
        queue.topics = [ queue.topics ];
      }
      // HACK: TOML parser weirdness
      if (typeof queue.topics == 'object') {
        queue.topics.length = Object.keys(queue.topics).length;
      }
      
      logger.info('Declaring queue %s', queue.name);
      this.declare(queue.name, { bind: (queue.topics.length === 0) }, function(err, q) {
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
