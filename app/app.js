exports = module.exports = function(IoC, configuration, MS, logger) {
  
  return IoC.create('http://i.bixbyjs.org/ms/Application')
    .then(function(app) {
      return configuration.get()
        .then(function createConnection(config) {
          var conn = MS.createConnection(config);
          conn.on('message', app);
          
          return conn;
        })
        .then(function waitUntilReady(conn) {
          return new Promise(function(resolve, reject) {
            
            conn.once('ready', function() {
              resolve(conn);
              // TODO: Remove error listener
            });
      
            // TODO: reject on error.
          });
        })
        .then(function subscribe(conn) {
          return new Promise(function(resolve, reject) {
            
            conn.subscribe('fetch', function(err) {
              console.log('SUBSCRIBED?')
              console.log(err);
        
              // err: NoQueueError: Queue "fetch" not declared
            });
      
            // TODO: reject on error.
          });
          
          
          
        })
        .then(function() {
          return app;
        });
    })
    .then(function(app) {
      return;
    });
  
  
  return IoC.create('http://i.bixbyjs.org/ms/Application')
    .then(function(app) {
      return Promise.resolve(IoC.create('./config'))
        .then(function(config) {
          var conn = MS.createConnection(config);
          // TODO: Add the connection to the agent?
          
          conn.on('message', app);
          
          
          conn.on('error', function(err) {
            console.log(err);
          });
          
          return conn;
        });
    })
    .then(function(conn) {
      return new Promise(function(resolve, reject){
        conn.declare('fetch', function(err)  {
          console.log('DECLARED!');
          console.log(err);
          
          
        })
      });
    })
    .then(function(conn) {
      // TODO: Get subscription topics/queues automatically...
      conn.subscribe('fetch', function(err) {
        console.log('SUBSCRIBED?')
        console.log(err);
        
        // err: NoQueueError: Queue "fetch" not declared
      });
    });
};

exports['@singleton'] = true;
exports['@require'] = [
  '!container',
  './config',
  'http://i.bixbyjs.org/ms',
  'http://i.bixbyjs.org/Logger'
];
