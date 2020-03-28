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
const open = require('amqplib').connect('amqp://localhost');

