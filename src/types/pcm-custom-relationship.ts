/**
 * Product Custom Relationships
 */
import { Identifiable, SimpleResourcePageResponse } from './core'
import {
  CustomRelationship,
  CustomRelationshipsListResponse
} from './custom-relationships'
import { PcmProduct } from './pcm'

export interface PcmProductEntry extends Identifiable {
  type: 'product'
}

export interface CustomRelationshipEntry {
  type: 'custom-relationship'
  slug: string
}

export interface NonAssociatedProductEntry extends Identifiable {
    details: string
}

export interface ProductAssociationResponse {
  meta: {
    associated_products?: string[]
    products_not_associated?: NonAssociatedProductEntry[]
    owner: 'organization' | 'store'
    timestamps: {
      created_at: string
      updated_at: string
    }
  }
}

export interface PcmCustomRelationshipEndpoint {
  endpoint: 'custom-relationships'

  /**
   * Get all of a product's custom relationships
   * @param productId
   */
  All(productId: string): Promise<CustomRelationshipsListResponse>

  Limit(value: number): PcmCustomRelationshipEndpoint

  Offset(value: number): PcmCustomRelationshipEndpoint

  /**
   * Attach a custom relationship to a product
   * @param productId
   * @param body
   */
  AttachCustomRelationship(
    productId: string,
    body: CustomRelationshipEntry[]
  ): Promise<SimpleResourcePageResponse<CustomRelationship>>

  /**
   * Detach one or multiple custom relationships from a product
   * @param productId
   * @param body
   */
  DetachCustomRelationship(
    productId: string,
    body: CustomRelationshipEntry[]
  ): Promise<void>

  /**
   * Associate a product with other products under a custom relationship
   * @param productId
   * @param customRelationshipSlug
   * @param productsToAssociate
   * @returns
   */
  AssociateProductsToCustomRelationship(
    productId: string,
    customRelationshipSlug: string,
    productsToAssociate: PcmProductEntry[]
  ): Promise<ProductAssociationResponse>

  /**
   * Dissociate related products from a product under a custom relationship
   * @param productId
   * @param customRelationshipSlug
   * @param productsToDissociate
   */
  DissociateProductsFromCustomRelationship(
    productId: string,
    customRelationshipSlug: string,
    productsToDissociate: PcmProductEntry[]
  ): Promise<void>

  /**
   * Get all related products of a product under a custom relationship
   * @param productId
   * @param customRelationshipSlug
   */
  GetProductsForCustomRelationship(
    productId: string,
    customRelationshipSlug: string
  ): Promise<SimpleResourcePageResponse<PcmProduct>>

  /**
   * Get all IDs of a product's related products under a custom relationship
   * @param productId
   * @param customRelationshipSlug
   *  TODO CHECK RETURN VALUE
   */
  GetProductIdsForCustomRelationship(
    productId: string,
    customRelationshipSlug: string
  ): Promise<SimpleResourcePageResponse<PcmProductEntry>>
}
