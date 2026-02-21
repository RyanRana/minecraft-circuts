/**
 * Minecraft Circuits
 * Convert logic (Verilog or netlist) to Minecraft redstone block layouts.
 * No game connection — design only. Usable by any LLM or script.
 *
 * Usage:
 *   import { circuitFromVerilog, circuitFromNetlist, netlistToRedstone } from 'minecraft-circuits';
 *   const design = await circuitFromVerilog('module c(input a,b, output y); assign y = a & b; endmodule');
 *   // design.blocks = [{ block: 'stone', dx, dy, dz }, ...], design.size = { x, y, z }
 */

export { netlistToRedstone } from './src/gate_placer.js';
export { synthesize, parseNetlist, isYosysAvailable } from './src/yosys.js';
export { circuitFromVerilog, circuitFromNetlist, autoFixDesign } from './src/design.js';
export { parseJSON, validateCircuitDesign, validateCircuitPlan } from './src/models.js';
export {
    VERILOG_PROMPT,
    DESIGNER_PROMPT,
    PLANNER_PROMPT,
    CORRECTOR_PROMPT,
} from './src/prompts.js';
