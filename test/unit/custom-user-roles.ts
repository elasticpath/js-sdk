import { assert } from 'chai'
import nock from 'nock'
import { gateway as ElasticPathGateway } from '../../src'
import type {
  AccessLevels,
  CreateCustomUserRoleBody,
  CustomUserRole,
  UpdateCustomUserRoleBody
} from '../../src/types/custom-user-roles'

const apiUrl = 'https://euwest.api.elasticpath.com/v2'

// The API requires every permission group on create, so a complete set is the
// only valid starting point for a create body.
const accessLevels: AccessLevels = {
  accounts: 'none',
  application_keys: 'none',
  authentication: 'none',
  catalog_releases: 'none',
  catalog_search: 'none',
  catalogs: 'none',
  composer: 'none',
  content_and_pages: 'none',
  currencies: 'none',
  custom_actions: 'none',
  custom_apis: 'none',
  flows: 'none',
  inventories: 'manage',
  legacy_catalogs: 'none',
  metrics: 'none',
  orders: 'view',
  payment_gateways: 'none',
  personal_data: 'none',
  price_books: 'none',
  products: 'none',
  promotions: 'none',
  settings: 'none',
  subscription_billing: 'none',
  subscription_jobs: 'none',
  subscription_offerings: 'none',
  subscription_subscribers: 'none',
  team: 'none',
  webhooks: 'none'
}

const customUserRole: CustomUserRole = {
  id: 'role-1',
  type: 'custom_user_role',
  name: 'Inventory Controller',
  description: 'Manage all inventory operations.',
  access_levels: accessLevels,
  links: { self: `${apiUrl}/permissions/custom-user-roles/role-1` },
  meta: {
    timestamps: {
      created_at: '2026-08-17T14:26:35.966Z',
      updated_at: '2026-08-17T14:26:35.966Z'
    },
    owner: 'store'
  }
}

// Compile-time coverage: the API rejects these bodies, so the types should too.
// @ts-expect-error 'read' is not a valid access level
const invalidLevel: AccessLevels = { ...accessLevels, orders: 'read' }
// @ts-expect-error a custom user role may only hold 'none' for team
const invalidTeamLevel: AccessLevels = { ...accessLevels, team: 'manage' }
// @ts-expect-error metrics has no 'manage' level
const invalidMetricsLevel: AccessLevels = { ...accessLevels, metrics: 'manage' }
// @ts-expect-error inventores is not a permission group
const unknownGroup: AccessLevels = { ...accessLevels, inventores: 'view' }

void [invalidLevel, invalidTeamLevel, invalidMetricsLevel, unknownGroup]

describe('ElasticPath custom user roles', () => {
  const ElasticPath = ElasticPathGateway({
    client_id: 'XXX'
  })

  it('should return a page of custom user roles with pagination params', () => {
    nock(apiUrl, {
      reqheaders: {
        Authorization: 'Bearer a550d8cbd4a4627013452359ab69694cd446615a'
      }
    })
      .get('/permissions/custom-user-roles')
      .query({ 'page[limit]': '25', 'page[offset]': '50' })
      .reply(200, { data: [customUserRole] })

    return ElasticPath.CustomUserRoles.GetCustomUserRoles({
      limit: 25,
      offset: 50
    }).then(response => {
      assert.lengthOf(response.data, 1)
      assert.propertyVal(response.data[0], 'name', 'Inventory Controller')
    })
  })

  it('should filter custom user roles by exact name', () => {
    nock(apiUrl, {
      reqheaders: {
        Authorization: 'Bearer a550d8cbd4a4627013452359ab69694cd446615a'
      }
    })
      .get('/permissions/custom-user-roles')
      .query({ filter: 'eq(name,"Inventory Controller")' })
      .reply(200, { data: [customUserRole] })

    return ElasticPath.CustomUserRoles.GetCustomUserRoles({
      filter: { eq: { name: 'Inventory Controller' } }
    }).then(response => {
      assert.lengthOf(response.data, 1)
      assert.propertyVal(response.data[0], 'name', 'Inventory Controller')
    })
  })

  it('should escape quotes and encode reserved characters in the name', () => {
    nock(apiUrl, {
      reqheaders: {
        Authorization: 'Bearer a550d8cbd4a4627013452359ab69694cd446615a'
      }
    })
      .get('/permissions/custom-user-roles')
      // decodes server-side to eq(name,"Ops & \"Fulfilment\"")
      .query({ filter: 'eq(name,"Ops & \\"Fulfilment\\"")' })
      .reply(200, { data: [] })

    return ElasticPath.CustomUserRoles.GetCustomUserRoles({
      filter: { eq: { name: 'Ops & "Fulfilment"' } }
    }).then(response => {
      assert.lengthOf(response.data, 0)
    })
  })

  it('should sort custom user roles by name', () => {
    nock(apiUrl, {
      reqheaders: {
        Authorization: 'Bearer a550d8cbd4a4627013452359ab69694cd446615a'
      }
    })
      .get('/permissions/custom-user-roles')
      .query({ sort: '-name' })
      .reply(200, { data: [customUserRole] })

    return ElasticPath.CustomUserRoles.GetCustomUserRoles({
      sort: '-name'
    }).then(response => {
      assert.lengthOf(response.data, 1)
    })
  })

  it('should escape backslashes in the name', () => {
    nock(apiUrl, {
      reqheaders: {
        Authorization: 'Bearer a550d8cbd4a4627013452359ab69694cd446615a'
      }
    })
      .get('/permissions/custom-user-roles')
      // decodes server-side to eq(name,"Ops\\") — an escaped backslash
      // before the closing quote, not an escaped quote
      .query({ filter: 'eq(name,"Ops\\\\")' })
      .reply(200, { data: [] })

    return ElasticPath.CustomUserRoles.GetCustomUserRoles({
      filter: { eq: { name: 'Ops\\' } }
    }).then(response => {
      assert.lengthOf(response.data, 0)
    })
  })

  it('should not reuse a Filter() from a previous request', () => {
    nock(apiUrl, {
      reqheaders: {
        Authorization: 'Bearer a550d8cbd4a4627013452359ab69694cd446615a'
      }
    })
      .get('/permissions/custom-user-roles')
      .query({ filter: 'eq(name,"Inventory Controller")' })
      .reply(200, { data: [customUserRole] })
      .get('/permissions/custom-user-roles')
      .reply(200, { data: [customUserRole, customUserRole] })

    const roles = ElasticPath.CustomUserRoles as unknown as {
      Filter(filter: object): typeof ElasticPath.CustomUserRoles
    }

    return roles
      .Filter({ eq: { name: 'Inventory Controller' } })
      .GetCustomUserRoles()
      .then(() => ElasticPath.CustomUserRoles.GetCustomUserRoles())
      .then(response => {
        assert.lengthOf(response.data, 2)
      })
  })

  it('should not reuse a Filter() after fetching a single role', () => {
    nock(apiUrl, {
      reqheaders: {
        Authorization: 'Bearer a550d8cbd4a4627013452359ab69694cd446615a'
      }
    })
      .get('/permissions/custom-user-roles/role-1')
      .reply(200, { data: customUserRole })
      .get('/permissions/custom-user-roles')
      .reply(200, { data: [customUserRole, customUserRole] })

    const roles = ElasticPath.CustomUserRoles as unknown as {
      Filter(filter: object): typeof ElasticPath.CustomUserRoles
    }

    roles.Filter({ eq: { name: 'Inventory Controller' } })

    return ElasticPath.CustomUserRoles.GetCustomUserRole('role-1')
      .then(() => ElasticPath.CustomUserRoles.GetCustomUserRoles())
      .then(response => {
        assert.lengthOf(response.data, 2)
      })
  })

  it('should send the name filter alongside pagination', () => {
    nock(apiUrl, {
      reqheaders: {
        Authorization: 'Bearer a550d8cbd4a4627013452359ab69694cd446615a'
      }
    })
      .get('/permissions/custom-user-roles')
      .query({
        'page[limit]': '100',
        'page[offset]': '100',
        filter: 'eq(name,"Inventory Controller")'
      })
      .reply(200, { data: [customUserRole] })

    return ElasticPath.CustomUserRoles.GetCustomUserRoles({
      limit: 100,
      offset: 100,
      filter: { eq: { name: 'Inventory Controller' } }
    }).then(response => {
      assert.lengthOf(response.data, 1)
    })
  })

  it('should return all custom user roles without params', () => {
    nock(apiUrl, {
      reqheaders: {
        Authorization: 'Bearer a550d8cbd4a4627013452359ab69694cd446615a'
      }
    })
      .get('/permissions/custom-user-roles')
      .reply(200, { data: [customUserRole] })

    return ElasticPath.CustomUserRoles.GetCustomUserRoles().then(response => {
      assert.lengthOf(response.data, 1)
    })
  })

  it('should return a single custom user role', () => {
    nock(apiUrl, {
      reqheaders: {
        Authorization: 'Bearer a550d8cbd4a4627013452359ab69694cd446615a'
      }
    })
      .get('/permissions/custom-user-roles/role-1')
      .reply(200, { data: customUserRole })

    return ElasticPath.CustomUserRoles.GetCustomUserRole('role-1').then(
      response => {
        assert.propertyVal(response.data, 'id', 'role-1')
      }
    )
  })

  it('should create a custom user role passing the body through untouched', () => {
    const body: CreateCustomUserRoleBody = {
      type: 'custom_user_role',
      name: 'Inventory Controller',
      description: 'Manage all inventory operations.',
      access_levels: accessLevels
    }

    nock(apiUrl, {
      reqheaders: {
        Authorization: 'Bearer a550d8cbd4a4627013452359ab69694cd446615a'
      }
    })
      .post('/permissions/custom-user-roles', { data: { ...body } })
      .reply(201, { data: customUserRole })

    return ElasticPath.CustomUserRoles.CreateCustomUserRole(body).then(
      response => {
        assert.propertyVal(response.data, 'id', 'role-1')
      }
    )
  })

  it('should update a custom user role with a sparse body', () => {
    const body: UpdateCustomUserRoleBody = {
      type: 'custom_user_role',
      access_levels: { inventories: 'manage' }
    }

    nock(apiUrl, {
      reqheaders: {
        Authorization: 'Bearer a550d8cbd4a4627013452359ab69694cd446615a'
      }
    })
      .put('/permissions/custom-user-roles/role-1', { data: { ...body } })
      .reply(200, { data: customUserRole })

    return ElasticPath.CustomUserRoles.UpdateCustomUserRole(
      'role-1',
      body
    ).then(response => {
      assert.propertyVal(response.data, 'id', 'role-1')
    })
  })

  it('should delete a custom user role', () => {
    nock(apiUrl, {
      reqheaders: {
        Authorization: 'Bearer a550d8cbd4a4627013452359ab69694cd446615a'
      }
    })
      .delete('/permissions/custom-user-roles/role-1')
      .reply(204)

    return ElasticPath.CustomUserRoles.DeleteCustomUserRole('role-1').then(
      response => {
        assert.equal(response as unknown as string, '{}')
      }
    )
  })
})
