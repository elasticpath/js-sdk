import { assert } from 'chai'
import nock from 'nock'
import fetch from 'cross-fetch'
import { gateway as ElasticPathGateway } from '../../src'

const apiUrl = 'https://euwest.api.elasticpath.com'
const authExpire = 9999999999

describe('ElasticPath authentication', () => {
  it('should return an access token', () => {
    const ElasticPath = ElasticPathGateway({
      client_id: 'XXX'
    })

    // Intercept the API request
    nock(apiUrl, {
      reqheaders: {
        'Content-Type': 'application/x-www-form-urlencoded'
      }
    })
      .post('/oauth/access_token', {
        grant_type: 'implicit',
        client_id: 'XXX'
      })
      .reply(200, {
        access_token: 'a550d8cbd4a4627013452359ab69694cd446615a',
        expires: authExpire
      })

    return ElasticPath.Authenticate().then(response => {
      assert.equal(
        response.access_token,
        'a550d8cbd4a4627013452359ab69694cd446615a'
      )
      assert.equal(response.expires, authExpire)
    })
  })

  it('should throw an error when no client id is set', () => {
    const ElasticPath = ElasticPathGateway({
      client_id: ''
    })

    assert.throws(
      () => ElasticPath.Authenticate(),
      Error,
      /You must have a client_id set/
    )
  })

  it('should return an access token using custom_fetch', () => {
    const ElasticPath = ElasticPathGateway({
      client_id: 'XXX',
      custom_fetch: fetch
    })

    // Intercept the API request
    nock(apiUrl, {
      reqheaders: {
        'Content-Type': 'application/x-www-form-urlencoded'
      }
    })
      .post('/oauth/access_token', {
        grant_type: 'implicit',
        client_id: 'XXX'
      })
      .reply(200, {
        access_token: 'a550d8cbd4a4627013452359ab69694cd446615a',
        expires: authExpire
      })

    return ElasticPath.Authenticate().then(response => {
      assert.equal(
        response.access_token,
        'a550d8cbd4a4627013452359ab69694cd446615a'
      )
      assert.equal(response.expires, authExpire)
    })
  })

  it('should fallback to default API host if host is undefined during instantiation', () => {
    const ElasticPath = ElasticPathGateway({
      client_id: 'XXX',
      host: undefined
    })

    assert.equal(ElasticPath.config.host, 'euwest.api.elasticpath.com')
  })

  it('should use a custom API host', () => {
    const ElasticPath = ElasticPathGateway({
      client_id: 'XXX',
      host: 'api.test.test'
    })

    assert.equal(ElasticPath.config.host, 'api.test.test')
  })

  it('should cache authentication details', () => {
    // Intercept the API request
    nock(apiUrl, {
      reqheaders: {
        'Content-Type': 'application/x-www-form-urlencoded'
      }
    })
      .post('/oauth/access_token', {
        grant_type: 'implicit',
        client_id: 'XXX'
      })
      .reply(200, {
        access_token: 'a550d8cbd4a4627013452359ab69694cd446615a',
        expires: authExpire
      })

    const ElasticPath = ElasticPathGateway({
      client_id: 'XXX'
    })

    ElasticPath.Authenticate().then(() => {
      const { storage } = ElasticPath.request
      assert.exists(storage.get('epCredentials'))
    })
  })

  it('should clear cache if client ID is different', () => {
    // Intercept the API request
    nock(apiUrl, {
      reqheaders: {
        'Content-Type': 'application/x-www-form-urlencoded'
      }
    })
      .post('/oauth/access_token', {
        grant_type: 'implicit',
        client_id: 'YYY'
      })
      .reply(200, {
        access_token: 'a550d8cbd4a4627013452359ab69694cd446615b',
        expires: authExpire
      })

    let ElasticPath = ElasticPathGateway({
      client_id: 'YYY'
    })

    return ElasticPath.Authenticate().then(() => {
      const { storage } = ElasticPath.request
      let credentials = JSON.parse(storage.get('epCredentials'))
      assert.equal(
        credentials.access_token,
        'a550d8cbd4a4627013452359ab69694cd446615b'
      )

      // Intercept the API request
      nock(apiUrl, {
        reqheaders: {
          'Content-Type': 'application/x-www-form-urlencoded'
        }
      })
        .post('/oauth/access_token', {
          grant_type: 'implicit',
          client_id: 'XXX'
        })
        .reply(200, {
          access_token: 'a550d8cbd4a4627013452359ab69694cd446615a',
          expires: authExpire
        })

      ElasticPath = ElasticPathGateway({
        client_id: 'XXX'
      })

      return ElasticPath.Authenticate().then(() => {
        const { storage: storage2 } = ElasticPath.request
        credentials = JSON.parse(storage2.get('epCredentials'))
        assert.equal(
          credentials.access_token,
          'a550d8cbd4a4627013452359ab69694cd446615a'
        )
      })
    })
  })
})
