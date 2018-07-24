var http = require('http');
var fs = require('fs');
const querystring = require('querystring');

// Create a server
const server = http.createServer( function (request,response) {  
   let pathname = request.url;
   let methodname = request.method;
   let Obj = request.headers;
   console.log("Method: ", methodname);

   if(request.url.indexOf('public') < 0) {
     pathname = '/public'+ request.url;
   }
   
   // Print the name of the file for which request is made.
   console.log('Request for ' + pathname + ' received.');

  if(methodname === "GET" || methodname === "HEAD") {
    fs.readFile(pathname.substr(1),'UTF8', function(err, data){ //Substr takes off the initial '/'
      if(err) {
      console.log(err);

      fs.readFile('public/404.html','UTF8', function(err, data){
        response.writeHead(400, {'Content-Type': 'text/html'});
        response.end(data);
      })

      response.writeHead(505, {'Content-Type': 'text/html'}); // If the server side messed up.
      } else {
        // send a status head back?
      response.writeHead(200, {'Content-Type': 'text/html'});
      response.write(data);
      response.end();
      }
   })
  } else if(methodname === "POST") {
    let requestBody = "";

    request.on('data', function(chunk) {
      requestBody += chunk;
    });
    
    request.on('end', function(){
      elementsObj = querystring.parse(requestBody);
      console.log("This is request body: ", elementsObj);
      console.log("type of: ", typeof elementsObj);
    })

     // fs.writeFile
  }
});

server.listen(8081, 'localhost');

console.log('Server running at http://localhost:8081/');