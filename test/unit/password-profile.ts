import { assert } from 'chai'
import nock from 'nock'
import { gateway as ElasticPathGateway } from '../../src'

const apiUrl = 'https://euwest.api.elasticpath.com/v2'

describe('Password Profiles', () => {
  const ElasticPath = ElasticPathGateway({
    client_id: 'XXX'
  })

  const realmId = '96764ca9-af12-4355-acce-37fa2ef4728a'

  it('Read All User Authentication Password Profile Info', () => {
    nock(apiUrl, {})
      .get(/\/authentication-realms\/(.*)\/password-profiles/)
      .reply(200, {})

    return ElasticPath.PasswordProfile.All(realmId).then(res => {
      assert.isObject(res)
    })
  })

  it('Get a single Password Profile', () => {
    nock(apiUrl, {})
      .get(/\/authentication-realms\/(.*)\/password-profiles\/(.*)/)
      .reply(200, {})

    return ElasticPath.PasswordProfile.Get({
      realmId,
      profileId: '4da65e78-7f9b-4248-b498-823d43120da9'
    }).then(res => {
      assert.isObject(res)
    })
  })

  it('Create a single Password Profile', () => {
    nock(apiUrl, {})
      .post(/\/authentication-realms\/(.*)\/password-profiles/)
      .reply(201, {})

    const body = {
      username_format: 'email',
      name: 'password profile',
      type: 'password_profile'
    }

    return ElasticPath.PasswordProfile.Create(realmId, { data: body }).then(
      res => {
        assert.isObject(res)
      }
    )
  })

  it('Update a single Password Profile', () => {
    nock(apiUrl, {})
      .put(/\/authentication-realms\/(.*)\/password-profiles\/(.*)/)
      .reply(201, {})

    const body = {
      username_format: 'any',
      type: 'password_profile',
      name: 'updated password profile'
    }

    const profileId = 'e1b5c7fa-f2b6-48d2-b659-3d82f20968a9'

    return ElasticPath.PasswordProfile.Update(realmId, profileId, {
      data: body
    }).then(res => {
      assert.isObject(res)
    })
  })

  it('Delete a single Password Profile', () => {
    nock(apiUrl, {})
      .delete(/\/authentication-realms\/(.*)\/password-profiles\/(.*)/)
      .reply(204)

    const profileId = '7e6645ef-0084-4928-b9b4-d2fe5577f70e'

    return ElasticPath.PasswordProfile.Delete(realmId, profileId).then(res => {
      assert.equal(res, '{}')
    })
  })
})
