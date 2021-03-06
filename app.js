import express from 'express';
import 'dotenv/config'
import path from 'path';
import cors from 'cors';
import { fileURLToPath } from 'url';
import getHolders from './npxs.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
app.use(cors({ origin: '*' }));

const intervalFunc = setInterval(() => {
  getHolders();
  console.log('Started running...');
}, 60000);


app.use(express.static(__dirname + '/data'));
app.use("/data", express.static(__dirname + '/data'));

const port = process.env.PORT || 3000;

app.get('/', (req, res) => {
  res.send('Hello Crypto!')
})

app.listen(port, () => {
  console.log(`App listening on port ${port}`)
})