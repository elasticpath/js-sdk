import {
  CrudQueryableResource,
  Identifiable,
  Resource,
  ResourcePage
} from './core'

export interface AccountTagBase {
  type: string
  name: string
  description: string
}

export interface AccountTagMeta {
  timestamps: {
    created_at: string
    updated_at: string
  }
}

export interface AccountTag extends Identifiable, AccountTagBase {
  meta: AccountTagMeta
}

export interface AccountTagFilter {
  like?: {
    name?: string
  }
}

export interface AccountTagsEndpoint
  extends CrudQueryableResource<
    AccountTag,
    AccountTagBase,
    AccountTagBase,
    AccountTagFilter,
    never,
    never
  > {
  endpoint: 'account-tags'

  Create(body: AccountTagBase): Promise<Resource<AccountTag>>

  All(token?: string, headers?): Promise<ResourcePage<AccountTag>>

  Get(accountTagId: string, token?: string): Promise<Resource<AccountTag>>

  Update(
    accountTagId: string,
    body: AccountTagBase
  ): Promise<Resource<AccountTag>>

  Delete(accountTagId: string): Promise<{}>
}
