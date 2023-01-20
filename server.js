/** LOADING ENVIRONMENT VARIABLE */
if(process.env.NODE_ENV !== "production"){
    require("dotenv").config();
}

const express = require("express");
const bcrypt = require("bcrypt");
const passport = require("passport");
const flash = require("express-flash");
const session = require("express-session");
const methodOverride = require("method-override");
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
app.use(methodOverride("_method"));

app.get("/", checkAuthenticated, (req, res) => {
    res.render("index.ejs", { name: req.user.name });
});

app.get("/login", checkNotAuthenticated, (req, res) => {
    res.render("login.ejs");
});

app.post("/login", checkNotAuthenticated, passport.authenticate("local", {
    successRedirect: "/",
    failureRedirect: "/login",
    failureFlash: true
}));

app.get("/register", checkNotAuthenticated, (req, res) => {
    res.render("register.ejs");
});

app.post("/register", checkNotAuthenticated, async (req, res) => {
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

/** TO USE 'delete' (HTTP) METHOD, YOU NEED THE 'method-override' LIBRARY, SINCE DELETE IS NOT SUPPORTED BY HTML FORMS */
app.delete("/logout", (req, res, next) => {
    /** 
     * logOut IS BUILT-IN FUNCTION OF 'passport' LIBRARY 
     * NOTE: LOG OUT WAS A BIT DIFFERENT COMPARE TO THE TUTORIAL SINCE IT WAS 3 YEARS AGO, SO PLEASE REFER TO THE OFFICIAL DOC:
     * https://www.passportjs.org/concepts/authentication/logout/
     */
    req.logOut((err) => {
        if (err) return next(err);
        res.redirect("/login");
    });
});

function checkAuthenticated(req, res, next){
    /** isAuthenticated IS BUILT-IN FUNCTION OF 'passport' LIBRARY */
    if(req.isAuthenticated()){
        return next();
    }

    res.redirect("/login");
}

function checkNotAuthenticated(req, res, next){
    /** isAuthenticated IS BUILT-IN FUNCTION OF 'passport' LIBRARY */
    if(req.isAuthenticated()){
        return res.redirect("/");
    }

    next();
}

app.listen(3000, () => console.log("Server running in port 3000..."));