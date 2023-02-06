import express, { NextFunction, Request, Response } from 'express';
import routes from './routes';

class App {
  constructor() {
    this.app = express();
    this.config();
    this.routes();
  }

  public app: express.Express;

  private PORT = process.env.PORT || 3001;

  private config():void {
    const accessControl: express.RequestHandler = (_req:Request, res:Response, next:NextFunction) => {
      res.header('Access-Control-Allow-Origin', '*');
      res.header('Access-Control-Allow-Methods', 'GET,POST,DELETE,OPTIONS,PUT,PATCH');
      res.header('Access-Control-Allow-Headers', '*');
      next();
    };

    this.app.use(accessControl);
    this.app.use(express.json());
  }

  public start(PORT: string | number):void {
    this.app.listen(PORT, () => {
      console.log('This Server is Running on PORT', PORT);
    });
  }

  private routes = () => {
    this.app.use(routes);
    this.app.get('/', (_req, res) => { return res.status(200).json({ message: `I'm ok!`})});
  };

}

export { App };

export const { app } = new App();
