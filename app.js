
/*
Now lets look at a solution

Step 1: fetch information

Step 2: write information to file

The code below executes step 2 upon completion of step 1.
*/


    var request = require( 'request' ); /* for getting something from the internet */
    /* Always have the docs handy for a module! https://github.com/mikeal/request */
    
    var fs = require( 'fs' ); /* for writing that file */
    /* http://nodejs.org/api/fs.html */
    
    /* who better to scrape than google? */
    request( 'http://www.google.com', function (error, response, body) {
      if (!error && response.statusCode == 200) {
      	
  	    /* write the web content to file */
	    fs.writeFile( 'webcontent.html', body );
      }
    })



