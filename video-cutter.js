const ffmpeg = require("fluent-ffmpeg");
const fs = require('fs');
ffmpeg.setFfmpegPath(__dirname + "/public/assets/ffmpeg/bin/ffmpeg.exe ");
ffmpeg.setFfprobePath(__dirname + "/public/assets/ffmpeg/bin");
ffmpeg.setFlvtoolPath(__dirname + "/public/assets/ffmpeg/bin");

module.exports = (path, start, duration) => {
    ffmpeg("./public/" + path)
        .seek(start)
        .duration(duration)
        .on('start', function (commandLine) {
            console.log('Started Ffmpeg with command: ' + commandLine);
        })
        .on('progress', function (progress) {
            console.log('Processing: ' + progress.percent + '% done');
        })
        .on('end', function (stdout, stderr) {
            console.log('Transcoding succeeded !');
        })
        .on("error", function (err) {
            console.log("an error happened: " + err.message);
            return "";
        })
        .saveToFile("./public/rendered/" + path);
}