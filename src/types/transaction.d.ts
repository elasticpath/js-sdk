/**
 * Transactions
 * Description: Each product has its own Inventory and stock history.
 * This is useful when auditing product movements across your project.
 * DOCS: https://documentation.elasticpath.com/commerce-cloud/docs/api/payments/transactions.html
 */
import {
  Identifiable,
  Relationship,
  Resource,
  ResourceList,
  ResourcePage
} from './core'

export interface TransactionsResponse {
  data: {
    id: string
    type: string
    reference: string
    gateway: string
    amount: number
    currency: string
    transaction_type: string
    status: string
    relationships: {
      order: {
        data: {
          type: string
          id: string
        }
      }
      timestamps?: {
        created_at: string
        updated_at: string
      }
    }
    meta: {
      display_price: {
        amount: number
        currency: string
        formatted: string
      }
      timestamps: {
        created_at: string
        updated_at: string
      }
      display_refunded_amount?: {
        total: {
          amount: number
          currency: string
          formatted: string
        }
      }
    }
    next_actions?: string[]
    payment_details?: {
      detailed_status?: string
    }
  }
}

/**
 * Core Transaction Base Interface
 * DOCS: https://documentation.elasticpath.com/commerce-cloud/docs/api/payments/transactions.html#the-transaction-object
 */
export interface TransactionBase {
  type: string
  reference: string
  gateway: string
  amount: number
  currency: string
  refunded_amount: number
  refund_mechanism?: 'automatic' | 'manual'
  transaction_type: 'purchase' | 'capture' | 'authorize' | 'refund'
  status: 'complete' | 'failed' | 'pending' | 'cancelled'
  relationships: any
  failure_details?: { code?: string; reason?: string }
  meta: {
    display_price: {
      amount: number
      currency: string
      formatted: string
    }
    timestamps: {
      created_at: string
      updated_at: string
    }
    display_refunded_amount?: {
      total: {
        amount: number
        currency: string
        formatted: string
      }
    }
  }
  payment_details?: {
    detailed_status?: string
  }
  timestamps: any
  next_actions?: string[]
}

export interface Transaction extends Identifiable, TransactionBase {}

/**
 * Text is 1 to 250 characters. A transaction can have at most 50 notes.
 */
export interface TransactionNoteBody {
  text: string
}

export interface TransactionNote extends Identifiable, TransactionNoteBody {
  type: 'note'
  relationships: {
    transaction: Relationship<'transaction'>
  }
  meta: {
    timestamps: {
      created_at: string
      updated_at: string
    }
    created_by: string
    updated_by: string
  }
}

/**
 * Transaction Endpoints
 * Get All DOCS: https://documentation.elasticpath.com/commerce-cloud/docs/api/payments/transactions.html#get-get-all-transactions
 * Get single DOCS: https://documentation.elasticpath.com/commerce-cloud/docs/api/payments/transactions.html#get-get-single-transaction
 * Capture DOCS: https://documentation.elasticpath.com/commerce-cloud/docs/api/payments/transactions.html#post-capture-payment
 * Refund DOCS: https://documentation.elasticpath.com/commerce-cloud/docs/api/payments/transactions.html#post-refund-payment
 * Cancel DOCS: https://documentation.elasticpath.com/commerce-cloud/docs/api/payments/transactions/cancel-a-pending-transaction.html
 * Notes are admin only; shopper tokens are rejected.
 */
export interface TransactionEndpoint {
  endpoint: 'transaction'

  All(options: { order: string }): Promise<ResourceList<Transaction>>

  Get(options: {
    order: string
    transaction: string
  }): Promise<TransactionsResponse>

  Capture(options: {
    order: string
    transaction: string
  }): Promise<TransactionsResponse>

  Refund(
    options: {
      order: string
      transaction: string
    },
    body?: { amount: number }
  ): Promise<TransactionsResponse>

  Cancel(
    options: {
      order: string
      transaction: string
    },
    body?: {
      reason: 'duplicate' | 'fraudulent' | 'requested_by_customer' | 'abandoned'
    }
  ): Promise<TransactionsResponse>

  /**
   * List the notes on a transaction, newest first. `limit` is at most 100.
   */
  AllNotes(options: {
    order: string
    transaction: string
    limit?: number
    offset?: number
  }): Promise<ResourcePage<TransactionNote>>

  GetNote(options: {
    order: string
    transaction: string
    note: string
  }): Promise<Resource<TransactionNote>>

  CreateNote(
    options: {
      order: string
      transaction: string
    },
    body: TransactionNoteBody
  ): Promise<Resource<TransactionNote>>

  UpdateNote(
    options: {
      order: string
      transaction: string
      note: string
    },
    body: TransactionNoteBody
  ): Promise<Resource<TransactionNote>>

  Limit(value: number): TransactionEndpoint

  Offset(value: number): TransactionEndpoint
}
