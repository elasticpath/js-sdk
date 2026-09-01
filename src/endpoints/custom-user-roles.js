import CRUDExtend from '../extends/crud'

import { buildURL } from '../utils/helpers'

function withQuotedName(filter) {
  const name = filter && filter.eq ? filter.eq.name : undefined
  if (name === undefined || name === null) return filter

  return {
    ...filter,
    eq: {
      ...filter.eq,
      name: `"${encodeURIComponent(
        String(name)
          .replace(/\\/g, '\\\\')
          .replace(/"/g, '\\"')
      )}"`
    }
  }
}

class CustomUserRolesEndpoint extends CRUDExtend {
  constructor(endpoint) {
    super(endpoint)

    this.endpoint = 'permissions'
  }

  GetCustomUserRoles({ limit, offset, filter, sort } = {}) {
    return this.request.send(
      buildURL(`${this.endpoint}/custom-user-roles`, {
        limit: limit !== undefined ? limit : this.limit,
        offset: offset !== undefined ? offset : this.offset,
        filter: withQuotedName(filter !== undefined ? filter : this.filter),
        sort: sort !== undefined ? sort : this.sort
      }),
      'GET',
      undefined,
      undefined,
      this
    )
  }

  GetCustomUserRole(roleId) {
    return this.request.send(
      `${this.endpoint}/custom-user-roles/${roleId}`,
      'GET',
      undefined,
      undefined,
      this
    )
  }

  CreateCustomUserRole(body) {
    return this.request.send(
      `${this.endpoint}/custom-user-roles`,
      'POST',
      body,
      undefined,
      this
    )
  }

  UpdateCustomUserRole(roleId, body) {
    return this.request.send(
      `${this.endpoint}/custom-user-roles/${roleId}`,
      'PUT',
      body,
      undefined,
      this
    )
  }

  DeleteCustomUserRole(roleId) {
    return this.request.send(
      `${this.endpoint}/custom-user-roles/${roleId}`,
      'DELETE',
      undefined,
      undefined,
      this
    )
  }
}

export default CustomUserRolesEndpoint
