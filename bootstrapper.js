// Live reload behaviour
require('electron-reload')(__dirname+'/**/!(*.css|*.scss)', {
    electron: require('electron-prebuilt')
});

// install babel hooks in the main process
require('babel-register');
require('./main/main.js');