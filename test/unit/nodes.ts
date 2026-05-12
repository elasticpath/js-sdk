import { assert } from 'chai'
import nock from 'nock'
import { gateway as ElasticPathGateway } from '../../src'

const apiUrl = 'https://euwest.api.elasticpath.com/pcm'

describe('ElasticPath hierarchy nodes pagination', () => {
  it('should pass page[limit] and page[offset] to All', () => {
    const ElasticPath = ElasticPathGateway({
      client_id: 'XXX'
    })

    nock(apiUrl, {
      reqheaders: {
        Authorization: 'Bearer a550d8cbd4a4627013452359ab69694cd446615a'
      }
    })
      .get('/hierarchies/hierarchy-1/nodes')
      .query({
        page: {
          limit: 10,
          offset: 20
        }
      })
      .reply(200, { data: [] })

    return ElasticPath.Hierarchies.Nodes.Limit(10)
      .Offset(20)
      .All({ hierarchyId: 'hierarchy-1' })
      .then(response => {
        assert.exists(response.data)
      })
  })
})
