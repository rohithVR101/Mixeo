const express = require('express');
const formidable = require('formidable');
const ffmpeg = require("fluent-ffmpeg");
const fs = require('fs');
ffmpeg.setFfmpegPath(__dirname + "/../public/assets/ffmpeg/bin/ffmpeg.exe ");
ffmpeg.setFfprobePath(__dirname + "/../public/assets/ffmpeg/bin");
ffmpeg.setFlvtoolPath(__dirname + "/../public/assets/ffmpeg/bin");
var path = "";
const router = express.Router();

router.get('/', (req, res) => {
    res.render("pages/index", {});
});

router.get("/preview", (req, res) => {
    res.render("pages/preview", {
        'path': req.body.path
    });
});

router.post("/preview", (req, res) => {
    res.redirect("pages/preview")
});

router.get('/community', (req, res) => {
    res.render("pages/community", {
    });
});

router.post("/new", (req, res) => {
    var form = new formidable.IncomingForm();
    form.parse(req);
    form.on('fileBegin', function (name, file) {
        file.path = __dirname + '/../public/uploads/' + file.name;
    });
    form.on('file', function (name, file) {
        res.render("pages/new", {
            'path': 'uploads/' + file.name
        });
    });
});

router.post("/stage", (req, res) => {
    var path = req.body.content;
    ffmpeg(__dirname + "/../public/" + req.body.content)
        .seek(req.body.start)
        .duration(req.body.duration)
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
        })
        .saveToFile(__dirname + "/../public/rendered/" + req.body.content);
});

module.exports = router;