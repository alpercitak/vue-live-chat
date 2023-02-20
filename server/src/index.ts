import express, { Request, Response } from 'express';
import './webSocketServer';

const app = express();
const PORT = 3000;

app.get('/', (req: Request, res: Response) => {
  return res.json({ message: 'Hello' }).status(200);
});

app.listen(PORT, () => {
  console.log(`http server started on: ${PORT}`);
});
