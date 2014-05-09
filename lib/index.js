module.exports = function express(id) {
  var map = {
    'adapter': './adapter',
    'boot/connection': './boot/connection',
    'boot/declare': './boot/declare',
    'boot/subscribe': './crane/subscribe'
  };
  
  var mid = map[id];
  if (mid) {
    return require(mid);
  }
};
