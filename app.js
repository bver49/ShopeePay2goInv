var express = require("express");
var app = express();
var path = require("path");
var bodyParser = require("body-parser");

app.set("views", path.join(__dirname, "views")); //view的路徑位在資料夾views中

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: false}));
app.use("/assets", express.static("assets"));
app.use("/",express.static(__dirname));

app.use("/api",require("./api"));

app.listen(3000,function(){
  console.log("Listen on port 3000!");
});
