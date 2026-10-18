import CRUDExtend from '../extends/crud'

import { buildURL } from '../utils/helpers'

class ExtendedAttributesEndpoint extends CRUDExtend {
  constructor(endpoint) {
    super(endpoint)

    this.endpoint = 'settings/extensions/extended-attributes'
  }

  GetExtendedAttributes(resourceType, { limit, offset, sort } = {}) {
    return this.request.send(
      buildURL(`${this.endpoint}/${resourceType}`, {
        limit: limit !== undefined ? limit : this.limit,
        offset: offset !== undefined ? offset : this.offset,
        sort: sort !== undefined ? sort : this.sort
      }),
      'GET',
      undefined,
      undefined,
      this
    )
  }

  GetExtendedAttribute(resourceType, id) {
    return this.request.send(
      `${this.endpoint}/${resourceType}/${id}`,
      'GET',
      undefined,
      undefined,
      this
    )
  }

  CreateExtendedAttribute(resourceType, body) {
    return this.request.send(
      `${this.endpoint}/${resourceType}`,
      'POST',
      { ...body, type: 'extended_attribute' },
      undefined,
      this
    )
  }

  UpdateExtendedAttribute(resourceType, id, body) {
    return this.request.send(
      `${this.endpoint}/${resourceType}/${id}`,
      'PUT',
      { ...body, type: 'extended_attribute' },
      undefined,
      this
    )
  }

  DeleteExtendedAttribute(resourceType, id) {
    return this.request.send(
      `${this.endpoint}/${resourceType}/${id}`,
      'DELETE',
      undefined,
      undefined,
      this
    )
  }
}

export default ExtendedAttributesEndpoint
