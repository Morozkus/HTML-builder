const fs = require('fs');
const path = require('path')
const FSP = require('fs/promises');

const htmlPath = path.resolve(__dirname, 'template.html')
const componentsPath = path.resolve(__dirname, 'components')
const projectFolder = path.resolve(__dirname, 'project-dist')

fs.access(projectFolder, function (err) {

    if (err && err.code === 'ENOENT') {

        fs.mkdir(projectFolder, (err) => {
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

const writeFileAsync = async (path, data) => {
    return new Promise((resolve, reject) => fs.writeFile(path, data, (err) => {
        if (err) {
            return reject(err)
        }
        resolve()
    }))
}

const obj = {
    html: null,
}

readFileAsync(htmlPath)
    .then(data => obj.html = data)
    .then(data => {

        let str = data.match(/{{.*}}/gi)
        return str.map(el => el.replace(/\W/gi, ''))

    })
    .then(async (data) => {
        return await data.forEach((el) => {
            readFileAsync(path.join(componentsPath, `${el}.html`))
                .then(data => obj.html = obj.html.replace(`{{${el}}}`, data))
                .then(() => writeFileAsync(path.resolve(projectFolder, 'index.html'), obj.html))
        })
    })

const styleFolder = path.resolve(__dirname, 'styles')
const destFolder = path.resolve(__dirname, 'project-dist', 'style.css')

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
            .then(data => {
                fs.appendFile(destFolder, data, () => {
                    return
                })
            })


    })
}))

const assests = path.resolve(__dirname, 'assets')
const destAssests = path.resolve(__dirname, 'project-dist', 'assets')

fs.rm(destAssests, { force: true, recursive: true }, () => {
    return copyFiles(assests, destAssests)
});

async function copyFiles(folderPath, copyPath) {
    fs.access(copyPath, function (err) {

        if (err && err.code === 'ENOENT') {

            fs.mkdir(copyPath, (err) => {
                if (err) return console.log(err);
            });
        }
    });

    fs.readdir(folderPath, ((err, files) => {

        if (err) {

            return console.log(err.message)

        }

        files.forEach(file => {
            fs.stat(path.resolve(folderPath, file), (err, stats) => {

                if (err) {
                    console.error(err)
                    return
                }

                if (stats.isDirectory() === true) {
                    return copyFiles(path.join(folderPath, file), path.join(copyPath, file))
                } else {
                    fs.copyFile(path.join(folderPath, file), path.join(copyPath, file), (err) => {
                        if (err) console.log(err);
                    })
                }
            })
        })
    }))
}
