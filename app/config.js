exports = module.exports = function(IoC, env) {
  var Settings = require('../lib/settings');
  
  
  var settings = new Settings();
  settings.use(env);
  
  return settings;
}

exports['@require'] = [
  '!container',
  './config/env'
];
