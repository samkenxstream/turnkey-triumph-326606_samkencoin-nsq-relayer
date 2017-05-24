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
	});

	it('obeys its options', function()
	{
		const spy = sinon.spy(process, 'on');
		createRelayer({
			event: 'zaphod'
		});

		spy.called.must.be.true();
		spy.calledWith('zaphod').must.be.true();
		spy.restore();
	});

	it('defaults options when they are not provided', function()
	{
		const spy = sinon.spy(process, 'on');
		createRelayer();
		spy.called.must.be.true();
		spy.calledWith('nsq').must.be.true();
		spy.restore();
	});

	it('listens for the configured event', function(done)
	{
		const r = createRelayer();
		r.handleEvent = function(msg)
		{
			msg.must.be.an.object();
			msg.payload.must.equal('hello world');
			process.removeAllListeners('nsq');
			done()
		}
		process.emit('nsq', { payload: 'hello world'});
	});

	it('posts to nsq on receiving an event', function(done)
	{
		const r = createRelayer();
		const msg = { payload: 'hello world'};
		r.requester.post = function(uri, msg)
		{
			uri.must.equal('/pub');
			msg.must.be.an.object();
			msg.payload.must.equal('hello world');
			done()
		}
		process.emit('nsq', msg);
	});

	it('logs on error', function(done)
	{
		const r = createRelayer();
		r.requester.post = function()
		{
			return Promise.reject(new Error('wat'));
		};
		const msg = { payload: 'hello world'};
		var count = 0;

		r.logger.error = function()
		{
			count++;
			if (count === 2) done();
		}
		r.handleEvent(msg)
	});
});
