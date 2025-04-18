import { assert } from 'chai'
import nock from 'nock'
import { gateway as ElasticPathGateway } from '../../src'

const apiUrl = 'https://euwest.api.elasticpath.com/v2'

describe('User Authentication Password Profile Info', () => {
  const ElasticPath = ElasticPathGateway({
    client_id: 'XXX'
  })

  const realmId = '96764ca9-af12-4355-acce-37fa2ef4728a'
  const userAuthenticationId = '4da65e78-7f9b-4248-b498-823d43120da9'
  const userAuthenticationPasswordProfileId =
    '12a64ca9-af12-4355-acce-37fa2ef4728a'

  it('Read All User Authentication Password Profile Info', () => {
    nock(apiUrl, {})
      .get(
        /\/authentication-realms\/(.*)\/user-authentication-info\/(.*)\/user-authentication-password-profile-info/
      )
      .reply(200, {})

    return ElasticPath.UserAuthenticationPasswordProfile.All(
      realmId,
      userAuthenticationId
    ).then(res => {
      assert.isObject(res)
    })
  })

  it('Get a single User Authentication Password Profile Info', () => {
    nock(apiUrl, {})
      .get(
        /\/authentication-realms\/(.*)\/user-authentication-info\/(.*)\/user-authentication-password-profile-info\/(.*)/
      )
      .reply(200, {})

    return ElasticPath.UserAuthenticationPasswordProfile.Get(
      realmId,
      userAuthenticationId,
      userAuthenticationPasswordProfileId
    ).then(res => {
      assert.isObject(res)
    })
  })

  it('Create a single User Authentication Password Profile Info', () => {
    nock(apiUrl, {})
      .post(
        /\/authentication-realms\/(.*)\/user-authentication-info\/(.*)\/user-authentication-password-profile-info/
      )
      .reply(201, {})

    const body = {
      type: 'user_authentication_password_profile_info',
      password_profile_id: 'e1b5c7fa-f2b6-48d2-b659-3d82f20968a9',
      username: 'john.doe',
      password: 'password'
    }

    return ElasticPath.UserAuthenticationPasswordProfile.Create(
      realmId,
      userAuthenticationId,
      { data: body }
    ).then(res => {
      assert.isObject(res)
    })
  })

  it('Update a single User Authentication Password Profile Info', () => {
    nock(apiUrl, {})
      .put(
        /\/authentication-realms\/(.*)\/user-authentication-info\/(.*)\/user-authentication-password-profile-info\/(.*)/
      )
      .reply(201, {})

    const body = {
      id: userAuthenticationPasswordProfileId,
      type: 'user_authentication_password_profile_info',
      username: 'john.doe',
      password: 'password.new'
    }

    return ElasticPath.UserAuthenticationPasswordProfile.Update(
      realmId,
      userAuthenticationId,
      userAuthenticationPasswordProfileId,
      {
        data: body
      },
      null,
      'dummy-token'
    ).then(res => {
      assert.isObject(res)
    })
  })

  it('Delete a single User Authentication Password Profile Info', () => {
    nock(apiUrl, {})
      .delete(
        /\/authentication-realms\/(.*)\/user-authentication-info\/(.*)\/user-authentication-password-profile-info\/(.*)/
      )
      .reply(204)

    return ElasticPath.UserAuthenticationPasswordProfile.Delete(
      realmId,
      userAuthenticationId,
      userAuthenticationPasswordProfileId
    ).then(res => {
      assert.equal(res, '{}')
    })
  })
})
