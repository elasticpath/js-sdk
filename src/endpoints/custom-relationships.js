import RequestFactory from '../factories/request'
import { buildURL } from '../utils/helpers'

class CustomRelationshipsEndpoint {
  constructor(endpoint) {
    const config = { ...endpoint }
    config.version = 'pcm'
    this.request = new RequestFactory(config)
    this.endpoint = 'custom_relationships'
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

  Get(slug) {
    return this.request.send(`${this.endpoint}/${slug}`, 'GET')
  }

  Create(body) {
    return this.request.send(this.endpoint, 'POST', {
      ...body,
      type: 'custom-relationship'
    })
  }

  Update(slug, body) {
    return this.request.send(`${this.endpoint}/${slug}`, 'PUT', {
      ...body,
      type: 'custom-relationship'
    })
  }

  Delete(slug) {
    return this.request.send(`${this.endpoint}/${slug}`, 'DELETE')
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

export default CustomRelationshipsEndpoint
