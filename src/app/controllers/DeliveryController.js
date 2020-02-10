import * as Yup from 'yup';
import Queue from '../../lib/Queue';
import Delivery from '../models/Delivery';
import Recipient from '../models/Recipient';
import DeliveryMan from '../models/DeliveryMan';
import File from '../models/File';
import DeliveryCreatedMail from '../jobs/DeliveryCreatedMail';

class DeliveryController {
  async index(req, res) {
    const { page = 1 } = req.query;

    const deliveries = await Delivery.findAll({
      attributes: ['id', 'product', 'canceled_at', 'start_date', 'end_date'],
      order: ['product'],
      limit: 20,
      offset: (page - 1) * 20,
      include: [
        {
          model: Recipient,
          as: 'recipient',
          attributes: [
            'id',
            'name',
            'address',
            'number',
            'addressComplement',
            'state',
            'city',
            'zipCode',
          ],
        },
        {
          model: DeliveryMan,
          as: 'deliveryMan',
          attributes: ['id', 'name', 'email'],
          include: [
            {
              model: File,
              as: 'avatar',
              attributes: ['url', 'id', 'path'],
            },
          ],
        },
        {
          model: File,
          as: 'signature',
          attributes: ['url', 'id', 'path'],
        },
      ],
    });

    return res.json(deliveries);
  }

  async store(req, res) {
    const schema = Yup.object().shape({
      recipient_id: Yup.number().required(),
      deliveryman_id: Yup.number().required(),
      product: Yup.string().required(),
    });

    if (!(await schema.isValid(req.body))) {
      res.status(400).json({ error: 'Validation Error' });
    }

    const { recipient_id, deliveryman_id, product } = req.body;

    // verify if the recipient exists
    const recipient = await Recipient.findByPk(recipient_id);

    if (!recipient) {
      res.status(400).json({ error: 'Recipient Not Found' });
    }

    // verify if the DeliveryMan exists
    const deliveryMan = await DeliveryMan.findByPk(deliveryman_id);

    if (!deliveryMan) {
      res.status(400).json({ error: 'DeliveryMan Not Found' });
    }

    const delivery = await Delivery.create({
      recipient_id,
      deliveryman_id,
      product,
    });

    await Queue.add(DeliveryCreatedMail.key, { delivery });
    return res.json(delivery);
  }

  async update(req, res) {
    const { id } = req.params;

    const schema = Yup.object().shape({
      recipient_id: Yup.number(),
      deliveryman_id: Yup.number(),
      product: Yup.string(),
    });

    if (!(await schema.isValid(req.body))) {
      res.status(400).json({ error: 'Validation Error' });
    }

    const { recipient_id, deliveryman_id, product } = req.body;

    if (recipient_id) {
      // verify if the recipient exists
      const recipient = await Recipient.findByPk(recipient_id);

      if (!recipient) {
        res.status(400).json({ error: 'Recipient Not Found' });
      }
    }

    if (deliveryman_id) {
      // verify if the DeliveryMan exists
      const deliveryMan = await DeliveryMan.findByPk(deliveryman_id);

      if (!deliveryMan) {
        res.status(400).json({ error: 'DeliveryMan Not Found' });
      }
    }

    const delivery = await Delivery.findByPk(id);

    if (!delivery) {
      res.status(400).json({ error: 'Delivery Not Found' });
    }

    await delivery.update({
      recipient_id,
      deliveryman_id,
      product,
    });

    return res.json(delivery);
  }

  async delete(req, res) {
    const { id } = req.params;

    const delivery = await Delivery.findByPk(id);

    if (!delivery) {
      res.status(400).json({ error: 'Delivery Not Found' });
    }

    await delivery.destroy();

    return res.json();
  }
}

export default new DeliveryController();
