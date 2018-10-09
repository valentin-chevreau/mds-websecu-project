const { createServer } = require('https');
const { readFileSync } = require('fs');
const express = require('express');

const app = express();

createServer(
    {
        key: readFileSync(process.env.SSL_KEY),
        cert: readFileSync(process.env.SSL_CERT),
    },
    app
).listen(process.env.PORT);
