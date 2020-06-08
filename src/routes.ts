import express from 'express';
import PointsController from './routes/routes_points';
import ItemsController from './routes/routes_items';

const routes = express.Router();
const pointsController = new PointsController();
const itemsController = new ItemsController();

/*
    Padrão Utilizado para nomear as funções utilizadas nos controller:
    index - listar items
    show - mostrat um único item
    create - criar um item
    update - atualizar um item
    delete - excluir um item
*/

routes.get('/', (request,response)=>{
    return response.json({ msg:'Olá José Lucas' });
});

routes.get('/items', itemsController.index);
routes.post('/points', pointsController.create);
routes.get('/points/:id', pointsController.show);
routes.get('/points',pointsController.index);

export default routes;