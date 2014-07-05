
/*
Here is a set of problem code, here are the steps:

Step 1: fetch information

Step 2: write information to file

The code below executes step 2 before completion of step 1.
*/


var request = require( 'request' ); /* for getting something from the internet */
/* Always have the docs handy for a module! https://github.com/mikeal/request */

var fs = require( 'fs' ); /* for writing that file */
/* http://nodejs.org/api/fs.html */

var scraped_content; /* for storing the web content */

/* who better to scrape than google? */
request( 'http://www.google.com', function (error, response, body) {
  if (!error && response.statusCode == 200) {
  	/* store the web content for writing to a file */
  	scraped_content = body;
  }
})


