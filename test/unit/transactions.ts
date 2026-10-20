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

describe('ElasticPath order transaction notes', () => {
  const ElasticPath = ElasticPathGateway({
    client_id: 'XXX'
  })

  const note = {
    type: 'note',
    id: 'note-1',
    text: 'Refunded as goodwill',
    relationships: {
      transaction: { data: { type: 'transaction', id: 'transaction-1' } }
    },
    meta: {
      timestamps: {
        created_at: '2026-10-16T12:00:00Z',
        updated_at: '2026-10-16T12:00:00Z'
      },
      created_by: 'user-1',
      updated_by: 'user-1'
    }
  }

  it('should return the notes on a transaction', () => {
    nock(apiUrl, {
      reqheaders: {
        Authorization: 'Bearer a550d8cbd4a4627013452359ab69694cd446615a'
      }
    })
      .get('/orders/order-1/transactions/transaction-1/notes')
      .reply(200, { data: [note] })

    return ElasticPath.Transactions.AllNotes({
      order: 'order-1',
      transaction: 'transaction-1'
    }).then(response => {
      assert.lengthOf(response.data, 1)
      assert.propertyVal(response.data[0], 'id', 'note-1')
    })
  })

  it('should pass limit and offset when listing transaction notes', () => {
    nock(apiUrl, {
      reqheaders: {
        Authorization: 'Bearer a550d8cbd4a4627013452359ab69694cd446615a'
      }
    })
      .get('/orders/order-1/transactions/transaction-1/notes')
      .query({ 'page[limit]': '100', 'page[offset]': '20' })
      .reply(200, { data: [note] })

    return ElasticPath.Transactions.AllNotes({
      order: 'order-1',
      transaction: 'transaction-1',
      limit: 100,
      offset: 20
    }).then(response => {
      assert.lengthOf(response.data, 1)
    })
  })

  it('should apply chained Limit and Offset to transaction notes', () => {
    nock(apiUrl, {
      reqheaders: {
        Authorization: 'Bearer a550d8cbd4a4627013452359ab69694cd446615a'
      }
    })
      .get('/orders/order-1/transactions/transaction-1/notes')
      .query({ 'page[limit]': '10', 'page[offset]': '30' })
      .reply(200, { data: [note] })

    return ElasticPath.Transactions.Limit(10)
      .Offset(30)
      .AllNotes({ order: 'order-1', transaction: 'transaction-1' })
      .then(response => {
        assert.lengthOf(response.data, 1)
      })
  })

  it('should not keep chained Limit and Offset for the next notes request', () => {
    nock(apiUrl, {
      reqheaders: {
        Authorization: 'Bearer a550d8cbd4a4627013452359ab69694cd446615a'
      }
    })
      .get('/orders/order-1/transactions/transaction-1/notes')
      .query({ 'page[limit]': '10', 'page[offset]': '30' })
      .reply(200, { data: [note] })
      .get('/orders/order-1/transactions/transaction-1/notes')
      .reply(200, { data: [] })

    return ElasticPath.Transactions.Limit(10)
      .Offset(30)
      .AllNotes({ order: 'order-1', transaction: 'transaction-1' })
      .then(() =>
        ElasticPath.Transactions.AllNotes({
          order: 'order-1',
          transaction: 'transaction-1'
        })
      )
      .then(response => {
        assert.lengthOf(response.data, 0)
      })
  })

  it('should return a single transaction note', () => {
    nock(apiUrl, {
      reqheaders: {
        Authorization: 'Bearer a550d8cbd4a4627013452359ab69694cd446615a'
      }
    })
      .get('/orders/order-1/transactions/transaction-1/notes/note-1')
      .reply(200, { data: note })

    return ElasticPath.Transactions.GetNote({
      order: 'order-1',
      transaction: 'transaction-1',
      note: 'note-1'
    }).then(response => {
      assert.propertyVal(response.data, 'text', 'Refunded as goodwill')
    })
  })

  it('should create a transaction note', () => {
    nock(apiUrl, {
      reqheaders: {
        Authorization: 'Bearer a550d8cbd4a4627013452359ab69694cd446615a'
      }
    })
      .post('/orders/order-1/transactions/transaction-1/notes', {
        data: { type: 'note', text: 'Refunded as goodwill' }
      })
      .reply(201, { data: note })

    return ElasticPath.Transactions.CreateNote(
      { order: 'order-1', transaction: 'transaction-1' },
      { text: 'Refunded as goodwill' }
    ).then(response => {
      assert.propertyVal(response.data, 'id', 'note-1')
    })
  })

  it('should update a transaction note', () => {
    nock(apiUrl, {
      reqheaders: {
        Authorization: 'Bearer a550d8cbd4a4627013452359ab69694cd446615a'
      }
    })
      .put('/orders/order-1/transactions/transaction-1/notes/note-1', {
        data: { type: 'note', text: 'Updated note' }
      })
      .reply(200, { data: { ...note, text: 'Updated note' } })

    return ElasticPath.Transactions.UpdateNote(
      { order: 'order-1', transaction: 'transaction-1', note: 'note-1' },
      { text: 'Updated note' }
    ).then(response => {
      assert.propertyVal(response.data, 'text', 'Updated note')
    })
  })
})
