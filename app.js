
/*
First let's discuss a few situations.

Consider:

A situation where we want to execute
many of one asynchronous 
task before other asynchronous tasks. 
( many of the same api call )

A situation where we want to execute
many asynchronous tasks
but for each one to happen only after the 
previous and we know the order. 
( sequential api calls for example)

To demonstrate the situations, we can create a factory
which produces "pretend" asynchronous functions.
Each function will execute in a random bounded period of time

*/

/*
 This factory takes a return value, and creates a
 function which will complete between 0 and 400 ms later
 and upon completion will execute a callback passed to it.
 The callback will take an error and the returnvalue -- this
 function will fail about 30% of the time with a cosmic wave
 error ( the sun is active today ).
*/
function produce_async_function( returnvalue ) {
	return function( callback ) {
		setTimeout(
			function() {
				var rval = (function() { return returnvalue })()
				var success = (function() { return Math.random()* 10 > 3 })();
				if ( success ) callback( null, rval );
				else callback( {err: 'cosmic waves'}, null )
		}, ( function() { return Math.random()*400 } )() )
	}
}

/*
Here is a demonstration of our
sometimes failing functions in use.
each iteration of the setInterval
the counter is ticked, and a new function is 
generated and executed.
*/
var counter = 0
setInterval(function() {
	counter++
	produce_async_function( counter )( function( err, rvalue ){
		console.log( err, rvalue )
	} )
},100)

/* the output looks something like this:
null 1
{ err: 'cosmic waves' } null
null 3
{ err: 'cosmic waves' } null
null 5
null 8
null 6
null 7
null 10
null 11
null 9
{ err: 'cosmic waves' } null
null 14
null 13
{ err: 'cosmic waves' } null
null 17
null 16
{ err: 'cosmic waves' } null
null 19
*/