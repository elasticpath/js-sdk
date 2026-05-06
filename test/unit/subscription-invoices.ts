import { assert } from 'chai'
import nock from 'nock'
import fetch from 'cross-fetch'
import { gateway as ElasticPathGateway, MemoryStorageFactory } from '../../src'
import type { SubscriptionInvoice } from '../../src/types/subscription-invoices'

const apiHost = 'https://euwest.api.elasticpath.com'
const apiV2 = `${apiHost}/v2`
const authExpire = 9999999999

const subscriptionInvoiceFixture: SubscriptionInvoice = {
  type: 'subscription_invoice',
  id: 'inv-1',
  attributes: {
    billing_period: {
      start: '2026-01-01T00:00:00Z',
      end: '2026-02-01T00:00:00Z'
    },
    invoice_items: [
      {
        description: 'Plan',
        price: {
          amount: 1000,
          currency: 'USD',
          includes_tax: false
        }
      }
    ],
    outstanding: true,
    tax_required: true,
    payment_retries_limit_reached: false
  },
  meta: {
    owner: 'store',
    display_price: {
      with_tax: {
        amount: 1150,
        currency: 'USD',
        formatted: '$11.50'
      },
      without_tax: {
        amount: 1000,
        currency: 'USD',
        formatted: '$10.00'
      },
      tax: {
        amount: 150,
        currency: 'USD',
        formatted: '$1.50'
      }
    },
    timestamps: {
      updated_at: '2026-01-01T00:00:00Z',
      created_at: '2026-01-01T00:00:00Z'
    },
    prorated_at: []
  }
}

function nockAuthenticate() {
  nock(apiHost, {
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
}

describe('ElasticPath subscription invoices', () => {
  const ElasticPath = ElasticPathGateway({
    client_id: 'XXX',
    storage: new MemoryStorageFactory(),
    custom_fetch: fetch
  })

  it('should return a subscription invoice with meta.display_price', () => {
    nockAuthenticate()

    nock(apiV2, {
      reqheaders: {
        Authorization: 'Bearer a550d8cbd4a4627013452359ab69694cd446615a'
      }
    })
      .get('/subscriptions/invoices/inv-1')
      .reply(200, { data: subscriptionInvoiceFixture })

    return ElasticPath.SubscriptionInvoices.Get('inv-1').then(response => {
      const dp = response.data.meta.display_price
      if (dp === undefined) {
        throw new Error('expected meta.display_price')
      }
      assert.propertyVal(dp.with_tax, 'amount', 1150)
      assert.propertyVal(dp.with_tax, 'currency', 'USD')
      assert.propertyVal(dp.with_tax, 'formatted', '$11.50')
      assert.propertyVal(dp.without_tax, 'amount', 1000)
      assert.propertyVal(dp.tax, 'amount', 150)
    })
  })

  it('should return invoices for a subscription including meta.display_price', () => {
    nockAuthenticate()

    nock(apiV2, {
      reqheaders: {
        Authorization: 'Bearer a550d8cbd4a4627013452359ab69694cd446615a'
      }
    })
      .get('/subscriptions/subscriptions/sub-1/invoices')
      .reply(200, { data: [subscriptionInvoiceFixture] })

    return ElasticPath.Subscriptions.GetInvoices('sub-1').then(response => {
      assert.lengthOf(response.data, 1)
      const dp = response.data[0].meta.display_price
      if (dp === undefined) {
        throw new Error('expected meta.display_price')
      }
      assert.equal(dp.tax.formatted, '$1.50')
    })
  })
})
