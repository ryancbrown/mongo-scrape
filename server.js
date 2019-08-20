require("dotenv").config();
const express = require('express');
const exphbs  = require('express-handlebars');
const mongoose = require('mongoose');
const cheerio = require('cheerio');
const axios = require('axios');
const db = require("./models");
const MONGODB_URI = process.env.MONGODB_URI || "mongodb://localhost/mongoHeadlines";

const app = express();
app.use(express.urlencoded({ extended: false }));
app.use(express.json());
app.use(express.static("public"));

app.engine('handlebars', exphbs({
    defaultLayout: "main"
}));
app.set('view engine', 'handlebars');

mongoose.connect(MONGODB_URI, { useNewUrlParser: true });

app.get('/', (req, res) => {
    res.render('home');
});


app.get('/scrape', (req, res) => { 
    const $ = cheerio.load('response.data')

    res.json({test:"name"})
}); 

app.listen(3000, () => console.log("Connected and listening on port 3000."));