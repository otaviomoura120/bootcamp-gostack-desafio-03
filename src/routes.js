import { Router } from 'express';
import multer from 'multer';
import multerConfig from './config/multer';

import UserController from './app/controllers/UserController';
import RecipientController from './app/controllers/RecipientController';
import SessionController from './app/controllers/SessionController';
import DeliveryManController from './app/controllers/DeliveryManController';
import FileController from './app/controllers/FileController';
import DeliveryController from './app/controllers/DeliveryController';
import PickupDeliveryController from './app/controllers/PickupDeliveryController';
import EndDeliveryController from './app/controllers/EndDeliveryController';
import DeliveryProblemController from './app/controllers/DeliveryProblemController';
import CancelDeliveryController from './app/controllers/CancelDeliveryController';

import authMiddleware from './app/middlewares/auth';

const routes = new Router();
const upload = multer(multerConfig);

routes.post('/sessions', SessionController.store);

routes.get(
  '/deliveryman/:deliveryman_id/deliveries/:showDelivered',
  PickupDeliveryController.index
);
routes.put(
  '/deliveryman/:deliveryman_id/pickup/:delivery_id',
  PickupDeliveryController.update
);

routes.put(
  '/deliveryman/endDelivery/:delivery_id',
  upload.single('file'),
  EndDeliveryController.update
);

routes.get('/delivery/:id?/problems', DeliveryProblemController.index);
routes.post('/delivery/:delivery_id/problems', DeliveryProblemController.store);

routes.use(authMiddleware);
routes.post('/users', UserController.store);
routes.put('/users', UserController.update);

routes.post('/recipients', RecipientController.store);
routes.put('/recipients', RecipientController.update);

routes.post('/files', upload.single('file'), FileController.store);

routes.post('/deliveryMan', DeliveryManController.store);
routes.put('/deliveryMan/:id', DeliveryManController.update);
routes.get('/deliveryMan', DeliveryManController.index);
routes.delete('/deliveryMan/:id', DeliveryManController.delete);

routes.post('/deliveries', DeliveryController.store);
routes.put('/deliveries/:id', DeliveryController.update);
routes.get('/deliveries', DeliveryController.index);
routes.delete('/deliveries/:id', DeliveryController.delete);

routes.delete(
  '/problem/:delivery_problem_id/cancel-delivery',
  CancelDeliveryController.delete
);

export default routes;
