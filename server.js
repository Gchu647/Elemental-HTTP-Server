var http = require('http');
var fs = require('fs');
const querystring = require('querystring');

// Create a server
const server = http.createServer( function (request,response) {  
   let pathname = request.url;
   let methodname = request.method;

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
      //If we have the url we send the url page back to them
      response.writeHead(200, {'Content-Type': 'text/html'});
      response.write(data);
      response.end();
      }
   })
  } else if(methodname === "POST" && pathname === "/public/elements") {
    let requestBody = "";

    request.on('data', function(chunk) {
      requestBody += chunk;
    });
    
    // Takes the requestBody information and makes a html file
    request.on('end', function(){
      postObj = querystring.parse(requestBody);
      console.log("This is request body: ", postObj);
      console.log("type of: ", typeof postObj);

      let newHTML = `<!DOCTYPE html>
      <html lang="en">
      <head>
        <meta charset="UTF-8">
        <title>The Elements - ${postObj.elementName}</title>
        <link rel="stylesheet" href="/css/styles.css">
      </head>
      <body>
        <h1>${postObj.elementName}</h1>
        <h2>${postObj.elementSymbol}</h2>
        <h3>Atomic number ${postObj.elementAtomicNumber}</h3>
        <p>${postObj.elementDescription}</p>
        <p><a href="/">back</a></p>
      </body>
      </html>`;
      
      fs.writeFile(`public/${postObj.elementName}.html`, newHTML, (err) => {if (err) throw err;});
    })
  }
});

server.listen(8081, 'localhost');

console.log('Server running at http://localhost:8081/');