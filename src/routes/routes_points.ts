import { Request,Response } from 'express';
import knex from '../database/connection';

class PointsController {

    async create(request: Request, response: Response){

        const trx = await knex.transaction();

        const {image,name,email,whatsapp,lat,lon,city,uf,items} = request.body;
        const point = {
            image,
            name,
            email,
            whatsapp,
            lat,
            lon,
            city,
            uf
        };
        const ids = await trx('points').insert(point);
        const point_id = ids[0];
        const pointItems = items.map((item_id:number) => {
            return {
                item_id,
                point_id
            }
        });
        
        await trx('point_item').insert(pointItems);

        await trx.commit();
        
        return response.json({ 
            point_id,
            ...point
        });
    };

    async show(request: Request, response:Response){
        const { id } = request.params;
        const point = await knex('points').where('id',id).first();
        const items = await knex('items')
            .join('point_item','items.id','=','point_item.item_id')
            .where('point_item.point_id',id)
            .select('items.title');
        
        return response.json({point,items});
    }

    async index(request:Request, response:Response){
        const { city, uf, items } = request.query;
        const parsedItems = String(items)
            .split(',')
            .map(item => Number(item.trim()));
    
        const points = await knex('points')
            .join('point_item', 'points.id', '=', 'point_item.point_id')
            .whereIn('point_item.item_id',parsedItems)
            .where('city',String(city))
            .where('uf',String(uf))
            .distinct()
            .select('points.*');

        return response.json(points);
    }
}

export default PointsController;