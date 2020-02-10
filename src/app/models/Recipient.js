import Sequelize, { Model } from 'sequelize';

class Recipient extends Model {
  static init(sequelize) {
    super.init(
      {
        name: Sequelize.STRING,
        address: Sequelize.STRING,
        number: Sequelize.STRING,
        addressComplement: Sequelize.STRING,
        state: Sequelize.STRING,
        city: Sequelize.STRING,
        zipCode: Sequelize.STRING,
      },
      {
        sequelize,
      }
    );
    return this;
  }
}

export default Recipient;
