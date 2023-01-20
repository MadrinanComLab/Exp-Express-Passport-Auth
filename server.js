const { render } = require("ejs");
const express = require("express");
const app = express();

app.set("view-engine", "ejs");

app.get("/", (req, res) => {
    res.render("index.ejs", { name: "Clifford" });
});

app.get("/login", (req, res) => {
    res.render("login.ejs");
});

app.post("/login", (req, res) => {
    // res.render("register.ejs");
});

app.get("/register", (req, res) => {
    res.render("register.ejs");
});

app.post("/register", (req, res) => {
    // res.render("register.ejs");
});

app.listen(3000, () => console.log("Server running in port 3000..."));