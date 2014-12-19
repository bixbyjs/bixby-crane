exports = module.exports = function(adapter) {

  return function dispatch() {
    // Dispatch messages recieved from the message queue to the application for
    // processing.
    adapter.on('message', this);
  }
}

/**
 * Component annotations.
 */
exports['@require'] = [ '../adapter' ];
