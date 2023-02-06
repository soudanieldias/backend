import { userModel } from '../model/index';
import { userSchema } from '../interfaces/index';
import jwt from 'jsonwebtoken';
import dotenv from 'dotenv';
dotenv.config();

export default class UserService {
  findAll = async () => {
    const usersList = await userModel.findAll();
    return { status: 200, message: usersList };
  }

  login = async (body:userSchema) => {
    const { name, password } = body;

    if (name === '') {
      return { status: 400, message: '"Name" is not allowed to be empty' };
    }

    if (password === '') {
      return { status: 400, message: '"password" is not allowed to be empty' };
    }

    if (!name) {
      return { status: 400, message: '"Name" is required' };
    }

    if (!password) {
      return { status: 400, message: 'Invalid fields' };
    }

    const userData = await userModel.findUserByName(body.name);

    // const token = jwt.sign({ id }, process.env.SECRET_KEY, {
    //   expiresIn: 1d // expires in 5min
    // });

    const token = jwt.sign({ id: userData.id, name: userData.name, }, process.env.JWT_SECRET! , { expiresIn: '1h' });

    return { status: 200, message: { message: 'Login ok!', token} };
  }
}
