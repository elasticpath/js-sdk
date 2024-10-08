import { assert } from 'chai'
import nock from 'nock'
import { gateway as ElasticPathGateway } from '../../src'
import { attributeResponse } from '../factories'

const apiUrl = 'https://euwest.api.elasticpath.com/v2'

describe('ElasticPath flow fields', () => {
  it('should create a field', () => {
    const newField = {
      type: 'field',
      name: 'Field 1',
      slug: 'field-1',
      field_type: 'float',
      validation_rules: [],
      description: 'Field 1 description',
      required: true,
      default: 1.23,
      enabled: true,
      order: 0,
      omit_null: false
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
      .post('/fields')
      .reply(201, { data: { ...newField, id: 'field1' } })

    return ElasticPath.Fields.Create(newField).then(response => {
      assert.equal(response.data.id, 'field1')
      assert.equal(response.data.type, newField.type)
      assert.equal(response.data.name, newField.name)
      assert.equal(response.data.slug, newField.slug)
      assert.equal(response.data.field_type, newField.field_type)
      assert.equal(response.data.description, newField.description)
      assert.equal(response.data.required, newField.required)
      assert.equal(response.data.default, newField.default)
      assert.equal(response.data.enabled, newField.enabled)
      assert.equal(response.data.order, newField.order)
      assert.equal(response.data.omit_null, newField.omit_null)
    })
  })

  it('should update a field', () => {
    const ElasticPath = ElasticPathGateway({
      client_id: 'XXX'
    })

    // Intercept the API request
    nock(apiUrl, {
      reqheaders: {
        Authorization: 'Bearer a550d8cbd4a4627013452359ab69694cd446615a'
      }
    })
      .put('/fields/1', {
        data: {
          type: 'field',
          name: 'Updated field name'
        }
      })
      .reply(200, {
        name: 'Updated field name'
      })

    return ElasticPath.Fields.Update('1', {
      name: 'Updated field name'
    }).then(response => {
      assert.propertyVal(response, 'name', 'Updated field name')
    })
  })

  it('should get a field', () => {
    const ElasticPath = ElasticPathGateway({
      client_id: 'XXX'
    })

    // Intercept the API request
    nock(apiUrl, {
      reqheaders: {
        Authorization: 'Bearer a550d8cbd4a4627013452359ab69694cd446615a'
      }
    })
      .get('/fields/1')
      .reply(200, {
        name: 'Updated field name'
      })

    return ElasticPath.Fields.Get('1').then(response => {
      assert.propertyVal(response, 'name', 'Updated field name')
    })
  })

  it('should delete a field', () => {
    const ElasticPath = ElasticPathGateway({
      client_id: 'XXX'
    })

    // Intercept the API request
    nock(apiUrl, {
      reqheaders: {
        Authorization: 'Bearer a550d8cbd4a4627013452359ab69694cd446615a'
      }
    })
      .delete('/fields/1')
      .reply(204)

    return ElasticPath.Fields.Delete('1').then(response => {
      assert.equal(response, '{}')
    })
  })

  it('should return an array of attributes', () => {
    const ElasticPath = ElasticPathGateway({
      client_id: 'XXX'
    })
    nock(apiUrl, {
      reqheaders: {
        Authorization: 'Bearer a550d8cbd4a4627013452359ab69694cd446615a'
      }
    })
      .get('/fields/attributes')
      .reply(200, attributeResponse)

    return ElasticPath.Fields.Attributes('testtoken').then(response => {
      assert.lengthOf(response.data, 3)
    })
  })
})
