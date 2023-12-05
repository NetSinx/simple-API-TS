import http from 'http';
import { UserController } from './controllers/User';

const port = 3000;
const hostname = "localhost";

const server = http.createServer((req: http.IncomingMessage, res: http.ServerResponse) => {
  new UserController(req, res);
})

server.listen(port, hostname, () => {
  console.log(`Server running at http://${hostname}:${port}`);
})