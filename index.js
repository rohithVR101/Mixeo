require('dotenv').config();
const express = require('express');
const app = express();
const routes = require('./routes');

app.set('view engine', 'ejs');
app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(express.static("public"));
app.use('/', routes);

app.listen(process.env.PORT || 3000, () => {
    console.log("Mixeo running on port " + (process.env.PORT || 3000));
});