import express, { Request, Response } from 'express';
import './webSocketServer';
import * as os from 'os';

const app = express();
const PORT = 3000;

app.get('/', (req: Request, res: Response) => {
  return res.json({ hostName: os.hostname() }).status(200);
});

if (import.meta.env.PROD) {
  app.listen(PORT, () => {
    console.log(`http server started on: ${PORT}`);
  });
}

export const viteNodeApp = app;
