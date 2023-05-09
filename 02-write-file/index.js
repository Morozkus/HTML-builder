const fs = require('fs')
const path = require('path')
const readline = require('node:readline');

let out = fs.createWriteStream('./02-write-file/text.txt');

async function writeFile(out) {
    let rl = readline.createInterface({
        input: process.stdin,
        output: process.stdout,
    });
    console.log('Go some text');


    rl.on('close', goodBye)
    rl.on('line', (line) => {
        if (line === 'exit') {
            goodBye()
        }
        out.write(`${line}\n`)
    });
}

writeFile(out)

function goodBye() {
    console.log('see you soon!');
    process.exit(0)
}