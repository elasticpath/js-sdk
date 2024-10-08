import { assert } from 'chai'
import nock from 'nock'
import { gateway as ElasticPathGateway } from '../../src'
import { attributeResponse, currenciesArray as currencies } from '../factories'

const apiUrl = 'https://euwest.api.elasticpath.com/v2'

describe('ElasticPath currencies', () => {
  const ElasticPath = ElasticPathGateway({
    client_id: 'XXX'
  })

  it('should return an array of currencies', () => {
    // Intercept the API request
    nock(apiUrl, {
      reqheaders: {
        Authorization: 'Bearer a550d8cbd4a4627013452359ab69694cd446615a'
      }
    })
      .get('/currencies')
      .reply(200, { data: currencies })

    return ElasticPath.Currencies.All().then(response => {
      assert.lengthOf(response.data, 4)
    })
  })

  it('should return a single currency', () => {
    // Intercept the API request
    nock(apiUrl, {
      reqheaders: {
        Authorization: 'Bearer a550d8cbd4a4627013452359ab69694cd446615a'
      }
    })
      .get('/currencies/1')
      .reply(200, { data: currencies[0] })

    return ElasticPath.Currencies.Get('1').then(response => {
      assert.propertyVal(response.data, 'code', 'USD')
    })
  })

  it('should create a currency', () => {
    const newCurrency = {
      type: 'currency',
      default: true,
      code: 'USD',
      exchange_rate: 1,
      enabled: true,
      format: '${price}',
      decimal_point: '.',
      thousand_separator: ',',
      decimal_places: 2
    }

    // Intercept the API request
    nock(apiUrl, {
      reqheaders: {
        Authorization: 'Bearer a550d8cbd4a4627013452359ab69694cd446615a'
      }
    })
      .post('/currencies')
      .reply(201, { data: { ...newCurrency, id: 'cur1' } })

    return ElasticPath.Currencies.Create(newCurrency).then(response => {
      assert.equal(response.data.id, 'cur1')
      assert.equal(response.data.type, newCurrency.type)
      assert.equal(response.data.default, newCurrency.default)
      assert.equal(response.data.code, newCurrency.code)
      assert.equal(response.data.exchange_rate, newCurrency.exchange_rate)
      assert.equal(response.data.enabled, newCurrency.enabled)
      assert.equal(response.data.format, newCurrency.format)
      assert.equal(response.data.decimal_point, newCurrency.decimal_point)
      assert.equal(
        response.data.thousand_separator,
        newCurrency.thousand_separator
      )
      assert.equal(response.data.decimal_places, newCurrency.decimal_places)
    })
  })

  it('should update a currency', () => {
    // Intercept the API request
    nock(apiUrl, {
      reqheaders: {
        Authorization: 'Bearer a550d8cbd4a4627013452359ab69694cd446615a'
      }
    })
      .put('/currencies/1', {
        data: {
          code: 'GBP'
        }
      })
      .reply(200, {
        code: 'GBP'
      })

    return ElasticPath.Currencies.Update('1', {
      code: 'GBP'
    }).then(response => {
      assert.propertyVal(response, 'code', 'GBP')
    })
  })

  it('should delete a currency', () => {
    // Intercept the API request
    nock(apiUrl, {
      reqheaders: {
        Authorization: 'Bearer a550d8cbd4a4627013452359ab69694cd446615a'
      }
    })
      .delete('/currencies/1')
      .reply(204)

    return ElasticPath.Currencies.Delete('1').then(response => {
      assert.equal(response, '{}')
    })
  })

  it('should return the active currency', () => {
    ElasticPath.Currencies.Set(currencies[2].code).then(() => {
      ElasticPath.Currencies.Active().then(response => {
        assert.equal(response, 'YEN')
      })
    })
  })

  it('should set the active currency', () => {
    ElasticPath.Currencies.Set(currencies[1].code).then(response => {
      assert.equal(response, 'GBP')
    })
  })

  it('should return an array of attributes', () => {
    nock(apiUrl, {
      reqheaders: {
        Authorization: 'Bearer a550d8cbd4a4627013452359ab69694cd446615a'
      }
    })
      .get('/currencies/attributes')
      .reply(200, attributeResponse)

    return ElasticPath.Currencies.Attributes('testtoken').then(response => {
      assert.lengthOf(response.data, 3)
    })
  })
})
