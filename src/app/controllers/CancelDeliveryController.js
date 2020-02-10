import DeliveryProblem from '../models/DeliveryProblem';
import Delivery from '../models/Delivery';
import DeliveryCanceledMail from '../jobs/DeliveryCanceledMail';
import Recipient from '../models/Recipient';
import DeliveryMan from '../models/DeliveryMan';
import Queue from '../../lib/Queue';

class CancelDeliveryController {
  async delete(req, res) {
    const { delivery_problem_id } = req.params;

    const deliveryProblem = await DeliveryProblem.findByPk(delivery_problem_id);

    if (!deliveryProblem) {
      res.status(400).json({ error: 'Problem Not Found' });
    }

    const delivery = await Delivery.findByPk(deliveryProblem.delivery_id, {
      include: [
        {
          model: Recipient,
          as: 'recipient',
        },
        {
          model: DeliveryMan,
          as: 'deliveryMan',
        },
      ],
    });

    await delivery.update({
      canceled_at: new Date(),
    });

    await Queue.add(DeliveryCanceledMail.key, { delivery });

    return res.json();
  }
}

export default new CancelDeliveryController();
