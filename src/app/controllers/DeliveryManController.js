import * as Yup from 'yup';
import DeliveryMan from '../models/DeliveryMan';
import Delivery from '../models/Delivery';
import File from '../models/File';

class DeliveryManController {
  async index(req, res) {
    const { page = 1 } = req.query;

    const deliveryMans = await DeliveryMan.findAll({
      attributes: ['id', 'name', 'email'],
      order: ['name'],
      limit: 20,
      offset: (page - 1) * 20,
      include: [
        {
          model: File,
          as: 'avatar',
          attributes: ['url', 'id', 'path'],
        },
      ],
    });

    return res.json(deliveryMans);
  }

  async store(req, res) {
    const schema = Yup.object().shape({
      name: Yup.string().required(),
      email: Yup.string()
        .email()
        .required(),
    });

    if (!(await schema.isValid(req.body))) {
      res.status(400).json({ error: 'Validation Error' });
    }

    // verify if there is a delivery with the same email
    const checkDeliveryManEmail = await DeliveryMan.findOne({
      where: {
        email: req.body.email,
      },
    });

    if (checkDeliveryManEmail) {
      return res.status(400).json({ error: 'This Email is not available' });
    }

    const { name, email, avatar_id } = await DeliveryMan.create(req.body);
    return res.json({ name, email, avatar_id });
  }

  async update(req, res) {
    const { id } = req.params;

    if (!id) {
      res.status(400).json({
        error: 'ID not provided',
      });
    }

    const schema = Yup.object().shape({
      name: Yup.string(),
      email: Yup.string().email(),
    });

    if (!(await schema.isValid(req.body))) {
      res.status(400).json({ error: 'Validation Error' });
    }

    const deliveryMan = await DeliveryMan.findByPk(id);

    // Verify if there is another deliveryMan with the same email
    if (req.body.email && req.body.email !== deliveryMan.email) {
      const deliveryManExists = await DeliveryMan.findOne({
        where: { email: req.body.email },
      });

      if (deliveryManExists) {
        return res.status(400).json({ error: 'This Email is not available' });
      }
    }

    if (!deliveryMan) {
      return res.status(400).json('DeliveryMan not found with this ID');
    }

    const { name, email, avatar_id } = await deliveryMan.update(req.body);

    return res.json({ name, email, avatar_id });
  }

  async delete(req, res) {
    const { id } = req.params;

    if (!id) {
      res.status(400).json({
        error: 'ID not provided',
      });
    }

    // Verify with this deliveryMan has deliveries associate on him
    const deliveries = await Delivery.findAll({
      where: { deliveryman_id: id },
    });

    if (deliveries.length > 0) {
      return res.status(400).json({
        error: 'This DeliveryMan has deliveries associate on him',
      });
    }

    await DeliveryMan.destroy({
      where: {
        id,
      },
    });

    return res.json();
  }
}

export default new DeliveryManController();
