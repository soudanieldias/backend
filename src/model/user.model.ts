import { prisma } from "../database/index";

export default class UserModel {
  findAll = async () => {
    const users = await prisma.users.findMany();
    return users;
  }

  findUserByName = async (name: string) => {
    const user = await prisma.users.findFirstOrThrow({ where: { name: name } });
    return user;
  };
}
