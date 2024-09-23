/**
 * Inventory Locations
 */
import { Identifiable, Resource, ResourcePage } from './core'

type InventoryLocationType = 'inventory_location'

export interface GeolocationDetails {
  lat: number
  lon: number
}
export interface LocationAttributes {
  name: string
  external_ref?: string
  description?: string
  address: string[]
  geolocation: GeolocationDetails
}
export interface LocationMeta {
  timestamps: {
    created_at: string
    updated_at: string
  }
}

/**
 * Core Location Base Interface
 */
export interface LocationBase {
  type: InventoryLocationType
  attributes: LocationAttributes
  meta: LocationMeta
}

export interface Location extends Identifiable, LocationBase {}

export interface CreateLocationBody extends LocationAttributes {}

export interface UpdateLocationBody extends Identifiable, LocationAttributes {}

/**
 * Location Endpoints
 */
export interface LocationsEndpoint {
  endpoint: 'inventory/locations'

  /**
   * List All Locations
   */
  All(): Promise<ResourcePage<Location>>

  /**
   * Get Location
   * @param locationId - The ID of the Location.
   */
  Get(locationId: string): Promise<Resource<Location>>

  /**
   * Create Location
   * @param body - The base attributes of the Locations
   */
  Create(body: CreateLocationBody): Promise<Resource<Location>>

  /**
   * Update Location
   * @param locationId - The ID of the Location.
   * @param body - The base attributes of the Locations.
   */
  Update(
    locationId: string,
    body: UpdateLocationBody
  ): Promise<Resource<Location>>

  /**
   * Delete Location
   * @param locationId - The ID of the Location.
   */
  Delete(locationId: string): Promise<{}>

  Limit(value: number): LocationsEndpoint

  Offset(value: number): LocationsEndpoint
}
