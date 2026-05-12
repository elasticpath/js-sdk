import { assert } from 'chai'
import nock from 'nock'
import { gateway as ElasticPathGateway } from '../../src'

const apiUrl = 'https://euwest.api.elasticpath.com'

describe('ElasticPath ShopperCatalog hierarchies pagination', () => {
  it('should pass page[limit] and page[offset] to Hierarchies.All', () => {
    const ElasticPath = ElasticPathGateway({
      client_id: 'XXX'
    })

    nock(apiUrl, {
      reqheaders: {
        Authorization: 'Bearer a550d8cbd4a4627013452359ab69694cd446615a'
      }
    })
      .get('/catalog/hierarchies')
      .query({
        page: {
          limit: 10,
          offset: 20
        }
      })
      .reply(200, { data: [] })

    return ElasticPath.ShopperCatalog.Hierarchies.Limit(10)
      .Offset(20)
      .All()
      .then(response => {
        assert.exists(response.data)
      })
  })

  it('should pass page[limit] and page[offset] to GetHierarchyChildren', () => {
    const ElasticPath = ElasticPathGateway({
      client_id: 'XXX'
    })

    nock(apiUrl, {
      reqheaders: {
        Authorization: 'Bearer a550d8cbd4a4627013452359ab69694cd446615a'
      }
    })
      .get('/catalog/hierarchies/hierarchy-1/children')
      .query({
        page: {
          limit: 5,
          offset: 15
        }
      })
      .reply(200, { data: [] })

    return ElasticPath.ShopperCatalog.Hierarchies.Limit(5)
      .Offset(15)
      .GetHierarchyChildren({ hierarchyId: 'hierarchy-1' })
      .then(response => {
        assert.exists(response.data)
      })
  })

  it('should pass page[limit] and page[offset] to GetHierarchyNodes', () => {
    const ElasticPath = ElasticPathGateway({
      client_id: 'XXX'
    })

    nock(apiUrl, {
      reqheaders: {
        Authorization: 'Bearer a550d8cbd4a4627013452359ab69694cd446615a'
      }
    })
      .get('/catalog/hierarchies/hierarchy-1/nodes')
      .query({
        page: {
          limit: 7,
          offset: 21
        }
      })
      .reply(200, { data: [] })

    return ElasticPath.ShopperCatalog.Hierarchies.Limit(7)
      .Offset(21)
      .GetHierarchyNodes({ hierarchyId: 'hierarchy-1' })
      .then(response => {
        assert.exists(response.data)
      })
  })
})
