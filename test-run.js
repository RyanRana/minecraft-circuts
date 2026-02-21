#!/usr/bin/env node
/**
 * Run from package root: npm test
 * Uses local ./index.js so it works in a fresh clone (no npm install of self).
 */
import { netlistToRedstone } from './index.js';

const design = netlistToRedstone({
  inputs: [{ name: 'a', bit: 1 }, { name: 'b', bit: 2 }],
  outputs: [{ name: 'y', bit: 3 }],
  gates: [{ type: '$_AND_', inputs: [1, 2], output: 3 }],
}, 'redstone_lamp');

console.log('OK', design.blocks.length, 'blocks, size', JSON.stringify(design.size));
