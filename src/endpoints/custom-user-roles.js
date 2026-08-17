import CRUDExtend from '../extends/crud'

import { buildURL } from '../utils/helpers'

class CustomUserRolesEndpoint extends CRUDExtend {
  constructor(endpoint) {
    super(endpoint)

    this.endpoint = 'permissions'
  }

  GetCustomUserRoles({ limit, offset } = {}) {
    return this.request.send(
      buildURL(`${this.endpoint}/custom-user-roles`, {
        limit: limit !== undefined ? limit : this.limit,
        offset: offset !== undefined ? offset : this.offset
      }),
      'GET'
    )
  }

  GetCustomUserRole(roleId) {
    return this.request.send(
      `${this.endpoint}/custom-user-roles/${roleId}`,
      'GET'
    )
  }

  CreateCustomUserRole(body) {
    return this.request.send(`${this.endpoint}/custom-user-roles`, 'POST', body)
  }

  UpdateCustomUserRole(roleId, body) {
    return this.request.send(
      `${this.endpoint}/custom-user-roles/${roleId}`,
      'PUT',
      body
    )
  }

  DeleteCustomUserRole(roleId) {
    return this.request.send(
      `${this.endpoint}/custom-user-roles/${roleId}`,
      'DELETE'
    )
  }
}

export default CustomUserRolesEndpoint
