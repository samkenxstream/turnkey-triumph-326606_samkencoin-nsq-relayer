#!/usr/bin/env node

const createRelayer = require('./index.js');

createRelayer({
	topic: 'test-relayer',
	event: 'test-relayer',
});

var count = 0;

setInterval(() =>
{
	process.emit('test-relayer', { name: 'test', count });
	count++;

	if (count > 100) process.exit();
}, 1000);
