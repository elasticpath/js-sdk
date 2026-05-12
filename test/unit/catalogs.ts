import { assert } from 'chai'
import nock from 'nock'
import { gateway as ElasticPathGateway } from '../../src'

const apiUrl = 'https://euwest.api.elasticpath.com/pcm'

describe('ElasticPath catalogs pagination', () => {
  it('should pass page[limit] and page[offset] to Catalogs.Nodes.All', () => {
    const ElasticPath = ElasticPathGateway({
      client_id: 'XXX'
    })

    nock(apiUrl, {
      reqheaders: {
        Authorization: 'Bearer a550d8cbd4a4627013452359ab69694cd446615a'
      }
    })
      .get('/catalogs/nodes')
      .query({
        page: {
          limit: 10,
          offset: 20
        }
      })
      .reply(200, { data: [] })

    return ElasticPath.Catalogs.Nodes.Limit(10)
      .Offset(20)
      .All({})
      .then(response => {
        assert.exists(response.data)
      })
  })

  it('should pass page[limit] and page[offset] to Catalogs.Releases.All', () => {
    const ElasticPath = ElasticPathGateway({
      client_id: 'XXX'
    })

    nock(apiUrl, {
      reqheaders: {
        Authorization: 'Bearer a550d8cbd4a4627013452359ab69694cd446615a'
      }
    })
      .get('/catalogs/releases/catalog-1')
      .query({
        page: {
          limit: 5,
          offset: 15
        }
      })
      .reply(200, { data: [] })

    return ElasticPath.Catalogs.Releases.Limit(5)
      .Offset(15)
      .All({ catalogId: 'catalog-1' })
      .then(response => {
        assert.exists(response.data)
      })
  })

  it('should pass page[limit] and page[offset] to Catalogs.GetCatalogReleases', () => {
    const ElasticPath = ElasticPathGateway({
      client_id: 'XXX'
    })

    nock(apiUrl, {
      reqheaders: {
        Authorization: 'Bearer a550d8cbd4a4627013452359ab69694cd446615a'
      }
    })
      .get('/catalogs/catalog-1/releases')
      .query({
        page: {
          limit: 7,
          offset: 21
        }
      })
      .reply(200, { data: [] })

    return ElasticPath.Catalogs.Limit(7)
      .Offset(21)
      .GetCatalogReleases('catalog-1')
      .then(response => {
        assert.exists(response.data)
      })
  })
})
