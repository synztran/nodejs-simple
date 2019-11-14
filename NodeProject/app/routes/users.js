// var {app, Account} = require("./index.js");
var express = require("express");
var bodyParser = require("body-parser");
var mongoose = require('mongoose');
mongoose.connect('mongodb://localhost:27017/testmongodb');

// Create object
var app = express();
var db = mongoose.connection;
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ 
    extended: true
})); 
// set static data for public folder to Application Server
app.use(express.static("public"));

// using libary ejs, ejs create html then back to browser
app.set("view engine", "ejs");

// url of view folder to Application Server
app.set("views", "./views");

// working on port 3000

function showListAccount() {
    app.get("/people", async (req, res) => {
        try {
            var result = await Account.find().exec();
            res.send(result);
        } catch (err) {
            res.status(500).send(err);

        }
    });
};

module.exports = {showListAccount}

	