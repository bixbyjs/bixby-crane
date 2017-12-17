exports = module.exports = function() {
  
  return function env() {
    if (process.env.MESSAGE_BROKER_URL) {
      return { url: process.env.MESSAGE_BROKER_URL };
    }
  };
};
