import { execFile } from 'child_process';
import { writeFile, readFile, unlink, mkdtemp } from 'fs/promises';
import { tmpdir } from 'os';
import { join } from 'path';

const YOSYS_TIMEOUT_MS = 15000;

function findYosys() {
    return ['yosys', '/usr/local/bin/yosys', '/opt/homebrew/bin/yosys'];
}

export async function synthesize(verilogCode) {
    const dir = await mkdtemp(join(tmpdir(), 'redstone-'));
    const vFile = join(dir, 'circuit.v');
    const jsonFile = join(dir, 'circuit.json');
    await writeFile(vFile, verilogCode, 'utf8');
    const yosysCmd = `read_verilog ${vFile}; synth -flatten -noabc; clean; write_json ${jsonFile}`;
    const candidates = findYosys();
    let lastErr = null;
    for (const yosysBin of candidates) {
        try {
            await new Promise((resolve, reject) => {
                execFile(yosysBin, ['-p', yosysCmd], { timeout: YOSYS_TIMEOUT_MS }, (err, stdout, stderr) => {
                    if (err) reject(new Error(`Yosys failed: ${err.message}\n${stderr}`));
                    else resolve(stdout);
                });
            });
            const jsonStr = await readFile(jsonFile, 'utf8');
            const netlist = JSON.parse(jsonStr);
            unlink(vFile).catch(() => {});
            unlink(jsonFile).catch(() => {});
            return parseNetlist(netlist);
        } catch (e) {
            lastErr = e;
        }
    }
    throw new Error(`Yosys synthesis failed. Is yosys installed? (brew install yosys)\n${lastErr?.message || ''}`);
}

export function parseNetlist(netlist) {
    const modules = netlist.modules || {};
    const modNames = Object.keys(modules);
    if (modNames.length === 0) throw new Error('No modules found in Yosys output');
    const mod = modules[modNames[0]];
    const ports = mod.ports || {};
    const cells = mod.cells || {};
    const inputs = [];
    const outputs = [];
    for (const [name, port] of Object.entries(ports)) {
        if (port.direction === 'input') for (const bit of port.bits) inputs.push({ name, bit });
        else if (port.direction === 'output') for (const bit of port.bits) outputs.push({ name, bit });
    }
    const gates = [];
    for (const [cellName, cell] of Object.entries(cells)) {
        const conns = cell.connections || {};
        const gateInputs = [];
        let gateOutput = null;
        for (const [portName, bits] of Object.entries(conns)) {
            const dir = (cell.port_directions || {})[portName];
            if (dir === 'input') for (const bit of bits) gateInputs.push(bit);
            else if (dir === 'output') gateOutput = bits[0];
        }
        gates.push({ name: cellName, type: cell.type, inputs: gateInputs, output: gateOutput });
    }
    return { inputs, outputs, gates, moduleCount: modNames.length };
}

export function isYosysAvailable() {
    return new Promise((resolve) => {
        execFile('yosys', ['--version'], { timeout: 5000 }, (err) => {
            if (err) {
                execFile('/usr/local/bin/yosys', ['--version'], { timeout: 5000 }, (err2) => {
                    if (err2) {
                        execFile('/opt/homebrew/bin/yosys', ['--version'], { timeout: 5000 }, (err3) => resolve(!err3));
                    } else resolve(true);
                });
            } else resolve(true);
        });
    });
}
