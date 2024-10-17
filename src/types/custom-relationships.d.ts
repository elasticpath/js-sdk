/**
 * Custom Relationships
 * Description: Custom Relationships
 */

import {
  Identifiable,
  ResourceList,
  Resource
} from './core'

export interface CustomRelationshipBaseAttributes {
  name: string
  description?: string
  slug: string
  bi_directional: boolean
}

export interface CustomRelationshipBase {
  type: 'custom-relationship'
  attributes: CustomRelationshipBaseAttributes
  meta: {
    owner: 'organization' | 'store'
    timestamps: {
      created_at: string
      updated_at: string
    }
  }
}

export interface CustomRelationship
  extends Identifiable,
    CustomRelationshipBase {}

export interface CreateCustomRelationshipBody
  extends Pick<CustomRelationshipBase, 'attributes'> {}

export interface UpdateCustomRelationshipBody
  extends Identifiable,
    Pick<CustomRelationshipBase, 'attributes'> {}

export interface CustomRelationshipsFilter {
  eq?: {
    owner?: 'organization' | 'store'
  }
}

export interface CustomRelationshipsListResponse
  extends ResourceList<CustomRelationship> {
  links?: { [key: string]: string | null } | {}
  meta: {
    results: {
      total: number
    }
  }
}

export interface CustomRelationshipsEndpoint {
  endpoint: 'custom-relationships'
  /**
   * List Custom Relationships
   */
  All(): Promise<CustomRelationshipsListResponse>

  /**
   * Get Custom Relationship
   * @param slug - The slug of the Custom Relationship. It should always be prefixed with 'CRP_'
   */
  Get(slug: string): Promise<Resource<CustomRelationship>>

  /**
   * Create Custom Relationship
   * @param body - The base attributes of the Custom Relationships
   */
  Create(
    body: CreateCustomRelationshipBody
  ): Promise<Resource<CustomRelationship>>

  /**
   * Update Custom Relationship
   * @param slug - The slug of the Custom Relationship. It should always be prefixed with 'CRP_'
   * @param body - The base attributes of the Custom Relationships.
   * The Slug attribute cannot be updated and the slug within this object should match this function's first argument.
   */
  Update(
    slug: string,
    body: UpdateCustomRelationshipBody
  ): Promise<Resource<CustomRelationship>>

  /**
   * Delete Custom Relationship
   * @param slug - The slug of the Custom Relationship. It should always be prefixed with 'CRP_'
   */
  Delete(slug: string): Promise<{}>

  /**
   * Custom Relationship filtering
   * @param filter - The filter object.
   * Currently supports the 'eq' filter operator for the 'owner' field of the Custom Relationship.
   */
  Filter(filter: CustomRelationshipsFilter): CustomRelationshipsEndpoint

  Limit(value: number): CustomRelationshipsEndpoint

  Offset(value: number): CustomRelationshipsEndpoint
}
