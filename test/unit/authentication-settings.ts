import { assert } from 'chai'
import nock from 'nock'
import { gateway as ElasticPathGateway } from '../../src'

const apiUrl = 'https://euwest.api.elasticpath.com/v2'

describe('ElasticPath Authentication Settings', () => {
  const ElasticPath = ElasticPathGateway({
    client_id: 'XXX'
  })

  it('Get all Settings', () => {
    nock(apiUrl, {}).get('/settings/customer-authentication').reply(200, {})

    return ElasticPath.AuthenticationSettings.Get().then(res => {
      assert.isObject(res)
    })
  })
})
