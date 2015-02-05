var test = require('tap').test
var protocol = require('./')

test('get', function (t) {
  t.plan(4)
  var p = protocol()

  p.on('get', function (id, cb) {
    t.same(id, 'test')
    cb(null, {id: id, start: 'start-script'})
  })

  p.get('test', function (err, service) {
    t.ok(!err)
    t.same(service.id, 'test')
    t.same(service.start, 'start-script')
  })

  p.pipe(p)
})

test('handshake', function (t) {
  t.plan(4)
  var p = protocol()

  p.on('handshake', function (handshake, cb) {
    t.same(handshake.type, 'dock')
    t.same(handshake.priority, 1)
    cb(null, {type: 'terminal'})
  })

  p.handshake({type: 'dock', priority: 1}, function (err, handshake) {
    t.ok(!err)
    t.same(handshake.type, 'terminal')
  })

  p.pipe(p)
})

test('add', function (t) {
  t.plan(3)
  var p = protocol()

  p.on('add', function (id, service, cb) {
    t.same(id, 'test')
    t.same(service.start, 'start-script')
    cb()
  })

  p.add('test', {start: 'start-script'}, function (err) {
    t.ok(!err)
  })

  p.pipe(p)
})

test('update', function (t) {
  t.plan(3)
  var p = protocol()

  p.on('update', function (id, service, cb) {
    t.same(id, 'test')
    t.same(service.start, 'start-script')
    cb(null, service)
  })

  p.update('test', {start: 'start-script'}, function (err) {
    t.ok(!err)
  })

  p.pipe(p)
})

test('remove', function (t) {
  t.plan(2)
  var p = protocol()

  p.on('remove', function (id, cb) {
    t.same(id, 'test')
    cb()
  })

  p.remove('test', function (err) {
    t.ok(!err)
  })

  p.pipe(p)
})

test('list', function (t) {
  t.plan(4)
  var p = protocol()

  p.on('list', function (cb) {
    cb(null, [{id: 'test'}])
  })

  p.list(function (err, list) {
    t.ok(!err)
    t.ok(Array.isArray(list))
    t.ok(list.length, 1)
    t.same(list[0].id, 'test')
  })

  p.pipe(p)
})

test('ps', function (t) {
  t.plan(4)
  var p = protocol()

  p.on('ps', function (cb) {
    cb(null, [{id: 'test'}])
  })

  p.ps(function (err, ps) {
    t.ok(!err)
    t.ok(Array.isArray(ps))
    t.ok(ps.length, 1)
    t.same(ps[0].id, 'test')
  })

  p.pipe(p)
})

test('start', function (t) {
  t.plan(2)
  var p = protocol()

  p.on('start', function (id, cb) {
    t.same(id, 'test')
    cb()
  })

  p.start('test', function (err) {
    t.ok(!err)
  })

  p.pipe(p)
})

test('stop', function (t) {
  t.plan(2)
  var p = protocol()

  p.on('stop', function (id, cb) {
    t.same(id, 'test')
    cb()
  })

  p.stop('test', function (err) {
    t.ok(!err)
  })

  p.pipe(p)
})

test('restart', function (t) {
  t.plan(2)
  var p = protocol()

  p.on('restart', function (id, cb) {
    t.same(id, 'test')
    cb()
  })

  p.restart('test', function (err) {
    t.ok(!err)
  })

  p.pipe(p)
})

test('sync', function (t) {
  t.plan(3)
  var p = protocol()

  p.on('sync', function (id, service, cb) {
    t.same(id, 'test')
    t.same(service.start, 'start-script')
    cb()
  })

  p.sync('test', {start: 'start-script'}, function (err) {
    t.ok(!err)
  })

  p.pipe(p)
})

test('subscribe', function (t) {
  t.plan(2)
  var p = protocol()

  p.on('subscribe', function (id, cb) {
    t.same(id, 'test')
    cb()
  })

  p.subscribe('test', function (err) {
    t.ok(!err)
  })

  p.pipe(p)
})

test('unsubscribe', function (t) {
  t.plan(2)
  var p = protocol()

  p.on('unsubscribe', function (id, cb) {
    t.same(id, 'test')
    cb()
  })

  p.unsubscribe('test', function (err) {
    t.ok(!err)
  })

  p.pipe(p)
})

test('stdout', function (t) {
  t.plan(4)
  var p = protocol()

  p.on('stdout', function (id, origin, buffer) {
    t.same(id, 'test')
    t.same(origin, 'localhost')
    t.same(buffer.toString(), 'hello stdout')
    t.ok(Buffer.isBuffer(buffer))
  })

  p.stdout('test', 'localhost', new Buffer('hello stdout'))

  p.pipe(p)
})

test('stderr', function (t) {
  t.plan(4)
  var p = protocol()

  p.on('stderr', function (id, origin, buffer) {
    t.same(id, 'test')
    t.same(origin, 'localhost')
    t.same(buffer.toString(), 'hello stderr')
    t.ok(Buffer.isBuffer(buffer))
  })

  p.stderr('test', 'localhost', new Buffer('hello stderr'))

  p.pipe(p)
})

test('spawn', function (t) {
  t.plan(3)
  var p = protocol()

  p.on('spawn', function (id, origin, pid) {
    t.same(id, 'test')
    t.same(origin, 'localhost')
    t.same(pid, 900)
  })

  p.spawn('test', 'localhost', 900)

  p.pipe(p)
})

test('exit', function (t) {
  t.plan(3)
  var p = protocol()

  p.on('exit', function (id, origin, code) {
    t.same(id, 'test')
    t.same(origin, 'localhost')
    t.same(code, 'SIGTERM')
  })

  p.exit('test', 'localhost', 'SIGTERM')

  p.pipe(p)
})

test('ping', function (t) {
  t.plan(2)
  var p = protocol()

  p.on('ping', function () {
    t.ok(true)
  })

  p.ping(function (err) {
    t.ok(!err)
  })

  p.pipe(p)
})
