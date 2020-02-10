import Sequelize from 'sequelize';
import databaseConfig from '../config/database';

import User from '../app/models/User';
import Recipient from '../app/models/Recipient';

import File from '../app/models/File';
import Delivery from '../app/models/Delivery';
import DeliveryMan from '../app/models/DeliveryMan';
import DeliveryProblem from '../app/models/DeliveryProblem';

const models = [Recipient, User, File, Delivery, DeliveryMan, DeliveryProblem];
class Database {
  constructor() {
    this.init();
  }

  init() {
    this.connection = new Sequelize(databaseConfig);
    models.map(model => model.init(this.connection));
    models.map(
      model => model.associate && model.associate(this.connection.models)
    );
  }
}

export default new Database();
