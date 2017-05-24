#!/usr/bin/env node

const createRelayer = require('./index.js');

const relayer = createRelayer({
	topic: 'test-relayer',
	event: 'test-relayer',
});

var count = 0;

const interval = setInterval(() =>
{
	process.emit('test-relayer', { name: 'test', count });
	count++;

	if (count > 100) process.exit();
}, 1000);
