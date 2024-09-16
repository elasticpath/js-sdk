import RequestFactory from '../factories/request'
import { buildURL } from '../utils/helpers'

class PCMCustomRelationshipEndpoint {
  constructor(endpoint) {
    const config = { ...endpoint }
    this.request = new RequestFactory(config)
    config.version = 'pcm'
    this.endpoint = 'custom-relationships'
  }

  Limit(value) {
    this.limit = value

    return this
  }

  Offset(value) {
    this.offset = value

    return this
  }

  All(productId) {
    const { limit, offset } = this
    return this.request.send(
      buildURL(`products/${productId}/${this.endpoint}`, { limit, offset }),
      'GET'
    )
  }

  AttachCustomRelationship(productId, body) {
    return this.request.send(
      `products/${productId}/${this.endpoint}`,
      'POST',
      body
    )
  }

  DetachCustomRelationship(productId, body) {
    return this.request.send(
      `products/${productId}/${this.endpoint}`,
      'DELETE',
      body
    )
  }

  AssociateProductsToCustomRelationship(
    productId,
    customRelationshipSlug,
    productsToAssociate
  ) {
    return this.request.send(
      `products/${productId}/${this.endpoint}/${customRelationshipSlug}`,
      'POST',
      productsToAssociate
    )
  }

  DissociateProductsFromCustomRelationship(
    productId,
    customRelationshipSlug,
    productsToDissociate
  ) {
    return this.request.send(
      `products/${productId}/${this.endpoint}/${customRelationshipSlug}`,
      'DELETE',
      productsToDissociate
    )
  }

  GetProductsForCustomRelationship(productId, customRelationshipSlug) {
    const { limit, offset } = this
    return this.request.send(
      buildURL(
        `products/${productId}/${this.endpoint}/${customRelationshipSlug}/products`,
        { limit, offset }
      ),
      'GET'
    )
  }

  GetProductIdsForCustomRelationship(productId, customRelationshipSlug) {
    const { limit, offset } = this
    return this.request.send(
      buildURL(
        `products/${productId}/${this.endpoint}/${customRelationshipSlug}`,
        {
          limit,
          offset
        }
      ),
      'GET'
    )
  }
}

export default PCMCustomRelationshipEndpoint
