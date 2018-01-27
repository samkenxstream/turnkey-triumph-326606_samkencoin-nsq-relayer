'use strict';

const
	bole    = require('bole'),
	Squeaky = require('squeaky'),
	url     = require('url')
	;

const createRelayer = module.exports = function createRelayer(opts)
{
	opts = opts || {};
	opts.topic = opts.topic || 'relayed';
	opts.event = opts.event || 'nsq';
	opts.nsq = opts.nsq || 'http://localhost:4150';

	return new NSQRelayer(opts);
};

class NSQRelayer
{
	constructor(opts)
	{
		const parsed = url.parse(opts.nsq);
		this.nsq = new Squeaky({ host: parsed.host });
		this.topic = opts.topic;
		this.logger = bole(opts.event);

		process.on(opts.event, msg => this.handleEvent(msg));
	}

	handleEvent(message)
	{
		this.nsq.publish(this.topic, message).then(resp =>
		{
			// silence on success
			this.logger.debug(resp, message);
		}).catch(err =>
		{
			this.logger.error('unexpected problem posting to nsq; dropping event on the floor');
			this.logger.error(err);
		});
	}
}

createRelayer.NSQRelayer = NSQRelayer;
