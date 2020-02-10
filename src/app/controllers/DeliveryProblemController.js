import * as Yup from 'yup';
import Sequelize, { Op } from 'sequelize';
import DeliveryProblem from '../models/DeliveryProblem';
import Delivery from '../models/Delivery';

class DeliveryProblemController {
  async index(req, res) {
    const { id } = req.params;
    let deliveries = [];
    if (id) {
      deliveries = await DeliveryProblem.findAll({
        order: [['id', 'DESC']],
        where: { delivery_id: id },
      });
    } else {
      deliveries = await DeliveryProblem.findAll({
        attributes: [],
        include: [
          {
            model: Delivery,
            as: 'delivery',
            required: true,
          },
        ],
        group: ['delivery_id', 'delivery_problems.id'],
      });
    }

    return res.json(deliveries);
  }

  async store(req, res) {
    const { delivery_id } = req.params;

    const delivery = await Delivery.findByPk(delivery_id);

    if (!delivery) {
      return res
        .status(401)
        .json({ error: 'There is no Delivery with this ID' });
    }

    const schema = Yup.object().shape({
      description: Yup.string().required(),
    });

    if (!(await schema.isValid(req.body))) {
      res.status(400).json({ error: 'Validation Error' });
    }

    const deliveryProblem = await DeliveryProblem.create({
      description: req.body.description,
      delivery_id,
    });

    return res.json(deliveryProblem);
  }
}

export default new DeliveryProblemController();
