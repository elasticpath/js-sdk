import { assert } from 'chai'
import nock from 'nock'
import { gateway as ElasticPathGateway } from '../../src'

const apiUrl = 'https://euwest.api.elasticpath.com/v2'

const customUserRole = {
  id: 'role-1',
  type: 'custom_user_role',
  name: 'Inventory Controller',
  description: 'Manage all inventory operations.',
  access_levels: { orders: 'view', inventories: 'manage' },
  links: { self: `${apiUrl}/permissions/custom-user-roles/role-1` },
  meta: {
    timestamps: {
      created_at: '2026-08-17T14:26:35.966Z',
      updated_at: '2026-08-17T14:26:35.966Z'
    },
    owner: 'store'
  }
}

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
    const body = {
      type: 'custom_user_role' as const,
      name: 'Inventory Controller',
      description: 'Manage all inventory operations.',
      access_levels: { orders: 'view', inventories: 'manage' }
    }

    nock(apiUrl, {
      reqheaders: {
        Authorization: 'Bearer a550d8cbd4a4627013452359ab69694cd446615a'
      }
    })
      .post('/permissions/custom-user-roles', { data: body })
      .reply(201, { data: customUserRole })

    return ElasticPath.CustomUserRoles.CreateCustomUserRole(body).then(
      response => {
        assert.propertyVal(response.data, 'id', 'role-1')
      }
    )
  })

  it('should update a custom user role with a sparse body', () => {
    const body = {
      type: 'custom_user_role' as const,
      access_levels: { inventories: 'manage' }
    }

    nock(apiUrl, {
      reqheaders: {
        Authorization: 'Bearer a550d8cbd4a4627013452359ab69694cd446615a'
      }
    })
      .put('/permissions/custom-user-roles/role-1', { data: body })
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
