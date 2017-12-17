exports = module.exports = function(IoC, env) {
  var Factory = require('fluidfactory');
  
  
  var factory = new Factory();
  factory.use(env);
  
  return factory.create();
}

exports['@require'] = [
  '!container',
  './config/env'
];
