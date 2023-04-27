const fs = require('fs')
const path = require('path')
const readline = require('node:readline');
const { stdin } = require('process');

let out = fs.createWriteStream('./02-write-file/text.txt');

let rl = readline.createInterface({
    input: stdin,
    output: out,
});

rl.on('line', (line) => {
    if (line === '' || line === 'end') {
        rl.close();
    } else {
        out.write(line + '\n');
    }
});