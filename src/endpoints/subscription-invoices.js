import RequestFactory from '../factories/request'
import { buildURL } from '../utils/helpers'

class SubscriptionInvoicesEndpoint {
  constructor(endpoint) {
    const config = { ...endpoint }
    this.request = new RequestFactory(config)

    this.endpoint = 'subscriptions/invoices'
  }

  All() {
    const { filter, limit, offset } = this

    return this.request.send(
      buildURL(this.endpoint, {
        filter,
        limit,
        offset
      }),
      'GET'
    )
  }

  Get(id) {
    return this.request.send(`${this.endpoint}/${id}`, 'GET')
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

  Filter(filter) {
    this.filter = filter

    return this
  }

  Limit(value) {
    this.limit = value

    return this
  }

  Offset(value) {
    this.offset = value

    return this
  }
}

export default SubscriptionInvoicesEndpoint
