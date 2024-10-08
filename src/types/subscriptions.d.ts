/**
 * Subscriptions
 * Description: Subscriptions.
 * DOCS: TODO: add docs when ready
 */
import {
  Identifiable,
  CrudQueryableResource,
  Resource,
  ResourcePage
} from './core'
import {
  SubscriptionOfferingPlan,
  SubscriptionOfferingProduct
} from './subscription-offerings'
import { SubscriptionInvoice } from './subscription-invoices'

/**
 * Core Subscription Base Interface
 * For custom flows, extend this interface
 * DOCS: TODO: add docs when ready
 */
export interface SubscriptionBase {
  type: 'subscription'
  attributes: {
    external_ref?: string
    account_id: string
    offering: {
      id: string
      type: 'subscription_offering'
      attributes: {
        external_ref?: string
        name: string
        description: string
      }
      meta: {
        owner: string
        timestamps: {
          updated_at: string
          created_at: string
          canceled_at: string | null
        }
      }
    }
    plan_id: string
    currency: string
  }
}

export interface SubscriptionCreate {
  account_id: string
  offering_id: string
  plan_id: string
  currency: string
  meta?: {
    owner?: string
  }
}

export interface SubscriptionUpdate extends Identifiable {
  type: 'subscription'
  attributes: {
    plan_id: string
  }
}

export interface SubscriptionFilter {
  eq?: {
    account_id?: string
  }
}

export interface Subscription extends Identifiable, SubscriptionBase {
  relationships: {
    subscriber: {
      data: {
        id: string
        type: 'subscription_subscriber'
      }
    }
  }
  meta: {
    owner: string
    status: 'active' | 'inactive'
    canceled: boolean
    paused: boolean
    closed: boolean
    timestamps: {
      updated_at: string
      created_at: string
      canceled_at: string | null
    }
  }
}

export type SubscriptionsInclude = 'plans'

export type SubscriptionsStateAction = 'cancel' | 'pause' | 'resume'

export interface SubscriptionsIncluded {
  plans: SubscriptionOfferingPlan[]
}

/**
 * Subscription Endpoints
 * DOCS: TODO: add docs when ready
 */
export interface SubscriptionsEndpoint
  extends Omit<
    CrudQueryableResource<
      Subscription,
      SubscriptionCreate,
      SubscriptionUpdate,
      SubscriptionFilter,
      never,
      SubscriptionsInclude
    >,
    'All' | 'Attributes' | 'Link'
  > {
  endpoint: 'subscriptions'

  All(
    token?: string
  ): Promise<ResourcePage<Subscription, SubscriptionsIncluded>>

  GetInvoices(id: string): Promise<Resource<SubscriptionInvoice[]>>

  GetAttachedProducts(
    id: string
  ): Promise<Resource<SubscriptionOfferingProduct[]>>

  GetAttachedPlans(id: string): Promise<Resource<SubscriptionOfferingPlan[]>>

  CreateState(id: string, action: SubscriptionsStateAction): Promise<void>
}
