exports = module.exports = function(IoC, service, logger) {
  return Promise.resolve()
    .then(function(server) {
      console.log('crane app!');
    });
  
};

exports['@singleton'] = true;
exports['@require'] = [
  '!container',
  'http://i.bixbyjs.org/Logger'
];
