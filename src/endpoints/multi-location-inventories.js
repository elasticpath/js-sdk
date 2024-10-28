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

    this.request = new RequestFactory(config)

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

  Get(inventoryId) {
    return this.request.send(`${this.endpoint}/${inventoryId}`, 'GET')
  }

  Create(body, productId) {
    return this.request.send(`${this.endpoint}`, 'POST', {
      type: 'stock',
      id: productId,
      attributes: body
    })
  }

  Update(inventoryId, body) {
    return this.request.send(`${this.endpoint}/${inventoryId}`, 'PUT', {
      type: 'stock',
      id: inventoryId,
      attributes: body
    })
  }

  Delete(inventoryId) {
    return this.request.send(`${this.endpoint}/${inventoryId}`, 'DELETE')
  }

  Limit(value) {
    this.limit = value
    return this
  }

  Offset(value) {
    this.offset = value
    return this
  }

  Filter(filter) {
    this.filter = filter
    return this
  }
}

export default MultiLocationInventories
