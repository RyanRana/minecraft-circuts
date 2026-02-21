/** Parse JSON from LLM response (may contain markdown or extra text). */

export function validateCircuitPlan(plan) {
    if (!plan.name) throw new Error('CircuitPlan missing name');
    if (!plan.description) throw new Error('CircuitPlan missing description');
    if (!plan.estimatedSize) plan.estimatedSize = { x: 8, y: 4, z: 8 };
    if (!plan.inputs) plan.inputs = [];
    if (!plan.outputs) plan.outputs = [];
    return plan;
}

export function parseJSON(text) {
    let cleaned = text.trim();
    if (cleaned.includes('```')) {
        const match = cleaned.match(/```(?:json)?\s*([\s\S]*?)```/);
        if (match) cleaned = match[1].trim();
    }
    if (cleaned.includes('</think>')) {
        cleaned = cleaned.split('</think>').pop().trim();
    }
    const firstBrace = cleaned.indexOf('{');
    const firstBracket = cleaned.indexOf('[');
    let start = firstBrace === -1 ? firstBracket : firstBracket === -1 ? firstBrace : Math.min(firstBrace, firstBracket);
    if (start === -1) throw new Error('No JSON found in response');
    const isArray = cleaned[start] === '[';
    const lastClose = isArray ? cleaned.lastIndexOf(']') : cleaned.lastIndexOf('}');
    if (lastClose === -1) throw new Error('Unclosed JSON in response');
    cleaned = cleaned.substring(start, lastClose + 1);
    return JSON.parse(cleaned);
}

export function validateCircuitDesign(design) {
    if (!design.blocks || !Array.isArray(design.blocks)) throw new Error('CircuitDesign must have a blocks array');
    if (design.blocks.length === 0) throw new Error('CircuitDesign blocks array is empty');
    for (let i = 0; i < design.blocks.length; i++) {
        const b = design.blocks[i];
        if (b.block === undefined || b.dx === undefined || b.dy === undefined || b.dz === undefined) {
            throw new Error(`Block at index ${i} missing required fields (block, dx, dy, dz)`);
        }
    }
    if (!design.size) {
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
