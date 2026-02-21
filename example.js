#!/usr/bin/env node
/**
 * Out-of-the-box example. Run from package root: npm run example
 * No Yosys required — uses netlist only.
 */
import { netlistToRedstone } from './index.js';

const netlist = {
  inputs: [
    { name: 'a', bit: 1 },
    { name: 'b', bit: 2 },
  ],
  outputs: [{ name: 'y', bit: 3 }],
  gates: [
    { type: '$_AND_', inputs: [1, 2], output: 3 },
  ],
};

const design = netlistToRedstone(netlist, 'redstone_lamp');

console.log('Minecraft Circuits — netlist to redstone (no Yosys needed)\n');
console.log('Netlist: 1 AND gate (a & b -> y)');
console.log('Blocks:', design.blocks.length);
console.log('Size:  ', design.size.x, 'x', design.size.y, 'x', design.size.z);
console.log('First 5 blocks:', design.blocks.slice(0, 5));
