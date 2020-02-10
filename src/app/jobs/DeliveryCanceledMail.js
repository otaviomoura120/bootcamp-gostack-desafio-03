import Mail from '../../lib/Mail';

class DeliveryCreatedMail {
  get key() {
    return 'DeliveryCanceledMail';
  }

  async handle({ data }) {
    const { delivery } = data;

    const {
      address,
      addressComplement,
      state,
      city,
      zipCode,
      number,
    } = delivery.recipient;

    const recipientAddress = `${address} ${addressComplement}, ${number} - ${zipCode} ${city} - ${state}`;

    Mail.sendMail({
      to: `${delivery.deliveryMan.name} <${delivery.deliveryMan.email}>`,
      subject: 'Nova Encomenda Cancelada',
      template: 'deliveryCanceled',
      context: {
        deliveryMan: delivery.deliveryMan.name,
        recipient: delivery.recipient.name,
        recipientAddress,
        product: delivery.product,
      },
    });
  }
}

export default new DeliveryCreatedMail();
