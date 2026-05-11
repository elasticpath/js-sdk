import CRUDExtend from '../extends/crud'

import { buildURL } from '../utils/helpers'

class CustomApiRolePoliciesEndpoint extends CRUDExtend {
  constructor(endpoint) {
    super(endpoint)

    this.endpoint = 'permissions'
  }

  CreateCustomApiRolePolicy(body) {
    return this.request.send(
      `${this.endpoint}/custom-api-role-policies`,
      'POST',
      body
    )
  }

  UpdateCustomApiRolePolicy(policyId, body) {
    return this.request.send(
      `${this.endpoint}/custom-api-role-policies/${policyId}`,
      'PUT',
      body
    )
  }

  GetCustomApiRolePolicies({ customApiId, include } = {}) {
    const { limit, offset, sort } = this

    return this.request.send(
      buildURL(`${this.endpoint}/custom-api-role-policies`, {
        filter: { eq: { custom_api_id: customApiId } },
        ...(include === 'role' && { include }),
        limit,
        offset,
        sort
      }),
      'GET'
    )
  }

  GetStandardUserRoles() {
    return this.request.send(
      `${this.endpoint}/standard-user-roles`,
      'GET'
    )
  }

  GetStandardShopperRoles() {
    return this.request.send(
      `${this.endpoint}/standard-shopper-roles`,
      'GET'
    )
  }

  DeleteCustomApiRolePolicy(policyId) {
    return this.request.send(
      `${this.endpoint}/custom-api-role-policies/${policyId}`,
      'DELETE'
    )
  }
}

export default CustomApiRolePoliciesEndpoint
