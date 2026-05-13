import { Resource, ResourceList } from './core'

export interface StandardUserRole {
  id: string
  type: 'standard_user_role'
  links: { self: string }
  name: string
}

export interface StandardShopperRole {
  id: string
  type: 'standard_shopper_role'
  links: { self: string }
  name: string
}

export type StandardRole = StandardUserRole | StandardShopperRole
export type StandardRoleType = StandardRole['type']

export type IncludedRole = Omit<StandardRole, 'links'>

export interface CustomApiRolePolicyBase {
  data: {
    type: 'custom_api_role_policy'
    create: boolean
    list: boolean
    read: boolean
    update: boolean
    delete: boolean
  }
}

export interface CustomApiRolePolicyRequestBody {
  type: 'custom_api_role_policy'
  create: boolean
  list: boolean
  read: boolean
  update: boolean
  delete: boolean
  relationships: {
    custom_api: { data: { type: 'custom_api'; id: string } }
    role: { data: { type: StandardRoleType; id: string } }
  }
}

export interface CustomApiRolePolicy {
  id: string
  type: 'custom_api_role_policy'
  relationships: {
    custom_api: { data: { type: 'custom_api'; id: string } }
    role: { data: { type: StandardRoleType; id: string } }
  }
  links: { self: string }
  meta: {
    timestamps: {
      created_at: string
      updated_at: string
    }
  }
  create: boolean
  list: boolean
  read: boolean
  update: boolean
  delete: boolean
}

export interface CustomApiRolePoliciesIncluded {
  role: IncludedRole[]
}

export interface CustomApiRolePoliciesResponse extends ResourceList<CustomApiRolePolicy> {
  included?: CustomApiRolePoliciesIncluded
}

export interface CustomApiRolePoliciesEndpoint {
  endpoint: 'permissions'

  CreateCustomApiRolePolicy(
    body: CustomApiRolePolicyRequestBody
  ): Promise<Resource<CustomApiRolePolicy>>

  UpdateCustomApiRolePolicy(
    policyId: string,
    body: CustomApiRolePolicyBase
  ): Promise<Resource<CustomApiRolePolicy>>

  GetCustomApiRolePolicies(args: {
    customApiId: string
    include?: 'role'
  }): Promise<CustomApiRolePoliciesResponse>

  GetStandardUserRoles(): Promise<ResourceList<StandardUserRole>>

  GetStandardShopperRoles(): Promise<ResourceList<StandardShopperRole>>

  DeleteCustomApiRolePolicy(policyId: string): Promise<void>
}
