import { Resource, ResourcePage } from './core'

/**
 * The resources the Extended Attribute Registry accepts definitions for.
 * A store may hold up to 100 order definitions and 10 order item definitions,
 * and up to 10 searchable definitions for each resource type.
 */
export type ExtendedAttributeResourceType = 'order' | 'order_item'

export type ExtendedAttributeFieldType =
  | 'string'
  | 'integer'
  | 'float'
  | 'boolean'
  | 'date'

export interface ExtendedAttributeBaseValidation {
  allow_null_values: boolean
  immutable: boolean
}

/**
 * Lengths are counted in UTF-8 bytes. Every allowed value must satisfy the
 * length bounds and the regex, which uses RE2 syntax.
 */
export interface ExtendedAttributeStringValidation
  extends ExtendedAttributeBaseValidation {
  min_length: number | null
  max_length: number | null
  regex: string | null
  allowed_values: string[] | null
}

/**
 * Integer bounds must stay within ±9007199254740991 (Number.MAX_SAFE_INTEGER).
 */
export interface ExtendedAttributeNumberValidation
  extends ExtendedAttributeBaseValidation {
  min_value: number | null
  max_value: number | null
}

/**
 * The response always holds the block that matches the field type, with every
 * key present.
 */
export type ExtendedAttributeValidation =
  | { string: ExtendedAttributeStringValidation }
  | { integer: ExtendedAttributeNumberValidation }
  | { float: ExtendedAttributeNumberValidation }
  | { boolean: ExtendedAttributeBaseValidation }
  | { date: ExtendedAttributeBaseValidation }

/**
 * A validation block in a request. Keys left out keep their stored value on
 * update, or their default on create; null clears a rule. Keys the field type
 * does not support are dropped without an error.
 */
export type ExtendedAttributeValidationInput =
  | { string: Partial<ExtendedAttributeStringValidation> }
  | { integer: Partial<ExtendedAttributeNumberValidation> }
  | { float: Partial<ExtendedAttributeNumberValidation> }
  | { boolean: Partial<ExtendedAttributeBaseValidation> }
  | { date: Partial<ExtendedAttributeBaseValidation> }

export interface ExtendedAttributeDefinition {
  id: string
  type: 'extended_attribute'
  resource_type: ExtendedAttributeResourceType
  name: string
  description: string
  /** Lowercase letters, digits, underscores and hyphens, 1 to 63 characters. */
  slug: string
  field_type: ExtendedAttributeFieldType
  searchable: boolean
  validation: ExtendedAttributeValidation
  links?: { self?: string }
  meta: {
    timestamps: {
      created_at: string
      updated_at: string
    }
  }
}

/**
 * `description` is required but may be empty. A slug that is already used for
 * the resource type returns 409.
 */
export interface CreateExtendedAttributeBody {
  name: string
  description: string
  slug: string
  field_type: ExtendedAttributeFieldType
  searchable: boolean
  validation?: ExtendedAttributeValidationInput | null
}

/**
 * Update merges into the stored definition, so any subset may be sent.
 * `slug` and `field_type` cannot change. Sending `validation: null` resets
 * every rule to its default.
 */
export interface UpdateExtendedAttributeBody {
  name?: string
  description?: string
  searchable?: boolean
  validation?: ExtendedAttributeValidationInput | null
}

export type ExtendedAttributeSortField =
  | 'id'
  | 'created_at'
  | 'updated_at'
  | 'name'
  | 'slug'
  | 'field_type'

/** A field name for ascending order, or the name with a `-` prefix for descending. */
export type ExtendedAttributeSort =
  | ExtendedAttributeSortField
  | `-${ExtendedAttributeSortField}`

interface ExtendedAttributeRangeFilterFields {
  id?: string
  /** An RFC 3339 date time with milliseconds, for example 2026-01-01T00:00:00.000Z. */
  created_at?: string
  /** An RFC 3339 date time with milliseconds, for example 2026-01-01T00:00:00.000Z. */
  updated_at?: string
}

/**
 * The registry rejects any other field or operator with a 400, including
 * filters on `description`. `like` takes `*` as a wildcard.
 */
export interface ExtendedAttributeFilter {
  eq?: ExtendedAttributeRangeFilterFields & {
    name?: string
    slug?: string
    field_type?: ExtendedAttributeFieldType
  }
  lt?: ExtendedAttributeRangeFilterFields
  le?: ExtendedAttributeRangeFilterFields
  gt?: ExtendedAttributeRangeFilterFields
  ge?: ExtendedAttributeRangeFilterFields
  like?: {
    name?: string
    slug?: string
  }
  in?: {
    id?: string[]
    slug?: string[]
    field_type?: ExtendedAttributeFieldType[]
  }
}

export interface ExtendedAttributesEndpoint {
  endpoint: 'settings/extensions/extended-attributes'

  /**
   * Returns one page of definitions, newest first by default. `limit` may be
   * at most 100.
   */
  GetExtendedAttributes(
    resourceType: ExtendedAttributeResourceType,
    args?: {
      limit?: number
      offset?: number
      filter?: ExtendedAttributeFilter
      sort?: ExtendedAttributeSort
    }
  ): Promise<ResourcePage<ExtendedAttributeDefinition>>

  GetExtendedAttribute(
    resourceType: ExtendedAttributeResourceType,
    id: string
  ): Promise<Resource<ExtendedAttributeDefinition>>

  CreateExtendedAttribute(
    resourceType: ExtendedAttributeResourceType,
    body: CreateExtendedAttributeBody
  ): Promise<Resource<ExtendedAttributeDefinition>>

  UpdateExtendedAttribute(
    resourceType: ExtendedAttributeResourceType,
    id: string,
    body: UpdateExtendedAttributeBody
  ): Promise<Resource<ExtendedAttributeDefinition>>

  DeleteExtendedAttribute(
    resourceType: ExtendedAttributeResourceType,
    id: string
  ): Promise<void>
}
