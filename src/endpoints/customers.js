import CRUDExtend from '../extends/crud'
import { buildURL } from '../utils/helpers'

class CustomersEndpoint extends CRUDExtend {
  constructor(endpoint) {
    super(endpoint)

    this.endpoint = 'customers'

    this.sendToken = (tokenRequestBody, headers = {}) =>
      this.request.send(
        `${this.endpoint}/tokens`,
        'POST',
        tokenRequestBody,
        null,
        {
          ...headers
        }
      )
  }

  TokenViaPassword(email, password, headers) {
    const body = {
      type: 'token',
      authentication_mechanism: 'password',
      email,
      password
    }

    return this.sendToken(body, headers)
  }

  TokenViaOIDC(code, redirectUri, codeVerifier, headers) {
    const body = {
      type: 'token',
      authentication_mechanism: 'oidc',
      oauth_authorization_code: code,
      oauth_redirect_uri: redirectUri,
      oauth_code_verifier: codeVerifier
    }

    return this.sendToken(body, headers)
  }

  Token(email, password) {
    return this.TokenViaPassword(email, password)
  }

  TotalMethod(totalMethod) {
    this.total_method = totalMethod
    return this
  }

  All(token = null) {
    const { includes, sort, limit, offset, filter, total_method } = this

    this.call = this.request.send(
      buildURL(this.endpoint, {
        includes,
        sort,
        limit,
        offset,
        filter,
        ...(total_method && { total_method })
      }),
      'GET',
      undefined,
      token,
      this
    )

    this.total_method = undefined

    return this.call
  }
}
export default CustomersEndpoint
