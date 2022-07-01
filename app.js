
require('dotenv').config()// to store environment variables

const express = require("express");
const bodyParser = require("body-parser");
const ejs = require("ejs");
const mongoose = require("mongoose");

const passport = require("passport");
const passportLocal = require("passport-local");
const passportLocalMongoose = require("passport-local-mongoose");

// LEVEL 2 SECURITY -> DATABASE ENCRYPTION
const encrypt = require("mongoose-encryption");

const app = express();

app.use(bodyParser.urlencoded({extended: true}));
app.set("view engine", "ejs");
app.use(express.static("public"));

mongoose.connect("mongodb://localhost:27017/userDB");

// LEVEL 1 SECURITY -> USERNAME AND PASSWORD IN A DB
const userSchema = new mongoose.Schema({

    email: String,
    password: String
})

// LEVEL 2 SECURITY -> DATABASE ENCRYPTION
// encrypting our data
const secret = "thisIsOurLittleSecret";
// encryptedFields: ["password"] only encrypts the password field in the data
userSchema.plugin(encrypt, {secret: secret, encryptedFields: ["password"]});

const User = new mongoose.model("User", userSchema);

app.get("/", (req, res) => {

    res.render("home");
})
app.get("/login", (req, res) => {

    res.render("login");
})
app.get("/register", (req, res) => {

    res.render("register");
})

app.post("/register", (req, res) => {

    const newUser = new User({

        email: req.body.username,
        password: req.body.password

    })

    newUser.save(function(err){

        if(err){

            console.log(err);
        }else{

            res.render("secrets");
        }
    })


})

app.post("/login", (req, res) => {

    const username = req.body.username;
    const password = req.body.password;

    User.findOne({email: username}, function(err, foundResult){

        if(err){

            console.log(err);
        }else{

            if(foundResult){

                if( foundResult.password==password ){

                    res.render("secrets");
                }
            }
        }
    })
})

app.listen(8080, function (){

    console.log("listening on port 8080");
})

