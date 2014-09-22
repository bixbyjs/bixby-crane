exports = exports = module.exports = function crane(id) {
  var map = {
    'adapter': './adapter',
    'boot/connection': './boot/connection',
    'boot/declare': './boot/declare',
    'boot/subscribe': './boot/subscribe'
  };
  
  var mid = map[id];
  if (mid) {
    return require(mid);
  }
};

exports.scope = function(id, obj, $scope) {
  if (id == 'settings') {
    var prefix = $scope.prefix || 'connection';
    if ($scope.options && $scope.options['#']) {
      prefix = $scope.options['#'];
    }
    return obj.isolate(prefix);
  }
  return obj;
}
