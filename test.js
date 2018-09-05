/*global describe:true, it:true, before:true, after:true, beforeEach: true, afterEach:true */
'use strict';

var
	demand        = require('must'),
	createRelayer = require('./index'),
	sinon         = require('sinon')
	;

describe('nsq-relayer', () =>
{
	it('exports a constructor', function()
	{
		createRelayer.must.be.a.function();
		const r = createRelayer();
		r.must.be.instanceof(createRelayer.NSQRelayer);
		r.close();
	});

	it('obeys its options', function()
	{
		const spy = sinon.spy(process, 'on');
		const r = createRelayer({
			event: 'zaphod'
		});

		spy.called.must.be.true();
		spy.calledWith('zaphod').must.be.true();
		spy.restore();

		r.close();
	});

	it('defaults options when they are not provided', function()
	{
		const spy = sinon.spy(process, 'on');
		const r = createRelayer();

		spy.called.must.be.true();
		spy.calledWith('nsq').must.be.true();
		spy.restore();

		r.close();
	});

	it('listens for the configured event', function(done)
	{
		const r = createRelayer();
		r.handleEvent = function(msg)
		{
			msg.must.be.an.object();
			msg.payload.must.equal('hello world');
			process.removeAllListeners('nsq');
			r.close();
			done();
		};
		process.emit('nsq', { payload: 'hello world'});
	});

	it('posts to nsq on receiving an event', function(done)
	{
		const r = createRelayer();
		const msg = { payload: 'hello world' };
		r.nsq.publish = function(topic, msg)
		{
			topic.must.equal('relayed');
			msg.must.be.an.object();
			msg.payload.must.equal('hello world');
			r.close();
			done();
		};
		process.emit('nsq', msg);
	});

	it('logs on error', function(done)
	{
		const r = createRelayer();
		r.nsq.publish = function()
		{
			return Promise.reject(new Error('wat'));
		};
		const msg = { payload: 'hello world'};
		var count = 0;

		r.logger.error = function()
		{
			count++;
			if (count === 2)
			{
				r.close();
				done();
			}
		};
		r.handleEvent(msg);
	});

	it('exposes close()', function(done)
	{
		const r = createRelayer();
		var count = 0;
		const close = r.nsq.close.bind(r.nsq);
		r.nsq.close = function()
		{
			count++;
			close();
		};

		const eventCount = process.listeners('nsq').length;
		r.close();
		(process.listeners('nsq').length - eventCount).must.equal(-1);
		count.must.equal(1);
		done();
	});

});
