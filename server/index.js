const { TRRServer } = require('./server');

const port = parseInt(process.argv[2]) || 41236;
const server = new TRRServer(port);
server.start();
