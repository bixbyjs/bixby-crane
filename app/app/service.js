exports = module.exports = function(IoC, logger) {
  var crane = require('crane');
  
  return IoC.create('service')
    .catch(function(err) {
      // TODO: Check that the error is failure to create app/service
      
      var service = crane();
      
      return Promise.resolve(service)
        .then(function(service) {
          return service;
        });
    });
};

exports['@require'] = [
  '!container',
  'http://i.bixbyjs.org/Logger'
];
