import { Resource, ResourcePage } from './core'

export type AccessLevel = 'none' | 'view' | 'manage'

/**
 * The permission groups a custom user role grants access to.
 *
 * Every group is required on create. Composer, Legacy Catalogs, Metrics,
 * Custom Actions and Team accept a narrower set of levels than the rest —
 * Custom Actions and Team only ever 'none' for a custom user role, though
 * standard user roles may hold higher levels for them.
 */
export type AccessLevels = {
  accounts: AccessLevel
  application_keys: AccessLevel
  authentication: AccessLevel
  catalog_releases: AccessLevel
  catalog_search: AccessLevel
  catalogs: AccessLevel
  composer: 'none' | 'manage'
  content_and_pages: AccessLevel
  currencies: AccessLevel
  custom_actions: 'none'
  custom_apis: AccessLevel
  flows: AccessLevel
  inventories: AccessLevel
  legacy_catalogs: 'none' | 'manage'
  metrics: 'none' | 'view'
  orders: AccessLevel
  payment_gateways: AccessLevel
  personal_data: AccessLevel
  price_books: AccessLevel
  products: AccessLevel
  promotions: AccessLevel
  settings: AccessLevel
  subscription_billing: AccessLevel
  subscription_jobs: AccessLevel
  subscription_offerings: AccessLevel
  subscription_subscribers: AccessLevel
  team: 'none'
  webhooks: AccessLevel
}

export interface CustomUserRole {
  id: string
  type: 'custom_user_role'
  name: string
  description?: string
  access_levels: AccessLevels
  links: { self: string }
  meta: {
    timestamps: {
      created_at: string
      updated_at: string
    }
    owner: string
  }
}

// Create rejects a missing or null description; an empty string is accepted.
// Every permission group is required, so access_levels must be complete.
export interface CreateCustomUserRoleBody {
  type: 'custom_user_role'
  name: string
  description: string
  access_levels: AccessLevels
}

// Update merges into the stored role, so any subset may be sent. Omitted
// permission groups keep their current level.
export interface UpdateCustomUserRoleBody {
  type: 'custom_user_role'
  name?: string
  description?: string
  access_levels?: Partial<AccessLevels>
}

export interface CustomUserRoleFilter {
  eq?: {
    name?: string
  }
}

export interface CustomUserRolesEndpoint {
  endpoint: 'permissions'

  GetCustomUserRoles(args?: {
    limit?: number
    offset?: number
    filter?: CustomUserRoleFilter
    sort?: string
  }): Promise<ResourcePage<CustomUserRole>>

  GetCustomUserRole(roleId: string): Promise<Resource<CustomUserRole>>

  CreateCustomUserRole(
    body: CreateCustomUserRoleBody
  ): Promise<Resource<CustomUserRole>>

  UpdateCustomUserRole(
    roleId: string,
    body: UpdateCustomUserRoleBody
  ): Promise<Resource<CustomUserRole>>

  DeleteCustomUserRole(roleId: string): Promise<void>
}
