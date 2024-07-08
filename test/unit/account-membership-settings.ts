import { assert } from 'chai'
import nock from 'nock'
import { gateway as ElasticPathGateway } from '../../src'

const apiUrl = 'https://euwest.api.elasticpath.com/v2'

describe('ElasticPath Account Membership Settings', () => {
  const ElasticPath = ElasticPathGateway({
    client_id: 'XXX'
  })

  it('Get Account Membership Settings', () => {
    nock(apiUrl, {}).get('/settings/account-membership').reply(200, {})

    return ElasticPath.AccountMembershipSettings.Get().then(res => {
      assert.isObject(res)
    })
  })

  it('Update Account Membership Settings', () => {
    nock(apiUrl, {})
      .post('/oauth/access_token')
      .reply(200, {
        access_token: 'a550d8cbd4a4627013452359ab69694cd446615a'
      })
      .put('/settings/account-membership')
      .reply(200, {})

    const body = {
      type: 'account_membership_setting',
      membership_limit: 2
    }

    return ElasticPath.AccountMembershipSettings.Update(body).then(res => {
      assert.isObject(res)
    })
  })
})
