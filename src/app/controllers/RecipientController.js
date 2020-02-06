import * as Yup from 'yup';
import Recipient from '../models/Recipient';

class RecipientController {
  async store(req, res) {
    const schema = Yup.object().shape({
      name: Yup.string().required(),
      zipCode: Yup.string().required(),
      adress: Yup.string().required(),
      number: Yup.string().required(),
      city: Yup.string().required(),
      state: Yup.string().required(),
    });

    if (!(await schema.isValid(req.body))) {
      res.status(400).json({ error: 'Validation Error' });
    }

    const {
      id,
      name,
      zipCode,
      adress,
      adressComplement,
      number,
      city,
      state,
    } = await Recipient.create(req.body);

    return res.json({
      id,
      name,
      zipCode,
      adress,
      adressComplement,
      number,
      city,
      state,
    });
  }

  async update(req, res) {
    const schema = Yup.object().shape({
      id: Yup.number().required(),
      name: Yup.string().required(),
      zipCode: Yup.string().required(),
      adress: Yup.string().required(),
      number: Yup.string().required(),
      city: Yup.string().required(),
      state: Yup.string().required(),
    });

    if (!(await schema.isValid(req.body))) {
      res.status(400).json({ error: 'Validation Error' });
    }

    const {
      id,
      name,
      zipCode,
      adress,
      adressComplement,
      number,
      city,
      state,
    } = await Recipient.update(req.body);

    return res.json({
      id,
      name,
      zipCode,
      adress,
      adressComplement,
      number,
      city,
      state,
    });
  }
}

export default new RecipientController();
