import { assert } from 'chai'
import nock from 'nock'
import { gateway as ElasticPathGateway } from '../../src'

const apiUrl = 'https://euwest.api.elasticpath.com/v2'

describe('ElasticPath Account Authentication Settings', () => {
  const ElasticPath = ElasticPathGateway({
    client_id: 'XXX'
  })

  it('Get all Account Settings', () => {
    nock(apiUrl, {}).get('/settings/account-authentication').reply(200, {})

    return ElasticPath.AccountAuthenticationSettings.Get().then(res => {
      assert.isObject(res)
    })
  })

  it('should update account authentication settings', () => {
    nock(apiUrl, {
      reqheaders: {
        Authorization: 'Bearer a550d8cbd4a4627013452359ab69694cd446615a'
      }
    })
      .put('/settings/account-authentication', {
        data: {
          type: 'account_authentication_settings',
          enable_self_signup: true,
          auto_create_account_for_account_members: true,
          account_management_authentication_token_timeout_secs: 200,account_member_self_management: 'update_only'
        }
      })
      .reply(200, {
        data: {
          id: '775c934a-b54b-4846-9a7e-21844f4700a4',
          type: 'account_authentication_settings',
          enable_self_signup: true,
          auto_create_account_for_account_members: true,
          account_member_self_management: 'update_only',account_management_authentication_token_timeout_secs: 200,
          relationships: {
            authentication_realm: {
              data: {
                id: '775c934a-b54b-4846-9a7e-21844f4700a5',
                type: 'authentication_realm'
              }
            }
          },
          meta: {
            client_id: 'account-management'
          }
        }
      })
    const body = {
      type: 'account_authentication_settings',
      enable_self_signup: true,
      auto_create_account_for_account_members: true,
      account_management_authentication_token_timeout_secs: 200,
      account_member_self_management: 'update_only'
    }

    return ElasticPath.AccountAuthenticationSettings.Update(body).then(
      response => {
        assert.deepEqual(response, {
          data: {
            id: '775c934a-b54b-4846-9a7e-21844f4700a4',
            type: 'account_authentication_settings',
            enable_self_signup: true,
            auto_create_account_for_account_members: true,
            account_management_authentication_token_timeout_secs: 200,account_member_self_management: 'update_only',
            relationships: {
              authentication_realm: {
                data: {
                  id: '775c934a-b54b-4846-9a7e-21844f4700a5',
                  type: 'authentication_realm'
                }
              }
            },
            meta: {
              client_id: 'account-management'
            }
          }
        })
      }
    )
  })
})
