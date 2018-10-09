const { createServer } = require('https');
const { readFileSync, chmodSync } = require('fs');
const express = require('express');
const helmet = require('helmet');
const multer = require('multer');
const csrf = require('csurf');
const cookieParser = require('cookie-parser');

// SETUP APP
const app = express();
const basicAuth = require('basic-auth');

const auth = function (req, res, next) {
    const user = basicAuth(req);
    if (!user || !user.name || !user.pass) {
        console.log(process.env.USER);
        console.log(process.env.PASS);
        res.set('WWW-Authenticate', 'Basic realm=Authorization Required');
        res.sendStatus(401);
        return;
    }
    if (user.name === process.env.USER && user.pass === process.env.PASS) {
        next();
    } else {
        res.set('WWW-Authenticate', 'Basic realm=Authorization Required');
        res.sendStatus(401);
        return;
    }
}


app.use('/', express.static(__dirname + '/'));

const maxFileSize = 4194304 // Taille du fichier en octets
app.use(cookieParser());
app.use(csrf({cookie: true, httpOnly: true}));
app.use(
    helmet.contentSecurityPolicy({
        directives: {
            defaultSrc: ["'self'"],
            upgradeInsecureRequests: true,
        },
    })
);
app.use(helmet.frameguard({ action: 'deny' }));
app.use(helmet.noSniff());
app.use(
    helmet.hsts({ maxAge: 31536000, includeSubDomains: true, preload: true })
);
app.use(helmet.ieNoOpen());
app.use(helmet.referrerPolicy({ policy: 'no-referrer' }));
//MULTER CONFIG: to get file photos to temp server storage
const multerConfig = multer({

    //specify diskStorage (another option is memory)
    storage: multer.diskStorage({

        //specify destination
        destination: function (req, file, next) {
            next(null, './uploads');
        },

        //specify the filename to be unique
        filename: function (req, file, next) {
            console.log(file);
            //get the file mimetype ie 'image/jpeg' split and prefer the second value ie'jpeg'
            //const ext = file.mimetype.split('/')[1];
            //set the file fieldname to a unique name containing the original name, current datetime and the extension.
            let nameFile = file.fieldname + '-' + Date.now() + getExtension(file)
            let picture = []
            console.log('picture ', picture)
            picture = picture.push(nameFile)
            return picture
            console.log('pictures=', picture)
            next(null, file.fieldname + '-' + Date.now() + getExtension(file))
        }

    }),
    limits: {fileSize: maxFileSize, files: 1},

    // filter out and prevent non-image files.
    fileFilter: function (req, file, next) {
        if (!file) {
            next();
        }

        // only permit image mimetypes
        const image = file.mimetype.startsWith('image/');

        if (image) {
            console.log('photo uploaded')
            next(null, true);
        }
        else {
            console.log("file not supported")
            //TODO:  A better message response to user on failure.
            return next();
        }
    }
});

app.use(multerConfig.single('photo'))

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
app.get('/', function (req, res) {
    res.send(`
    <form action="/upload?_csrf=${ req.csrfToken() }" enctype="multipart/form-data" method="POST">
        <div class="inner-wrap">
        <label><input type="file" id="photo" name="photo" /></label>
        <div class="button-section">
        <input type="submit" name="Upload" value="Upload Photo"/>
        </div>
        </div>
        </div>
    </form>
    `
    )

});

app.post('/upload', function (req, res) {
        chmodSync(`./uploads/${req.file.filename}`, '666')
        res.redirect('/')
    }
);

app.get("/images", auth, function (req, res) {
    console.log('images', req.file.pictures)
    res.send('This page is authenticated!' + ' ' + images.forEach(function(item, index, array) { +
        `<li>console.log(`
        uploads/
        `item, index)</li>`
    })
    )
});

createServer(
    {
        key: readFileSync(process.env.SSL_KEY),
        cert: readFileSync(process.env.SSL_CERT),
    },
    app
).listen(process.env.PORT)
