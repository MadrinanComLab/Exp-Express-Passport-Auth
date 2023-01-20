const express = require("express");
const bcrypt = require("bcrypt");
const app = express();

/** USER DATA WOULD BE SAVED HERE INSTEAD OF DATABASE. THIS IS FOR DEMO PURPOSE ONLY. */
const users = [];

app.set("view-engine", "ejs");
app.use(express.urlencoded({ extended: false }));

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