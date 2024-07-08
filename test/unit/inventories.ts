import { assert } from 'chai'
import nock from 'nock'
import { gateway as ElasticPathGateway } from '../../src'
import {
  inventoriesArray as inventories,
  stockTransactionsArray as transactions
} from '../factories'

const apiUrl = 'https://euwest.api.elasticpath.com/v2'

describe('ElasticPath inventories', () => {
  it('should return an array of inventories', () => {
    const ElasticPath = ElasticPathGateway({
      client_id: 'XXX'
    })

    // Intercept the API request
    nock(apiUrl, {
      reqheaders: {
        Authorization: 'Bearer a550d8cbd4a4627013452359ab69694cd446615a'
      }
    })
      .get('/inventories')
      .reply(200, { data: inventories })

    return ElasticPath.Inventories.All().then(response => {
      assert.lengthOf(response.data, 2)
    })
  })

  it('should return a single product inventory', () => {
    const ElasticPath = ElasticPathGateway({
      client_id: 'XXX'
    })

    // Intercept the API request
    nock(apiUrl, {
      reqheaders: {
        Authorization: 'Bearer a550d8cbd4a4627013452359ab69694cd446615a'
      }
    })
      .get('/inventories/inventory-1')
      .reply(200, inventories[0])

    return ElasticPath.Inventories.Get('inventory-1').then(response => {
      assert.propertyVal(response, 'total', 10)
    })
  })

  it('should return an array inventory transactions for specific product', () => {
    const ElasticPath = ElasticPathGateway({
      client_id: 'XXX'
    })

    nock(apiUrl, {
      reqheaders: {
        Authorization: 'Bearer a550d8cbd4a4627013452359ab69694cd446615a'
      }
    })
      .get('/inventories/managed-product-1/transactions')
      .reply(200, { data: transactions })

    return ElasticPath.Inventories.GetTransactions('managed-product-1').then(
      response => {
        assert.lengthOf(response.data, 2)
      }
    )
  })

  it('should increment stock', () => {
    const ElasticPath = ElasticPathGateway({
      client_id: 'XXX'
    })

    nock(apiUrl, {
      reqheaders: {
        Authorization: 'Bearer a550d8cbd4a4627013452359ab69694cd446615a'
      }
    })
      .post('/inventories/managed-product-1/transactions', {
        data: {
          quantity: 100,
          action: 'increment',
          type: 'stock-transaction'
        }
      })
      .reply(201, {
        product_id: 'managed-product-1',
        quantity: 100,
        action: 'increment',
        type: 'stock-transaction'
      })

    return ElasticPath.Inventories.IncrementStock(
      'managed-product-1',
      100
    ).then(response => {
      assert.propertyVal(response, 'product_id', 'managed-product-1')
      assert.propertyVal(response, 'quantity', 100)
      assert.propertyVal(response, 'action', 'increment')
      assert.propertyVal(response, 'type', 'stock-transaction')
    })
  })

  it('should decrement stock', () => {
    const ElasticPath = ElasticPathGateway({
      client_id: 'XXX'
    })

    nock(apiUrl, {
      reqheaders: {
        Authorization: 'Bearer a550d8cbd4a4627013452359ab69694cd446615a'
      }
    })
      .post('/inventories/managed-product-1/transactions', {
        data: {
          quantity: 50,
          action: 'decrement',
          type: 'stock-transaction'
        }
      })
      .reply(201, {
        product_id: 'managed-product-1',
        quantity: 50,
        action: 'decrement',
        type: 'stock-transaction'
      })

    return ElasticPath.Inventories.DecrementStock('managed-product-1', 50).then(
      response => {
        assert.propertyVal(response, 'product_id', 'managed-product-1')
        assert.propertyVal(response, 'quantity', 50)
        assert.propertyVal(response, 'action', 'decrement')
        assert.propertyVal(response, 'type', 'stock-transaction')
      }
    )
  })

  it('should allocate stock', () => {
    const ElasticPath = ElasticPathGateway({
      client_id: 'XXX'
    })

    nock(apiUrl, {
      reqheaders: {
        Authorization: 'Bearer a550d8cbd4a4627013452359ab69694cd446615a'
      }
    })
      .post('/inventories/managed-product-1/transactions', {
        data: {
          quantity: 10,
          action: 'allocate',
          type: 'stock-transaction'
        }
      })
      .reply(201, {
        product_id: 'managed-product-1',
        quantity: 10,
        action: 'allocate',
        type: 'stock-transaction'
      })

    return ElasticPath.Inventories.AllocateStock('managed-product-1', 10).then(
      response => {
        assert.propertyVal(response, 'product_id', 'managed-product-1')
        assert.propertyVal(response, 'quantity', 10)
        assert.propertyVal(response, 'action', 'allocate')
        assert.propertyVal(response, 'type', 'stock-transaction')
      }
    )
  })

  it('should deallocate stock', () => {
    const ElasticPath = ElasticPathGateway({
      client_id: 'XXX'
    })

    nock(apiUrl, {
      reqheaders: {
        Authorization: 'Bearer a550d8cbd4a4627013452359ab69694cd446615a'
      }
    })
      .post('/inventories/managed-product-1/transactions', {
        data: {
          quantity: 10,
          action: 'deallocate',
          type: 'stock-transaction'
        }
      })
      .reply(201, {
        product_id: 'managed-product-1',
        quantity: 10,
        action: 'deallocate',
        type: 'stock-transaction'
      })

    return ElasticPath.Inventories.DeallocateStock(
      'managed-product-1',
      10
    ).then(response => {
      assert.propertyVal(response, 'product_id', 'managed-product-1')
      assert.propertyVal(response, 'quantity', 10)
      assert.propertyVal(response, 'action', 'deallocate')
      assert.propertyVal(response, 'type', 'stock-transaction')
    })
  })
})
