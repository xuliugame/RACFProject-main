const mysqlConnection = require("../../server/svdb/mysql");
const jwt             = require('jsonwebtoken');
const bcrypt          = require('bcryptjs');
const multer          = require('multer');
const path            = require('path');

const priceDB         = require('../../server/svdb/price');
const discountsDB     = require('../../server/svdb/discounts');

const venueDB         = require('../../server/svdb/venues');
const venuePriceDB    = require('../../server/svdb/venue_price');
const venueDiscounts  = require('../../server/svdb/venue_discounts');

const eventsDB        = require('../../server/svdb/events');
const eventPriceDB    = require('../../server/svdb/event_price');
const eventDiscounts  = require('../../server/svdb/event_discounts');
const tagsEventsDB    = require('../../server/svdb/tags_events');



// Set Storage Engine
const storage = multer.diskStorage({
    destination: './client/public/images/',
    filename: function(req,file,cb){
        cb(null,file.fieldname + '-' + Date.now() + path.extname(file.originalname));
    }
});

// Initialize upload variable
const upload = multer({
    storage: storage,
    limits: {fileSize:10000000}
}).single('image');

exports.login = async (req,res)=>{
    try{
        const { email, password } = req.body;
        
        if( !email || !password ){
            return res.status(400).render('create', {
                message: 'Please provide an username and a password'
            });
        }


        mysqlConnection.query('SELECT * FROM user WHERE email=?', [email], async (error, results)=>{
            if(!results || results == "" || !(await bcrypt.compare(password, results[0].password)) ){
                res.status(401).render('create', {
                    message: 'Email or password is incorrect.'
                });
            }else{
                const id = results[0].user_id;
                const token = jwt.sign({ id }, process.env.JWT_SECRET, {
                    expiresIn: '90d'
                });

                mysqlConnection.query('UPDATE user SET token=? WHERE email=?', [token,email], async (error, results)=>{
                    if(error){
                        console.log(error);
                    }
                });

                //set token into the cookies
                const cookieOptions = {
                    httpOnly:true,
                    expires: new Date(
                        Date.now() + process.env.JWT_COOKIE_EXPIRES * 24 * 60 * 60 * 1000
                    )
                };

                res.cookie('jwt', token, cookieOptions);
                if(results[0].role == 3){
                    res.status(200).render('homepage', {
                        message: results[0].full_name,
                        id: id,
                        role: 3,
                        email: email
                    });
                }else if(results[0].role == 2){
                    res.status(200).render('homepage', {
                        message: results[0].full_name,
                        id: id,
                        role: 2,
                        email: email
                    });
                }else{
                    res.status(200).render('homepage', {
                        message: results[0].full_name,
                        id: id,
                        role: 1,
                        email: email
                    });
                }
            }
        });
    }catch (error) {
        console.log(error);
    }
}

exports.register = (req,res)=>{
    const { name, email, address, zip, password, confirmpassword } = req.body;

    mysqlConnection.query('SELECT email FROM user WHERE email=?', [email], async (error, results)=>{
        if( error ){
            console.log(error);
        }

        if( results.length > 0 ){
            return res.render('signup', {
                message: 'Account creation: Failure. That email is taken.'
            });
        } else if( password !== confirmpassword){
            return res.render('signup', {
                message: 'Account creation: Failure. Passwords do not match.'
            });
        }else if( !name || !email || !address || !zip || !password || !confirmpassword || name == "" || email == "" || address == "" || zip == "" || password == "" || confirmpassword == ""){
            return res.render('signup',{
                message: 'Account creation: Failure. One or more fields are blank.'
            });
        }

        let hashedPassword = await bcrypt.hash(password, 8);
        mysqlConnection.query('INSERT INTO user SET ?', {password: hashedPassword, token: 'heyhey', full_name: name, email: email, zipcode: zip, role: 1, address: address}, (error, results)=>{
            if(error){
                console.log(error);
                return res.render('signup', {
                    message: 'One or more fields were filled out incorrectly. Please try again.'
                });
            }else{
                console.log(results);
                return res.render('signup',{
                    message: 'Account creation: Success. Please log in.'
                });
            }
        })
    });
}

exports.verify = (req, res)=>{

    try{
        let cookieStr = req.headers.cookie;
        let token;
        if(req.headers.cookie.includes(';')){
            cookieStr = cookieStr.split(';')[1];
            token = cookieStr.split('=')[1];
        }else{
            token = cookieStr.split('=')[1];
        }
        
        
        mysqlConnection.query('SELECT full_name,email,role FROM user WHERE token=?', [token], async (error, results)=>{
            if( error ){
                return res.json({ name: 'NULL' });
            }
            return res.json({ name: results[0].full_name, email: results[0].email, role: results[0].role });
        });
    }
    catch(e){
        console.log(e);
        return res.json('NULL');
    }
}

exports.updateDiscount = (req,res,next) =>{

    const { discounts, email, filename, decide } = req.body;

    switch(decide){
        case "Approve":
            approve(discounts,email,filename,decide, req, res);
            break;
        case "Deny":
            deny(discounts,email,filename,decide, req, res);
            break;
        case "Defer":
            defer(discounts,email,filename,decide, req, res);
            break;
        default:
            return res.render('adminGrantPortal', {
                message: 'You selected an option from the -- Approve/Deny/Defer -- menu which does not exist. Please contact your system administrator'
            });
    }
}


exports.createVenue = (req,res) =>{

    try{
        //console.log(req);
        upload(req,res, async (err) =>{
            //const { titled, image, about, address, description, phone, home, date, motd, pid } = req.body;
            
            //console.log(req.file.filename);
            if(err){
                console.log('File Uploading error');
                console.log(err);
                return res.render('partnerPortal', {
                    message: 'Error: Image not uploaded, try a different image.',
                    user_id: `${req.body.pid}`
                });
            } else {
                try{
                    if(req.body.titled == undefined || req.file.filename == undefined || req.body.about == undefined || req.body.address == undefined|| req.body.description == undefined || req.body.phone == undefined || req.body.home == undefined || req.body.date == undefined || req.body.motd == undefined || req.body.pid == undefined){
                        console.log('One or more fields are blank');
                        return res.render('partnerPortal', {
                            message: 'Error: One or more important fields was left blank.',
                            user_id: `${req.body.pid}`
                        });
                    }else{
                        //post to venues
                        var obj = {
                            title: req.body.titled,
                            image: `/images/${req.file.filename}`,
                            about: req.body.about,
                            address: req.body.address,
                            description: req.body.description,
                            phone_number: req.body.phone,
                            homepage: req.body.home,
                            date_id: req.body.date,
                            motd: req.body.motd,
                            partner_id: req.body.pid
                        };
    
                        try{                        
                            let venueID = await venueDB.insert(obj.title,obj.image,obj.about,obj.address,obj.description,obj.phone_number,obj.homepage,obj.date_id,obj.motd,obj.partner_id);
                            console.log(venueID.insertId);
    
                            // Take general,senior,children,college
                            
                            // insert them into price
                            
                            // get their id's back
                            let ids = [];
                            ids.push( (await priceDB.insert('General Admissions', req.body.general)).insertId );
                            ids.push( (await priceDB.insert('Senior Citizens (62+)', req.body.senior)).insertId );
                            ids.push( (await priceDB.insert('Children (12 and under)', req.body.children)).insertId );
                            
                            console.log(ids);
    
                            // insert into venue_price ( in order to correctly display )
                            ids.forEach(async e=>{
                                console.log(e + " " + venueID.insertId);
                                await venuePriceDB.insertDependancy(venueID.insertId,e);
                            });
    
                            // Now, for each discount in the discount table
                            let allDiscounts = await discountsDB.all();
                            allDiscounts.forEach(async el=>{
                                let keys = Object.keys(req.body);
                                for(let i=0; i<keys.length; i++){
                                    //console.log(req.body[keys[i]]);
                                    //console.log(keys[i]);
    
                                    if(keys[i] == el.name){
                                        console.log(venueID.insertId + " " + el.id + " " + req.body[keys[i]]);
                                        venueDiscounts.insertDependancy(venueID.insertId, el.id, req.body[keys[i]]);
                                    }
                                }
                            });
                                // get the name of each discount
                                // check req.body for it
                                // if it has it, add to venue_discounts(venue_id, discount_id, discount_amount)
                            return res.render('partnerPortal', {
                                message: 'Your Venue was successfully added!',
                                user_id: `${obj.partner_id}`
                            });
                        } catch (error){
                            return res.render('partnerPortal', {
                                message: 'Error: You are trying to add a field that does not exist.',
                                user_id: `${obj.partner_id}`
                            });
                        }
    
                    }
                }catch(err){
                    console.log(err);
                    return res.render('partnerPortal', {
                        message: 'Error: Please upload a file.',
                        user_id: `${req.body.pid}`
                    });
                }
                
            }
        });
    }
    catch (error){
        return res.render('partnerPortal', {
            message: error,
            user_id: `${req.body.pid}`
        });
    }
}

exports.updateImage = (req,res) =>{
    try{
        upload(req,res, async (err) =>{
            
            //console.log(req.file.filename);
            if(err){
                console.log('File Uploading error');
                console.log(err);
                return res.render('partnerPortal', {
                    message: 'Error: Image not uploaded, try a different image.',
                });
            } else {
                try{
                    if(req.file.filename == undefined){
                        return res.render('partnerPortal', {
                            message: 'Error: One or more important fields was left blank.',
                        });
                    }else{
                        
                        //update db with new filename
                        let filename = `/images/${req.file.filename}`;
                        // id of venue, field, value
                        venueDB.update(req.body.id, 'image', filename);
                        return res.render('partnerPortal',{
                            message: 'Image upload successful'
                        });
                    }
                }catch(err){
                    console.log(err);
                    return res.render('partnerPortal', {
                        message: 'Error: Please upload a file.',
                    });
                }
                
            }
        });
    }
    catch (error){
        return res.render('partnerPortal', {
            message: error,
            user_id: `${req.body.pid}`
        });
    }
}

exports.createEvent = (req,res) =>{
    try{

        upload(req,res, async (err) =>{

            console.log(req.body);
            console.log(req.file.filename);

            if(err){
                console.log('File Uploading error');
                console.log(err);
                return res.render('partnerPortal', {
                    message: 'Error: Image not uploaded, try a different image.'
                });
            } else {
                try{
                    if(req.body.titled == undefined || req.body.about == undefined || req.body.address == undefined || req.body.description == undefined || req.body.date == undefined || req.body.general == undefined || req.body.senior == undefined || req.body.children == undefined || req.body.SNAP == undefined || req.body.Medicare == undefined || req.body.Medicade == undefined || req.body.Disability == undefined || req.body.Veteran == undefined || req.body.vid == undefined || req.body.tag1 == undefined || req.body.tag2 == undefined || req.body.tag3 == undefined){
                        console.log('One or more fields are blank');
                        return res.render('partnerPortal', {
                            message: 'Error: One or more important fields was left blank.'
                        });
                    }else{
                        //post to venues
                        var obj = {
                            title: req.body.titled,
                            image: `/images/${req.file.filename}`,
                            address: req.body.address,
                            description: req.body.description,
                            venue_id: req.body.vid,
                            date_id: req.body.date,
                            about: req.body.about
                        };
    
                        try{                        
                            //(title,image,address,description,venue_id,date_id,about)
                            let eventID = await eventsDB.insert(obj.title, obj.image, obj.address, obj.description, obj.venue_id, obj.date_id, obj.about);
                            console.log(eventID.insertId);
    
                            // Take general,senior,children,college
                            
                            // insert them into price
                            
                            // get their id's back
                            let ids = [];
                            ids.push( (await priceDB.insert('General Admissions', req.body.general)).insertId );
                            ids.push( (await priceDB.insert('Senior Citizens (62+)', req.body.senior)).insertId );
                            ids.push( (await priceDB.insert('Children (12 and under)', req.body.children)).insertId );
                            
                            console.log(ids);
    
                            // insert into event_price ( in order to correctly display )
                            ids.forEach(async e=>{
                                console.log(e + " " + eventID.insertId);
                                await eventPriceDB.insertDependancy(eventID.insertId,e);
                            });
    
                            // Now, for each discount in the discount table
                            let allDiscounts = await discountsDB.all();
                            allDiscounts.forEach(async el=>{
                                let keys = Object.keys(req.body);
                                for(let i=0; i<keys.length; i++){
                                    //console.log(req.body[keys[i]]);
                                    //console.log(keys[i]);
    
                                    if(keys[i] == el.name){
                                        console.log(eventID.insertId + " " + el.id + " " + req.body[keys[i]]);
                                        eventDiscounts.insertDependancy(eventID.insertId, el.id, req.body[keys[i]]);
                                    }
                                }
                            });
                            
                            // Tags
                            // Get the value of each tag
                            // insert into tags_events
                            // tags_events.insertDependancy = (event_id, tag_id)
                            // if any of the tags are the same, do not add it multiple times
                            let tag1 = req.body.tag1;
                            let tag2 = req.body.tag2;
                            let tag3 = req.body.tag3;

                            let uniqueTags = [];
                            if( tag1 == tag2 && tag2 == tag3 ){
                                // all the tags are the same, just add tag1
                                uniqueTags.push(tag1);
                            } 
                            else if ( tag1 == tag2 ){
                                // tag 1 and 2 are the same, just add tag1 and tag3
                                uniqueTags.push(tag1);
                                uniqueTags.push(tag3);
                            }
                            else if ( tag1 == tag3 ){
                                // tag 1 and 3 are the same, just add tag1 and tag2
                                uniqueTags.push(tag1);
                                uniqueTags.push(tag2);
                            }
                            else if ( tag2 == tag3 ){
                                // tag 2 and 3 are the same, just add tag1 and tag2
                                uniqueTags.push(tag1);
                                uniqueTags.push(tag2);
                            }
                            else {
                                // all tags are unique
                                uniqueTags.push(tag1);
                                uniqueTags.push(tag2);
                                uniqueTags.push(tag3);
                            }

                            // for each tag in uniqueTags.length
                            // tags_events.insertDependency(event_id, uniqueTags[i])
                            // add each event_id to tag_id 1 ( all )
                            console.log(uniqueTags);
                            uniqueTags.forEach(async el=>{
                                tagsEventsDB.insertDependancy(eventID.insertId, el);
                            });
                            let all = 1;
                            tagsEventsDB.insertDependancy(eventID.insertId, all);


                            return res.render('partnerPortal', {
                                message: 'Your Event was successfully added!'
                            });
                        } catch (error){
                            return res.render('partnerPortal', {
                                message: 'Error: You are trying to add a field that does not exist.'
                            });
                        }
    
                    }
                }catch(err){
                    console.log(err);
                    return res.render('partnerPortal', {
                        message: 'Error: Please upload a file.'
                    });
                }
                
            }
        });
    }
    catch (error){
        return res.render('partnerPortal', {
            message: error
        });
    }
}

exports.updateEventImage = (req,res) =>{
    try{
        upload(req,res, async (err) =>{
            
            //console.log(req.file.filename);
            if(err){
                console.log('File Uploading error');
                console.log(err);
                return res.render('partnerPortal', {
                    message: 'Error: Image not uploaded, try a different image.',
                });
            } else {
                try{
                    if(req.file.filename == undefined){
                        return res.render('partnerPortal', {
                            message: 'Error: One or more important fields was left blank.',
                        });
                    }else{
                        
                        //update db with new filename
                        let filename = `/images/${req.file.filename}`;
                        // id of venue, field, value
                        eventsDB.update(req.body.id, 'image', filename);
                        return res.render('partnerPortal',{
                            message: 'Image upload successful'
                        });
                    }
                }catch(err){
                    console.log(err);
                    return res.render('partnerPortal', {
                        message: 'Error: Please upload a file.',
                    });
                }
                
            }
        });
    }
    catch (error){
        return res.render('partnerPortal', {
            message: error
        });
    }
}



approve = (discounts, email, filename, decide, req, res) =>{

    // get discount based on name
    mysqlConnection.query('SELECT id FROM discounts WHERE name=?', [discounts], async (error, results)=>{
        if(error){
            return res.render('adminGrantPortal',{
                resp: 'One or more fields either, do not exist in the database, or were filled out incorrectly during your last action.'
            });
        }
        console.log('ayayay');
        console.log(results[0]);
        let discountID = results[0].id;

        // Set staus in files table
        mysqlConnection.query("UPDATE files SET status='approved' WHERE email=? AND filename=?", [email,filename], async (error,results)=>{
            if(error){
                return res.render('adminGrantPortal',{
                    resp: 'Could not update users status, because it is not found in the database.'
                });
            }

            // Add to discounts_users
            mysqlConnection.query('INSERT INTO discounts_users (email,discountID) VALUES (?,?)',[email,discountID], async (error,results)=>{
                if(error){
                    return res.render('adminGrantPortal', {
                        resp: 'Cannot update the database, maybe this user already has this discount.'
                    });
                }
                return res.render('adminGrantPortal', {
                    resp: 'Approved discount eligibility successfully.'
                });
            });
        });
    });
}

deny = (discounts, email, filename, decide, req, res) =>{
    // Set staus in files table
    mysqlConnection.query("UPDATE files SET status='denied' WHERE email=? AND filename=?", [email,filename], async (error,results)=>{
        if(error){
            console.log('error');
            return res.render('adminGrantPortal',{
                resp: 'Could not update users status, because it is not found in the database.'
            });
        }
    });

    console.log('success');
    return res.render('adminGrantPortal', {
        resp: 'Denied discount eligibility successfully.'
    });
}

defer = (discounts, email, filename, decide, req, res) =>{
    // Set staus in files table
    mysqlConnection.query("UPDATE files SET status='deferred' WHERE email=? AND filename=?", [email,filename], async (error,results)=>{
        if(error){
            console.log(error);
            return res.render('adminGrantPortal',{
                resp: 'Could not update users status, because it is not found in the database.'
            });
        }
        return res.render('adminGrantPortal', {
            resp: 'Deferred discount eligibility successfully.'
        });
    });
}