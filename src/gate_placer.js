// Gate-level redstone templates and deterministic placer.
// Each Yosys primitive cell ($_AND_, $_OR_, $_NOT_, $_XOR_, etc.)
// maps to a small proven redstone layout with defined input/output positions.

// =================================================================
// GATE TEMPLATES
// Each gate has: blocks[], size{x,y,z}, inputOffsets[], outputOffset
// Blocks use relative (dx,dy,dz). dy=0 is ground (stone base).
// All wire has stone below. All torches have stone below.
// =================================================================

const GATE_TEMPLATES = {
    // NOT gate: wire -> stone pillar -> torch (inverts) -> wire out
    // Size: 4x3x1, input at (0,1,0), output at (3,1,0)
    '$_NOT_': {
        size: { x: 4, y: 3, z: 1 },
        inputOffsets: [{ dx: 0, dy: 1, dz: 0 }],
        outputOffset: { dx: 3, dy: 1, dz: 0 },
        blocks: [
            { block: 'stone', dx: 0, dy: 0, dz: 0 },
            { block: 'stone', dx: 1, dy: 0, dz: 0 },
            { block: 'stone', dx: 2, dy: 0, dz: 0 },
            { block: 'stone', dx: 3, dy: 0, dz: 0 },
            { block: 'redstone_wire', dx: 0, dy: 1, dz: 0 },
            { block: 'stone', dx: 1, dy: 1, dz: 0 },
            { block: 'redstone_torch', dx: 1, dy: 2, dz: 0 },
            { block: 'redstone_wire', dx: 2, dy: 1, dz: 0 },
            { block: 'redstone_wire', dx: 3, dy: 1, dz: 0 },
        ],
    },

    // AND gate via De Morgan: NOT(NOT(A) OR NOT(B))
    '$_AND_': {
        size: { x: 5, y: 3, z: 3 },
        inputOffsets: [{ dx: 0, dy: 1, dz: 0 }, { dx: 0, dy: 1, dz: 2 }],
        outputOffset: { dx: 4, dy: 1, dz: 1 },
        blocks: [
            { block: 'stone', dx: 0, dy: 0, dz: 0 }, { block: 'stone', dx: 1, dy: 0, dz: 0 },
            { block: 'stone', dx: 2, dy: 0, dz: 0 }, { block: 'stone', dx: 3, dy: 0, dz: 0 },
            { block: 'stone', dx: 4, dy: 0, dz: 0 },
            { block: 'stone', dx: 0, dy: 0, dz: 1 }, { block: 'stone', dx: 1, dy: 0, dz: 1 },
            { block: 'stone', dx: 2, dy: 0, dz: 1 }, { block: 'stone', dx: 3, dy: 0, dz: 1 },
            { block: 'stone', dx: 4, dy: 0, dz: 1 },
            { block: 'stone', dx: 0, dy: 0, dz: 2 }, { block: 'stone', dx: 1, dy: 0, dz: 2 },
            { block: 'stone', dx: 2, dy: 0, dz: 2 }, { block: 'stone', dx: 3, dy: 0, dz: 2 },
            { block: 'stone', dx: 4, dy: 0, dz: 2 },
            { block: 'redstone_wire', dx: 0, dy: 1, dz: 0 },
            { block: 'stone', dx: 1, dy: 1, dz: 0 },
            { block: 'redstone_torch', dx: 1, dy: 2, dz: 0 },
            { block: 'redstone_wire', dx: 0, dy: 1, dz: 2 },
            { block: 'stone', dx: 1, dy: 1, dz: 2 },
            { block: 'redstone_torch', dx: 1, dy: 2, dz: 2 },
            { block: 'redstone_wire', dx: 2, dy: 1, dz: 0 },
            { block: 'redstone_wire', dx: 2, dy: 1, dz: 1 },
            { block: 'redstone_wire', dx: 2, dy: 1, dz: 2 },
            { block: 'stone', dx: 3, dy: 1, dz: 1 },
            { block: 'redstone_torch', dx: 3, dy: 2, dz: 1 },
            { block: 'redstone_wire', dx: 4, dy: 1, dz: 1 },
        ],
    },

    // OR gate
    '$_OR_': {
        size: { x: 3, y: 2, z: 3 },
        inputOffsets: [{ dx: 0, dy: 1, dz: 0 }, { dx: 0, dy: 1, dz: 2 }],
        outputOffset: { dx: 2, dy: 1, dz: 1 },
        blocks: [
            { block: 'stone', dx: 0, dy: 0, dz: 0 }, { block: 'stone', dx: 1, dy: 0, dz: 0 },
            { block: 'stone', dx: 2, dy: 0, dz: 0 },
            { block: 'stone', dx: 0, dy: 0, dz: 1 }, { block: 'stone', dx: 1, dy: 0, dz: 1 },
            { block: 'stone', dx: 2, dy: 0, dz: 1 },
            { block: 'stone', dx: 0, dy: 0, dz: 2 }, { block: 'stone', dx: 1, dy: 0, dz: 2 },
            { block: 'stone', dx: 2, dy: 0, dz: 2 },
            { block: 'redstone_wire', dx: 0, dy: 1, dz: 0 },
            { block: 'redstone_wire', dx: 1, dy: 1, dz: 0 },
            { block: 'redstone_wire', dx: 0, dy: 1, dz: 2 },
            { block: 'redstone_wire', dx: 1, dy: 1, dz: 2 },
            { block: 'redstone_wire', dx: 1, dy: 1, dz: 1 },
            { block: 'redstone_wire', dx: 2, dy: 1, dz: 1 },
        ],
    },

    // XOR gate: two-level crossing
    '$_XOR_': {
        size: { x: 7, y: 3, z: 3 },
        inputOffsets: [{ dx: 0, dy: 1, dz: 0 }, { dx: 0, dy: 1, dz: 2 }],
        outputOffset: { dx: 6, dy: 1, dz: 1 },
        blocks: [
            { block: 'stone', dx: 0, dy: 0, dz: 0 }, { block: 'stone', dx: 1, dy: 0, dz: 0 },
            { block: 'stone', dx: 2, dy: 0, dz: 0 }, { block: 'stone', dx: 3, dy: 0, dz: 0 },
            { block: 'stone', dx: 4, dy: 0, dz: 0 }, { block: 'stone', dx: 5, dy: 0, dz: 0 },
            { block: 'stone', dx: 6, dy: 0, dz: 0 },
            { block: 'stone', dx: 0, dy: 0, dz: 1 }, { block: 'stone', dx: 1, dy: 0, dz: 1 },
            { block: 'stone', dx: 2, dy: 0, dz: 1 }, { block: 'stone', dx: 3, dy: 0, dz: 1 },
            { block: 'stone', dx: 4, dy: 0, dz: 1 }, { block: 'stone', dx: 5, dy: 0, dz: 1 },
            { block: 'stone', dx: 6, dy: 0, dz: 1 },
            { block: 'stone', dx: 0, dy: 0, dz: 2 }, { block: 'stone', dx: 1, dy: 0, dz: 2 },
            { block: 'stone', dx: 2, dy: 0, dz: 2 }, { block: 'stone', dx: 3, dy: 0, dz: 2 },
            { block: 'stone', dx: 4, dy: 0, dz: 2 }, { block: 'stone', dx: 5, dy: 0, dz: 2 },
            { block: 'stone', dx: 6, dy: 0, dz: 2 },
            { block: 'redstone_wire', dx: 0, dy: 1, dz: 0 },
            { block: 'redstone_wire', dx: 1, dy: 1, dz: 0 },
            { block: 'redstone_wire', dx: 0, dy: 1, dz: 2 },
            { block: 'redstone_wire', dx: 1, dy: 1, dz: 2 },
            { block: 'stone', dx: 1, dy: 1, dz: 1 },
            { block: 'stone', dx: 2, dy: 1, dz: 1 },
            { block: 'redstone_wire', dx: 1, dy: 2, dz: 1 },
            { block: 'redstone_wire', dx: 2, dy: 2, dz: 1 },
            { block: 'stone', dx: 2, dy: 1, dz: 0 },
            { block: 'redstone_torch', dx: 2, dy: 2, dz: 0 },
            { block: 'stone', dx: 2, dy: 1, dz: 2 },
            { block: 'redstone_torch', dx: 2, dy: 2, dz: 2 },
            { block: 'redstone_wire', dx: 1, dy: 1, dz: 2 },
            { block: 'redstone_wire', dx: 3, dy: 1, dz: 0 },
            { block: 'redstone_wire', dx: 3, dy: 1, dz: 1 },
            { block: 'redstone_wire', dx: 3, dy: 1, dz: 2 },
            { block: 'redstone_wire', dx: 4, dy: 1, dz: 1 },
            { block: 'redstone_wire', dx: 5, dy: 1, dz: 1 },
            { block: 'redstone_wire', dx: 6, dy: 1, dz: 1 },
        ],
    },

    '$_BUF_': {
        size: { x: 3, y: 2, z: 1 },
        inputOffsets: [{ dx: 0, dy: 1, dz: 0 }],
        outputOffset: { dx: 2, dy: 1, dz: 0 },
        blocks: [
            { block: 'stone', dx: 0, dy: 0, dz: 0 },
            { block: 'stone', dx: 1, dy: 0, dz: 0 },
            { block: 'stone', dx: 2, dy: 0, dz: 0 },
            { block: 'redstone_wire', dx: 0, dy: 1, dz: 0 },
            { block: 'repeater[facing=east,delay=1]', dx: 1, dy: 1, dz: 0 },
            { block: 'redstone_wire', dx: 2, dy: 1, dz: 0 },
        ],
    },

    '$_NAND_': {
        size: { x: 4, y: 3, z: 3 },
        inputOffsets: [{ dx: 0, dy: 1, dz: 0 }, { dx: 0, dy: 1, dz: 2 }],
        outputOffset: { dx: 3, dy: 1, dz: 1 },
        blocks: [
            { block: 'stone', dx: 0, dy: 0, dz: 0 }, { block: 'stone', dx: 1, dy: 0, dz: 0 },
            { block: 'stone', dx: 2, dy: 0, dz: 0 }, { block: 'stone', dx: 3, dy: 0, dz: 0 },
            { block: 'stone', dx: 0, dy: 0, dz: 1 }, { block: 'stone', dx: 1, dy: 0, dz: 1 },
            { block: 'stone', dx: 2, dy: 0, dz: 1 }, { block: 'stone', dx: 3, dy: 0, dz: 1 },
            { block: 'stone', dx: 0, dy: 0, dz: 2 }, { block: 'stone', dx: 1, dy: 0, dz: 2 },
            { block: 'stone', dx: 2, dy: 0, dz: 2 }, { block: 'stone', dx: 3, dy: 0, dz: 2 },
            { block: 'redstone_wire', dx: 0, dy: 1, dz: 0 },
            { block: 'stone', dx: 1, dy: 1, dz: 0 },
            { block: 'redstone_torch', dx: 1, dy: 2, dz: 0 },
            { block: 'redstone_wire', dx: 0, dy: 1, dz: 2 },
            { block: 'stone', dx: 1, dy: 1, dz: 2 },
            { block: 'redstone_torch', dx: 1, dy: 2, dz: 2 },
            { block: 'redstone_wire', dx: 2, dy: 1, dz: 0 },
            { block: 'redstone_wire', dx: 2, dy: 1, dz: 1 },
            { block: 'redstone_wire', dx: 2, dy: 1, dz: 2 },
            { block: 'redstone_wire', dx: 3, dy: 1, dz: 1 },
        ],
    },

    '$_NOR_': {
        size: { x: 5, y: 3, z: 3 },
        inputOffsets: [{ dx: 0, dy: 1, dz: 0 }, { dx: 0, dy: 1, dz: 2 }],
        outputOffset: { dx: 4, dy: 1, dz: 1 },
        blocks: [
            { block: 'stone', dx: 0, dy: 0, dz: 0 }, { block: 'stone', dx: 1, dy: 0, dz: 0 },
            { block: 'stone', dx: 2, dy: 0, dz: 0 }, { block: 'stone', dx: 3, dy: 0, dz: 0 },
            { block: 'stone', dx: 4, dy: 0, dz: 0 },
            { block: 'stone', dx: 0, dy: 0, dz: 1 }, { block: 'stone', dx: 1, dy: 0, dz: 1 },
            { block: 'stone', dx: 2, dy: 0, dz: 1 }, { block: 'stone', dx: 3, dy: 0, dz: 1 },
            { block: 'stone', dx: 4, dy: 0, dz: 1 },
            { block: 'stone', dx: 0, dy: 0, dz: 2 }, { block: 'stone', dx: 1, dy: 0, dz: 2 },
            { block: 'stone', dx: 2, dy: 0, dz: 2 }, { block: 'stone', dx: 3, dy: 0, dz: 2 },
            { block: 'stone', dx: 4, dy: 0, dz: 2 },
            { block: 'redstone_wire', dx: 0, dy: 1, dz: 0 },
            { block: 'redstone_wire', dx: 1, dy: 1, dz: 0 },
            { block: 'redstone_wire', dx: 0, dy: 1, dz: 2 },
            { block: 'redstone_wire', dx: 1, dy: 1, dz: 2 },
            { block: 'redstone_wire', dx: 1, dy: 1, dz: 1 },
            { block: 'redstone_wire', dx: 2, dy: 1, dz: 1 },
            { block: 'stone', dx: 3, dy: 1, dz: 1 },
            { block: 'redstone_torch', dx: 3, dy: 2, dz: 1 },
            { block: 'redstone_wire', dx: 4, dy: 1, dz: 1 },
        ],
    },

    '$_DLATCH_P_': {
        size: { x: 5, y: 3, z: 3 },
        inputOffsets: [{ dx: 0, dy: 1, dz: 0 }, { dx: 0, dy: 1, dz: 2 }],
        outputOffset: { dx: 4, dy: 1, dz: 0 },
        blocks: [
            { block: 'stone', dx: 0, dy: 0, dz: 0 }, { block: 'stone', dx: 1, dy: 0, dz: 0 },
            { block: 'stone', dx: 2, dy: 0, dz: 0 }, { block: 'stone', dx: 3, dy: 0, dz: 0 },
            { block: 'stone', dx: 4, dy: 0, dz: 0 },
            { block: 'stone', dx: 0, dy: 0, dz: 1 }, { block: 'stone', dx: 1, dy: 0, dz: 1 },
            { block: 'stone', dx: 2, dy: 0, dz: 1 },
            { block: 'stone', dx: 0, dy: 0, dz: 2 }, { block: 'stone', dx: 1, dy: 0, dz: 2 },
            { block: 'stone', dx: 2, dy: 0, dz: 2 },
            { block: 'redstone_wire', dx: 0, dy: 1, dz: 0 },
            { block: 'redstone_wire', dx: 1, dy: 1, dz: 0 },
            { block: 'repeater[facing=east,delay=1]', dx: 2, dy: 1, dz: 0 },
            { block: 'redstone_wire', dx: 3, dy: 1, dz: 0 },
            { block: 'redstone_wire', dx: 4, dy: 1, dz: 0 },
            { block: 'repeater[facing=north,delay=1]', dx: 2, dy: 1, dz: 1 },
            { block: 'redstone_wire', dx: 0, dy: 1, dz: 2 },
            { block: 'stone', dx: 1, dy: 1, dz: 2 },
            { block: 'redstone_torch', dx: 1, dy: 2, dz: 2 },
            { block: 'redstone_wire', dx: 2, dy: 1, dz: 2 },
        ],
    },

    '$_DLATCH_N_': {
        size: { x: 5, y: 2, z: 3 },
        inputOffsets: [{ dx: 0, dy: 1, dz: 0 }, { dx: 0, dy: 1, dz: 2 }],
        outputOffset: { dx: 4, dy: 1, dz: 0 },
        blocks: [
            { block: 'stone', dx: 0, dy: 0, dz: 0 }, { block: 'stone', dx: 1, dy: 0, dz: 0 },
            { block: 'stone', dx: 2, dy: 0, dz: 0 }, { block: 'stone', dx: 3, dy: 0, dz: 0 },
            { block: 'stone', dx: 4, dy: 0, dz: 0 },
            { block: 'stone', dx: 0, dy: 0, dz: 1 }, { block: 'stone', dx: 1, dy: 0, dz: 1 },
            { block: 'stone', dx: 2, dy: 0, dz: 1 },
            { block: 'stone', dx: 0, dy: 0, dz: 2 }, { block: 'stone', dx: 1, dy: 0, dz: 2 },
            { block: 'stone', dx: 2, dy: 0, dz: 2 },
            { block: 'redstone_wire', dx: 0, dy: 1, dz: 0 },
            { block: 'redstone_wire', dx: 1, dy: 1, dz: 0 },
            { block: 'repeater[facing=east,delay=1]', dx: 2, dy: 1, dz: 0 },
            { block: 'redstone_wire', dx: 3, dy: 1, dz: 0 },
            { block: 'redstone_wire', dx: 4, dy: 1, dz: 0 },
            { block: 'repeater[facing=north,delay=1]', dx: 2, dy: 1, dz: 1 },
            { block: 'redstone_wire', dx: 0, dy: 1, dz: 2 },
            { block: 'redstone_wire', dx: 1, dy: 1, dz: 2 },
            { block: 'redstone_wire', dx: 2, dy: 1, dz: 2 },
        ],
    },

    '$_XNOR_': {
        size: { x: 9, y: 3, z: 3 },
        inputOffsets: [{ dx: 0, dy: 1, dz: 0 }, { dx: 0, dy: 1, dz: 2 }],
        outputOffset: { dx: 8, dy: 1, dz: 1 },
        blocks: [
            { block: 'stone', dx: 0, dy: 0, dz: 0 }, { block: 'stone', dx: 1, dy: 0, dz: 0 },
            { block: 'stone', dx: 2, dy: 0, dz: 0 }, { block: 'stone', dx: 3, dy: 0, dz: 0 },
            { block: 'stone', dx: 4, dy: 0, dz: 0 }, { block: 'stone', dx: 5, dy: 0, dz: 0 },
            { block: 'stone', dx: 6, dy: 0, dz: 0 }, { block: 'stone', dx: 7, dy: 0, dz: 0 },
            { block: 'stone', dx: 8, dy: 0, dz: 0 },
            { block: 'stone', dx: 0, dy: 0, dz: 1 }, { block: 'stone', dx: 1, dy: 0, dz: 1 },
            { block: 'stone', dx: 2, dy: 0, dz: 1 }, { block: 'stone', dx: 3, dy: 0, dz: 1 },
            { block: 'stone', dx: 4, dy: 0, dz: 1 }, { block: 'stone', dx: 5, dy: 0, dz: 1 },
            { block: 'stone', dx: 6, dy: 0, dz: 1 }, { block: 'stone', dx: 7, dy: 0, dz: 1 },
            { block: 'stone', dx: 8, dy: 0, dz: 1 },
            { block: 'stone', dx: 0, dy: 0, dz: 2 }, { block: 'stone', dx: 1, dy: 0, dz: 2 },
            { block: 'stone', dx: 2, dy: 0, dz: 2 }, { block: 'stone', dx: 3, dy: 0, dz: 2 },
            { block: 'stone', dx: 4, dy: 0, dz: 2 }, { block: 'stone', dx: 5, dy: 0, dz: 2 },
            { block: 'stone', dx: 6, dy: 0, dz: 2 }, { block: 'stone', dx: 7, dy: 0, dz: 2 },
            { block: 'stone', dx: 8, dy: 0, dz: 2 },
            { block: 'redstone_wire', dx: 0, dy: 1, dz: 0 },
            { block: 'redstone_wire', dx: 1, dy: 1, dz: 0 },
            { block: 'redstone_wire', dx: 0, dy: 1, dz: 2 },
            { block: 'redstone_wire', dx: 1, dy: 1, dz: 2 },
            { block: 'stone', dx: 1, dy: 1, dz: 1 },
            { block: 'stone', dx: 2, dy: 1, dz: 1 },
            { block: 'redstone_wire', dx: 1, dy: 2, dz: 1 },
            { block: 'redstone_wire', dx: 2, dy: 2, dz: 1 },
            { block: 'stone', dx: 2, dy: 1, dz: 0 },
            { block: 'redstone_torch', dx: 2, dy: 2, dz: 0 },
            { block: 'stone', dx: 2, dy: 1, dz: 2 },
            { block: 'redstone_torch', dx: 2, dy: 2, dz: 2 },
            { block: 'redstone_wire', dx: 1, dy: 1, dz: 2 },
            { block: 'redstone_wire', dx: 3, dy: 1, dz: 0 },
            { block: 'redstone_wire', dx: 3, dy: 1, dz: 1 },
            { block: 'redstone_wire', dx: 3, dy: 1, dz: 2 },
            { block: 'redstone_wire', dx: 4, dy: 1, dz: 1 },
            { block: 'redstone_wire', dx: 5, dy: 1, dz: 1 },
            { block: 'redstone_wire', dx: 6, dy: 1, dz: 1 },
            { block: 'stone', dx: 7, dy: 1, dz: 1 },
            { block: 'redstone_torch', dx: 7, dy: 2, dz: 1 },
            { block: 'redstone_wire', dx: 8, dy: 1, dz: 1 },
        ],
    },

    '$_MUX_': {
        size: { x: 6, y: 3, z: 5 },
        inputOffsets: [{ dx: 0, dy: 1, dz: 0 }, { dx: 0, dy: 1, dz: 4 }, { dx: 0, dy: 1, dz: 2 }],
        outputOffset: { dx: 5, dy: 1, dz: 2 },
        blocks: [
            { block: 'stone', dx: 0, dy: 0, dz: 0 }, { block: 'stone', dx: 1, dy: 0, dz: 0 },
            { block: 'stone', dx: 2, dy: 0, dz: 0 }, { block: 'stone', dx: 3, dy: 0, dz: 0 },
            { block: 'stone', dx: 4, dy: 0, dz: 0 }, { block: 'stone', dx: 5, dy: 0, dz: 0 },
            { block: 'stone', dx: 0, dy: 0, dz: 1 }, { block: 'stone', dx: 1, dy: 0, dz: 1 },
            { block: 'stone', dx: 2, dy: 0, dz: 1 }, { block: 'stone', dx: 3, dy: 0, dz: 1 },
            { block: 'stone', dx: 4, dy: 0, dz: 1 }, { block: 'stone', dx: 5, dy: 0, dz: 1 },
            { block: 'stone', dx: 0, dy: 0, dz: 2 }, { block: 'stone', dx: 1, dy: 0, dz: 2 },
            { block: 'stone', dx: 2, dy: 0, dz: 2 }, { block: 'stone', dx: 3, dy: 0, dz: 2 },
            { block: 'stone', dx: 4, dy: 0, dz: 2 }, { block: 'stone', dx: 5, dy: 0, dz: 2 },
            { block: 'stone', dx: 0, dy: 0, dz: 3 }, { block: 'stone', dx: 1, dy: 0, dz: 3 },
            { block: 'stone', dx: 2, dy: 0, dz: 3 }, { block: 'stone', dx: 3, dy: 0, dz: 3 },
            { block: 'stone', dx: 4, dy: 0, dz: 3 }, { block: 'stone', dx: 5, dy: 0, dz: 3 },
            { block: 'stone', dx: 0, dy: 0, dz: 4 }, { block: 'stone', dx: 1, dy: 0, dz: 4 },
            { block: 'stone', dx: 2, dy: 0, dz: 4 }, { block: 'stone', dx: 3, dy: 0, dz: 4 },
            { block: 'stone', dx: 4, dy: 0, dz: 4 }, { block: 'stone', dx: 5, dy: 0, dz: 4 },
            { block: 'redstone_wire', dx: 0, dy: 1, dz: 0 },
            { block: 'stone', dx: 1, dy: 1, dz: 0 },
            { block: 'redstone_torch', dx: 1, dy: 2, dz: 0 },
            { block: 'redstone_wire', dx: 2, dy: 1, dz: 0 },
            { block: 'redstone_wire', dx: 0, dy: 1, dz: 2 },
            { block: 'stone', dx: 1, dy: 1, dz: 2 },
            { block: 'redstone_torch', dx: 1, dy: 2, dz: 2 },
            { block: 'redstone_wire', dx: 2, dy: 1, dz: 2 },
            { block: 'redstone_wire', dx: 0, dy: 1, dz: 4 },
            { block: 'stone', dx: 1, dy: 1, dz: 4 },
            { block: 'redstone_torch', dx: 1, dy: 2, dz: 4 },
            { block: 'redstone_wire', dx: 2, dy: 1, dz: 4 },
            { block: 'redstone_wire', dx: 1, dy: 1, dz: 1 },
            { block: 'redstone_wire', dx: 2, dy: 1, dz: 1 },
            { block: 'stone', dx: 3, dy: 1, dz: 1 },
            { block: 'redstone_torch', dx: 3, dy: 2, dz: 1 },
            { block: 'redstone_wire', dx: 4, dy: 1, dz: 1 },
            { block: 'redstone_wire', dx: 2, dy: 1, dz: 3 },
            { block: 'stone', dx: 3, dy: 1, dz: 3 },
            { block: 'redstone_torch', dx: 3, dy: 2, dz: 3 },
            { block: 'redstone_wire', dx: 4, dy: 1, dz: 3 },
            { block: 'redstone_wire', dx: 4, dy: 1, dz: 2 },
            { block: 'redstone_wire', dx: 5, dy: 1, dz: 2 },
        ],
    },
};

const DFF_TO_DLATCH_P = ['$_DFF_P_', '$_DFF_PP0_', '$_DFF_PP1_', '$_SDFF_PP0_'];
const DFF_TO_DLATCH_N = ['$_DFF_N_', '$_DFF_PN0_', '$_DFF_PN1_'];

const GATE_SPACING_X = 4;
const CLOCK_RE = /^(clk|clock)$/i;

function placeClockSource(blocks, baseZ) {
    for (let x = 0; x < 3; x++)
        for (let z = 0; z < 3; z++)
            blocks.push({ block: 'stone', dx: x, dy: 0, dz: baseZ + z });
    blocks.push({ block: 'repeater[facing=east,delay=2]', dx: 0, dy: 1, dz: baseZ });
    blocks.push({ block: 'redstone_wire', dx: 1, dy: 1, dz: baseZ });
    blocks.push({ block: 'repeater[facing=south,delay=2]', dx: 2, dy: 1, dz: baseZ });
    blocks.push({ block: 'redstone_wire', dx: 2, dy: 1, dz: baseZ + 1 });
    blocks.push({ block: 'repeater[facing=west,delay=2]', dx: 2, dy: 1, dz: baseZ + 2 });
    blocks.push({ block: 'redstone_wire', dx: 1, dy: 1, dz: baseZ + 2 });
    blocks.push({ block: 'repeater[facing=north,delay=2]', dx: 0, dy: 1, dz: baseZ + 2 });
    blocks.push({ block: 'redstone_wire', dx: 0, dy: 1, dz: baseZ + 1 });
    blocks.push({ block: 'stone', dx: -1, dy: 0, dz: baseZ + 1 });
    blocks.push({ block: 'stone', dx: -1, dy: 1, dz: baseZ + 1 });
    blocks.push({ block: 'lever', dx: -1, dy: 2, dz: baseZ + 1 });
}

function placeOutputBlock(blocks, x, z, outputType) {
    blocks.push({ block: 'stone', dx: x, dy: 0, dz: z });
    switch (outputType) {
        case 'iron_door':
            blocks.push({ block: 'iron_door[half=lower]', dx: x, dy: 1, dz: z });
            blocks.push({ block: 'iron_door[half=upper]', dx: x, dy: 2, dz: z });
            break;
        case 'sticky_piston':
            blocks.push({ block: 'sticky_piston[facing=up]', dx: x, dy: 1, dz: z });
            break;
        case 'dispenser':
            blocks.push({ block: 'dispenser[facing=up]', dx: x, dy: 1, dz: z });
            break;
        case 'dropper':
            blocks.push({ block: 'dropper[facing=down]', dx: x, dy: 1, dz: z });
            break;
        default:
            blocks.push({ block: outputType, dx: x, dy: 1, dz: z });
            break;
    }
}

export function netlistToRedstone(netlist, outputType = 'redstone_lamp') {
    const { inputs, outputs, gates } = netlist;
    if (gates.length === 0) throw new Error('No gates in netlist — circuit may be trivially simple or invalid');

    const sorted = topoSort(gates, inputs);
    const netPositions = new Map();
    const allBlocks = [];
    const occupied = new Set();
    let cursorX = 0;
    const maxZ = { value: 0 };

    function markOccupied(dx, dy, dz) { occupied.add(`${dx},${dy},${dz}`); }
    function isOccupied(dx, dy, dz) { return occupied.has(`${dx},${dy},${dz}`); }

    function pushBlock(b) {
        allBlocks.push(b);
        markOccupied(b.dx, b.dy, b.dz);
    }

    for (let i = 0; i < inputs.length; i++) {
        const iz = i * 3;
        if (CLOCK_RE.test(inputs[i].name)) {
            const clockBlocks = [];
            placeClockSource(clockBlocks, iz);
            for (const b of clockBlocks) pushBlock(b);
            netPositions.set(inputs[i].bit, { x: 0, y: 1, z: iz + 1 });
            if (iz + 3 > maxZ.value) maxZ.value = iz + 3;
        } else {
            pushBlock({ block: 'stone', dx: 0, dy: 0, dz: iz });
            pushBlock({ block: 'redstone_wire', dx: 0, dy: 1, dz: iz });
            pushBlock({ block: 'lever', dx: 0, dy: 2, dz: iz });
            netPositions.set(inputs[i].bit, { x: 0, y: 1, z: iz });
            if (iz + 1 > maxZ.value) maxZ.value = iz + 1;
        }
    }

    cursorX = 4;
    for (const gate of sorted) {
        const tmplKey = resolveTemplate(gate.type);
        const tmpl = GATE_TEMPLATES[tmplKey];
        if (!tmpl) continue;
        let avgZ = 0, countZ = 0;
        for (const inputBit of gate.inputs) {
            const pos = netPositions.get(inputBit);
            if (pos) { avgZ += pos.z; countZ++; }
        }
        const gateZ = countZ > 0 ? Math.round(avgZ / countZ) : 0;
        const baseZ = Math.max(0, gateZ - Math.floor(tmpl.size.z / 2));
        for (const b of tmpl.blocks) {
            pushBlock({ block: b.block, dx: cursorX + b.dx, dy: b.dy, dz: baseZ + b.dz });
        }
        for (let i = 0; i < gate.inputs.length && i < tmpl.inputOffsets.length; i++) {
            const srcPos = netPositions.get(gate.inputs[i]);
            const tgtPos = { x: cursorX + tmpl.inputOffsets[i].dx, y: tmpl.inputOffsets[i].dy, z: baseZ + tmpl.inputOffsets[i].dz };
            if (srcPos) routeWire(allBlocks, occupied, srcPos, tgtPos, markOccupied, isOccupied);
        }
        if (gate.output != null) {
            netPositions.set(gate.output, { x: cursorX + tmpl.outputOffset.dx, y: tmpl.outputOffset.dy, z: baseZ + tmpl.outputOffset.dz });
        }
        if (baseZ + tmpl.size.z > maxZ.value) maxZ.value = baseZ + tmpl.size.z;
        cursorX += tmpl.size.x + GATE_SPACING_X;
    }

    for (let i = 0; i < outputs.length; i++) {
        const srcPos = netPositions.get(outputs[i].bit);
        const outZ = i * 3;
        const outX = cursorX;
        const outBlocks = [];
        placeOutputBlock(outBlocks, outX, outZ, outputType);
        for (const b of outBlocks) pushBlock(b);
        if (srcPos) routeWire(allBlocks, occupied, srcPos, { x: outX, y: 1, z: outZ }, markOccupied, isOccupied);
        if (outZ + 1 > maxZ.value) maxZ.value = outZ + 1;
    }

    const seen = new Set();
    const deduped = allBlocks.filter(b => {
        const key = `${b.dx},${b.dy},${b.dz}`;
        if (seen.has(key)) return false;
        seen.add(key);
        return true;
    });
    const xs = deduped.map(b => b.dx), ys = deduped.map(b => b.dy), zs = deduped.map(b => b.dz);
    const size = { x: Math.max(...xs) - Math.min(...xs) + 1, y: Math.max(...ys) - Math.min(...ys) + 1, z: Math.max(...zs) - Math.min(...zs) + 1 };
    return {
        blocks: deduped,
        size,
        inputPositions: inputs.map((inp, i) => ({ dx: 0, dy: 2, dz: i * 3, label: inp.name })),
        outputPositions: outputs.map((out, i) => ({ dx: cursorX, dy: 1, dz: i * 3, label: out.name })),
    };
}

function resolveTemplate(cellType) {
    if (GATE_TEMPLATES[cellType]) return cellType;
    if (DFF_TO_DLATCH_P.includes(cellType)) return '$_DLATCH_P_';
    if (DFF_TO_DLATCH_N.includes(cellType)) return '$_DLATCH_N_';
    if (cellType === '$_ANDNOT_') return '$_AND_';
    if (cellType === '$_ORNOT_') return '$_OR_';
    if (cellType === '$_AOI3_') return '$_NAND_';
    if (cellType === '$_OAI3_') return '$_NOR_';
    return null;
}

function topoSort(gates, inputs) {
    const inputBits = new Set(inputs.map(i => i.bit));
    const produced = new Set(inputBits);
    const remaining = [...gates];
    const sorted = [];
    let maxIter = gates.length * gates.length + 1;
    while (remaining.length > 0 && maxIter-- > 0) {
        const idx = remaining.findIndex(g => g.inputs.every(bit => produced.has(bit) || typeof bit === 'string'));
        if (idx === -1) { sorted.push(...remaining); break; }
        const gate = remaining.splice(idx, 1)[0];
        sorted.push(gate);
        if (gate.output != null) produced.add(gate.output);
    }
    return sorted;
}

function routeWire(blocks, occupied, src, tgt, markOccupied, isOccupied) {
    const baseY = 1;
    let cx = src.x, cz = src.z;
    const stepX = tgt.x > cx ? 1 : (tgt.x < cx ? -1 : 0);
    const stepZ = tgt.z > cz ? 1 : (tgt.z < cz ? -1 : 0);
    const facingX = stepX === 1 ? 'east' : 'west';
    const facingZ = stepZ === 1 ? 'south' : 'north';

    // Build the ideal 2D path (X first, then Z)
    const waypoints = [];
    while (cx !== tgt.x) {
        cx += stepX;
        if (cx === tgt.x && cz === tgt.z) break;
        waypoints.push({ x: cx, z: cz, facing: facingX });
    }
    while (cz !== tgt.z) {
        cz += stepZ;
        if (cx === tgt.x && cz === tgt.z) break;
        waypoints.push({ x: cx, z: cz, facing: facingZ });
    }

    // Find a clear Y for each waypoint (go up if occupied by gate or other wire)
    function findClearY(wx, wz) {
        let y = baseY;
        while (isOccupied(wx, y, wz) && y < baseY + 8) y += 2;
        return y;
    }

    function emitWireAt(x, y, z, facing, distRef) {
        if (!isOccupied(x, y - 1, z)) {
            blocks.push({ block: 'stone', dx: x, dy: y - 1, dz: z });
            markOccupied(x, y - 1, z);
        }
        distRef.val++;
        if (distRef.val >= 14) {
            blocks.push({ block: `repeater[facing=${facing},delay=1]`, dx: x, dy: y, dz: z });
            distRef.val = 0;
        } else {
            blocks.push({ block: 'redstone_wire', dx: x, dy: y, dz: z });
        }
        markOccupied(x, y, z);
    }

    // Emit vertical transition: ramp wire from curY to nextY at (x, z)
    function emitVertical(x, z, fromY, toY, facing, distRef) {
        const dir = toY > fromY ? 1 : -1;
        let y = fromY;
        while (y !== toY) {
            const midY = y + dir;
            // Place support stone and wire at intermediate level
            if (!isOccupied(x, midY - 1, z)) {
                blocks.push({ block: 'stone', dx: x, dy: midY - 1, dz: z });
                markOccupied(x, midY - 1, z);
            }
            blocks.push({ block: 'redstone_wire', dx: x, dy: midY, dz: z });
            markOccupied(x, midY, z);
            distRef.val++;
            y = midY;
        }
    }

    const distRef = { val: 0 };
    let prevY = baseY;

    for (const wp of waypoints) {
        const clearY = findClearY(wp.x, wp.z);
        if (clearY !== prevY) {
            // Step up/down at the previous X,Z before moving to new cell
            emitVertical(wp.x, wp.z, prevY, clearY, wp.facing, distRef);
            prevY = clearY;
        } else {
            emitWireAt(wp.x, clearY, wp.z, wp.facing, distRef);
            prevY = clearY;
        }
    }

    // If we ended at a Y != baseY, ramp back down to baseY at the last waypoint
    if (waypoints.length > 0 && prevY !== baseY) {
        const last = waypoints[waypoints.length - 1];
        emitVertical(last.x, last.z, prevY, baseY, last.facing, distRef);
    }
}
