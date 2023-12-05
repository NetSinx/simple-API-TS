import { User } from "../entities/User";
import { UserRepository } from "../repositories/User";
import { initDB } from "../connection";
import http from 'http';
import { responseToUser } from "../entities/Response";
import bcrypt from 'bcrypt';

export class UserService {
  public listUsers(req: http.IncomingMessage, res: http.ServerResponse) {
    let users: User[];

    req.on("data", data => data);
  
    req.on("end", async () => {
      res.on("error", err => console.error(err));
  
      const usersRepo = new UserRepository();
      
      users = await usersRepo.listUsers(initDB);
      
      res.writeHead(200, {'Content-Type': 'application/json'});
  
      const response: responseToUser = {
        code: res.statusCode,
        status: res.statusMessage,
        data: users
      }

      res.end(JSON.stringify(response));
    })
  }

  public createUser(req: http.IncomingMessage, res: http.ServerResponse) {
    let user: User;

    req.on("data", (chuck) => {
      const request = JSON.parse(chuck.toString());

      user = request;
    });
    req.on("end", () => {
      if (!user.nama || !user.username || !user.email || !user.password) {
        res.writeHead(400, {'Content-Type': 'application/json'});
        
        const response: responseToUser = {
          code: res.statusCode,
          status: res.statusMessage,
          message: "Your request invalid!"
        };
        
        res.end(JSON.stringify(response));
        return;
      }

      const postUser = async () => {
        const hashPassword = await bcrypt.hash(user.password, 10);
        user.password = hashPassword;

        const userRepo = new UserRepository();
        const userPost = await userRepo.createUser(initDB, user);

        const createUser: User = {
          id: userPost.id,
          nama: userPost.nama,
          username: userPost.username,
          email: userPost.email,
          password: userPost.password
        }

        return createUser;
      }

      postUser().then((value) => {
        res.writeHead(200, {'Content-Type': 'application/json'});

        const response: responseToUser = {
          code: res.statusCode,
          status: res.statusMessage,
          data: value
        }
  
        res.end(JSON.stringify(response));
      }).catch(() => {
        res.writeHead(409, {'Content-Type': 'application/json'});

        const response: responseToUser = {
          code: res.statusCode,
          status: res.statusMessage,
          message: "Data was existing!"
        }

        res.end(JSON.stringify(response));
      });

    });
  }

  public updateUser(req: http.IncomingMessage, res: http.ServerResponse, id: string | undefined) {
    let user: User;

    req.on("data", (data) => {
      const request: User = JSON.parse(data.toString());
      user = request;
    })

    req.on("end", () => {
      const userRepo = new UserRepository();

      const updUser = async () => {
        if (id === undefined) {
          res.writeHead(405, {'Content-Type': 'application/json'});

          const response: responseToUser = {
            code: res.statusCode,
            status: res.statusMessage,
            message: "Method doesn't match!"
          };

          res.end(JSON.stringify(response));
          return;
        }

        const getUser = await userRepo.getUser(initDB, Number(id));

        if (!getUser) {
          return getUser;
        }

        const hashPassword = await bcrypt.hash(user.password, 10);
        user.password = hashPassword;

        await userRepo.updateUser(initDB, user, Number(id));

        const updUser: User = {
          id: Number(id),
          nama: user.nama,
          username: user.username,
          email: user.email,
          password: user.password
        }

        return updUser;
      }

      updUser().then(value => {
        if (!value) {
          res.writeHead(404, {'Content-Type': 'application/json'});

          const response: responseToUser = {
            code: res.statusCode,
            status: res.statusMessage,
            message: "Resource not found!"
          };

          res.end(JSON.stringify(response));
          return;
        }

        res.writeHead(200, {'Content-Type': 'application/json'});

        const response: responseToUser = {
          code: res.statusCode,
          status: res.statusMessage,
          data: value!
        };

        res.end(JSON.stringify(response));
      }).catch(() => {
        res.writeHead(409, {'Content-Type': 'application/json'});

        const response: responseToUser = {
          code: res.statusCode,
          status: res.statusMessage,
          message: "User was existing!"
        }

        res.end(JSON.stringify(response));
      });
    })
  }

  public async getUser(req: http.IncomingMessage, res: http.ServerResponse, id: string | undefined) {
    req.on("data", data => data)

    req.on("end", () => {
      const userRepo = new UserRepository();
      
      const getUser = async () => {
        const getUser = await userRepo.getUser(initDB, Number(id));

        return getUser;
      };

      getUser().then(data => {
        if (data === null) {
          res.writeHead(404, {'Content-Type': 'application/json'});

          const response: responseToUser = {
            code: res.statusCode,
            status: res.statusMessage,
            message: "Resource not found!"
          }

          res.end(JSON.stringify(response));

          return;
        }

        res.writeHead(200, {'Content-Type': 'application/json'});
        
        const response: responseToUser = {
          code: res.statusCode,
          status: res.statusMessage,
          data: data!
        }
        
        res.end(JSON.stringify(response));
      });
    })
  }

  public async deleteUser(req: http.IncomingMessage, res: http.ServerResponse, id: string | undefined) {
    req.on("data", data => data);

    req.on("end", () => {
      if (id === undefined) {
        res.writeHead(405, {'Content-Type': 'application/json'});

        const response: responseToUser = {
          code: res.statusCode,
          status: res.statusMessage,
          message: "Method doesn't match"
        }

        res.end(JSON.stringify(response));

        return;
      }

      const userRepo = new UserRepository();

      const deleteUser = async () => {
        const findUser = await userRepo.getUser(initDB, Number(id));

        if (findUser === null) {
          return findUser;
        }

        await userRepo.deleteUser(initDB, Number(id));
      }
        
      deleteUser().then((user) => {
        if (user === null) {
          res.writeHead(404, {'Content-Type': 'application/json'});

          const response: responseToUser = {
            code: res.statusCode,
            status: res.statusMessage,
            message: "Resource not found!"
          }

          res.end(JSON.stringify(response));

          return;
        }

        res.writeHead(200, {'Content-Type': 'application/json'});

        const response: responseToUser = {
          code: res.statusCode,
          status: res.statusMessage,
          message: "User was deleted!"
        }
        
        res.end(JSON.stringify(response));
      });
    });
  }
}