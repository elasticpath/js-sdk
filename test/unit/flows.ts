import { assert } from 'chai'
import nock from 'nock'
import { gateway as ElasticPathGateway } from '../../src'
import {
  flowsArray as flows,
  flowEntriesArray as flowEntries,
  attributeResponse
} from '../factories'

const apiUrl = 'https://euwest.api.elasticpath.com/v2'

describe('ElasticPath flows', () => {
  it('should create a flow', () => {
    const newFlow = {
      slug: 'addresses' as const,
      type: 'flow',
      name: 'Flow 1',
      description: 'Flow 1 description',
      enabled: true
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
      .post('/flows')
      .reply(201, { data: { ...newFlow, id: 'flow1' } })

    return ElasticPath.Flows.Create(newFlow).then(response => {
      assert.equal(response.data.id, 'flow1')
      assert.equal(response.data.type, newFlow.type)
      assert.equal(response.data.slug, newFlow.slug)
      assert.equal(response.data.name, newFlow.name)
      assert.equal(response.data.description, newFlow.description)
      assert.equal(response.data.enabled, newFlow.enabled)
    })
  })

  it('should update a flow', () => {
    const ElasticPath = ElasticPathGateway({
      client_id: 'XXX'
    })

    // Intercept the API request
    nock(apiUrl, {
      reqheaders: {
        Authorization: 'Bearer a550d8cbd4a4627013452359ab69694cd446615a'
      }
    })
      .put('/flows/flow-1', {
        data: {
          type: 'flow',
          name: 'Updated flow name'
        }
      })
      .reply(200, {
        name: 'Updated flow name'
      })

    return ElasticPath.Flows.Update('flow-1', {
      name: 'Updated flow name'
    }).then(response => {
      assert.propertyVal(response, 'name', 'Updated flow name')
    })
  })

  it('should get a flow', () => {
    const ElasticPath = ElasticPathGateway({
      client_id: 'XXX'
    })

    // Intercept the API request
    nock(apiUrl, {
      reqheaders: {
        Authorization: 'Bearer a550d8cbd4a4627013452359ab69694cd446615a'
      }
    })
      .get('/flows/flow-1')
      .reply(200, {
        name: 'Updated flow name'
      })

    return ElasticPath.Flows.Get('flow-1').then(response => {
      assert.propertyVal(response, 'name', 'Updated flow name')
    })
  })

  it('should delete a flow', () => {
    const ElasticPath = ElasticPathGateway({
      client_id: 'XXX'
    })

    // Intercept the API request
    nock(apiUrl, {
      reqheaders: {
        Authorization: 'Bearer a550d8cbd4a4627013452359ab69694cd446615a'
      }
    })
      .delete('/flows/flow-1')
      .reply(204)

    return ElasticPath.Flows.Delete('flow-1').then(response => {
      assert.equal(response, '{}')
    })
  })

  it('should return an array of flows', () => {
    const ElasticPath = ElasticPathGateway({
      client_id: 'XXX'
    })

    // Intercept the API request
    nock(apiUrl, {
      reqheaders: {
        Authorization: 'Bearer a550d8cbd4a4627013452359ab69694cd446615a'
      }
    })
      .get('/flows')
      .reply(200, { data: flows })

    return ElasticPath.Flows.All().then(response => {
      assert.lengthOf(response.data, 2)
    })
  })

  it('should return a single flow', () => {
    const ElasticPath = ElasticPathGateway({
      client_id: 'XXX'
    })

    // Intercept the API request
    nock(apiUrl, {
      reqheaders: {
        Authorization: 'Bearer a550d8cbd4a4627013452359ab69694cd446615a'
      }
    })
      .get('/flows/flow-1')
      .reply(200, flows[0])

    return ElasticPath.Flows.Get('flow-1').then(response => {
      assert.propertyVal(response, 'name', 'Flow 1')
    })
  })

  it('should return an array of flows entries', () => {
    const ElasticPath = ElasticPathGateway({
      client_id: 'XXX'
    })

    // Intercept the API request
    nock(apiUrl, {
      reqheaders: {
        Authorization: 'Bearer a550d8cbd4a4627013452359ab69694cd446615a'
      }
    })
      .get('/flows/flow-1/entries')
      .reply(200, flowEntries)

    return ElasticPath.Flows.GetEntries('flow-1').then(response => {
      assert.lengthOf(response, 2)
    })
  })

  it('should return fields', () => {
    const ElasticPath = ElasticPathGateway({
      client_id: 'XXX'
    })

    // Intercept the API request
    nock(apiUrl, {
      reqheaders: {
        Authorization: 'Bearer a550d8cbd4a4627013452359ab69694cd446615a'
      }
    })
      .get('/flows/12/fields')
      .reply(200)

    return ElasticPath.Flows.GetFields('12').then(response => {
      assert.lengthOf(response, 2)
    })
  })

  it('should return a limited number of flow entries', () => {
    const ElasticPath = ElasticPathGateway({
      client_id: 'XXX'
    })

    // Intercept the API request
    nock(apiUrl, {
      reqheaders: {
        Authorization: 'Bearer a550d8cbd4a4627013452359ab69694cd446615a'
      }
    })
      .get('/flows/flow-1/entries')
      .query({
        page: {
          limit: 4
        }
      })
      .reply(200, { data: flowEntries })

    return ElasticPath.Flows.Limit(4)
      .GetEntries('flow-1')
      .then(response => {
        assert.lengthOf(response.data, 2)
      })
  })

  it('should return an array flow entries offset by a value', () => {
    const ElasticPath = ElasticPathGateway({
      client_id: 'XXX'
    })

    // Intercept the API request
    nock(apiUrl, {
      reqheaders: {
        Authorization: 'Bearer a550d8cbd4a4627013452359ab69694cd446615a'
      }
    })
      .get('/flows/flow-1/entries')
      .query({
        page: {
          offset: 10
        }
      })
      .reply(200, flowEntries)

    return ElasticPath.Flows.Offset(10)
      .GetEntries('flow-1')
      .then(response => {
        assert.lengthOf(response, 2)
      })
  })

  it('should create a flow entry', () => {
    const ElasticPath = ElasticPathGateway({
      client_id: 'XXX'
    })
    // Intercept the API request
    nock(apiUrl, {
      reqheaders: {
        Authorization: 'Bearer a550d8cbd4a4627013452359ab69694cd446615a'
      }
    })
      .post('/flows/flow-1/entries', {
        data: {
          type: 'entry',
          name: 'A new entry'
        }
      })
      .reply(201, {
        name: 'A new entry'
      })

    return ElasticPath.Flows.CreateEntry('flow-1', {
      name: 'A new entry'
    }).then(response => {
      assert.propertyVal(response, 'name', 'A new entry')
    })
  })

  it('should update an entry', () => {
    const ElasticPath = ElasticPathGateway({
      client_id: 'XXX'
    })

    // Intercept the API request
    nock(apiUrl, {
      reqheaders: {
        Authorization: 'Bearer a550d8cbd4a4627013452359ab69694cd446615a'
      }
    })
      .put('/flows/flow-1/entries/1', {
        data: {
          type: 'entry',
          name: 'Updated flow name'
        }
      })
      .reply(200, {
        name: 'Updated flow name'
      })

    return ElasticPath.Flows.UpdateEntry('flow-1', '1', {
      name: 'Updated flow name'
    }).then(response => {
      assert.propertyVal(response, 'name', 'Updated flow name')
    })
  })

  it('should get an entry', () => {
    const ElasticPath = ElasticPathGateway({
      client_id: 'XXX'
    })

    // Intercept the API request
    nock(apiUrl, {
      reqheaders: {
        Authorization: 'Bearer a550d8cbd4a4627013452359ab69694cd446615a'
      }
    })
      .get('/flows/flow-1/entries/1')
      .reply(200, {
        name: 'Updated flow name'
      })

    return ElasticPath.Flows.GetEntry('flow-1', '1').then(response => {
      assert.propertyVal(response, 'name', 'Updated flow name')
    })
  })

  it('should delete an entry', () => {
    const ElasticPath = ElasticPathGateway({
      client_id: 'XXX'
    })

    // Intercept the API request
    nock(apiUrl, {
      reqheaders: {
        Authorization: 'Bearer a550d8cbd4a4627013452359ab69694cd446615a'
      }
    })
      .delete('/flows/flow-1/entries/1')
      .reply(204)

    return ElasticPath.Flows.DeleteEntry('flow-1', '1').then(response => {
      assert.equal(response, '{}')
    })
  })
  it('should delete flows by id', () => {
    const ElasticPath = ElasticPathGateway({
      client_id: 'XXX'
    })
    // Intercept the API request
    nock(apiUrl, {
      reqheaders: {
        Authorization: 'Bearer a550d8cbd4a4627013452359ab69694cd446615a'
      }
    })
      .delete('/flows/1')
      .reply(204)

    return ElasticPath.Flows.Delete('1').then(response => {
      assert.equal(response, '{}')
    })
  })

  it('should create a flow entry relationship', () => {
    const ElasticPath = ElasticPathGateway({
      client_id: 'XXX'
    })
    // Intercept the API request
    nock(apiUrl, {
      reqheaders: {
        Authorization: 'Bearer a550d8cbd4a4627013452359ab69694cd446615a'
      }
    })
      .post('/flows/flow-1/entries/entry-1/relationships/field-1', {
        data: {
          type: 'brand'
        }
      })
      .reply(201, {
        type: 'brand'
      })

    return ElasticPath.Flows.CreateEntryRelationship(
      'flow-1',
      'entry-1',
      'field-1',
      {
        type: 'brand'
      }
    ).then(response => {
      assert.propertyVal(response, 'type', 'brand')
    })
  })

  it('should create one-to-many flow entry relationships', () => {
    const ElasticPath = ElasticPathGateway({
      client_id: 'XXX'
    })
    // Intercept the API request
    nock(apiUrl, {
      reqheaders: {
        Authorization: 'Bearer a550d8cbd4a4627013452359ab69694cd446615a'
      }
    })
      .post('/flows/flow-1/entries/entry-1/relationships/field-1', {
        data: [
          {
            type: 'brand',
            id: 'id1'
          },
          {
            type: 'brand',
            id: 'id2'
          }
        ]
      })
      .reply(201, [
        {
          type: 'brand',
          id: 'id1'
        },
        {
          type: 'brand',
          id: 'id2'
        }
      ])

    return ElasticPath.Flows.CreateEntryRelationship(
      'flow-1',
      'entry-1',
      'field-1',
      [
        {
          type: 'brand',
          id: 'id1'
        },
        {
          type: 'brand',
          id: 'id2'
        }
      ]
    ).then(response => {
      assert.propertyVal(response[0], 'id', 'id1')
      assert.propertyVal(response[1], 'id', 'id2')
    })
  })

  it('should update a flow entry relationship', () => {
    const ElasticPath = ElasticPathGateway({
      client_id: 'XXX'
    })
    // Intercept the API request
    nock(apiUrl, {
      reqheaders: {
        Authorization: 'Bearer a550d8cbd4a4627013452359ab69694cd446615a'
      }
    })
      .put('/flows/flow-1/entries/entry-1/relationships/field-1', {
        data: {
          type: 'new'
        }
      })
      .reply(201, {
        type: 'new'
      })

    return ElasticPath.Flows.UpdateEntryRelationship(
      'flow-1',
      'entry-1',
      'field-1',
      {
        type: 'new'
      }
    ).then(response => {
      assert.propertyVal(response, 'type', 'new')
    })
  })

  it('should update one-to-many flow entry relationships', () => {
    const ElasticPath = ElasticPathGateway({
      client_id: 'XXX'
    })
    // Intercept the API request
    nock(apiUrl, {
      reqheaders: {
        Authorization: 'Bearer a550d8cbd4a4627013452359ab69694cd446615a'
      }
    })
      .put('/flows/flow-1/entries/entry-1/relationships/field-1', {
        data: [
          {
            type: 'brand',
            id: 'new-id1'
          },
          {
            type: 'brand',
            id: 'new-id2'
          }
        ]
      })
      .reply(201, [
        {
          type: 'brand',
          id: 'new-id1'
        },
        {
          type: 'brand',
          id: 'new-id2'
        }
      ])

    return ElasticPath.Flows.UpdateEntryRelationship(
      'flow-1',
      'entry-1',
      'field-1',
      [
        {
          type: 'brand',
          id: 'new-id1'
        },
        {
          type: 'brand',
          id: 'new-id2'
        }
      ]
    ).then(response => {
      assert.propertyVal(response[0], 'id', 'new-id1')
      assert.propertyVal(response[1], 'id', 'new-id2')
    })
  })

  it('should update a flow entry relationship', () => {
    const ElasticPath = ElasticPathGateway({
      client_id: 'XXX'
    })
    // Intercept the API request
    nock(apiUrl, {
      reqheaders: {
        Authorization: 'Bearer a550d8cbd4a4627013452359ab69694cd446615a'
      }
    })
      .delete('/flows/flow-1/entries/entry-1/relationships/field-1')
      .reply(204)

    return ElasticPath.Flows.DeleteEntryRelationship(
      'flow-1',
      'entry-1',
      'field-1'
    ).then(response => {
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
      .get('/flows/attributes')
      .reply(200, attributeResponse)

    return ElasticPath.Flows.Attributes('testtoken').then(response => {
      assert.lengthOf(response.data, 3)
    })
  })

  it('should return an array of attributes by flow type', () => {
    const ElasticPath = ElasticPathGateway({
      client_id: 'XXX'
    })
    nock(apiUrl, {
      reqheaders: {
        Authorization: 'Bearer a550d8cbd4a4627013452359ab69694cd446615a'
      }
    })
      .get('/flows/flow-type-1/attributes')
      .reply(200, attributeResponse)

    return ElasticPath.Flows.GetFlowTypeAttributes(
      'flow-type-1',
      'testtoken'
    ).then(response => {
      assert.lengthOf(response.data, 3)
    })
  })
})
