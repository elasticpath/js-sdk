import BaseExtend from '../extends/base'
import { buildURL } from '../utils/helpers'

class TransactionsEndpoint extends BaseExtend {
  constructor(endpoint) {
    super(endpoint)

    this.endpoint = 'transactions'
  }

  All({ order }) {
    return this.request.send(`orders/${order}/${this.endpoint}`, 'GET')
  }

  Get({ order, transaction }, token = null) {
    return this.request.send(
      `orders/${order}/${this.endpoint}/${transaction}`,
      'GET',
      undefined,
      token
    )
  }

  Capture({ order, transaction }) {
    return this.request.send(
      `orders/${order}/${this.endpoint}/${transaction}/capture`,
      'POST'
    )
  }

  Refund({ order, transaction }, body = {}) {
    return this.request.send(
      `orders/${order}/${this.endpoint}/${transaction}/refund`,
      'POST',
      body
    )
  }

  Cancel({ order, transaction }, body = {}) {
    return this.request.send(
      `orders/${order}/${this.endpoint}/${transaction}/cancel`,
      'POST',
      body
    )
  }

  AllNotes({ order, transaction, limit, offset }) {
    return this.request.send(
      buildURL(`orders/${order}/${this.endpoint}/${transaction}/notes`, {
        limit: limit !== undefined ? limit : this.limit,
        offset: offset !== undefined ? offset : this.offset
      }),
      'GET',
      undefined,
      undefined,
      this
    )
  }

  GetNote({ order, transaction, note }) {
    return this.request.send(
      `orders/${order}/${this.endpoint}/${transaction}/notes/${note}`,
      'GET'
    )
  }

  CreateNote({ order, transaction }, body) {
    return this.request.send(
      `orders/${order}/${this.endpoint}/${transaction}/notes`,
      'POST',
      {
        ...body,
        type: 'note'
      }
    )
  }

  UpdateNote({ order, transaction, note }, body) {
    return this.request.send(
      `orders/${order}/${this.endpoint}/${transaction}/notes/${note}`,
      'PUT',
      {
        ...body,
        type: 'note'
      }
    )
  }

  DeleteNote({ order, transaction, note }) {
    return this.request.send(
      `orders/${order}/${this.endpoint}/${transaction}/notes/${note}`,
      'DELETE'
    )
  }
}

export default TransactionsEndpoint
