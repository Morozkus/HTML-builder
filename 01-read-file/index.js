const fs = require('fs')
const path = require('path')

function readFile(path) {
    const stremRead = fs.createReadStream(path, { encoding: 'utf-8' })
    stremRead.on('data', (chunk) => {
        console.log(chunk);
    })
};


readFile(path.resolve(__dirname, 'text.txt'))