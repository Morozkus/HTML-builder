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
    '{{header}}': null,
    '{{articles}}': null,
    '{{footer}}': null,
}

readFileAsync(htmlPath)
    .then(data => obj.html = data)

    .then(() => readFileAsync(path.resolve(componentsPath, 'header.html')))

    .then(data => obj['{{header}}'] = data)

    .then(() => readFileAsync(path.resolve(componentsPath, 'articles.html')))

    .then(data => obj['{{articles}}'] = data)

    .then(() => readFileAsync(path.resolve(componentsPath, 'footer.html')))

    .then(data => obj['{{footer}}'] = data)

    .then(() => {
        obj.html = obj.html.replace(/{{header}}/gi, obj['{{header}}'])
        obj.html = obj.html.replace(/{{articles}}/gi, obj['{{articles}}'])
        obj.html = obj.html.replace(/{{footer}}/gi, obj['{{footer}}'])
    })
    .then(() => writeFileAsync(path.resolve(projectFolder, 'index.html'), obj.html))

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


async function copyDir(src, dest) {
    const entries = await FSP.readdir(src, { withFileTypes: true });
    await FSP.mkdir(dest);

    for (let entry of entries) {

        const srcPath = path.join(src, entry.name);
        const destPath = path.join(dest, entry.name);

        if (entry.isDirectory()) {

            await copyDir(srcPath, destPath);
        } else {

            await FSP.copyFile(srcPath, destPath);
        }
    }
}

copyDir(path.join(__dirname, 'assets'), path.join(__dirname, 'project-dist', 'assets'))