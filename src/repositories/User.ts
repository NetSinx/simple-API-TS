import { DataSource } from "typeorm";
import { User } from "../entities/User";

export class UserRepository {
  public async listUsers(db: DataSource) {
    const userRepo = db.getRepository(User);
    const user = await userRepo.find();

    return user;
  }

  public async createUser(db: DataSource, user: User) {
    const userRepo = await db.getRepository(User);
    const createUser = await userRepo.save(user);
    
    return createUser;
  }

  public async updateUser(db: DataSource, user: User, id: number) {
    const userRepo = db.getRepository(User);
    const updateUser = await userRepo.createQueryBuilder()
      .update()
      .set({
        nama: user.nama,
        username: user.username,
        email: user.email,
        password: user.password,
      })
      .where("id = :id", {id: id})
      .execute();
    
      return updateUser;
  }

  public async getUser(db: DataSource, id: number) {
    const userRepo = db.getRepository(User);
    const getUser = await userRepo.createQueryBuilder()
      .select()
      .where("id = :id", {id: id})
      .getOne();

    return getUser;
  }

  public async deleteUser(db: DataSource, id: number) {
    const userRepo = db.getRepository(User);

    await userRepo.createQueryBuilder()
      .delete()
      .from(User)
      .where("id = :id", {id: Number(id)})
      .execute();

  }
}