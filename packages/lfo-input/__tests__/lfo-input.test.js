'use strict';

const lfoInput = require('..');
const assert = require('assert').strict;

assert.strictEqual(lfoInput(), 'Hello from lfoInput');
console.info('lfoInput tests passed');
