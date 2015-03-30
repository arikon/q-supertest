<a href="http://promisesaplus.com/">
  <img src="https://promises-aplus.github.io/promises-spec/assets/logo-small.png"
    align="right" valign="top" alt="Promises/A+ logo">
</a>

# q-supertest

<a href="https://travis-ci.org/arikon/q-supertest">
  <img src="https://travis-ci.org/arikon/q-supertest.svg?branch=master"
    align="right" valign="top" alt="Build Status">
</a>

`q-supertest` supercharges [SuperTest] with a `then` method, that returns [Q] promise.

Instead of layering callbacks on callbacks in your tests:

```js
request(app)
  .get("/user")
  .expect(200, function (err, res) {
    if (err) return done(err);

    var userId = res.body.id;
    request(app)
      .post("/kittens")
      .send({ userId: userId, ... })
      .expect(201, function (err, res) {
        if (err) return done(err);

        // ...
      });
  });
```

chain your requests like you were promised:

```js
return request(app)
  .get("/user")
  .expect(200)
  .then(function (res) {
    return request(app)
      .post("/kittens")
      .send({ userId: res})
      .expect(201);
  })
  .then(function (res) {
    // ...
  });
```

## Usage

`q-supertest` operates just like normal [SuperTest], except that the
object returned by `.get`, `.post`, etc. is a proper
thenable:

```js
var express = require("express")
  , request = require("q-supertest");

var app = express();

request(app)
  .get("/kittens")
  .expect(200)
  .then(function (res) {
    // ...
  });
```

If you use a promise-friendly test runner, you can just
return your `request` chain from the test case rather than messing with a
callback:

```js
describe("GET /kittens", function () {
  it("should work", function () {
    return request(app).get("/kittens").expect(200);
  });
});
```

### Agents

If you use a SuperTest agent to persist cookies, those are thenable too:

```js
var agent = require("q-supertest").agent(app);

agent
  .get("/ugly-kitteh")
  .expect(404)
  .then(function () {
    // ...
  })
```


### Promisey goodness

To start, only the `then` method is exposed. But once you've called `.then`
once, you've got a proper [Q] promise that supports the whole gamut of
promisey goodness:

```js
request(app)
  .get("/kittens")
  .expect(201)
  .then(function (res) { /* ... */ })
  // I'm a real promise now!
  .catch(function (err) { /* ... */ })
```

See the [Q API][Q] for everything that's available.

## Installation

### Node

```bash
$ npm install q-supertest
```

`q-supertest` lists [`supertest`][SuperTest] as a
[peer dependency][peer-dependency], so it'll wrap whatever version of SuperTest
you've asked for in your own `package.json`. If you don't specify a version of
SuperTest, npm will use the latest.

Do note that `q-supertest` is a well-behaved citizen and doesn't monkey-patch
SuperTest directly:

```js
// I return thenables!
var request = require("q-supertest");

// I'm lame and force you to use callbacks
var request = require("supertest");
```

[Q]: https://github.com/kriskowal/q
[peer-dependency]: http://blog.nodejs.org/2013/02/07/peer-dependencies/
[SuperTest]: https://github.com/visionmedia/supertest
