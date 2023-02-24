import express, { Request, Response } from 'express';
import './webSocketServer';
const os = require('os');

const app = express();
const PORT = 3000;

app.get('/', (req: Request, res: Response) => {
  return res.json({ hostName: os.hostname() }).status(200);
});

app.listen(PORT, () => {
  console.log(`http server started on: ${PORT}`);
});
