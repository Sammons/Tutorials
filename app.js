
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

Discussing a point after the second situation
where we don't really care if is an api we are 
calling, but we do want to execute a lot of functions
sequentially and we want to do one of these things 

A) to pass them all the same params
B) to pass each the prior one's result

and we want to stay out of callback hell, of course
*/

/* container function for this sample */
function begin() {
	var sequence     = []

	/* the first two parameters to pass to all of these functions,
	the last one is always next */
	var params = [ {name:'A'}, {name:'B'} ]

	/* sequence position control */	
	var seq_pos = -1
	var next = function( ) {
		seq_pos++
		if ( seq_pos == sequence.length ) {
			seq_pos = -1;
			return
		}
		/* call the next function with the params */
		sequence[ seq_pos ].call( this, params[0], params[1], next )
	}

	/* add function to the sequence */
	var use = function( func ) {
		chaining_sequence.push( func )
	}

	/* have fun adding things to the sequence! */
	use( function( objA, objB, next ) {
		objA.name = 'A'
		next()
	})
	use( function( objA, objB, next ) {
		console.log( objA.name )
		next()
	})

	/* begin the sequence */
	next()
}

/* begin the example */
begin()
