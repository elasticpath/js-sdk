import { assert } from 'chai'
import nock from 'nock'
import { gateway as ElasticPathGateway } from '../../src'
import { orderTransactionsArray as transactions } from '../factories'

const apiUrl = 'https://euwest.api.elasticpath.com/v2'

describe('ElasticPath order transactions', () => {
  const ElasticPath = ElasticPathGateway({
    client_id: 'XXX'
  })

  it('should return an array of order transactions', () => {
    // Intercept the API request
    nock(apiUrl, {
      reqheaders: {
        Authorization: 'Bearer a550d8cbd4a4627013452359ab69694cd446615a'
      }
    })
      .get('/orders/order-1/transactions')
      .reply(200, { data: transactions })

    return ElasticPath.Transactions.All({ order: 'order-1' }).then(response => {
      assert.lengthOf(response.data, 2)
      assert.propertyVal(response.data[0], 'id', 'transaction-1')
      assert.propertyVal(response.data[1], 'id', 'transaction-2')
    })
  })

  it('should return a single order transaction', () => {
    // Intercept the API request
    nock(apiUrl, {
      reqheaders: {
        Authorization: 'Bearer a550d8cbd4a4627013452359ab69694cd446615a'
      }
    })
      .get('/orders/order-1/transactions/transaction-1')
      .reply(200, { data: transactions[0] })

    return ElasticPath.Transactions.Get({
      order: 'order-1',
      transaction: 'transaction-1'
    }).then(response => {
      assert.isOk(response)
    })
  })

  it('should capture an order transaction', () => {
    // Intercept the API request
    nock(apiUrl, {
      reqheaders: {
        Authorization: 'Bearer a550d8cbd4a4627013452359ab69694cd446615a'
      }
    })
      .post('/orders/order-1/transactions/transaction-1/capture')
      .reply(200, {})

    return ElasticPath.Transactions.Capture({
      order: 'order-1',
      transaction: 'transaction-1'
    }).then(response => {
      assert.isOk(response)
    })
  })

  it('should refund an order transaction', () => {
    // Intercept the API request
    nock(apiUrl, {
      reqheaders: {
        Authorization: 'Bearer a550d8cbd4a4627013452359ab69694cd446615a'
      }
    })
      .post('/orders/order-1/transactions/transaction-1/refund')
      .reply(200, {})

    return ElasticPath.Transactions.Refund({
      order: 'order-1',
      transaction: 'transaction-1'
    }).then(response => {
      assert.isOk(response)
    })
  })
})
