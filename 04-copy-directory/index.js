const fs = require('fs')
const path = require('path')

const folderPath = path.join(__dirname, 'files')
const copyPath = path.join(folderPath, '..', 'files-copy')


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

        fs.copyFile(path.join(folderPath, file), path.join(copyPath, file), (err) => {
            if (err) console.log(err);
        })
    })
}))