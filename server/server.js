const express      = require('express');
const bodyParser   = require('body-parser');
const path         = require('path');
const cookieParser = require('cookie-parser');
const cors         = require('cors');
const multer = require('multer');

const { verifyAdmin, verifyPartner } = require('./adminAuth');


// Set Storage Engine
const storage = multer.diskStorage({
    destination: './client/public/files/',
    filename: function(req,file,cb){
        cb(null,file.fieldname + '-' + Date.now() + path.extname(file.originalname));
    }
});

// Initialize upload variable
const upload = multer({
    storage: storage,
    limits: {fileSize:10000000}
}).single('file');


const eventsRoute           = require('./routes/eventsRoute');     // Routing Config
const venuesRoute           = require('./routes/venuesRoute');
const datesRoute            = require('./routes/datesRoute');
const priceRoute            = require('./routes/priceRoute');
const tagsRoute             = require('./routes/tagsRoute');
const venuePriceRoute       = require('./routes/venue_priceRoute');
const eventPriceRoute       = require('./routes/event_priceRoute');
const tagEventRoute         = require('./routes/tag_eventRoute');
const contactRoute          = require('./routes/racf_contactRoute');
const discountInfoRoute     = require('./routes/discount_infoRoute');
const grantPortalRoute      = require('./routes/grantPortalRoute');
const fileRoute             = require('./routes/filesRoute');
const userRoute             = require('./routes/userRoute');
const discountsRoute        = require('./routes/discountsRoute');
const discountsUsersRoute   = require('./routes/discountsUsersRoute');
const venue_discountsRoute  = require('./routes/venue_discountsRoute');
const event_discountsRoute  = require('./routes/event_discountsRoute');
const discount_codesRoute   = require('./routes/discountCode');
const QRCODERoute           = require('./routes/QRCODERoute');

let routes = [ eventsRoute, venuesRoute, datesRoute, priceRoute, tagsRoute, venuePriceRoute, eventPriceRoute, tagEventRoute, contactRoute, discountInfoRoute, grantPortalRoute, fileRoute, userRoute, discountsRoute, discountsUsersRoute, venue_discountsRoute, event_discountsRoute, discount_codesRoute, QRCODERoute ];

const pageRoute  = require('../client/routes/pages');
const AuthRoutes  = require('../client/routes/auth');
const ip = '192.168.0.25';                                  // IP and Port
const port = '3000';
const address = `http://${ip}:${port}`;
const publicDir = path.join(__dirname, '../client/public'); // Public Directory

const app = express();

app.set('view engine', 'hbs');                              // Set view engine: Handlebars
app.set('views', path.join(__dirname, '../client/views'));  // Setup views folder
app.use(express.json());                                    // Transmit json data
app.use(bodyParser.urlencoded({extended:true}));            // Parse request bodies
app.use('/favicon.ico', express.static(path.join(__dirname, '../client/public/images/favicon.ico'))); // Set the favicon
app.use(express.static(publicDir));                         // Serve files in public directory

// Routes for API
app.use('/api', routes);

// Routes for Webpage
app.use('/', pageRoute);

// Routes for Auth
app.use('/auth', AuthRoutes);


//cookie stuff
app.use(cookieParser());

app.use(cors({
    origin: 'http://localhost:3001',
    credentials: true
}));


app.post('/upload', (req,res)=>{

    upload(req,res, (err) =>{
        
        if(err){
            res.render('grantportal',{
                message: err
            });
        } else {

            if(req.file == undefined){
                res.render('grantportal', {
                    message: 'Error: No file selected!'
                });
            }else{
                // upload to db
                uploadFile(req.file.filename, req.body.email, req.body.type);
                res.render('grantportal',{
                    message: 'Your file has been updated and is pending review.'
                });
            }
        }
    });
});


const files = require('./svdb/file');
uploadFile = (filename, email, type) =>{
    //hit the api with name of file and email
    files.insert(email, filename, 'pending', type);
}

app.get('/adminGrant', verifyAdmin, (req,res)=>{
    res.render('adminGrantPortal');
});

app.get('/partnerPortal', verifyPartner, (req,res)=>{
    res.render('partnerPortal', {
        user_id: req.user_id
    });
});


app.listen('3000', () =>{
    console.log(`Server is running at ${address}`);
});