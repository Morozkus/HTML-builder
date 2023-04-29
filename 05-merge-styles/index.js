const fs = require('fs');
const path = require('path')

const styleFolder = path.join(__dirname, 'styles')
const destFolder = path.join(__dirname, 'project-dist', 'bundle.css')
const folder = path.join(__dirname, 'project-dist')

fs.access(folder, function (err) {

    if (err && err.code === 'ENOENT') {

        fs.mkdir(folder, (err) => {
            if (err) return console.log(err);
        });
    }
});

const readFileAsync = async (path) => {
    return new Promise((resolve, reject) => fs.readFile(path, { encoding: 'utf-8' }, (err, data) => {
        if (err) {
            return reject(err.message)
        }
        resolve(data)
    }))
}

fs.readdir(styleFolder, ((err, files) => {

    if (err) {

        return console.log(err.message)

    }
    fs.writeFile(destFolder, '', () => {
        return
    })

    files.forEach(file => {

        if (path.extname(file) !== '.css') return

        readFileAsync(path.join(styleFolder, file))
            .then((data) => {
                fs.appendFile(destFolder, data, () => {
                    return
                })
            })

    })
}))