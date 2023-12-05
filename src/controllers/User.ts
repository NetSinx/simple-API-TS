import http from 'http';
import { UserService } from '../services/User';

export class UserController {
  constructor(
    private req: http.IncomingMessage,
    private res: http.ServerResponse
  ) {
    const userServ = new UserService();
    const id: string | undefined = this.req.url?.split("/").at(2);

    if (this.req.url === "/users" && this.req.method === "GET") {
      userServ.listUsers(this.req, this.res);
    } else if (this.req.url === "/users" && this.req.method === "POST") {
      userServ.createUser(this.req, this.res);    
    } else if (this.req.method === "PUT" ) {
      userServ.updateUser(this.req, this.res, id);
    } else if (this.req.method === "GET") {
      userServ.getUser(this.req, this.res, id);
    } else if (this.req.method === "DELETE") {
      userServ.deleteUser(this.req, this.res, id);
    } else {
      
    }
  }
}