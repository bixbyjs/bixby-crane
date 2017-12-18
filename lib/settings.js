function Settings() {
  this._sources = [];
}

Settings.prototype.use = function(source) {
  this._sources.push(source);
}

Settings.prototype.get = function(cb) {
  var self = this;
  
  return new Promise(function(resolve, reject) {
    var sources = self._sources
      , source
      , i = 0;
  
    (function iter(err, config) {
      if (err) { return reject(err); }
      if (config) { return resolve(config); }
    
      source = sources[i++];
      if (!source) { return reject(new Error('No configuration found')); }
    
      try {
        var arity = source.length;
        if (arity == 1) {
          source(iter);
        } else {
          iter(null, source());
        }
      } catch (ex) {
        iter(ex);
      }
    })();
  });
};


module.exports = Settings;
