var methods = require("methods")
  , q = require("q")
  , supertest = require("supertest");

// Support SuperTest's historical `del` alias for `delete`
methods.push("del");

function then(onFulfilled, onRejected) {
  var defer = q.defer();
  this.end.call(this, defer.makeNodeResolver());
  return defer.promise.then(onFulfilled, onRejected);
}

// Creates a new object that wraps `factory`, where each HTTP method (`get`,
// `post`, etc.) is overriden to inject a `then` method into the returned `Test`
// instance.
function wrap(factory) {
  var out = {};

  methods.forEach(function (method) {
    out[method] = function () {
      var test = factory[method].apply(factory, arguments);
      test.then = then;
      return test;
    };
  });

  return out;
}

module.exports = function () {
  var request = supertest.apply(null, arguments);
  return wrap(request);
};

module.exports.agent = function () {
  var agent = supertest.agent.apply(null, arguments);
  return wrap(agent);
};
