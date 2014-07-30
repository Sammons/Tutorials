
/*
Situations: 

A situation where we want to execute
many of one asynchronous 
task before other asynchronous tasks. 
( many of the same api call )

A situation where we want to execute
many asynchronous tasks
but for each one to happen only after the 
previous and we know the order. 
( sequential api calls for example)

Where are we?

let's do the second situation where
we execute many async functions one right after
the next.
*/

/* container function for this sample */
function send_all_requests() {

	/*
	pretend async api calls which we wil execute one right after another
	we are clearly messing with someone here
	*/
	var functions = {}
	functions.api_call_to_get_user_info        = produce_async_function( { name: 'joe',         status: 'identified' } )
	functions.api_call_to_find_user_address    = produce_async_function( { address: 'STL',      status: 'found'      } )
	functions.api_call_to_arrest_user          = produce_async_function( {                      status: 'arrested'   } )
	functions.api_call_to_send_flowers_to_user = produce_async_function( { flower_color: 'red', status: 'delivered'  } )

	/*
	to manage executing the functions in order
	we simply wrap them in a function which knows to call next()
	and push the bundle into an array.
	each function is executed, and on success calls next() which
	executes the next function, until the end of the array
	*/
	var current_position_in_sequence = -1;
	var sequence = []

	/* execute the next function
	or end the sequential execution because
	we are done 
	*/
	var next = function() {
		current_position_in_sequence++
		if ( current_position_in_sequence == sequence.length ) {
			current_position_in_sequence = -1
			return
		}
		sequence[ current_position_in_sequence ]()
	}
	/* a function which returns a handler that will
	retry to execute the api call if it fails, and will
	log the status if it succeeds 
	*/
	var response_handler_creator = function( func ) {
		return function( err, response ) { 
			if ( err ) {
				console.log('fail')
				setImmediate( function() {
					func( response_handler_creator( func ) )
				})
				return;
			}
			console.log( response.status )
			next()
		}
	}

	/* bundle and push each function into the sequence */
	for (var i in functions) {
		(function() { 
			var func = functions[ i ]
			sequence.push( function() {
				func( response_handler_creator( func ) )
			})
		})()
	}

	/* begin the sequence! */
	next()
}

/* begin the example */
send_all_requests()

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
				var success = Math.random()* 10 > 3 ;
				if ( success ) callback( null, rval )
				else callback( {err: 'cosmic waves'}, null )
		}, ( function() { return Math.random()*400 } )() )
	}
}

