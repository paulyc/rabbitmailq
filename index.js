//
// rabbitmailq
//
// Copyright (C) 2020 Paul Ciarlo <paul.ciarlo@gmail.com>
//
// Licensed under the terms of the Hippocratic License, Version 2.1, or any
// later version, at the discretion of the Licensee. (See LICENSE file)
//
// If you did not receive a copy of the Hippocratic License with this
// Software, you may download a copy of it from the following URI:
// https://firstdonoharm.dev/version/2/1/license.html
//

const fs = require('fs');
const amqp = require('amqplib/callback_api');
const amqplib = require('amqplib');

const getChannel = async (amqp_uri, queue_name) => {
	const conn = await amqplib.connect(amqp_uri)
	const channel = await conn.createChannel();
	await channel.assertQueue(queue_name);
	return channel;
};

const peekMessages = async (channel, queue_name) => {
	const msgs = [];
	for (;;) {
		const res = await channel.get(queue_name);
		if (res === false) {
			break;
		}
		msgs.push(res);
	}
	return msgs;
};

const main = async () => {
	const amqp_uri = 'amqp://localhost';
	const queue_name = 'email';
	const channel = await getChannel(amqp_uri, queue_name);
	const msgs = await peekMessages(channel, queue_name);
	console.log(msgs.length);
	//const uniq = `import-${new Date().valueOf()}`;
	for (const m of msgs) {
		fs.writeFileSync(`${process.env.HOME}/Maildir/new/rabbitmsg-${m.fields.deliveryTag}`, m.content.toString());
	}
};

// printing these msgs to stderr as not to interfere with the mbox on stdout
main()
	.then(res => console.error('ok, result:', res))
	.catch(err => console.error('fail, err:', err))
	.finally(() => process.exit(0));
