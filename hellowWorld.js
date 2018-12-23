var express = require("express");
var http = require("http");
var path = require("path");
var app = express();



app.set("views", path.resolve(__dirname, "views"));
app.set("view engine", "ejs");

app.use(function(request, response, next){
        console.log("In comes a request to : " + request.url);
        next();
        });

app.use(function(request, response, next){
        
        response.end("hello world!222333");
        });


http.createServer(app).listen(3000);
