exports = module.exports = function(IoC, service, configuration, MS, logger) {
  
  console.log('bixby-crane main');
  
  IoC.create('./app/broker')
    .then(function(broker) {
      broker.on('message', service);
      
      //console.log(service);
      
      /*
      broker.on('message', function(msg) {
        
        console.log('MESSAGE!');
        //console.log(msg);
        console.log(msg.topic)
        
      });
      */
    
    })
    .catch(function(err) {
      console.log('BROKER ERROR &**&&&&');
      console.log(err);
    });
  
  
  return;
  
  // FIXME: cleanup below here
  
  return IoC.create('http://i.bixbyjs.org/ms/Application')
    .then(function(app) {
      return configuration.get()
        .then(function createConnection(config) {
          var conn = MS.createConnection(config)
            , queue;
          conn.on('message', app);
          
          conn.on('error', function(err) {
            console.log(err);
          });
          
          if (!config.queue) {
            queue = MS.parseQueue(config.url);
          }
          
          
          
          return Promise.resolve(conn)
            .then(function waitUntilReady(conn) {
              return new Promise(function(resolve, reject) {
            
                conn.once('ready', function() {
                  resolve(conn);
                  // TODO: Remove error listener
                });
      
                // TODO: reject on error.
              });
            })
            .then(function declareMaybe(conn) {
              return new Promise(function(resolve, reject){
                conn.declare(queue, function(err)  {
                  console.log('DECLARED!');
                  console.log(err);
          
                  if (err) { return reject(err); }
                  return resolve(conn);
                })
              });
            })
            .then(function subscribe(conn) {
              return new Promise(function(resolve, reject) {
                conn.subscribe(queue, function(err) {
                  console.log('SUBSCRIBED?')
                  console.log(err);
              
                  // err: NoQueueError: Queue "fetch" not declared
                  // occurs if attempt to subscribe, and the queue does not exist
              
                  if (err) { return reject(err); }
                  return resolve(conn);
                });
              });
            })
        })
        .then(function() {
          return app;
        });
    })
    .then(function(app) {
      return;
    });
};

exports['@singleton'] = true;
exports['@implements'] = 'http://i.bixbyjs.org/Main';
exports['@require'] = [
  '!container',
  './app/service',
  './config',
  'http://i.bixbyjs.org/ms',
  'http://i.bixbyjs.org/Logger'
];
