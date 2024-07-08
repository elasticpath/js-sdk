import { assert } from 'chai'
import nock from 'nock'
import { ApplicationKeyBase, gateway as ElasticPathGateway } from '../../src'
import { applicationKeysArray as applicationKeys } from '../factories'

const apiUrl = 'https://euwest.api.elasticpath.com/v2'

describe('Store Application Keys', () => {
  it('should return an array of application keys', () => {
    const ElasticPath = ElasticPathGateway({
      client_id: 'XXX'
    })

    // Intercept the API request
    nock(apiUrl, {
      reqheaders: {
        Authorization: 'Bearer a550d8cbd4a4627013452359ab69694cd446615a'
      }
    })
      .get('/application-keys')
      .reply(200, { data: applicationKeys })

    return ElasticPath.ApplicationKeys.All().then(response => {
      assert.lengthOf(response.data, 4)
    })
  })

  it('should not return client secret', () => {
    const ElasticPath = ElasticPathGateway({
      client_id: 'XXX'
    })

    // Intercept the API request
    nock(apiUrl, {
      reqheaders: {
        Authorization: 'Bearer a550d8cbd4a4627013452359ab69694cd446615a'
      }
    })
      .get('/application-keys')
      .reply(200, { data: applicationKeys })

    return ElasticPath.ApplicationKeys.All().then(response => {
      response.data.map(key => assert.notProperty(key, 'client_secret'))
    })
  })

  it('should create a new application key', () => {
    const newApplicationKey = {
      id: 'applicationKeyId1',
      name: 'application-key-name',
      type: 'application_key',
      client_id: 'client-id',
      client_secret: 'client-secret',
      meta: {
        timestamps: {
          created_at: '2022-09-13T18:34:04.748025Z',
          updated_at: '2022-09-13T18:34:04.748025Z'
        }
      }
    }

    const applicationKeyBody: ApplicationKeyBase = {
      name: 'application-key-name',
      type: 'application_key'
    }

    const ElasticPath = ElasticPathGateway({
      client_id: 'XXX'
    })

    // Intercept the API request
    nock(apiUrl, {
      reqheaders: {
        Authorization: 'Bearer a550d8cbd4a4627013452359ab69694cd446615a'
      }
    })
      .post('/application-keys')
      .reply(201, { data: newApplicationKey })

    return ElasticPath.ApplicationKeys.Create(applicationKeyBody).then(
      response => {
        assert.equal(response.data.id, newApplicationKey.id)
        assert.equal(response.data.name, applicationKeyBody.name)
        assert.equal(response.data.type, newApplicationKey.type)
        assert.equal(response.data.client_id, newApplicationKey.client_id)
        assert.equal(
          response.data.client_secret,
          newApplicationKey.client_secret
        )
        assert.deepEqual(response.data.meta, newApplicationKey.meta)
      }
    )
  })

  it('should delete an application key', () => {
    const ElasticPath = ElasticPathGateway({
      client_id: 'XXX'
    })

    // Intercept the API request
    nock(apiUrl, {
      reqheaders: {
        Authorization: 'Bearer a550d8cbd4a4627013452359ab69694cd446615a'
      }
    })
      .delete('/application-keys/1')
      .reply(204)

    return ElasticPath.ApplicationKeys.Delete('1').then(response => {
      assert.equal(response, '{}')
    })
  })
})
