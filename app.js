var express = require("express");
var app = express();
var path = require("path");
var bodyParser = require("body-parser");
var cookieParser = require("cookie-parser");
var User = require("./model/User");

app.engine('ejs', require('ejs-locals'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({
    extended: false
}));
app.use(cookieParser("secretString"));
app.use("/assets", express.static("assets"));
app.use("/", express.static(__dirname));
app.set("views", path.join(__dirname, "views"));
app.set("view engine", "ejs");

app.use(function (req, res, next) {
    if (req.cookies.isLogin) {
        User.findOne({
            where: {
                id: req.cookies.id
            },
            attributes: ["id", "username", "role", "ship", "inv", "syncitems"]
        }).then(function (user) {
            req.user = user;
            next();
        });
    } else {
        next();
    }
});

app.use("/orders", checkLogin(1), require("./controller/orders"));
app.use("/items", require('./controller/items'));
app.use("/users", require('./controller/users'));
app.use("/notes", checkLogin(1), require('./controller/notes'));

app.get("/", checkLogin(), function (req, res) {
    res.render("profile", {
        me: req.user
    });
});

app.get("/inv", checkLogin(), function (req, res) {
    if (req.user.role == 2 || req.user.inv == 1) {
        res.render("inv", {
            me: req.user
        });
    } else {
        res.redirect("/");
    }
});

app.get("/ship", checkLogin(), function (req, res) {
    if (req.user.role == 2 || req.user.ship == 1) {
        res.render("ship", {
            me: req.user
        });
    } else {
        res.redirect("/");
    }
});

app.use(function (err, req, res, next) {
    res.status(500).send(err);
});

app.get('*', function (req, res, next) {
    res.status(404).send('Page not found');
});

app.listen(3000, function () {
    console.log("Listen on port 3000!");
});

function checkLogin(isAPI) {
    return function (req, res, next) {
        if (req.user) {
            next();
        } else {
            if (isAPI) {
                res.send("您沒有權限");
            } else {
                res.redirect("/users/login");
            }
        }
    }
}