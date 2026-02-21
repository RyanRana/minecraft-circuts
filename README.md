# Minecraft Circuits

Convert digital logic (Verilog or a Yosys-style netlist) into **Minecraft redstone block layouts**. Design only — no game connection. Usable from Node, scripts, or any LLM.

Redstone gate and routing logic was extracted from [Mindcraft](https://github.com/mindcraft-bots/mindcraft) (by [Kolby Nottingham](https://kolbynottingham.com/mindcraft) / mindcraft-bots). This package is a standalone, dependency-free version for use outside the full Mindcraft stack.

[![npm version](https://img.shields.io/npm/v/minecraft-circuits.svg)](https://www.npmjs.com/package/minecraft-circuits)
[![License: MIT](https://img.shields.io/badge/License-MIT-blue.svg)](https://opensource.org/licenses/MIT)

## Install

**From npm (in your app):**

```bash
npm install minecraft-circuits
```

**From repo (zero install — works out of the box):**

```bash
git clone https://github.com/RyanRana/minecraft-circuts.git
cd minecraft-circuits
npm test          # quick sanity check (no Yosys needed)
npm run example   # run the netlist example
```

No `npm install` is required in the repo: the package has **no runtime dependencies**. Optional: install [Yosys](https://yosyshq.readthedocs.io/) (e.g. `brew install yosys`) only if you use `circuitFromVerilog`. Netlist-only usage needs nothing else.

## Quick start

```js
import { circuitFromVerilog, netlistToRedstone } from 'minecraft-circuits';

// From Verilog (requires Yosys)
const design = await circuitFromVerilog(`
  module and_gate(input a, input b, output y);
    assign y = a & b;
  endmodule
`, 'redstone_lamp');

// From netlist (no Yosys)
const netlist = {
  inputs: [{ name: 'a', bit: 1 }, { name: 'b', bit: 2 }],
  outputs: [{ name: 'y', bit: 3 }],
  gates: [{ type: '$_AND_', inputs: [1, 2], output: 3 }],
};
const design2 = netlistToRedstone(netlist, 'redstone_lamp');

// design.blocks = [{ block: 'stone', dx, dy, dz }, ...]
// design.size = { x, y, z }
// design.inputPositions / design.outputPositions
```

## API

### Core

| Function | Description |
|----------|-------------|
| `netlistToRedstone(netlist, outputType?)` | Convert a netlist to block layout. `outputType`: `'redstone_lamp'`, `'iron_door'`, `'sticky_piston'`, `'dispenser'`, `'dropper'`. |
| `circuitFromVerilog(verilog, outputType?)` | Synthesize Verilog with Yosys and return block layout. |
| `circuitFromNetlist(netlist, outputType?)` | Run `netlistToRedstone` and `autoFixDesign`. |
| `autoFixDesign(design)` | Add missing support blocks under wire/torch and dedupe. |

### Synthesis (optional Yosys)

| Function | Description |
|----------|-------------|
| `synthesize(verilog)` | Run Yosys and return netlist. |
| `parseNetlist(text)` | Parse Yosys JSON netlist. |
| `isYosysAvailable()` | `Promise<boolean>`. |

### Validation & parsing

| Function | Description |
|----------|-------------|
| `parseJSON(text)` | Extract JSON from LLM output (handles markdown/code fences). |
| `validateCircuitDesign(design)` | Require `blocks` and (block, dx, dy, dz); fill `size` if missing. |
| `validateCircuitPlan(plan)` | Validate plan structure. |

### Prompts (for LLMs)

Import and send to your model:

- `VERILOG_PROMPT` — generate Verilog from a description.
- `DESIGNER_PROMPT` — generate block design from a plan.
- `PLANNER_PROMPT` — generate a circuit plan.
- `CORRECTOR_PROMPT` — fix invalid design JSON.

```js
import { VERILOG_PROMPT, DESIGNER_PROMPT } from 'minecraft-circuits';
// or: import { VERILOG_PROMPT } from 'minecraft-circuits/prompts';
```

## Output format

- **blocks**: `Array<{ block: string, dx: number, dy: number, dz: number }>` — relative positions. Block IDs match Minecraft (e.g. `redstone_wire`, `repeater[facing=east,delay=1]`, `redstone_lamp`).
- **size**: `{ x, y, z }` — bounding box size.
- **inputPositions** / **outputPositions**: offsets and labels for inputs/outputs.

## Supported gates

Yosys primitives: NOT, AND, NAND, OR, NOR, XOR, XNOR, BUF, MUX; D-latches; DFFs mapped to D-latches. Inputs named `clk`/`clock` get a repeater-loop clock with a kickstart lever.

## Requirements

- **Node.js** ≥ 18
- **Yosys** (optional) for Verilog synthesis

## Origin

Circuit design and gate-placer logic originated in [mindcraft-bots/mindcraft](https://github.com/mindcraft-bots/mindcraft). This package repackages that work as a standalone library; improvements (e.g. collision-aware routing, XOR/MUX fixes) are maintained here.

## License

MIT

## Contributing

Contributions are welcome. Open an [issue](https://github.com/RyanRana/minecraft-circuts/issues) or [pull request](https://github.com/RyanRana/minecraft-circuts).
