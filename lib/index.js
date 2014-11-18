exports = exports = module.exports = function crane(id) {
  var map = {
    'adapter': './adapter'
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
