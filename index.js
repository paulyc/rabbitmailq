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
	const {consumerTag} = await channel.consume(queue_name, msg => {
		if (msg !== null) {
			msgs.push(msg);
		}
	});
	channel.cancel(consumerTag);
	return msgs;
}

// Can't actually get mutt to accept this no matter what I do to it so
// Doesn't work, and IDC!
const msgToMboxOrNot = (msg) => {
	const str = msg.content.toString();
	// Find From header
	const lines = str.split('\r\n');
	let mboxFrom = null, mboxTimestamp = null;
	for (const l of lines) {
		if (l.startsWith('From:')) {
			mboxFrom = l.replace(/^From:.*<(.*)>.*$/, 'From $1');
		}
		if (l.startsWith('Date:')) {
			mboxTimestamp = l.substr(5);
		}
		if (mboxFrom !== null && mboxTimestamp !== null) {
			break;
		}
	}

	if (mboxFrom === null) {
		mboxFrom = 'From unknown@blackhole.as112.arpa ';
	}
	if (mboxTimestamp === null) {
		mboxTimestamp = new Date().toString();
	}
	return `\n${mboxFrom} ${mboxTimestamp}\n${str}`;
};

const mboxifyOrNot = (msgs) => msgs
	.map(msgToMboxOrNot)
	.join();

const main = async () => {
	const amqp_uri = 'amqp://localhost';
	const queue_name = 'email';
	const channel = await getChannel(amqp_uri, queue_name);
	const msgs = await peekMessages(channel, queue_name);
	// damn mbox to hell, nevermind
	// const mboxStr = mboxifyOrNot(msgs);
	// process.stdout.write(mboxStr);
	const msgsAsStrs = msgs.map(m => m.content.toString());
	process.stdout.write(msgsAsStrs.join('\n'));
};

// printing these msgs to stderr as not to interfere with the mbox on stdout
main()
	.then(res => console.error('ok, result:', res))
	.catch(err => console.error('fail, err:', err))
	.finally(() => process.exit(0));
