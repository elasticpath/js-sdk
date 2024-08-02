/**
 * Subscription Invoices
 * Description: Invoices represent the amount a customer owes for a subscription.
 * Elastic Path Subscriptions generates an invoice for every period in a subscription billing cycle.
 * DOCS: https://elasticpath.dev/docs/api/subscriptions/invoices
 */
import {
  Identifiable,
  CrudQueryableResource,
  Resource,
  ResourceList,
  ResourcePage
} from './core'
import { ItemTaxObject } from './cart'
import { Price } from './price'

interface SubscriptionInvoiceItemPrice extends Omit<Price, 'includes_tax'> {
  includes_tax?: boolean
}

interface SubscriptionInvoiceItem {
  description: string
  price: SubscriptionInvoiceItemPrice
  product_id?: string
  from_time_period?: string
  until_time_period?: string
}

/**
 * Core Subscription Invoice Base Interface
 * For custom flows, extend this interface
 * DOCS: https://elasticpath.dev/docs/api/subscriptions/get-invoice#responses
 */

export interface SubscriptionInvoiceBase {
  type: 'subscription_invoice'
  attributes: {
    billing_period: {
      start: string
      end: string
    }
    invoice_items: SubscriptionInvoiceItem[]
    tax_items?: ItemTaxObject[]
    outstanding: boolean
    number?: number
    tax_required: boolean
    payment_retries_limit_reached: boolean
    updated_at?: string
    created_at?: string
  }
}

interface ProrationEvent {
  proration_policy_id: string
  billing_cost_before_proration: number
  refunded_amount_for_unused_plan: number
  new_plan_cost: number
  prorated_at: string
}

export interface SubscriptionInvoice
  extends Identifiable,
    SubscriptionInvoiceBase {
  meta: {
    owner: 'store' | 'organization'
    subscription_id?: string
    subscriber_id?: string
    price?: SubscriptionInvoiceItemPrice
    timestamps: {
      updated_at: string
      created_at: string
      taxes_added_at?: string
    }
    prorated_at: ProrationEvent[]
  }
}

/**
 * Core Subscription Invoice Payments Base Interface
 * DOCS: https://elasticpath.dev/docs/api/subscriptions/get-invoice-payment#responses
 */

export interface SubscriptionInvoicePaymentBase {
  type: 'subscription_invoice_payment'
  attributes: {
    success: boolean
    gateway: string
    external_payment_id?: string
    failure_detail?: {
      reason?: string
    }
    amount: SubscriptionInvoiceItemPrice
  }
}

export interface SubscriptionInvoicePayment
  extends Identifiable,
    SubscriptionInvoicePaymentBase {
  meta: {
    owner: 'store' | 'organization'
    subscription_id: string
    invoice_id: string
    job_id: string
    timestamps: {
      updated_at: string
      created_at: string
      payment_taken_at?: string
    }
  }
}

/**
 * Subscription Invoice Filtering
 * DOCS: https://elasticpath.dev/docs/api/subscriptions/list-invoices#filtering
 */
export interface SubscriptionInvoiceFilter {
  eq?: {
    subscriber_id?: string
    subscription_id?: string
    outstanding?: string
    tax_required?: string
  }
}

/**
 * Subscription Invoice Endpoints
 * DOCS: https://elasticpath.dev/docs/api/subscriptions/list-invoices
 */
export interface SubscriptionInvoicesEndpoint {
  endpoint: 'invoices'

  /**
   * List Invoices
   * DOCS: https://elasticpath.dev/docs/api/subscriptions/list-invoices
   * @constructor
   */
  All(): Promise<ResourcePage<SubscriptionInvoice>>

  /**
   * Get Invoice
   * DOCS: https://elasticpath.dev/docs/api/subscriptions/get-invoice
   * @param id - The ID of the invoice.
   * @constructor
   */
  Get(id: string): Promise<Resource<SubscriptionInvoice>>

  /**
   * List Invoice Payments
   * DOCS: https://elasticpath.dev/docs/api/subscriptions/list-invoice-payments
   * @param invoiceId - The ID of the invoice to get the payments for.
   * @constructor
   */
  GetPayments(
    invoiceId: string
  ): Promise<ResourceList<SubscriptionInvoicePayment>>

  /**
   * Get Invoice Payment
   * DOCS: https://elasticpath.dev/docs/api/subscriptions/get-invoice-payment
   * @param invoiceId - The ID of the invoice to get the payment for.
   * @param paymentId - The ID of the payment.
   * @constructor
   */
  GetPayment(
    invoiceId: string,
    paymentId: string
  ): Promise<Resource<SubscriptionInvoicePayment>>

  /**
   * Subscription Invoice Filtering
   * DOCS: https://elasticpath.dev/docs/api/subscriptions/list-invoices#filtering
   */
  Filter(filter: SubscriptionInvoiceFilter): SubscriptionInvoicesEndpoint

  Limit(value: number): SubscriptionInvoicesEndpoint

  Offset(value: number): SubscriptionInvoicesEndpoint
}
