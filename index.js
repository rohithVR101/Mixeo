const express = require('express');
const bodyParser = require('body-parser');
const app = express();
const routes = require('./routes');
app.set('view engine', 'ejs');
app.use(bodyParser.urlencoded({
    extended: true
}));
app.use(bodyParser.json());

app.use(express.static("public"));

app.use('/', routes);

app.listen(process.env.PORT || 3000, () => {
    console.log("Running");
});