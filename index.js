const { createServer } = require('https');
const { readFileSync } = require('fs');
const express = require('express');
const multer = require('multer');
const bodyParser = require('body-parser');
const csrf = require('csurf');
const cookieParser = require('cookie-parser');

// SETUP APP
const app = express();

app.use(bodyParser.urlencoded({extended:false}));
app.use(bodyParser.json());
app.use('/', express.static(__dirname + '/'));

const maxFileSize = 4194304

//MULTER CONFIG: to get file photos to temp server storage
const multerConfig = {

    //specify diskStorage (another option is memory)
    storage: multer.diskStorage({

        //specify destination
        destination: function(req, file, next){
            next(null, './uploads');
        },

        //specify the filename to be unique
        filename: function(req, file, next){
            console.log(file);
            //get the file mimetype ie 'image/jpeg' split and prefer the second value ie'jpeg'
            //const ext = file.mimetype.split('/')[1];
            //set the file fieldname to a unique name containing the original name, current datetime and the extension.
            next(null, file.fieldname + '-' + Date.now() + getExtension(file))
        }
    }),
    limits: { fileSize: maxFileSize, files: 1 },

    // filter out and prevent non-image files.
    fileFilter: function(req, file, next){
        if(!file){
            next();
        }

        // only permit image mimetypes
        const image = file.mimetype.startsWith('image/');

        if (image) {
            console.log('photo uploaded');
            next(null, true);
        }
        else {
            console.log("file not supported")
            //TODO:  A better message response to user on failure.
            return next();
        }
    }
};

function getExtension(file) {
    // this function gets the filename extension by determining mimetype. To be exanded to support others, for example .jpeg or .tiff
    let res = '';
    if (file.mimetype === 'image/jpeg') res = '.jpg';
    if (file.mimetype === 'image/jpeg') res = '.jpeg';
    if (file.mimetype === 'image/png') res = '.png';
    return res;
}


/* ROUTES
**********/
app.get('/', function(req, res){
    res.send(`
        <form action="/upload" enctype="multipart/form-data" method="POST">
            <div class="inner-wrap">
            <label><input type="file" id="photo" name="photo" /></label>
            <div class="button-section">
            <input type="submit" name="Upload" value="Upload Photo"/>
            </div>
            </div>
            </div>
        </form>`)
});

app.post('/upload', multer(multerConfig).single('photo'),function(req, res){
    res.redirect('/')
}

);

createServer(
    {
        key: readFileSync(process.env.SSL_KEY),
        cert: readFileSync(process.env.SSL_CERT),
    },
    app
).listen(process.env.PORT);
