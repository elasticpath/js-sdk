import RequestFactory from '../factories/request'
import { buildURL } from '../utils/helpers'
import InventoryLocationsEndpoint from './mli-locations'

class MultiLocationInventories {
  constructor(endpoint) {
    const config = { ...endpoint }
    config.headers = {
      ...config.headers,
      'ep-inventories-multi-location': true
    }
    this.request = new RequestFactory(endpoint)

    this.Locations = new InventoryLocationsEndpoint(config)

    this.endpoint = 'inventories'
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

  Get(productId) {
    return this.request.send(`${this.endpoint}/${productId}`, 'GET')
  }

  Create(body) {
    return this.request.send(`${this.endpoint}}`, 'POST', {
      type: 'stock',
      attributes: body
    })
  }

  Delete(productId) {
    return this.request.send(`${this.endpoint}/${productId}`, 'DELETE')
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

export default MultiLocationInventories
