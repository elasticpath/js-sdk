import { assert } from 'chai'
import nock from 'nock'
import { gateway as ElasticPathGateway } from '../../src'

const apiUrl = 'https://euwest.api.elasticpath.com'

describe('ElasticPath Account Members', () => {
  const ElasticPath = ElasticPathGateway({
    client_id: 'XXX'
  })

  it('Get a single account member', () => {
    nock(apiUrl, {})
      .post('/oauth/access_token')
      .reply(200, {
        access_token: 'a550d8cbd4a4627013452359ab69694cd446615a'
      })
      .get(/account-members\/*/)
      .reply(200, {})
    const accountMemberId = '64f35045-2a76-4bcf-b6ba-02bb12090d38'

    return ElasticPath.AccountMembers.Get(accountMemberId).then(res => {
      assert.isObject(res)
    })
  })

  it('Get all Account Members', () => {
    nock(apiUrl, {})
      .get(/account-members\/*/)
      .reply(200, {})

    return ElasticPath.AccountMembers.All().then(res => {
      assert.isObject(res)
    })
  })

  it('Get all Account Members with filter', () => {
    nock(apiUrl, {})
      .get(/account-members\/*/)
      .query({
        filter: 'eq(name,John)'
      })
      .reply(200, {})

    return ElasticPath.AccountMembers.Filter({ eq: { name: 'John' } })
      .All()
      .then(res => {
        assert.isObject(res)
      })
  })
})
