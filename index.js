'use strict';

const
	axios = require('axios'),
	bole  = require('bole')
	;

const createRelayer = module.exports = function createRelayer(opts)
{
	opts = opts || {};
	opts.topic = opts.topic || 'relayed';
	opts.event = opts.event || 'nsq';
	opts.nsq = opts.nsq || 'http://localhost:4151';

	return new NSQRelayer(opts);
};

class NSQRelayer
{
	constructor(opts)
	{
		this.requester = axios.create({
			baseURL: opts.nsq,
			params: { topic: opts.topic }
		});
		this.logger = bole(opts.event);

		process.on(opts.event, msg => this.handleEvent(msg));
	}

	handleEvent(message)
	{
		// Possibly we want to batch, but for our use case, we don't anticipate
		// hundreds of events at once.
		this.requester.post('/pub', message).then(rez =>
		{
			// silence on success
			this.logger.debug('posted an event');
		}).catch(err =>
		{
			this.logger.error('unexpected problem posting to nsq; dropping event on the floor');
			this.logger.error(err);
		});
	}
}

createRelayer.NSQRelayer = NSQRelayer;
