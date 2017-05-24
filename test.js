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

	it('listens for the configured event');
	it('posts to nsq on receiving an event');
});
