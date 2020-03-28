//
// rabbitmailq
//
// Copyright (C) 2020 Paul Ciarlo <paul.ciarlo@gmail.com>
//
// Licensed under the terms of the Hippocratic License, version 2.1,
//   or any later version, at the discretion of the Licensee.
//   See LICENSE.
//

const amqp = require('amqplib/callback_api');
const amqplib = require('amqplib');

const getChannel = async (amqp_uri, queue_name) => {
	const conn = await amqplib.connect(amqp_uri)
	const channel = await conn.createChannel();
	await channel.assertQueue(queue_name);
	return channel;
};

const main = async () => {
	const amqp_uri = 'amqp://localhost';
	const queue_name = 'email';
	const channel = await getChannel(amqp_uri, queue_name);
	channel.consume(queue_name, msg => {
		if (msg !== null) {
			console.log(msg.content.toString());
		}
	});
};

main()
	.then(res => console.log('ok, result:', res))
	.catch(err => console.error('fail, err:', err))
	.finally(() => console.log('done'));
