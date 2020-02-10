import { getHours } from 'date-fns';
import { Op } from 'sequelize';
import Delivery from '../models/Delivery';

class PickupDeliveryController {
  async index(req, res) {
    const { deliveryman_id, showDelivered } = req.params;

    const deliveries = await Delivery.findAll({
      where: {
        deliveryman_id,
        end_date: showDelivered === '0' ? null : { [Op.not]: null },
        canceled_at: null,
      },
    });

    return res.json(deliveries);
  }

  async update(req, res) {
    const { deliveryman_id, delivery_id } = req.params;

    // Verify the working hours
    const initHours = 8;
    const endHours = 18;
    const actualHour = getHours(new Date());
    if (actualHour < initHours || actualHour > endHours) {
      return res
        .status(401)
        .json({ error: 'The pickup must be done between 08:00 - 18:00' });
    }

    const deliveries = await Delivery.findAll({
      where: {
        deliveryman_id,
        start_date: { [Op.not]: null },
        end_date: null,
        canceled_at: null,
      },
    });

    if (deliveries.length > 5) {
      return res
        .status(401)
        .json({ error: 'You can only pickup 5 deliveries at time' });
    }

    let delivery = await Delivery.findByPk(delivery_id);

    if (!delivery) {
      return res
        .status(401)
        .json({ error: 'There is no Delivery with this ID' });
    }

    delivery = await delivery.update({ start_date: new Date() });

    return res.json(delivery);
  }
}

export default new PickupDeliveryController();
