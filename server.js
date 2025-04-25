const { createServer } = require('node:tls');
const { readFileSync } = require('node:fs');

const options = {
  key: readFileSync('certs/server.key'),
  cert: readFileSync('certs/server_fullchain.pem'),

  // This is necessary only if using client certificate authentication.
  requestCert: true,

  // This is necessary only if the client uses a self-signed certificate.
  ca: [ readFileSync('ca/ca_chain.pem') ],

  crl: [
    readFileSync('crl/signing-ca.crl'),
    readFileSync('crl/root-ca.crl'),
  ]
};

const server = createServer(options, (socket) => {
  console.log('server connected',
              socket.authorized ? 'authorized' : 'unauthorized');
  socket.write('welcome!\n');
  socket.setEncoding('utf8');
  socket.pipe(socket);
});
server.listen(5555, () => {
  console.log('server bound');
});

server.on('tlsClientError', (err, tlsSocket) => {
    console.log('Client error, socket status: ',
        tlsSocket.authorized ? 'authorized' : 'unauthorized');
    console.error('cert error', tlsSocket.authorizationError);
    console.error('Error from client:', err);
});

server.on('keylog', (line, tlsSocket) => {
    
    //console.log(line);
  }); 

server.on('error', err => {
    console.error('Server error', err);
});