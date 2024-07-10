import { assert } from 'chai'
import nock from 'nock'
import { gateway as ElasticPathGateway } from '../../src'
import {
  accountAddressesArray as addresses,
  addressUpdate,
  attributeResponse
} from '../factories'

const apiUrl = 'https://euwest.api.elasticpath.com/v2'

describe('ElasticPath addresses', () => {
  const ElasticPath = ElasticPathGateway({
    client_id: 'XXX'
  })

  it('should return an array of account addresses', () => {
    // Intercept the API request

    nock(apiUrl, {
      reqheaders: {
        Authorization: 'Bearer a550d8cbd4a4627013452359ab69694cd446615a'
      }
    })
      .get('/accounts/account-1/addresses')
      .reply(200, { data: addresses })

    return ElasticPath.AccountAddresses.All({ account: 'account-1' }).then(
      response => {
        assert.lengthOf(response.data, 2)
      }
    )
  })

  it('should return an array of account addresses using a JWT', () => {
    // Intercept the API request
    nock(apiUrl, {
      reqheaders: {
        Authorization: 'Bearer a550d8cbd4a4627013452359ab69694cd446615a',
        'EP-ACCOUNT-MANAGEMENT-AUTHENTICATION-TOKEN': 'testtoken'
      }
    })
      .get('/accounts/account-1/addresses')
      .reply(200, { data: addresses })

    return ElasticPath.AccountAddresses.All({
      account: 'account-1',
      token: 'testtoken'
    }).then(response => {
      assert.lengthOf(response.data, 2)
    })
  })

  it('should return a single account address', () => {
    // Intercept the API request
    nock(apiUrl, {
      reqheaders: {
        Authorization: 'Bearer a550d8cbd4a4627013452359ab69694cd446615a'
      }
    })
      .get('/accounts/account-1/addresses/address-1')
      .reply(200, { data: addresses[0] })

    return ElasticPath.AccountAddresses.Get({
      account: 'account-1',
      address: 'address-1'
    }).then(response => {
      assert.propertyVal(response.data, 'id', 'address-1')
    })
  })

  it('should return a single account address using a JWT', () => {
    // Intercept the API request
    nock(apiUrl, {
      reqheaders: {
        Authorization: 'Bearer a550d8cbd4a4627013452359ab69694cd446615a',
        'EP-ACCOUNT-MANAGEMENT-AUTHENTICATION-TOKEN': 'testtoken'
      }
    })
      .get('/accounts/account-1/addresses/address-1')
      .reply(200, { data: addresses[0] })

    return ElasticPath.AccountAddresses.Get({
      account: 'account-1',
      address: 'address-1',
      token: 'testtoken'
    }).then(response => {
      assert.propertyVal(response.data, 'id', 'address-1')
    })
  })

  it('should create a new account address', () => {
    // Intercept the API request
    nock(apiUrl, {
      reqheaders: {
        Authorization: 'Bearer a550d8cbd4a4627013452359ab69694cd446615a'
      }
    })
      .post('/accounts/account-1/addresses')
      .reply(201, { data: { ...addresses[0], id: undefined } })

    return ElasticPath.AccountAddresses.Create({
      account: 'account-1',
      body: addresses[0]
    }).then(response => {
      assert.equal(response.data.type, addresses[0].type)
      assert.equal(response.data.first_name, addresses[0].first_name)
      assert.equal(response.data.last_name, addresses[0].last_name)
      assert.equal(response.data.name, addresses[0].name)
      assert.equal(response.data.phone_number, addresses[0].phone_number)
      assert.equal(response.data.instructions, addresses[0].instructions)
      assert.equal(response.data.company_name, addresses[0].company_name)
      assert.equal(response.data.line_1, addresses[0].line_1)
      assert.equal(response.data.line_2, addresses[0].line_2)
      assert.equal(response.data.city, addresses[0].city)
      assert.equal(response.data.county, addresses[0].county)
      assert.equal(response.data.postcode, addresses[0].postcode)
      assert.equal(response.data.country, addresses[0].country)
    })
  })

  it('should create a new account address using a JWT', () => {
    // Intercept the API request
    nock(apiUrl, {
      reqheaders: {
        Authorization: 'Bearer a550d8cbd4a4627013452359ab69694cd446615a',
        'EP-ACCOUNT-MANAGEMENT-AUTHENTICATION-TOKEN': 'testtoken'
      }
    })
      .post('/accounts/account-1/addresses')
      .reply(201, { data: addresses[0] })

    return ElasticPath.AccountAddresses.Create({
      account: 'account-1',
      body: addresses[0],
      token: 'testtoken'
    }).then(response => {
      assert.equal(response.data.id, addresses[0].id)
      assert.equal(response.data.type, addresses[0].type)
      assert.equal(response.data.first_name, addresses[0].first_name)
      assert.equal(response.data.last_name, addresses[0].last_name)
      assert.equal(response.data.name, addresses[0].name)
      assert.equal(response.data.phone_number, addresses[0].phone_number)
      assert.equal(response.data.instructions, addresses[0].instructions)
      assert.equal(response.data.company_name, addresses[0].company_name)
      assert.equal(response.data.line_1, addresses[0].line_1)
      assert.equal(response.data.line_2, addresses[0].line_2)
      assert.equal(response.data.city, addresses[0].city)
      assert.equal(response.data.county, addresses[0].county)
      assert.equal(response.data.postcode, addresses[0].postcode)
      assert.equal(response.data.country, addresses[0].country)
    })
  })

  it('should update a account address', () => {
    // Intercept the API request
    nock(apiUrl, {
      reqheaders: {
        Authorization: 'Bearer a550d8cbd4a4627013452359ab69694cd446615a'
      }
    })
      .put('/accounts/account-1/addresses/address-1')
      .reply(200, { data: { ...addresses[0], ...addressUpdate } })

    return ElasticPath.AccountAddresses.Update({
      account: 'account-1',
      address: 'address-1',
      body: { ...addresses[0], ...addressUpdate }
    }).then(response => {
      assert.equal(response.data.id, addresses[0].id)
      assert.equal(response.data.type, addresses[0].type)
      assert.equal(response.data.first_name, addresses[0].first_name)
      assert.equal(response.data.name, addresses[0].name)
      assert.equal(response.data.phone_number, addresses[0].phone_number)
      assert.equal(response.data.instructions, addresses[0].instructions)
      assert.equal(response.data.company_name, addresses[0].company_name)
      assert.equal(response.data.line_1, addresses[0].line_1)
      assert.equal(response.data.line_2, addresses[0].line_2)
      assert.equal(response.data.county, addresses[0].county)
      assert.equal(response.data.postcode, addresses[0].postcode)
      assert.equal(response.data.country, addresses[0].country)

      assert.equal(response.data.last_name, addressUpdate.last_name)
      assert.equal(response.data.city, addressUpdate.city)
    })
  })

  it('should update a account address using a JWT', () => {
    // Intercept the API request
    nock(apiUrl, {
      reqheaders: {
        Authorization: 'Bearer a550d8cbd4a4627013452359ab69694cd446615a',
        'EP-ACCOUNT-MANAGEMENT-AUTHENTICATION-TOKEN': 'testtoken'
      }
    })
      .put('/accounts/account-1/addresses/address-1')
      .reply(200, { data: { ...addresses[0], ...addressUpdate } })

    return ElasticPath.AccountAddresses.Update({
      account: 'account-1',
      address: 'address-1',
      token: 'testtoken',
      body: { ...addresses[0], ...addressUpdate }
    }).then(response => {
      assert.equal(response.data.id, addresses[0].id)
      assert.equal(response.data.type, addresses[0].type)
      assert.equal(response.data.first_name, addresses[0].first_name)
      assert.equal(response.data.name, addresses[0].name)
      assert.equal(response.data.phone_number, addresses[0].phone_number)
      assert.equal(response.data.instructions, addresses[0].instructions)
      assert.equal(response.data.company_name, addresses[0].company_name)
      assert.equal(response.data.line_1, addresses[0].line_1)
      assert.equal(response.data.line_2, addresses[0].line_2)
      assert.equal(response.data.county, addresses[0].county)
      assert.equal(response.data.postcode, addresses[0].postcode)
      assert.equal(response.data.country, addresses[0].country)

      assert.equal(response.data.last_name, addressUpdate.last_name)
      assert.equal(response.data.city, addressUpdate.city)
    })
  })

  it('should delete a account address', () => {
    // Intercept the API request
    nock(apiUrl, {
      reqheaders: {
        Authorization: 'Bearer a550d8cbd4a4627013452359ab69694cd446615a'
      }
    })
      .delete('/accounts/account-1/addresses/address-1')
      .reply(204)

    return ElasticPath.AccountAddresses.Delete({
      account: 'account-1',
      address: 'address-1'
    }).then(response => {
      assert.equal(response, '{}')
    })
  })

  it('should delete a account address using a JWT', () => {
    // Intercept the API request
    nock(apiUrl, {
      reqheaders: {
        Authorization: 'Bearer a550d8cbd4a4627013452359ab69694cd446615a',
        'EP-ACCOUNT-MANAGEMENT-AUTHENTICATION-TOKEN': 'testtoken'
      }
    })
      .delete('/accounts/account-1/addresses/address-1')
      .reply(204)

    return ElasticPath.AccountAddresses.Delete({
      account: 'account-1',
      address: 'address-1',
      token: 'testtoken'
    }).then(response => {
      assert.equal(response, '{}')
    })
  })

  it('should return an array of attributes', () => {
    nock(apiUrl, {
      reqheaders: {
        Authorization: 'Bearer a550d8cbd4a4627013452359ab69694cd446615a'
      }
    })
      .get('/addresses/attributes')
      .reply(200, attributeResponse)

    return ElasticPath.AccountAddresses.Attributes('testtoken').then(
      response => {
        assert.lengthOf(response.data, 3)
      }
    )
  })
})
