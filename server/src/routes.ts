import express from 'express';

import Points from './controllers/PointsController';
import Items from './controllers/ItemsController';

const routes = express.Router();

const points = new Points();
const items = new Items();

routes.get('/', (req, res) => {
  res.json({message: "Next Level Week"})
});

routes.get('/items', items.create);

routes.post('/points', points.create)
routes.get('/points/:id', points.show)
routes.get('/points', points.index)

export default routes;
