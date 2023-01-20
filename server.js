/** LOADING ENVIRONMENT VARIABLE */
if(process.env.NODE_ENV !== "production"){
    require("dotenv").config();
}

const express = require("express");
const bcrypt = require("bcrypt");
const passport = require("passport");
const flash = require("express-flash");
const session = require("express-session");
const app = express();

const initializePassport = require("./passport.config");
initializePassport(
    passport, 
    /** THE LINE OF CODE BELOW IS THE getUserByEmail BEING PASSED TO initialize OF passport.config.js */
    email => users.find(user => user.email === email),

    /** THE LINE OF CODE BELOW IS THE getUserById BEING PASSED TO initialize OF passport.config.js */
    id => users.find(user => user.id === id),
);

/** USER DATA WOULD BE SAVED HERE INSTEAD OF DATABASE. THIS IS FOR DEMO PURPOSE ONLY. */
const users = [];

app.set("view-engine", "ejs");
app.use(express.urlencoded({ extended: false }));
app.use(flash());
app.use(session({
    secret: process.env.SESSION_SECRET,
    resave: false,
    saveUninitialized: false
}));
app.use(passport.initialize());
app.use(passport.session());

app.get("/", (req, res) => {
    res.render("index.ejs", { name: req.user.name });
});

app.get("/login", (req, res) => {
    res.render("login.ejs");
});

app.post("/login", passport.authenticate("local", {
    successRedirect: "/",
    failureRedirect: "/login",
    failureFlash: true
}));

app.get("/register", (req, res) => {
    res.render("register.ejs");
});

app.post("/register", async (req, res) => {
    try{
        const hashed_password = await bcrypt.hash(req.body.password, 10);

        users.push({
            id: Date.now().toString(),
            name: req.body.name,
            email: req.body.email,
            password: hashed_password
        });

        res.redirect("/login");
    }
    catch{
        res.redirect("/register");
    }
    console.log(users);
});

app.listen(3000, () => console.log("Server running in port 3000..."));