/**
 * Commerce Extensions
 * Description: Commerce Extensions allows for the creation of Custom APIs that can manage large, private data sets efficiently, offering both simple and complex multidimensional filtering options.
 * DOCS: https://elasticpath.dev/docs/commerce-cloud/commerce-extensions/overview
 */

import { Identifiable, Resource, ResourcePage } from './core';

export interface Presentation {
  sort_order: number
}
export interface CustomApiBase {
  name: string
  description: string
  api_type: string
  type: string
  slug: string
  allow_upserts: boolean
}

export interface CustomApi extends Identifiable, CustomApiBase {
  links: {
    self: string
  }
  meta: {
    timestamps: {
      created_at: string
      updated_at: string
    }
  }
}

// ============================================================================
// Field Types & Validation
// ============================================================================

/** All supported field types */
export type FieldType = 'string' | 'integer' | 'float' | 'boolean' | 'any' | 'list'

/** Common validation options shared by all field types */
export interface CommonValidationOptions {
  allow_null_values?: boolean
  immutable?: boolean
}

/** Validation options for string fields */
export interface StringValidationOptions extends CommonValidationOptions {
  min_length?: number | null
  max_length?: number | null
  regex?: string | null
  unique: 'yes' | 'no'
  unique_case_insensitivity?: boolean
}

/** Validation options for integer fields */
export interface IntegerValidationOptions extends CommonValidationOptions {
  min_value?: number | null
  max_value?: number | null
}

/** Validation options for float fields */
export interface FloatValidationOptions extends CommonValidationOptions {
  min_value?: number | null
  max_value?: number | null
}

/** Validation options for boolean fields */
export interface BooleanValidationOptions extends CommonValidationOptions {}

/** Validation options for any fields */
export interface AnyValidationOptions extends CommonValidationOptions {}

/** Validation options for list fields */
export interface ListValidationOptions extends CommonValidationOptions {
  allowed_type?: 'any' | 'string' | 'integer' | 'float' | 'boolean'
  min_length?: number | null
  max_length?: number | null
}

/** Maps field types to their validation options for programmatic access */
export type ValidationOptionsMap = {
  string: StringValidationOptions
  integer: IntegerValidationOptions
  float: FloatValidationOptions
  boolean: BooleanValidationOptions
  any: AnyValidationOptions
  list: ListValidationOptions
}

/**
 * Union type matching the API response shape.
 * Each variant has a single key matching the field type.
 */
export type CustomFieldValidation =
  | { string: StringValidationOptions }
  | { integer: IntegerValidationOptions }
  | { float: FloatValidationOptions }
  | { boolean: BooleanValidationOptions }
  | { any: AnyValidationOptions }
  | { list: ListValidationOptions }

// ============================================================================
// Custom API Fields
// ============================================================================

/** Common properties shared by all field types */
interface CustomApiFieldCommon {
  name: string
  description: string
  type: string
  slug: string
  use_as_url_slug: boolean
  presentation?: Presentation
}

/**
 * Discriminated union for field base types.
 * Narrowing on `field_type` gives you the correctly typed `validation`.
 */
export type CustomApiFieldBase =
  | (CustomApiFieldCommon & { field_type: 'string'; validation?: { string: StringValidationOptions } })
  | (CustomApiFieldCommon & { field_type: 'integer'; validation?: { integer: IntegerValidationOptions } })
  | (CustomApiFieldCommon & { field_type: 'float'; validation?: { float: FloatValidationOptions } })
  | (CustomApiFieldCommon & { field_type: 'boolean'; validation?: { boolean: BooleanValidationOptions } })
  | (CustomApiFieldCommon & { field_type: 'any'; validation?: { any: AnyValidationOptions } })
  | (CustomApiFieldCommon & { field_type: 'list'; validation?: { list: ListValidationOptions } })

/** Full field type with ID and metadata (from API response) */
export type CustomApiField = Identifiable & CustomApiFieldBase & {
  links: {
    self: string
  }
  meta: {
    timestamps: {
      created_at: string
      updated_at: string
    }
  }
}
export interface CustomApisEndpoint {
  endpoint: 'settings/extensions/custom-apis'
  entriesEndpoint: 'extensions'

  All(token?: string): Promise<ResourcePage<CustomApi>>

  Get(id: string, token?: string): Promise<Resource<CustomApi>>

  Filter(filter: any): CustomApisEndpoint

  Limit(value: number): CustomApisEndpoint

  Offset(value: number): CustomApisEndpoint

  Sort(value: string): CustomApisEndpoint

  Create(body: CustomApiBase): Promise<Resource<CustomApi>>

  Update(
    id: string,
    body: Partial<CustomApiBase>,
    token?: string
  ): Promise<Resource<CustomApi>>

  Delete(id: string): Promise<{}>

  GetFields<T = any>(customApiId: string): Promise<T>
  
  GetField<T = any>(customApiId: string, customApiFieldId:string): Promise<T>

  CreateField<RequestBody = CustomApiFieldBase, ResponseBody = CustomApiField>(
    customApiId: string,
    body: RequestBody
  ): Promise<ResponseBody>

  UpdateField<RequestBody = CustomApiFieldBase, ResponseBody = CustomApiField>(
    customApiId: string,
    customApiFieldId: string,
    body: RequestBody
  ): Promise<ResponseBody>

  DeleteField<T = any>(customApiId: string, customApiFieldId: string): Promise<T>
  
  GetEntries<T = any>(customApiId: string): Promise<T>

  GetEntry<T = any>(customApiId: string, customApiEntryId: string): Promise<T>

  CreateEntry<RequestBody = any, ResponseBody = any>(
    customApiId: string,
    body: RequestBody
  ): Promise<ResponseBody>

  UpdateEntry<RequestBody = any, ResponseBody = any>(
    customApiId: string,
    customApiEntryId: string,
    body: RequestBody
  ): Promise<ResponseBody>

  DeleteEntry<T = any>(customApiId: string, customApiEntryId: string): Promise<T>

  GetEntriesBySlug<T = any>(slug: string): Promise<T>

  GetEntryBySlug<T = any>(slug: string, entryId: string): Promise<T>

  CreateEntryBySlug<RequestBody = any, ResponseBody = any>(
    slug: string,
    body: RequestBody
  ): Promise<ResponseBody>

  UpdateEntryBySlug<RequestBody = any, ResponseBody = any>(
    slug: string,
    entryId: string,
    body: RequestBody
  ): Promise<ResponseBody>

  DeleteEntryBySlug<T = any>(slug: string, entryId: string): Promise<T>

  Filter(filter: any): CustomApisEndpoint
  Limit(value: number): CustomApisEndpoint
  Offset(value: number): CustomApisEndpoint
  Sort(value: string): CustomApisEndpoint
}
