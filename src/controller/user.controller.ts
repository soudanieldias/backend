import { Request, Response, NextFunction } from "express";
import { userService } from '../service/index';

export default class UserController {
  constructor() {}

  findAll = async (_req:Request, res:Response, _next:NextFunction) => {
    const { status, message } = await userService.findAll();
    return res.status(status).json(message);
  }

  login = async (req:Request, res:Response, _next:NextFunction) => {
    const { status, message } = await userService.login(req.body);
    return res.status(status).json(message);
  }
}
