import express from 'express';

const app = express();
const PORT = process.env.port || 3333

app.get('/', (req, res) => {
  res.json({message: "Next Level Week"})
});

app.listen(PORT, () => {
  console.log(`Running on http://localhost:${PORT}`)
});
