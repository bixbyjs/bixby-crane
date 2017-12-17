exports = module.exports = function(IoC, MS, logger) {
  
  return Promise.resolve(IoC.create('http://i.bixbyjs.org/ms/Application'))
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
      // TODO: Get subscription topics/queues automatically...
      conn.subscribe('fetch');
    });
};

exports['@singleton'] = true;
exports['@require'] = [
  '!container',
  'http://i.bixbyjs.org/ms',
  'http://i.bixbyjs.org/Logger'
];
