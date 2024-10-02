import { buildURL } from '../utils/helpers'
import RequestFactory from '../factories/request'

class InventoryLocationsEndpoint {
  constructor(endpoint) {
    this.request = new RequestFactory(endpoint)

    this.endpoint = 'inventories/locations'
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

  Get(locationId) {
    return this.request.send(`${this.endpoint}/${locationId}`, 'GET')
  }

  Create(body) {
    return this.request.send(this.endpoint, 'POST', {
      type: 'inventory_location',
      attributes: body
    })
  }

  Update(locationId, body) {
    return this.request.send(`${this.endpoint}/${locationId}`, 'PUT', {
      type: 'inventory_location',
      id: locationId,
      attributes: body
    })
  }

  Delete(locationId) {
    return this.request.send(`${this.endpoint}/${locationId}`, 'DELETE')
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

export default InventoryLocationsEndpoint
