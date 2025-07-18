import BaseExtend from '../extends/base'
import { buildURL } from '../utils/helpers'

class AccountTagsEndpoint extends BaseExtend {
  Create(body, token = null) {
    return this.request.send(`account-tags`, 'POST', body, token, this)
  }

  All(token = null) {
    const { limit, offset, filter } = this

    this.call = this.request.send(
      buildURL(`account-tags`, {
        limit,
        offset,
        filter
      }),
      'GET',
      undefined,
      token,
      this
    )

    return this.call
  }

  Get(accountTagId, token = null) {
    return this.request.send(
      `account-tags/${accountTagId}`,
      'GET',
      undefined,
      token
    )
  }

  Update(accountTagId, body, token = null) {
    return this.request.send(`account-tags/${accountTagId}`, 'PUT', body, token)
  }

  Delete(accountTagId, token = null) {
    return this.request.send(
      `account-tags/${accountTagId}`,
      'DELETE',
      undefined,
      token
    )
  }
}

export default AccountTagsEndpoint
