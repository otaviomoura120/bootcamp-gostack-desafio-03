import Delivery from '../models/Delivery';
import File from '../models/File';

class EndDeliveryController {
  async update(req, res) {
    const { delivery_id } = req.params;
    const { originalname: name, filename: path } = req.file;

    let delivery = await Delivery.findByPk(delivery_id);

    if (!delivery) {
      return res.status(400).json({ error: 'Delivery not found with this ID' });
    }

    const file = await File.create({ name, path });

    delivery = await delivery.update({
      end_date: new Date(),
      signature_id: file.id,
    });

    return res.send(delivery);
  }
}

export default new EndDeliveryController();
