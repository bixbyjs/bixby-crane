module.exports = function crane(id) {
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
