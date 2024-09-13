import RequestFactory from '../factories/request'

class PCMCustomRelationshipEndpoint {
  constructor(endpoint) {
    const config = { ...endpoint }
    this.request = new RequestFactory(config)
    config.version = 'pcm'
    this.endpoint = 'custom-relationships'
  }

  All(productId) {
    return this.request.send(`products/${productId}/${this.endpoint}`, 'GET')
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
    return this.request.send(
      `products/${productId}/${this.endpoint}/${customRelationshipSlug}/products`,
      'GET'
    )
  }

  GetProductIdsForCustomRelationship(productId, customRelationshipSlug) {
    return this.request.send(
      `products/${productId}/${this.endpoint}/${customRelationshipSlug}`,
      'GET'
    )
  }
}

export default PCMCustomRelationshipEndpoint
