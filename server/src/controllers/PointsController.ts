import knex from '../database/connection';
import { Request, Response } from 'express';

class PointsController {

  async index(req: Request, res: Response) {
    const {
      city,
      uf,
      items
    } = req.query
    const splitedItems = String(items).split(',').map(item => Number(item.trim()))
    const points = await knex('points')
    .join('point_items', 'points.id', '=', 'point_items.point_id')
    .whereIn('point_items.item_id', splitedItems)
    .where('city', String(city))
    .where('uf', String(uf))
    .distinct()
    .select('points.*')
    
    return res.json(points);
  }
  async show(req: Request, res: Response) {
    const { id } = req.params;
    const point = await knex('points').where('id', id).first();
    if (!point) return res.status(404).json({ message: 'Point not found' })

    const items = await knex('items')
      .join('point_items', 'item_id', '=', 'items.id')
      .where('point_items.point_id', id)

    point.items = items
    return res.json(point);
  }
  async create(req: Request, res: Response) {
    const {
      name,
      email,
      whatsapp,
      latitude,
      longitude,
      city,
      uf,
      items,
    } = req.body;

    const trx = await knex.transaction();
    try {

      const point = {
        image: 'https://images.unsplash.com/photo-1542739674-b449a8938b59?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=crop&w=400&q=60',
        name,
        email,
        whatsapp,
        latitude,
        longitude,
        city,
        uf,
      }

      const [id] = await trx('points').insert(point);
      const pointItems = items.map((itemId: number) => ({
        point_id: id,
        item_id: itemId,
      }))
      await trx('point_items').insert(pointItems)
      await trx.commit()
      return res.json({ id, ...point })
    } catch (error) {
      await trx.rollback()
      return res.status(500).json({ message: error.message })
    }
  }
}

export default PointsController;
