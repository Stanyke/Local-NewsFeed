# Local-NewsFeed
This is a Social NewsFeed built on NodeJS which equally stores the data (newsfeed) on a cookie session

The app is used to upload image files with extension of *.jpg, .jpeg, .png, .gif*, incluing status (anything in your mind) and lastly any name you want to add to it.


This web app uses a node module *ejs* to display its html page, which can be located at *views/feed.ejs*


**To use this app**

*-1- Clone it*

*-2- run <b>npm install</b>, this will install all dependencies used in the package.json*

<br/>

<b>How This App Runs</b>

**I've Commented The app.js and views/feed.ejs for better understanding as you read this**

1. First of all, this app runs on port *8080 => (localhost:8080)*...

2. The app.js file is where the server setup is located at, also which route it should point to when the page loads on just *localhost:8080 => localhost:8080/feed*.

3. The app.js also contains functions that handle a couple of buttons clicked in the homepage.

4. The red X button is used in deleting files