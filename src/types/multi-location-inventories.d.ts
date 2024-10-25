/**
 * Multi Location Inventory
 */
import { LocationsEndpoint } from './mli-locations'
import { Identifiable, Resource, ResourcePage } from './core'

/**
 * Multi Location Inventory Types
 */
export type InventoryResourceType = 'stock'

/**
 * Base Types
 */
export interface Timestamps {
  created_at: string
  updated_at: string
}

/**
 * Location-specific inventory quantities
 */
export interface LocationQuantities {
  available: number
  allocated: number
  total: number
}

/**
 * Create Operation Types
 */
export interface LocationCreateQuantity {
  available: number
}

export interface StockCreate {
  available?: number
  locations?: {
    [locationId: string]: LocationCreateQuantity
  }
}

/**
 * Update Operation Types
 */
export interface LocationUpdateQuantity {
  allocated?: number
  available?: number
}

export interface StockUpdate {
  locations?: {
    [locationId: string]: LocationUpdateQuantity | null
  }
}

/**
 * Response Types
 */
export interface StockLocationsMap {
  [locationId: string]: LocationQuantities
}

export interface StockAttributes {
  allocated: number
  available: number
  total: number
  locations: StockLocationsMap
}

export interface StockResponse extends Identifiable {
  type: InventoryResourceType
  attributes: StockAttributes
  timestamps: Timestamps
}

export interface MultiLocationInventoryFilter {
  eq?: {
    locations?: string
  }
}

/**
 * Multi Location Inventories Endpoint Interface
 */
export interface MultiLocationInventoriesEndpoint {
  endpoint: 'inventory'
  Locations: LocationsEndpoint

  /**
   * Get Stock for all Products
   */
  All(): Promise<ResourcePage<StockResponse>>

  /**
   * Get Stock for Product
   * @param inventoryId - The inventory identifier
   */
  Get(inventoryId: string): Promise<Resource<StockResponse>>

  /**
   * Create Stock for Product
   * @param payload - Initial stock information with overall availability or per-location quantities
   * @param productId - Optional product identifier
   */
  Create(
    payload: StockCreate,
    productId?: string
  ): Promise<Resource<StockResponse>>

  /**
   * Update Stock for Product
   * @param inventoryId - The inventory identifier
   * @param payload - Location-specific updates. Set location to null to remove it
   */
  Update(
    inventoryId: string,
    payload: StockUpdate
  ): Promise<Resource<StockResponse>>

  /**
   * Delete Stock for Product
   * @param inventoryId - The inventory identifier
   */
  Delete(inventoryId: string): Promise<{}>

  Limit(value: number): MultiLocationInventoriesEndpoint

  Offset(value: number): MultiLocationInventoriesEndpoint

  Filter(filter: MultiLocationInventoryFilter): MultiLocationInventoriesEndpoint
}
