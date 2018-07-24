var http = require('http');
var fs = require('fs');

// Create a server
const server = http.createServer( function (request,response) {  
   let pathname = request.url;

   if(request.url.indexOf('public') < 0) {
     pathname = '/public'+ request.url;
   }
   
   // Print the name of the file for which request is made.
   console.log('Request for ' + pathname + ' received.');

   //Substr takes off the initial '/'
   fs.readFile(pathname.substr(1),'UTF8', function(err, data){
     if(err) { //Error is not passing anything back
      console.log(err);

      fs.readFile('public/404.html','UTF8', function(err, data){
        // Set head status
        // If my server is not picking up the 404, send back an 505!
        response.end(data);
      })
     } else {
      response.write(data);
      response.end();
     }
   })
});

server.listen(8081, 'localhost');

console.log('Server running at http://localhost:8081/');