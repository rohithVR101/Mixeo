const express = require('express');
const bodyParser = require('body-parser');
var cors = require('cors');
const app = express();
const routes = require('./routes');
app.set('view engine', 'ejs');
app.use(bodyParser.urlencoded({
    extended: true
}));
app.use(bodyParser.json());
var corsOptions = {
    origin: "http://localhost:3000"
};
app.use(cors(corsOptions));

app.use(express.static("public"));

app.use('/', routes);

app.listen(3000, () => {
    console.log("Running");
});