var http = require('http');
var fs = require('fs');

// Create a server
const server = http.createServer( function (request,response) {  
   let pathname = request.url;//Its doesn't seem like we need to parse it.

   if(request.url.indexOf('public') < 0) {
     pathname = '/public'+ request.url;
   }
   
   // Print the name of the file for which request is made.
   console.log('Request for ' + pathname + ' received.');

   //Substr takes off the initial '/'
   fs.readFile(pathname.substr(1),'UTF8', function(err, data){
      response.end(data);
   })
});

server.listen(8081, 'localhost');

// Console will print the message
console.log('Server running at http://localhost:8081/');