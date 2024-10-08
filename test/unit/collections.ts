import { assert } from 'chai'
import nock from 'nock'
import { gateway as ElasticPathGateway } from '../../src'
import {
  attributeResponse,
  collectionsArray as collections,
  productsArray as products
} from '../factories'

const apiUrl = 'https://euwest.api.elasticpath.com/v2'

describe('ElasticPath collections', () => {
  const ElasticPath = ElasticPathGateway({
    client_id: 'XXX'
  })

  it('should return an array of collections', () => {
    // Intercept the API request
    nock(apiUrl, {
      reqheaders: {
        Authorization: 'Bearer a550d8cbd4a4627013452359ab69694cd446615a'
      }
    })
      .get('/collections')
      .reply(200, { data: collections })

    return ElasticPath.Collections.All().then(response => {
      assert.lengthOf(response.data, 4)
    })
  })

  it('should return a single collection', () => {
    // Intercept the API request
    nock(apiUrl, {
      reqheaders: {
        Authorization: 'Bearer a550d8cbd4a4627013452359ab69694cd446615a'
      }
    })
      .get('/collections/1')
      .reply(200, collections[0])

    return ElasticPath.Collections.Get('1').then(response => {
      assert.propertyVal(response, 'name', 'Collection 1')
    })
  })

  it('should create a new collection', () => {
    const newCollection = {
      type: 'collection;',
      name: 'Collection 1',
      slug: 'collection-1',
      description: 'Collection 1 description',
      status: 'live'
    }

    // Intercept the API request
    nock(apiUrl, {
      reqheaders: {
        Authorization: 'Bearer a550d8cbd4a4627013452359ab69694cd446615a'
      }
    })
      .post('/collections')
      .reply(201, { data: { ...newCollection, id: 'col1' } })

    return ElasticPath.Collections.Create(newCollection).then(response => {
      assert.equal(response.data.id, 'col1')
      assert.equal(response.data.type, newCollection.type)
      assert.equal(response.data.name, newCollection.name)
      assert.equal(response.data.slug, newCollection.slug)
      assert.equal(response.data.description, newCollection.description)
      assert.equal(response.data.status, newCollection.status)
    })
  })

  it('should update a collection', () => {
    // Intercept the API request
    nock(apiUrl, {
      reqheaders: {
        Authorization: 'Bearer a550d8cbd4a4627013452359ab69694cd446615a'
      }
    })
      .put('/collections/1', {
        data: {
          type: 'collection',
          name: 'Updated collection name'
        }
      })
      .reply(200, {
        name: 'Updated collection name'
      })

    return ElasticPath.Collections.Update('1', {
      name: 'Updated collection name'
    }).then(response => {
      assert.propertyVal(response, 'name', 'Updated collection name')
    })
  })

  it('should delete a collection', () => {
    // Intercept the API request
    nock(apiUrl, {
      reqheaders: {
        Authorization: 'Bearer a550d8cbd4a4627013452359ab69694cd446615a'
      }
    })
      .delete('/collections/1')
      .reply(204)

    return ElasticPath.Collections.Delete('1').then(response => {
      assert.equal(response, '{}')
    })
  })

  it('should create a new product-collection relationship', () => {
    // Intercept the API request
    nock(apiUrl, {
      reqheaders: {
        Authorization: 'Bearer a550d8cbd4a4627013452359ab69694cd446615a'
      }
    })
      .post('/products/product-1/relationships/collections', {
        data: [
          {
            type: 'collection',
            id: 'collection-1'
          }
        ]
      })
      .reply(200, collections[0])

    return ElasticPath.Products.CreateRelationships(
      products[0].id,
      'collection',
      collections[0].id
    ).then(response => {
      assert.propertyVal(response, 'id', 'collection-1')
    })
  })

  it('should create multiple new product-collection relationships', () => {
    // Intercept the API request
    nock(apiUrl, {
      reqheaders: {
        Authorization: 'Bearer a550d8cbd4a4627013452359ab69694cd446615a'
      }
    })
      .post('/products/product-1/relationships/collections', {
        data: [
          {
            type: 'collection',
            id: 'collection-1'
          },
          {
            type: 'collection',
            id: 'collection-2'
          }
        ]
      })
      .reply(200, collections[0])

    return ElasticPath.Products.CreateRelationships(
      products[0].id,
      'collection',
      [collections[0].id, collections[1].id]
    ).then(response => {
      assert.propertyVal(response, 'id', 'collection-1')
    })
  })

  it('should delete an existing product-collection relationship', () => {
    // Intercept the API request
    nock(apiUrl, {
      reqheaders: {
        Authorization: 'Bearer a550d8cbd4a4627013452359ab69694cd446615a'
      }
    })
      .delete('/products/product-1/relationships/collections', {
        data: [
          {
            type: 'collection',
            id: 'collection-1'
          }
        ]
      })
      .reply(204)

    return ElasticPath.Products.DeleteRelationships(
      products[0].id,
      'collection',
      collections[0].id
    ).then(response => {
      assert.equal(response, '{}')
    })
  })

  it('should delete multiple existing product-collection relationships', () => {
    // Intercept the API request
    nock(apiUrl, {
      reqheaders: {
        Authorization: 'Bearer a550d8cbd4a4627013452359ab69694cd446615a'
      }
    })
      .delete('/products/product-1/relationships/collections', {
        data: [
          {
            type: 'collection',
            id: 'collection-1'
          },
          {
            type: 'collection',
            id: 'collection-2'
          }
        ]
      })
      .reply(204)

    return ElasticPath.Products.DeleteRelationships(
      products[0].id,
      'collection',
      [collections[0].id, collections[1].id]
    ).then(response => {
      assert.equal(response, '{}')
    })
  })

  it('should update existing product-collection relationships', () => {
    // Intercept the API request
    nock(apiUrl, {
      reqheaders: {
        Authorization: 'Bearer a550d8cbd4a4627013452359ab69694cd446615a'
      }
    })
      .put('/products/product-1/relationships/collections', {
        data: [
          {
            type: 'collection',
            id: 'collection-1'
          }
        ]
      })
      .reply(200, collections[0])

    return ElasticPath.Products.UpdateRelationships(
      products[0].id,
      'collection',
      collections[0].id
    ).then(response => {
      assert.propertyVal(response, 'id', 'collection-1')
    })
  })

  it('should remove all existing product-collection relationships', () => {
    // Intercept the API request
    nock(apiUrl, {
      reqheaders: {
        Authorization: 'Bearer a550d8cbd4a4627013452359ab69694cd446615a'
      }
    })
      .put('/products/product-1/relationships/collections', {
        data: []
      })
      .reply(200, {
        data: []
      })

    return ElasticPath.Products.UpdateRelationships(
      products[0].id,
      'collection'
    ).then(response => {
      assert.deepEqual(response, { data: [] })
    })
  })

  it('should return an array of attributes', () => {
    nock(apiUrl, {
      reqheaders: {
        Authorization: 'Bearer a550d8cbd4a4627013452359ab69694cd446615a'
      }
    })
      .get('/collections/attributes')
      .reply(200, attributeResponse)

    return ElasticPath.Collections.Attributes('testtoken').then(response => {
      assert.lengthOf(response.data, 3)
    })
  })
})
