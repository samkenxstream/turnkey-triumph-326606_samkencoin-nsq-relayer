# numbat-nsq

You emit events structured in a specific way and this tool posts them all to its configured nsq instance.

```js
const nsqRelayer = require('nsq-relayer');

const relayer = nsqRelayer({
	topic: 'foozle',
	nsq: 'http://localhost:5141/pub',
	event: 'event-to-listen-for'
});

// later on
process.emit('event-to-listen-for', { name: 'my-little-message', type: 'cutie-mark' });
// the relayer will then post this to nsq for us with zero effort
```

## Configuration

TBD.

## Notes

TBD

## Licence

ISC.
