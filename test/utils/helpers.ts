import { expect } from 'chai'
import rewire from 'rewire'
import {
  buildRelationshipData,
  buildCartItemData,
  buildURL,
  createCartIdentifier,
  cartIdentifier,
  formatUrlResource,
  formatQueryString,
  buildQueryParams,
  buildRequestBody,
  buildCartCheckoutData,
  resetProps,
  getCredentials,
  tokenInvalid,
  tryParseJSON
} from '../../src/utils/helpers'

import LocalStorageFactory from '../../src/factories/local-storage'

const mod = rewire('../../src/utils/helpers')

describe('Build relationship payloads', () => {
  it('should return an array of relationship key value pairings', () => {
    const relationships = buildRelationshipData('category', ['123', '456'])

    expect(relationships).to.deep.include.members([
      { type: 'category', id: '123' },
      { type: 'category', id: '456' }
    ])
  })

  it('should return an empty array', () => {
    const relationships = buildRelationshipData('category', null)

    expect(relationships).to.be.an('array').that.is.empty
  })
})

describe('Build cart payloads', () => {
  it('should return a promotion item payload', () => {
    const payload = buildCartItemData('testcode', null, 'promotion_item')

    expect(payload).to.include({
      type: 'promotion_item',
      code: 'testcode'
    })
  })

  it('should return a cart item payload', () => {
    const payload = buildCartItemData('123', 4)

    expect(payload).to.include({
      type: 'cart_item',
      id: '123',
      quantity: 4
    })
  })
})

describe('Build query params', () => {
  it('should build filter query string from object', () => {
    const params = {
      filter: {
        eq: {
          status: 'live',
          slug: 'new-slug'
        },
        gt: {
          stock: 2
        }
      }
    }

    const queryString = buildURL('products', params)

    expect(queryString).to.equal(
      'products?filter=eq(status,live):eq(slug,new-slug):gt(stock,2)'
    )
  })

  it('should build relationship filter query string from object', () => {
    const params = {
      filter: {
        eq: {
          brand: {
            id: '123'
          }
        }
      }
    }

    const queryString = buildURL('products', params)

    expect(queryString).to.equal('products?filter=eq(brand.id,123)')
  })

  it('should build sort query string from object', () => {
    const params = {
      sort: 'created_at'
    }

    const queryString = buildURL('products', params)

    expect(queryString).to.equal('products?sort=created_at')
  })

  it('should build pagination query string from object', () => {
    const params = {
      offset: 100,
      limit: 20
    }

    const queryString = buildURL('products', params)

    expect(queryString).to.equal('products?page[limit]=20&page[offset]=100')
  })
})

describe('Unique cart identifier', () => {
  it('should create a string', () => {
    expect(createCartIdentifier()).to.be.a('string')
  })

  it('should create a unique string', () => {
    const firstId = createCartIdentifier()
    const secondId = createCartIdentifier()

    expect(firstId).not.equal(secondId)
  })

  it('should return a valid cart identifier', () => {
    expect(cartIdentifier(new LocalStorageFactory())).to.be.a('string')
  })
})

describe('Format URL resource', () => {
  it('should return `type`', () => {
    const res = formatUrlResource('main-image')

    expect(res).to.equal('main-image')
  })

  it('should pluralize resource', () => {
    const res = formatUrlResource('product')

    expect(res).to.equal('products')
  })

  it('should pluralize resource', () => {
    const res = formatUrlResource('products')

    expect(res).to.equal('products')
  })
})

describe('Build query params', () => {
  const buildQueryParams = mod.__get__('buildQueryParams')

  it('should handle includes', () => {
    const res = buildQueryParams({ includes: 'hello' })

    expect(res).to.equal('include=hello')
  })

  it('should handle sort', () => {
    const res = buildQueryParams({ sort: 'gt' })

    expect(res).to.equal('sort=gt')
  })

  it('should handle limit', () => {
    const res = buildQueryParams({ limit: '50' })

    expect(res).to.equal('page[limit]=50')
  })

  it('should handle offset', () => {
    const res = buildQueryParams({ offset: '50' })

    expect(res).to.equal('page[offset]=50')
  })

  it('should handle filter', () => {
    const res = buildQueryParams({ filter: { eq: { name: 'john' } } })

    expect(res).to.equal('filter=eq(name,john)')
  })

  it('should handle multiple queries', () => {
    const res = buildQueryParams({ includes: 'hello', sort: 'lt' })

    expect(res).to.equal('include=hello&sort=lt')
  })
})

describe('Build URL', () => {
  it('should handle no query params', () => {
    const res = buildURL('/products', {})

    expect(res).to.equal('/products')
  })

  it('should handle query params', () => {
    const res = buildURL('/orders', { filter: { eq: { name: 'john' } } })

    expect(res).to.equal('/orders?filter=eq(name,john)')
  })
})

describe('Build request body', () => {
  it('should return body format', () => {
    const res = buildRequestBody({ id: 1, desc: 'dummy data' })

    expect(res).to.equal(`{
        "data": {"id":1,"desc":"dummy data"}
      }`)
  })
})

describe('Build cart item data', () => {
  it('should build cart item data with quantity', () => {
    const res = buildCartItemData(1, '10', 'cart_item', { name: 'test' })

    expect(res).to.deep.equal({
      id: 1,
      quantity: 10,
      type: 'cart_item',
      name: 'test'
    })
  })

  it('should build cart item data with quantity by SKU', () => {
    const res = buildCartItemData(2, '10', 'cart_item', { name: 'test' }, true)

    expect(res).to.deep.equal({
      sku: 2,
      quantity: 10,
      type: 'cart_item',
      name: 'test'
    })
  })

  it('should build promotion item data', () => {
    const res = buildCartItemData('promo123', 1, 'promotion_item', {
      name: 'test'
    })

    expect(res).to.deep.equal({
      code: 'promo123',
      type: 'promotion_item',
      name: 'test'
    })
  })
})

describe('Build cart checkout data', () => {
  it('should return checkout data', () => {
    const res = buildCartCheckoutData(
      '123',
      'elasticpath office',
      'elasticpath office'
    )

    expect(res).to.deep.equal({
      customer: { id: '123' },
      billing_address: 'elasticpath office',
      shipping_address: 'elasticpath office'
    })
  })

  it('should return checkout data', () => {
    const res = buildCartCheckoutData(
      { id: 1, name: 'john' },
      'elasticpath office',
      'elasticpath office'
    )

    expect(res).to.deep.equal({
      customer: { id: 1, name: 'john' },
      billing_address: 'elasticpath office',
      shipping_address: 'elasticpath office'
    })
  })
})

describe('Reset props', () => {
  it('should remove properties', () => {
    const instance = {
      id: 1,
      includes: 'name',
      limit: '100',
      offset: '50',
      filter: 'eq(name,test)'
    }

    resetProps(instance)

    expect(instance).to.deep.equal({ id: 1 })
  })
})

describe('Get credentials', () => {
  it('should get credentials from localstorage', () => {
    const storageMock = {
      get: () => '{ "token": "abc123" }'
    }

    const res = getCredentials(storageMock)

    expect(res).to.deep.equal({ token: 'abc123' })
  })
})

describe('Token invalid', () => {
  it('should return true if no credentials', () => {
    const storageMock = {
      get: () => false
    }
    const config = { client_id: '12345', storage: storageMock }

    const res = tokenInvalid(config)

    expect(res).to.equal(true)
  })

  it('should return true if access token missing', () => {
    const storageMock = {
      get: () => JSON.stringify({ token: '12345' })
    }
    const config = { client_id: '12345', storage: storageMock }

    const res = tokenInvalid(config)

    expect(res).to.equal(true)
  })

  it('should return true if client_ids do not match', () => {
    const storageMock = {
      get: () => JSON.stringify({ token: '12345', client_id: '54321' })
    }
    const config = { client_id: '12345', storage: storageMock }

    const res = tokenInvalid(config)

    expect(res).to.equal(true)
  })

  it('should return true if token expired', () => {
    const storageMock = {
      get: () =>
        JSON.stringify({
          token: '12345',
          client_id: '54321',
          expires: Math.floor(Date.now() / 1000) - 1000
        })
    }
    const config = { client_id: '12345', storage: storageMock }

    const res = tokenInvalid(config)

    expect(res).to.equal(true)
  })

  it('should return false if token not expired', () => {
    const storageMock = {
      get: () =>
        JSON.stringify({
          token: '12345',
          client_id: '12345',
          expires: Math.floor(Date.now() / 1000) + 1000
        })
    }
    const config = { client_id: '12345', storage: storageMock }

    const res = tokenInvalid(config)

    expect(res).to.equal(true)
  })
})

describe('Parsing body JSON', () => {
  it('should parse empty object', () => {
    expect(tryParseJSON('{}', 'fallback')).to.deep.equal({})
  })

  it('should parse non-empty object', () => {
    expect(tryParseJSON('{ "a": 123, "b": "str" }', 'fallback')).to.deep.equal({
      a: 123,
      b: 'str'
    })
  })

  it('should parse complex object', () => {
    const body = {
      ok: false,
      status: 500,
      errors: [
        { code: 123, message: 'Server error' },
        { code: 456, message: 'Another error' }
      ]
    }

    expect(tryParseJSON(JSON.stringify(body), 'fallback')).to.deep.equal(body)
  })

  it('should parse null value', () => {
    expect(tryParseJSON(null, 'fallback')).to.equal(null)
  })

  it('should fallback on undefined', () => {
    expect(tryParseJSON(undefined, 'fallback')).to.equal('fallback')
  })

  it('should fallback on non-json strings', () => {
    expect(tryParseJSON('', 'fallback')).to.equal('fallback')
    expect(tryParseJSON('   ', 'fallback')).to.equal('fallback')
    expect(tryParseJSON('There was an error', 'fallback')).to.equal('fallback')
    expect(tryParseJSON('{ "a": 123', 'fallback')).to.equal('fallback')
  })
})
