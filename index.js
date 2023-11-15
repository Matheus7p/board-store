const express = require("express");
const path = require('path');
const app = express();

app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(express.static(path.join(__dirname, 'public')));

app.get("/", function (req, res) {
    res.sendFile('/index.html', { root: __dirname });
})


app.get("/requests", function (req, res) {
    res.sendFile('/pages/requests.html', { root: __dirname });
})

app.get("/fdpPage", function (req, res) {
    res.sendFile('/pages/product_fdp.html', { root: __dirname });
})

app.get("/warPage", function (req, res) {
    res.sendFile('/pages/product_war.html', { root: __dirname });
})

app.get("/perfil7Page", function (req, res) {
    res.sendFile('/pages/product_perfil7.html', { root: __dirname });
})



let server = app.listen(8081, function () {
    let host = server.address().address;
    let port = server.address().port;
    console.log("Servidor funcionando", host, port);
})


module.exports = app;