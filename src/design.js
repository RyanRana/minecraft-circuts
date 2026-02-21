import { synthesize, isYosysAvailable } from './yosys.js';
import { netlistToRedstone } from './gate_placer.js';

const NEEDS_SUPPORT = new Set([
    'redstone_wire', 'redstone_torch', 'repeater', 'comparator',
    'lever', 'stone_button', 'stone_pressure_plate', 'oak_pressure_plate',
    'daylight_detector', 'note_block', 'dispenser', 'dropper',
]);

/**
 * Add missing support blocks (stone below wire/torch/etc.) and deduplicate.
 * @param {{ blocks: Array<{block:string, dx:number, dy:number, dz:number}>, size?: object }} design
 * @returns design (mutated) with blocks and size updated
 */
export function autoFixDesign(design) {
    const blockMap = new Map();
    for (const b of design.blocks) blockMap.set(`${b.dx},${b.dy},${b.dz}`, b);
    const additions = [];
    for (const b of design.blocks) {
        const baseName = b.block.split('[')[0];
        if (NEEDS_SUPPORT.has(baseName) || baseName === 'redstone_torch' || baseName === 'redstone_wall_torch') {
            const belowKey = `${b.dx},${b.dy - 1},${b.dz}`;
            if (!blockMap.has(belowKey)) {
                const supportBlock = { block: 'stone', dx: b.dx, dy: b.dy - 1, dz: b.dz };
                additions.push(supportBlock);
                blockMap.set(belowKey, supportBlock);
            }
        }
    }
    if (additions.length > 0) design.blocks = [...additions, ...design.blocks];
    const seen = new Set();
    design.blocks = design.blocks.filter(b => {
        const key = `${b.dx},${b.dy},${b.dz}`;
        if (seen.has(key)) return false;
        seen.add(key);
        return true;
    });
    if (design.blocks.length > 0) {
        const xs = design.blocks.map(b => b.dx);
        const ys = design.blocks.map(b => b.dy);
        const zs = design.blocks.map(b => b.dz);
        design.size = {
            x: Math.max(...xs) - Math.min(...xs) + 1,
            y: Math.max(...ys) - Math.min(...ys) + 1,
            z: Math.max(...zs) - Math.min(...zs) + 1,
        };
    }
    return design;
}

/**
 * Verilog string -> redstone design. Requires Yosys installed (brew install yosys).
 * @param {string} verilogCode
 * @param {string} [outputType='redstone_lamp']
 * @returns {{ blocks, size, inputPositions, outputPositions }}
 */
export async function circuitFromVerilog(verilogCode, outputType = 'redstone_lamp') {
    const netlist = await synthesize(verilogCode);
    const design = netlistToRedstone(netlist, outputType);
    return autoFixDesign(design);
}

/**
 * Netlist (Yosys-style) -> redstone design. No Yosys required.
 * @param {{ inputs: Array<{name, bit}>, outputs: Array<{name, bit}>, gates: Array<{type, inputs, output}> }} netlist
 * @param {string} [outputType='redstone_lamp']
 * @returns {{ blocks, size, inputPositions, outputPositions }}
 */
export function circuitFromNetlist(netlist, outputType = 'redstone_lamp') {
    const design = netlistToRedstone(netlist, outputType);
    return autoFixDesign(design);
}

export { isYosysAvailable };
