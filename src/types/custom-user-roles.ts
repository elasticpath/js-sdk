import { Resource, ResourcePage } from './core'

export interface CustomUserRole {
  id: string
  type: 'custom_user_role'
  name: string
  description?: string
  access_levels: Record<string, string>
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
export interface CreateCustomUserRoleBody {
  type: 'custom_user_role'
  name: string
  description: string
  access_levels: Record<string, string>
}

export interface UpdateCustomUserRoleBody {
  type: 'custom_user_role'
  name?: string
  description?: string
  access_levels?: Record<string, string>
}

export interface CustomUserRolesEndpoint {
  endpoint: 'permissions'

  GetCustomUserRoles(args?: {
    limit?: number
    offset?: number
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
