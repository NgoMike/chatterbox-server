/*************************************************************

You should implement your request handler function in this file.

requestHandler is already getting passed to http.createServer()
in basic-server.js, but it won't work as is.

You'll have to figure out a way to export this function from
this file and include it in basic-server.js so that it actually works.

*Hint* Check out the node module documentation at http://nodejs.org/api/modules.html.
{username: 'bob', message: 'trololo'}, {username: 'notBob', message: 'olololrt'}
**************************************************************/
var defaultCorsHeaders = {
  'access-control-allow-origin': '*',
  'access-control-allow-methods': 'GET, POST, OPTIONS, DELETE, PUT',
  'access-control-allow-headers': 'content-type, accept',
  'access-control-max-age': 10 // Seconds.
};
//{username: 'bob', text: 'trololo'}, {username: 'notBob', text: 'olololrt'}
var data = {results: []};

exports.requestHandler = function(request, response) {
  var headers = defaultCorsHeaders;
  const { header, method, url } = request;
  headers['Content-Type'] = 'application/json';
  // Request and Response come from node's http module.
  if (request.method === 'OPTIONS') {
    response.writeHead(200, headers);
    response.end();
  } else if (request.method === 'GET' && request.url === '/classes/messages') {
    // request.on('error', (err) => {
    //   console.error(err);
    //   // response.writeHead(404, headers);
    // });
    response.writeHead(200, headers);
    response.end(JSON.stringify(data));
  } else if (request.method === 'POST' && (request.url === '/classes/messages' || request.url === '/classes/room')) { 
    let body = [];
    request.on('data', (chunk) => {
      body.push(chunk);
    }).on('end', () => {
      body = Buffer.concat(body).toString();
      var formated = JSON.parse(body);

      data.results.push(formated);
      response.writeHead(201, headers);
      response.end(JSON.stringify({ message: 'donkey'}));
    });
  // } else if (request.url === '/classes/room' && request.method === 'POST') {
  //   let body = [];

  //   request.on('data', (chunk) => {
  //     body.push(chunk);
  //   }).on('end', () => {
  //     body = Buffer.concat(body).toString();
  //     data.results.push(JSON.parse(body));
  //     response.writeHead(response.statusCode = 201, headers);
  //     response.end();
  //   });
  } else {
    response.statusCode = 404;
    response.end();
  }
  
  // They include information about both the incoming request, such as
  // headers and URL, and about the outgoing response, such as its status
  // and content.
  //
  // Documentation for both request and response can be found in the HTTP section at
  // http://nodejs.org/documentation/api/

  // Do some basic logging.
  //
  // Adding more logging to your server can be an easy way to get passive
  // debugging help, but you should always be careful about leaving stray
  // console.logs in your code.
  console.log('Serving request type ' + request.method + ' for url ' + request.url);

  // The outgoing status.

  // See the note below about CORS headers.

  // Tell the client we are sending them plain text.
  // You will need to change this if you are sending something
  // other than plain text, like JSON or HTML.
  // .writeHead() writes to the request line and headers of the response,
  // which includes the status and all headers.
  
  // Make sure to always call response.end() - Node may not send
  // anything back to the client until you do. The string you pass to
  // response.end() will be the body of the response - i.e. what shows
  // up in the browser.
  //
  // Calling .end "flushes" the response's internal buffer, forcing
  // node to actually send all the data over to the client.
  // response.end(JSON.stringify(data));
};

// These headers will allow Cross-Origin Resource Sharing (CORS).
// This code allows this server to talk to websites that
// are on different domains, for instance, your chat client.
//
// Your chat client is running from a url like file://your/chat/client/index.html,
// which is considered a different domain.
//
// Another way to get around this restriction is to serve you chat
// client from this domain by setting up static file serving.

// exports.requestHandler = requestHandler;