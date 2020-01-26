var express = require('express');
var session = require('cookie-session'); // Loads the piece of middleware for sessions
var bodyParser = require('body-parser'); // Loads the piece of middleware for managing the settings
var urlencodedParser = bodyParser.urlencoded({ extended: true });

var formidable = require('formidable');
var fs = require('fs');
var path = require('path')


var app = express();

//NB: This section is important as this would help your image file display, make sure the root directory you mention here is same with, where your images would be stored to help display in the front page
app.use('/images', express.static(__dirname + '/images'));

/* Using the sessions */
app.use(session({secret: 'newsfeedtopsecret'}))


/* If there is no newsfeed in the session, 
we create an empty one in the form of an array before continuing */
.use(function(req, res, next){
    if (typeof(req.session.newsfeed) == 'undefined') {
        req.session.newsfeed = [];
    }
    next();
})

/* The newsfeed and the form are displayed */
.get('/feeds', function(req, res) { 
    res.render('feed.ejs', {newsfeed: req.session.newsfeed});
})

/* Adding an item to the to do list */
.post('/feed/new/', urlencodedParser, function(req, res)
{
    if (req.body.mystatus != '' || req.body.image != '' || req.body.username != '')
    {
        var form = new formidable.IncomingForm();
        form.parse(req, function (err, fields, files)
        {
            //Get Image file's extension (if its .jpg, etc.)
            var getImageFileExtension = path.extname(files.image.name);
            
            //Check Image file's extension (if its .jpg, etc.)
            if(getImageFileExtension === '.jpg' || getImageFileExtension === '.jpeg' || getImageFileExtension === '.png' || getImageFileExtension === '.gif')
            {
                //Get Current Date and Time
                var today = new Date();
                var date = today.getFullYear()+''+(today.getMonth()+1)+''+today.getDate();
                var time = today.getHours() + "" + today.getMinutes() + "" + today.getSeconds();
                var dateTime = date+''+time;

                //Temporal Location Of Image file before upload
                var oldImagePath = files.image.path;

                //New name of image file which should be stored in folder *images* and saved as Current Date and Time, finally merging it's extension
                var newImagePath = './images/' + dateTime+getImageFileExtension;
                
                fs.rename(oldImagePath, newImagePath, function (err)
                {
                    if (err) 
                    {
                        throw err;
                    }
                    else
                    {
                        req.session.newsfeed.push({TheStatus: fields.mystatus, TheImage: dateTime, TheExtension: getImageFileExtension, TheUsername: fields.username});

                        res.redirect('/feeds');

                        console.log("Uploaded Successfully");
                    }
                });
            }

            //If its none of the extensions listed above, It should process this else statement 
            else
            {
                res.redirect('/feeds');
            }

            
        });
    }
})

/* Deletes an item from the newsfeed */
.get('/feed/delete/:id/:name/:ext', function(req, res) {
    if (req.params.id != '' || req.params.name != '')
    {
        //Delete the file from the session
        req.session.newsfeed.splice(req.params.id, 1);

        //Delete the file from image folder
        fs.unlink("./images/"+req.params.name+req.params.ext, (err) =>
        {
            if (err)
            {
                throw err;
            }
            else
            {
                console.log('File Deleted Successfully')
            }
        });
    }
    res.redirect('/feeds');
})

/* Redirects to the newsfeed if the page requested is not found */
.use(function(req, res, next)
{
    res.redirect('/feeds');
})

.listen(8080);