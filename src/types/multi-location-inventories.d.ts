/**
 * Multi Location Inventory
 */
import { LocationsEndpoint } from './mli-locations'
import { Identifiable, Resource, ResourcePage } from './core'

type StockType = 'stock'

export interface StockMeta {
  timestamps: {
    created_at: string
    updated_at: string
  }
}

export interface StockBaseLocations {
  [key: string]: {
    available: number
  }
}

export interface StockBaseAttributes {
  product_id: string
  locations: StockBaseLocations
}

export interface StockResponseLocations {
  [key: string]: {
    available: number
    allocated: number
    total: number
  }
}
export interface StockResponseAttributes extends StockBaseAttributes {
  allocated: number
  total: number
  locations: StockResponseLocations
}

export interface StockResponse extends Identifiable, StockMeta {
  type: StockType
  attributes: StockResponseAttributes
}

/**
 * Multi Location Inventories Endpoints
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
   * @param productId The ID of the product.
   */
  Get(productId: string): Promise<Resource<StockResponse>>

  /**
   * Create Stock for Product
   * @param body - The base attributes of the inventory stock.
   */
  Create(body: StockBaseAttributes): Promise<Resource<StockResponse>>

  /**
   * Delete Stock for Product
   * @param productId The ID of the product.
   */
  Delete(productId: string): Promise<{}>

  Limit(value: number): MultiLocationInventoriesEndpoint

  Offset(value: number): MultiLocationInventoriesEndpoint
}
