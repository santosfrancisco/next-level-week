import express from 'express';
import routes from './routes';

const PORT = process.env.port || 3333

const app = express();
app.use(express.json())
app.use(routes)

app.listen(PORT, () => {
  console.log(`Running on http://localhost:${PORT}`)
});
