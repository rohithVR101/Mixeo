const express = require('express');
const bodyParser = require('body-parser');
const formidable = require('formidable');
const fs = require('fs');
const app = express();
app.set('view engine', 'ejs');

app.use(bodyParser.urlencoded({
    extended: true
}));

app.use(express.static("public"));

app.get('/', (req, res) => {
    res.render("pages/index", {});
});

app.get('/community', (req, res) => {
    res.render("pages/community", {});
});

app.post("/new", (req, res) => {
    var form = new formidable.IncomingForm();
    form.parse(req);
    form.on('fileBegin', function (name, file) {
        file.path = __dirname + '/public/uploads/' + file.name;
    });
    form.on('file', function (name, file) {
        res.render("pages/new", {
            'path': 'uploads/' + file.name
        });
    });
});

app.listen(3000, () => {
    console.log("Running");
});