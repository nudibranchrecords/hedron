'use strict';

const clock = require('..');
const assert = require('assert').strict;

assert.strictEqual(clock(), 'Hello from clock');
console.info('clock tests passed');
