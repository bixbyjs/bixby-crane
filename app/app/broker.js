exports = module.exports = function(IoC, env, logger) {
  var Factory = require('fluidfactory');
  
  
  var factory = new Factory();
  factory.use(env);
  
  return Promise.resolve(factory)
    .then(function(factory) {
      var components = IoC.components('http://i.bixbyjs.org/ms/app/BrokerProvider');
      return Promise.all(components.map(function(c) { return c.create(); } ))
        .then(function(initializers) {
          initializers.forEach(function(initializer, i) {
            logger.info('Loaded message broker provider: ' + components[i].a['@name']);
            factory.use(initializer);
          });
        })
        .then(function() {
          return factory;
        });
    })
    .then(function(factory) {
      return factory.create();
    });
}

exports['@require'] = [
  '!container',
  './broker/env',
  'http://i.bixbyjs.org/Logger'
];
