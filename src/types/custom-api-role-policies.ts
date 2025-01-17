import { Resource } from './core'

export interface BuiltInRolePolicy {
  id: string
  type: 'built_in_role'
  links: {
    self: string
  }
  name: string
  cm_user_assignable: boolean
}

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
    custom_api: {
      data: {
        type: 'custom_api'
        id: string
      }
    }
    role: {
      data: {
        type: 'built_in_role'
        id: string
      }
    }
  }
}

export interface CustomApiRolePolicy {
  id: string
  type: 'custom_api_role_policy'
  relationships: {
    custom_api: {
      data: {
        type: 'custom_api'
        id: string
      }
    }
    role: {
      data: {
        type: 'built_in_role'
        id: string
      }
    }
  }
  links: {
    self: string
  }
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
  }): Promise<Resource<Array<CustomApiRolePolicy>>>

  GetBuiltInRoles(): Promise<Resource<Array<BuiltInRolePolicy>>>

  DeleteCustomApiRolePolicy(policyId: string): Promise<void>
}
