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
})

describe('ElasticPath catalogs Releases.All URL shape', () => {
  it('should request catalogs/{catalogId}/releases (not catalogs/releases/{catalogId})', () => {
    const ElasticPath = ElasticPathGateway({
      client_id: 'XXX'
    })

    nock(apiUrl, {
      reqheaders: {
        Authorization: 'Bearer a550d8cbd4a4627013452359ab69694cd446615a'
      }
    })
      .get('/catalogs/catalog-1/releases')
      .reply(200, { data: [] })

    return ElasticPath.Catalogs.Releases.All({
      catalogId: 'catalog-1'
    }).then(response => {
      assert.exists(response.data)
    })
  })

  it('should request catalogs/{catalogId}/releases via Catalogs.GetCatalogReleases', () => {
    const ElasticPath = ElasticPathGateway({
      client_id: 'XXX'
    })

    nock(apiUrl, {
      reqheaders: {
        Authorization: 'Bearer a550d8cbd4a4627013452359ab69694cd446615a'
      }
    })
      .get('/catalogs/catalog-1/releases')
      .reply(200, { data: [] })

    return ElasticPath.Catalogs.GetCatalogReleases('catalog-1').then(
      response => {
        assert.exists(response.data)
      }
    )
  })
})
