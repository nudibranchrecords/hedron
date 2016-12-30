const fs = require('fs');
const path = require('path');

class Storage {

    set( fileName, json, callback ) {

        const data = JSON.stringify(json);
        const filePath = path.join(nw.App.dataPath, fileName + '.json');
        console.log(filePath);
        fs.writeFile(filePath, data, (err) => {
            if (err) {
                console.info("There was an error attempting to save your data.");
                console.warn(err.message);
                return;
            } else if (callback) {
                callback();
            }
        });

    }

    get( fileName, callback ) {

        const filePath = path.join(nw.App.dataPath, fileName + '.json');

        fs.readFile(filePath, 'utf8', (err, data) => {

            const json = JSON.parse(data);

            if (err) {
                console.info("There was an error attempting to load your data.");
                console.warn(err.message);
                return;
            } else if (callback) {
                callback(json);
            }
        })

    }

}

export default new Storage();