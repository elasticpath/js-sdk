import { assert } from 'chai'
import nock from 'nock'
import { gateway as ElasticPathGateway } from '../../src'

const apiUrl = 'https://euwest.api.elasticpath.com/v2'

describe('ElasticPath Authentication Realms', () => {
  const ElasticPath = ElasticPathGateway({
    client_id: 'XXX'
  })

  it('Get all Realms', () => {
    nock(apiUrl, {}).get('/authentication-realms').reply(200, {})

    return ElasticPath.AuthenticationRealm.All().then(res => {
      assert.isObject(res)
    })
  })

  it('Get a single Realm', () => {
    nock(apiUrl, {})
      .get(/authentication-realms\/*/)
      .reply(200, {})
    const realmId = '64f35045-2a76-4bcf-b6ba-02bb12090d38'

    return ElasticPath.AuthenticationRealm.Get({ realmId }).then(res => {
      assert.isObject(res)
    })
  })

  it('Create a single Realm', () => {
    nock(apiUrl, {})
      .post(/authentication-realms\/*/)
      .reply(201, {})

    const data = {
      type: 'authentication-realm' as const,
      name: 'Boo Authentication Realm'
    }

    return ElasticPath.AuthenticationRealm.Create({ data }).then(res => {
      assert.isObject(res)
    })
  })

  it('Update a single Realm', () => {
    nock(apiUrl, {})
      .put(/authentication-realms\/*/)
      .reply(201, {})

    const body = {
      type: 'authentication-realm' as const,
      name: 'Boo Authentication Realm'
    }

    const realmId = '64f35045-2a76-4bcf-b6ba-02bb12090d38'

    return ElasticPath.AuthenticationRealm.Update(realmId, body).then(res => {
      assert.isObject(res)
    })
  })

  it('Delete a single Realm', () => {
    nock(apiUrl, {})
      .delete(/authentication-realms\/*/)
      .reply(204, {})

    const realmId = '64f35045-2a76-4bcf-b6ba-02bb12090d38'

    return ElasticPath.AuthenticationRealm.Delete(realmId).then(res => {
      assert.isObject(res)
    })
  })
})
