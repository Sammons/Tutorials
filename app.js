
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

Let's tackle the first situation, we want to issue 20
pretend text messages to 20 individuals, and if cosmic waves
interfere we will retry until completed
*/

/* container function for this sample */
function send_20_text_messages() {

	// array of people to recieve texts
	// populated with false, when they are all set
	// to true, we are finished
	var people = [];
	for (var i = 0; i < 20; i++) people.push( { id: i, success: false, attempts: 0 } )

	// since we want everyone to be true, and we only retry on failure
	// we can assume we are done when we have succeeded 20 times
	var number_successes = 0

	// number of times we have tried to send any message
	var attempts         = 0

	// the pretend api call, which will return a success object
	var send_text_message = produce_async_function( { 'status':'success' } )

	// when we fail, try again on the next tick of the event loop
	var retry = function( person ) {
		setImmediate(function(){
			send_text_message( handle_text_response( person ) )
		})
	}

	// response handler factory, ensures that the person is
	// included in the callback's closure
	var handle_text_response = function( person ) {
		return function( err, value ) {
			// count attempts
			attempts++;
			person.attempts++

			// retry on the next run of the event loop if failure
			if ( err ) {
				retry( person )
				return;
			}
			// if success, set the person to true and
			// attempt to be completed!
			if ( value.status === 'success' ) {
				person.success = true
				number_successes++
				if ( number_successes === people.length ) {
					// show off our success!
					console.log( 'success! after ', attempts, 'attempts!' )
					console.log( people )
				}
			}
		}	
	}

	// issue the first 20 requests, the rest will automatically
	// be retriggered upon failure
	for ( var i in people ) {
		send_text_message( handle_text_response( people[ i ] ) )
	}

}

/* begin */
send_20_text_messages()

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

