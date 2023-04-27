const fs = require('fs');
const path = require('path')

const folderPath = path.resolve(__dirname, 'secret-folder')

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

            if (stats.isDirectory() === true) return

            console.log(`${path.basename(file)} - ${path.extname(file)} - ${stats.size}`);

        })
    })
}))