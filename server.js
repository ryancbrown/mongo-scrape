require("dotenv").config();
const express = require("express");
const exphbs  = require("express-handlebars");
const mongoose = require("mongoose");
const cheerio = require("cheerio");
const axios = require("axios");
const db = require("./models");
const MONGODB_URI = process.env.MONGODB_URI || "mongodb://localhost:27017/mongoHeadlines";

const app = express();
app.use(express.urlencoded({ extended: false }));
app.use(express.json());
app.use(express.static("public"));

app.engine("handlebars", exphbs({
    defaultLayout: "main"
}));
app.set("view engine", "handlebars");

mongoose.connect(MONGODB_URI, { useNewUrlParser: true });

app.get("/", (req, res) => {
    // Grab the 20 most recent stored articles
    db.Article.find({}).limit(20).sort({_id: 1}).then((outcome) => { 
        res.render("home", {articles: outcome});
    });
});

app.get("/saved", (req, res) => {
    // Return all saved articles
    db.Article.find({isSaved: true}).then((outcome) => { 
        res.render("home", {articles: outcome});
    });
});

app.get("/scrape", (req, res) => { 
    axios.get("https://www.npr.org/sections/world/").then((response) => {
        const $ = cheerio.load(response.data);
        
        // Prep and 
        $(".item-info-wrap").each(function(i, element) {
            const scrapeObj = {}; 

            scrapeObj.title = $(this).find("h2").text().trim();
            scrapeObj.date = $(this).find("p").find("time").text().replace(" • ", "");
            scrapeObj.summary = $(this).find("p").text()
            scrapeObj.url = $(this).find("h2").children("a").attr("href");
            scrapeObj.isSaved = false;

            db.Article.create(scrapeObj).then((mongoSave) => console.log(mongoSave)).catch(err => res.send(err))
        });
        // Send confirmation that scrape is complete
        res.send("Scrape successful.")
    });
}); 

app.listen(3000, () => console.log("Connected and listening on port 3000."));
