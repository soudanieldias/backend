import { Router } from "express";
import UsersRouter from "../routes/users.route";

const routes = Router();

routes.get('/', (_req, res) => res.status(200).json({ message: `I'm ok!` }));
routes.use('/users', UsersRouter);

export default routes;
