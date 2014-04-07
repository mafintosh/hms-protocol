# hms-protocol

The protocol stream that hms uses to communicate between servers and clients

	npm install hms-protocol

[![Build Status](https://travis-ci.org/mafintosh/hms-protocol.png)](https://travis-ci.org/mafintosh/hms-protocol)

This is mostly only useful for [hms](https://github.com/mafintosh/hms.git)

## Usage

Simply pipe the stream to and from a source

``` js
var protocol = require('hms-protocol');
var net = require('net');

net.createServer(function(stream) {
	var p = protocol();
	stream.pipe(p).pipe(stream);

	p.on('start', function(id, cb) {
		console.log('we received a start for', id);
		cb();
	});
}).listen(10000, function() {
	var p = protocol();
	var stream = net.connect(10000);
	stream.pipe(p).pipe(stream);

	p.start('test', function(err) {
		console.log('start was received?', err);
	});
});

```

## Send messages

The following messages are supported over the protocol

* `p.handshake(opts, cb)` send a protocol handhake
* `p.ping(cb)` ping to see if remote is alive
* `p.get(id, cb)` get information about a service
* `p.add(id, service, cb)` add a new service.
* `p.update(id, service, cb)` update an existing service
* `p.remove(id, cb)` remove a service
* `p.list(cb)` list all services
* `p.ps(cb)` get process information about all services
* `p.start(id, cb)` start a service
* `p.stop(id, cb)` stop a service
* `p.restart(id, cb)` restart a service
* `p.sync(id, service, cb)` sync service state
* `p.subscribe([id], cb)` subscribe to service events. omit the `id` to subscribe to `*`
* `p.unsubscribe([id], cb)` unsubscribe from service events. omit the `id` to unsubscribe `*`
* `p.stdout(id, origin, buffer)` send a stdout event
* `p.stderr(id, origin, buffer)` send a stderr event
* `p.spawn(id, origin, pid)` send a process spawn event
* `p.exit(id, origin, code)` send a process exit event
* `p.amSubscribing(id)` returns true if you are subscribing to `id`
* `p.peerSubscribing(id)` returns true if the peer is subscribing to `id`

The service message can contain the following

``` js
{
	start: 'node .',
	build: 'npm install',
	docks: [
		'dock-id-to-run-at'
	],
	env: {
		FOO: 'bar'
	}
}
```

## Receive messages

Sending any of the above messages will trigger an event of the same for the receiver.
I.e. if you do `p.start(id, cb)` it will result in `p.on('start', id, cb)` being triggered
for the receiver

## License

MIT
