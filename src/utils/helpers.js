import { pluralize, underscore } from 'inflected'
import {
  DEFAULT_CART_KEY,
  DEFAULT_CREDENTIALS_KEY,
  DEFAULT_CURRENCY_KEY
} from './constants'
import { formatQueryString } from './formatQueryString'

export function buildRelationshipData(type, ids, typeModifier = underscore) {
  let data = []

  if (ids === null || ids.length === 0) return data

  if (typeof ids === 'string') {
    const obj = { type: typeModifier(type), id: ids }

    return [obj]
  }

  if (Array.isArray(ids)) {
    data = ids.map(item => {
      if (typeof item === 'object' && item !== null) {
        return {
          type: typeModifier(type),
          ...item
        }
      }
      return {
        type: typeModifier(type),
        id: item
      }
    })
  }

  return data
}

export function formatUrlResource(type) {
  if (type === 'main-image') return type

  return pluralize(type)
}

export function createCartIdentifier() {
  return 'xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx'.replace(/[x]/g, () =>
    ((Math.random() * 16) | 0).toString(16)
  )
}

export function resolveCurrencyStorageKey(name) {
  return name ? `${name}_ep_currency` : DEFAULT_CURRENCY_KEY
}

export function resolveCartStorageKey(name) {
  return name ? `${name}_ep_cart` : DEFAULT_CART_KEY
}

export function cartIdentifier(storage, name) {
  const cartId = createCartIdentifier()
  const cartStorageKey = resolveCartStorageKey(name)

  const cartStorageValue = storage.get(cartStorageKey)

  if (cartStorageValue !== null && cartStorageValue !== undefined) {
    return storage.get(cartStorageKey)
  }

  storage.set(cartStorageKey, cartId)

  return cartId
}

export function tryParseJSON(body, fallback) {
  try {
    return JSON.parse(body)
  } catch (err) {
    return fallback
  }
}

export function parseJSON(response) {
  return new Promise(resolve => {
    response.text().then(body => {
      resolve({
        status: response.status,
        ok: response.ok,
        json: tryParseJSON(body, '{}')
      })
    })
  })
}

function buildQueryParams({ includes, sort, limit, offset, filter, useTemplateSlugs, total_method }) {
  const query = {}

  if (includes) {
    query.include = includes
  }

  if (sort) {
    query.sort = `${sort}`
  }

  if (limit !== undefined && limit !== null) {
    query.limit = `[limit]=${limit}`
  }

  if (offset) {
    query.offset = `[offset]=${offset}`
  }

  if (filter) {
    query.filter = filter
  }

  if(useTemplateSlugs) {
    query.useTemplateSlugs = useTemplateSlugs
  }

  if(total_method) {
    query.total_method = total_method
  }

  return Object.keys(query)
    .map(k => formatQueryString(k, query[k]))
    .join('&')
}

export function formatQueryParams(query) {
  return Object.keys(query)
    .map(k => formatQueryString(k, query[k]))
    .join('&')
}

export function buildURL(endpoint, params) {
  if (
    params.includes ||
    params.sort ||
    (params.limit !== undefined && params.limit !== null) ||
    params.offset ||
    params.filter ||
    params.useTemplateSlugs ||
    params.total_method
  ) {
    const paramsString = buildQueryParams(params)

    return `${endpoint}?${paramsString}`
  }
  return endpoint
}

export function buildRequestBody(body) {
  let parsedBody
  if (body) {
    if (body.options) {
      parsedBody = `{
        "data": ${JSON.stringify(body.data)},
        "options" : ${JSON.stringify(body.options)}
      }`
    } else {
      parsedBody = `{
        "data": ${JSON.stringify(body)}
      }`
    }
  }

  return parsedBody
}

/**
 * TODO Parameters should be reordered in the next major release
 */
export function buildCartItemData(
  id,
  quantity = null, // eslint-disable-line default-param-last
  type = 'cart_item', // eslint-disable-line default-param-last
  flows,
  isSku = false
) {
  const payload = {
    type,
    ...flows
  }

  if (type === 'cart_item') {
    if (isSku)
      Object.assign(payload, {
        sku: id,
        quantity: parseInt(quantity, 10)
      })
    else
      Object.assign(payload, {
        id,
        quantity: parseInt(quantity, 10)
      })
  }

  if (type === 'promotion_item') {
    Object.assign(payload, {
      code: id
    })
  }

  return payload
}

export function buildCartCheckoutData(
  customer,
  billing_address,
  shipping_address,
  isAccountMemberCheckout = false
) {
  let parsedCustomer = customer

  if (typeof customer === 'string') parsedCustomer = { id: customer }

  const data = {
    billing_address,
    shipping_address
  }

  if (isAccountMemberCheckout) {
    data.contact = parsedCustomer
  } else {
    data.customer = parsedCustomer
  }

  return data
}

export function resetProps(instance) {
  const inst = instance
  ;['includes', 'sort', 'limit', 'offset', 'filter'].forEach(
    e => delete inst[e]
  )
}

export function getCredentials(storage, storageKey) {
  return JSON.parse(storage.get(storageKey) ?? null)
}

export function resolveCredentialsStorageKey(name) {
  return name ? `${name}_ep_credentials` : DEFAULT_CREDENTIALS_KEY
}

export function tokenInvalid({ storage, client_id, reauth, name }) {
  const credentials = getCredentials(
    storage,
    resolveCredentialsStorageKey(name)
  )

  const handleInvalid = message => {
    /* eslint-disable no-console */
    const logger = reauth ? console.info : console.error
    logger(message)

    return true
  }

  if (!credentials)
    return handleInvalid('Token status: credentials do not exist')

  if (!credentials.access_token)
    return handleInvalid('Token status: credentials missing access_token')

  if (credentials.client_id !== client_id)
    return handleInvalid('Token status: client_id mismatch')


  if (Math.floor(Date.now() / 1000) >= credentials.expires)
    return handleInvalid('Token status: credentials expired')

  return false
}

export function isNode() {
  return (
    typeof process !== 'undefined' &&
    process.versions != null &&
    process.versions.node != null
  )
}
