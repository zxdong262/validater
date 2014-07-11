
/**
 * Module dependencies.
 */

var 

//module
express = require('express')

//user setting
,port = 4321

// all environments
,app = express()

//static files
app.use(express.static(__dirname + '/test'))

app.listen(port, function() {
	console.log('Magic happens on port ' + port)
})
