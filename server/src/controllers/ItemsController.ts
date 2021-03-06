import knex from '../database/connection';
import { Request, Response } from 'express';

class ItemsController {
  async create(req: Request, res: Response) {
    const items = await knex('items').select('*');
  
    const serializedItems = items.map(item => ({
      id: item.id,
      title: item.title,
      image_url: `http://192.168.15.13:3333/uploads/${item.image}`
    }))
  
    res.json(serializedItems);
  }
}

export default ItemsController;
