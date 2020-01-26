var express = require('express');
var session = require('cookie-session'); // Loads the piece of middleware for sessions
var bodyParser = require('body-parser'); // Loads the piece of middleware for managing the settings
var urlencodedParser = bodyParser.urlencoded({ extended: false });

var app = express();


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
.post('/feed/new/', urlencodedParser, function(req, res) {
    if (req.body.mystatus != '' || req.body.image != '' || req.body.username != '')
    {
        req.session.newsfeed.push({state: req.body.mystatus, kimg: req.body.image, usem: req.body.username});
    }
    res.redirect('/feeds');
})

/* Deletes an item from the newsfeed */
.get('/feed/delete/:id', function(req, res) {
    if (req.params.id != '')
    {
        req.session.newsfeed.splice(req.params.id, 1);
    }
    res.redirect('/feeds');
})

/* Redirects to the newsfeed if the page requested is not found */
.use(function(req, res, next)
{
    res.redirect('/feeds');
})

.listen(8080);