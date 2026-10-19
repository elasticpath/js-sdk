import { assert } from 'chai'
import nock from 'nock'
import { gateway as ElasticPathGateway } from '../../src'
import type {
  CreateExtendedAttributeBody,
  ExtendedAttributeDefinition,
  ExtendedAttributeFilter,
  ExtendedAttributeSort,
  UpdateExtendedAttributeBody
} from '../../src/types/extended-attributes'

const apiUrl = 'https://euwest.api.elasticpath.com/v2'
const path = '/settings/extensions/extended-attributes'

const extendedAttribute: ExtendedAttributeDefinition = {
  id: 'def-1',
  type: 'extended_attribute',
  resource_type: 'order',
  name: 'Payment terms',
  description: 'Agreed payment terms',
  slug: 'payment_terms',
  field_type: 'string',
  searchable: true,
  validation: {
    string: {
      allow_null_values: true,
      immutable: false,
      min_length: null,
      max_length: 32,
      regex: null,
      allowed_values: ['net30', 'net60']
    }
  },
  links: { self: `${apiUrl}${path}/order/def-1` },
  meta: {
    timestamps: {
      created_at: '2026-10-09T14:26:35.966Z',
      updated_at: '2026-10-09T14:26:35.966Z'
    }
  }
}

const createBody: CreateExtendedAttributeBody = {
  name: 'Payment terms',
  description: '',
  slug: 'payment_terms',
  field_type: 'string',
  searchable: false
}

// Compile-time coverage: the API rejects these, so the types should too.
// @ts-expect-error product is not a registry resource type
const unknownResourceType: ExtendedAttributeDefinition['resource_type'] =
  'product'
// @ts-expect-error slug cannot change on update
const slugUpdate: UpdateExtendedAttributeBody = { slug: 'new_slug' }
// @ts-expect-error field_type cannot change on update
const fieldTypeUpdate: UpdateExtendedAttributeBody = { field_type: 'integer' }
const unsupportedRule: UpdateExtendedAttributeBody = {
  // @ts-expect-error date has no min_value rule
  validation: { date: { min_value: 1 } }
}
// @ts-expect-error description is not sortable
const unknownSort: ExtendedAttributeSort = 'description'
// @ts-expect-error description is not filterable
const unknownFilterField: ExtendedAttributeFilter = { eq: { description: 'x' } }
// @ts-expect-error name has no range operators
const rangeOnName: ExtendedAttributeFilter = { lt: { name: 'x' } }

void [
  createBody,
  unknownResourceType,
  slugUpdate,
  fieldTypeUpdate,
  unsupportedRule,
  unknownSort,
  unknownFilterField,
  rangeOnName
]

describe('ElasticPath extended attributes', () => {
  const ElasticPath = ElasticPathGateway({
    client_id: 'XXX'
  })

  it('should return a page of definitions for a resource type', () => {
    nock(apiUrl, {
      reqheaders: {
        Authorization: 'Bearer a550d8cbd4a4627013452359ab69694cd446615a'
      }
    })
      .get(`${path}/order_item`)
      .query({ 'page[limit]': '100', 'page[offset]': '200', sort: 'name' })
      .reply(200, {
        data: [{ ...extendedAttribute, resource_type: 'order_item' }]
      })

    return ElasticPath.ExtendedAttributes.GetExtendedAttributes('order_item', {
      limit: 100,
      offset: 200,
      sort: 'name'
    }).then(response => {
      assert.lengthOf(response.data, 1)
      assert.propertyVal(response.data[0], 'resource_type', 'order_item')
    })
  })

  it('should filter definitions with several operators', () => {
    nock(apiUrl, {
      reqheaders: {
        Authorization: 'Bearer a550d8cbd4a4627013452359ab69694cd446615a'
      }
    })
      .get(`${path}/order`)
      .query({
        filter:
          'eq(field_type,string):like(name,Pay*):in(slug,payment_terms,po_number)',
        sort: '-name'
      })
      .reply(200, { data: [extendedAttribute] })

    return ElasticPath.ExtendedAttributes.GetExtendedAttributes('order', {
      filter: {
        eq: { field_type: 'string' },
        like: { name: 'Pay*' },
        in: { slug: ['payment_terms', 'po_number'] }
      },
      sort: '-name'
    }).then(response => {
      assert.lengthOf(response.data, 1)
    })
  })

  it('should apply a Filter() to one request only', () => {
    nock(apiUrl, {
      reqheaders: {
        Authorization: 'Bearer a550d8cbd4a4627013452359ab69694cd446615a'
      }
    })
      .get(`${path}/order`)
      .query({ filter: 'gt(created_at,2026-01-01T00:00:00.000Z)' })
      .reply(200, { data: [extendedAttribute] })
      .get(`${path}/order`)
      .reply(200, { data: [extendedAttribute, extendedAttribute] })

    const definitions = ElasticPath.ExtendedAttributes as unknown as {
      Filter(
        filter: ExtendedAttributeFilter
      ): typeof ElasticPath.ExtendedAttributes
    }

    return definitions
      .Filter({ gt: { created_at: '2026-01-01T00:00:00.000Z' } })
      .GetExtendedAttributes('order')
      .then(() => ElasticPath.ExtendedAttributes.GetExtendedAttributes('order'))
      .then(response => {
        assert.lengthOf(response.data, 2)
      })
  })

  it('should apply a Limit() to one request only', () => {
    nock(apiUrl, {
      reqheaders: {
        Authorization: 'Bearer a550d8cbd4a4627013452359ab69694cd446615a'
      }
    })
      .get(`${path}/order`)
      .query({ 'page[limit]': '10' })
      .reply(200, { data: [extendedAttribute] })
      .get(`${path}/order`)
      .reply(200, { data: [extendedAttribute, extendedAttribute] })

    const definitions = ElasticPath.ExtendedAttributes as unknown as {
      Limit(limit: number): typeof ElasticPath.ExtendedAttributes
    }

    return definitions
      .Limit(10)
      .GetExtendedAttributes('order')
      .then(() => ElasticPath.ExtendedAttributes.GetExtendedAttributes('order'))
      .then(response => {
        assert.lengthOf(response.data, 2)
      })
  })

  it('should get a definition by id', () => {
    nock(apiUrl, {
      reqheaders: {
        Authorization: 'Bearer a550d8cbd4a4627013452359ab69694cd446615a'
      }
    })
      .get(`${path}/order/def-1`)
      .reply(200, { data: extendedAttribute })

    return ElasticPath.ExtendedAttributes.GetExtendedAttribute(
      'order',
      'def-1'
    ).then(response => {
      assert.propertyVal(response.data, 'slug', 'payment_terms')
    })
  })

  it('should create a definition and add its type', () => {
    const body: CreateExtendedAttributeBody = {
      name: 'Payment terms',
      description: 'Agreed payment terms',
      slug: 'payment_terms',
      field_type: 'string',
      searchable: true,
      validation: {
        string: { max_length: 32, allowed_values: ['net30', 'net60'] }
      }
    }

    nock(apiUrl, {
      reqheaders: {
        Authorization: 'Bearer a550d8cbd4a4627013452359ab69694cd446615a'
      }
    })
      .post(`${path}/order`, {
        data: { ...body, type: 'extended_attribute' }
      })
      .reply(201, { data: extendedAttribute })

    return ElasticPath.ExtendedAttributes.CreateExtendedAttribute(
      'order',
      body
    ).then(response => {
      assert.propertyVal(response.data, 'id', 'def-1')
    })
  })

  it('should update a definition and send null to clear a rule', () => {
    const body: UpdateExtendedAttributeBody = {
      name: 'Terms',
      validation: { string: { max_length: null } }
    }

    nock(apiUrl, {
      reqheaders: {
        Authorization: 'Bearer a550d8cbd4a4627013452359ab69694cd446615a'
      }
    })
      .put(`${path}/order/def-1`, {
        data: {
          name: 'Terms',
          validation: { string: { max_length: null } },
          type: 'extended_attribute'
        }
      })
      .reply(200, { data: { ...extendedAttribute, name: 'Terms' } })

    return ElasticPath.ExtendedAttributes.UpdateExtendedAttribute(
      'order',
      'def-1',
      body
    ).then(response => {
      assert.propertyVal(response.data, 'name', 'Terms')
    })
  })

  it('should delete a definition', () => {
    nock(apiUrl, {
      reqheaders: {
        Authorization: 'Bearer a550d8cbd4a4627013452359ab69694cd446615a'
      }
    })
      .delete(`${path}/order_item/def-1`)
      .reply(204)

    return ElasticPath.ExtendedAttributes.DeleteExtendedAttribute(
      'order_item',
      'def-1'
    ).then(response => {
      assert.equal(response as unknown as string, '{}')
    })
  })
})
