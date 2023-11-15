const express = require("express");
const path = require('path');
const app = express();

app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(express.static(path.join(__dirname, 'public')));

app.get("/", function (req, res) {
    res.sendFile('/index.html', { root: __dirname });
})

app.get("/boards", function (req, res) {
    res.sendFile('/pages/boards.html', { root: __dirname });
})

app.get("/requests", function (req, res) {
    res.sendFile('/pages/requests.html', { root: __dirname });
})


let server = app.listen(8081, function () {
    let host = server.address().address;
    let port = server.address().port;
    console.log("Servidor funcionando", host, port);
})


module.exports = app;