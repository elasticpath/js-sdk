/**
 * Multi Location Inventory
 */
import { LocationsEndpoint } from './mli-locations'
import { Identifiable, Resource, ResourceList, ResourcePage } from './core'
import { Inventory, InventoryActionTypes } from './inventory'
import { InventoryResponse } from './inventory'

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

export interface MultiLocationInventoryResponse extends Identifiable {
  type: string
  attributes: {
    action: InventoryActionTypes
    product_id: string
    quantity: number
  }
  meta: {
    timestamps: {
      created_at: string
    }
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

  /**
   * Increment Stock
   * @param productId The ID for the product you're performing this action on.
   * @param quantity The amount of stock affected by this transaction.
   * @param location The slug of the location that the transaction should act on.
   */
  IncrementStock(
    productId: string,
    quantity: number,
    location?: string
  ): Promise<Resource<MultiLocationInventoryResponse>>

  /**
   * Decrement Stock
   * @param productId The ID for the product you're performing this action on.
   * @param quantity The amount of stock affected by this transaction.
   * @param location The slug of the location that the transaction should act on.
   */
  DecrementStock(
    productId: string,
    quantity: number,
    location?: string
  ): Promise<Resource<MultiLocationInventoryResponse>>

  /**
   * Allocate Stock
   * @param productId The ID for the product you're performing this action on.
   * @param quantity The amount of stock affected by this transaction.
   * @param location The slug of the location that the transaction should act on.
   */
  AllocateStock(
    productId: string,
    quantity: number,
    location?: string
  ): Promise<Resource<MultiLocationInventoryResponse>>

  /**
   * Deallocate Stock
   * @param productId The ID for the product you're performing this action on.
   * @param quantity The amount of stock affected by this transaction.
   * @param location The slug of the location that the transaction should act on.
   */
  DeallocateStock(
    productId: string,
    quantity: number,
    location?: string
  ): Promise<Resource<MultiLocationInventoryResponse>>

  /**
   * Set Stock
   * @param productId The ID for the product you're performing this action on.
   * @param quantity The amount of stock affected by this transaction.
   * @param location The slug of the location that the transaction should act on.
   */
  SetStock(
    productId: string,
    quantity: number,
    location?: string
  ): Promise<Resource<MultiLocationInventoryResponse>>

  /**
   * Get Transactions
   * @param productId The ID for the product you're performing this action on.
   */
  GetTransactions(
    productId: string
  ): Promise<ResourceList<MultiLocationInventoryResponse>>

  /**
   * Get Transaction
   * @param productId The ID for the product you're performing this action on.
   * @param transactionId The ID for the transaction created on the product.
   */
  GetTransaction(
    productId: string,
    transactionId: string
  ): Promise<Resource<MultiLocationInventoryResponse>>

  /**
   * Get Stocks for Multiple Products
   * @param productIds The array of unique identifier of the products.
   */
  GetMultipleStock(productIds: string[]): Promise<ResourceList<StockResponse>>
}
