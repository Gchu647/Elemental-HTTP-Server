var http = require('http');
var fs = require('fs');
const querystring = require('querystring');

// Create a server
const server = http.createServer( function (request,response) {  
   let pathname = request.url;
   let methodname = request.method;

   if(request.url.indexOf('public') < 0) {
     pathname = 'public'+ request.url;
   }
   
   // Print the name of the file for which request is made.
   console.log('Request for ' + pathname + ' received.');
   console.log('Method: ', methodname);

   /*
  if(methodname === "GET") {
    fileFetch(pathname, response);
  } else if(methodname === "POST" && pathname === "public/elements") {
    let requestBody = "";

    request.on('data', function(chunk) {
      requestBody += chunk;
    });
    
    // Takes the requestBody information and makes a html file
    request.on('end', function(){
      fileCreate(requestBody, response);
    })
  }
  */
  switch(methodname) {
    case('GET'):
      fileFetch(pathname, response);
      break;
    case('POST'):
      if(pathname !== "public/elements") {
        response.writeHead(400,{'content-type': 'text/html'}, {'expect': 'Path does not exist'});
        response.end();
        break;
      }

      let requestBody = "";

      request.on('data', function(chunk) {
        requestBody += chunk;
      });
      
      // Takes the requestBody information and makes a html file
      request.on('end', function(){
        fileCreate(requestBody, response);
      })

      break;
    default:
    response.writeHead(400,{'content-type': 'text/html'}, {'expect': '"GET or "POST"'});
    response.end();
  }
});

server.listen(8081, 'localhost');

console.log('Server running at http://localhost:8081/');

// This function fetch file for the 'GET' method
function fileFetch(path, res) {
  return fs.readFile(path, 'UTF8', function(err, data) { // Function within a function needs to be returned
    if(err) {
      return fileFetch('public/404.html', res);
    }

    if(path === 'public/404.html') {
      res.writeHead(404,{'content-type': 'text/html'});
    } else {
      res.writeHead(200, {'content-type': 'text/html'}, {'content-length:': data.length});
    }
    res.write(data); //Whatever you are doing here needs to be passed back to the createServer.
    return res.end(); // The end() needs to happen instead createServer.
 });
}

// This function creates file for the 'POST' method
function fileCreate(body, res) {
  postObj = querystring.parse(body);
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
  res.writeHead(201,{'content-type': 'text/html'}, {'content-length:': newHTML.length});
  return res.end();
}