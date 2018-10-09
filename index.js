const { createServer } = require('https');
const { readFileSync } = require('fs');
const express = require('express');

//const { form } = require('./form.js');

const app = express();


app.get('/', function(req, res) {
    res.send(`
        <form action="/upload" enctype="multipart/form-data" method="post" autocomplete="off">
        <input type="text" name="title">
        <input type="file" name="file">
        <input type="submit" value="Upload">
        </form>`)
});


createServer(
    {
        key: readFileSync(process.env.SSL_KEY),
        cert: readFileSync(process.env.SSL_CERT),
    },
    app
).listen(process.env.PORT);
