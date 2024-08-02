import BaseExtend from '../extends/base'

class SubscriptionInvoicesEndpoint extends BaseExtend {
  constructor(endpoint) {
    super(endpoint)

    this.endpoint = 'subscriptions/invoices'
  }

  GetPayments(invoiceId) {
    return this.request.send(`${this.endpoint}/${invoiceId}/payments`, 'GET')
  }

  GetPayment(invoiceId, paymentId) {
    return this.request.send(
      `${this.endpoint}/${invoiceId}/payments/${paymentId}`,
      'GET'
    )
  }
}

export default SubscriptionInvoicesEndpoint
