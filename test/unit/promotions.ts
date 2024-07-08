import { assert } from 'chai'
import nock from 'nock'
import { gateway as ElasticPathGateway, MemoryStorageFactory } from '../../src'
import {
  auth,
  promotionsArray as promotions,
  promotionCodesArray as promotionCodes
} from '../factories'

const apiUrl = 'https://euwest.api.elasticpath.com/v2'
const accessToken = 'testaccesstoken'

describe('ElasticPath promotions', () => {
  const ElasticPath = ElasticPathGateway({
    custom_authenticator: () => auth(accessToken),
    storage: new MemoryStorageFactory()
  })

  it('should return an array of promotions', () => {
    // Intercept the API request
    nock(apiUrl, {
      reqheaders: {
        Authorization: `Bearer ${accessToken}`
      }
    })
      .get('/promotions')
      .reply(200, { data: promotions })

    return ElasticPath.Promotions.All().then(response => {
      assert.lengthOf(response.data, 2)
    })
  })

  it('should return a single promotion', () => {
    // Intercept the API request
    nock(apiUrl, {
      reqheaders: {
        Authorization: `Bearer ${accessToken}`
      }
    })
      .get('/promotions/1')
      .reply(200, promotions[0])

    return ElasticPath.Promotions.Get('1').then(response => {
      assert.propertyVal(response, 'id', promotions[0].id)
    })
  })

  it('should create a new promotion', () => {
    const newPromotion: any = {
      type: 'promotion',
      name: 'promotion-3',
      description: 'promotion-3',
      enabled: true,
      promotion_type: 'fixed_discount',
      schema: {
        currencies: [
          {
            currency: 'USD',
            amount: 111
          }
        ]
      },
      start: '2020-01-01T04:00:00Z',
      end: '2020-11-01T04:00:00Z'
    }

    // Intercept the API request
    nock(apiUrl, {
      reqheaders: {
        Authorization: `Bearer ${accessToken}`
      }
    })
      .post('/promotions', { data: newPromotion })
      .reply(201, promotions[0])

    return ElasticPath.Promotions.Create(newPromotion).then(response => {
      assert.propertyVal(response, 'id', promotions[0].id)
    })
  })

  it('should return an array of promotion codes', () => {
    // Intercept the API request
    nock(apiUrl, {
      reqheaders: {
        Authorization: `Bearer ${accessToken}`
      }
    })
      .get('/promotions/1/codes')
      .reply(200, { data: promotionCodes })

    return ElasticPath.Promotions.Codes('1').then(response => {
      assert.lengthOf(response.data, 2)
    })
  })

  it('should create a new promotion codes', () => {
    const newCodes = [{ code: 'QWERTY' }]
    // Intercept the API request
    nock(apiUrl, {
      reqheaders: {
        Authorization: `Bearer ${accessToken}`
      }
    })
      .post('/promotions/1/codes', {
        data: { codes: newCodes, type: 'promotion_codes' }
      })
      .reply(201, promotions[0])

    return ElasticPath.Promotions.AddCodes('1', newCodes).then(response => {
      assert.propertyVal(response, 'id', promotions[0].id)
    })
  })
})
