// http://docs.celeryproject.org/en/latest/userguide/configuration.html
// BROKER_URL

exports = module.exports = function(ms, logger) {
  
  
  return function() {
    var url = process.env['BROKER_URL'];
    if (!url) { return; }
    
    broker = ms.createConnection(url);
    //console.log(broker);
    
    /*
    broker.on('ready', function() {
      broker.consume('my-sub-linkback', function(err) {
        if (err) {
          logger.error('Failed to consume message queue')
          logger.error(err.stack);
        }
      });
    });
    return broker;
    */
  };
};

exports['@require'] = [
  'http://i.bixbyjs.org/ms',
  'http://i.bixbyjs.org/Logger'
];
