/**
 * Promotions Builder
 * Description:Promotions allow you to provide discounts to customers.
 * A Promotion can be automatic which is applied provided any criteria are satisfied,
 * or require codes, which are then used by the end user to get a discount.
 */
import {
  CrudQueryableResource,
  Identifiable,
  ResourceList,
  ResourcePage,
  Resource
} from './core'

export interface ActionLimitation {
  max_discount?: number
  max_quantity?: number
  items?: {
    max_items?: number
    price_strategy?: string
  }
}

export interface ActionCondition {
  strategy: string
  operator?: string
  args?: any[]
  children?: {
    strategy?: string
    operator?: string
    args?: any[]
  }[]
}

export interface Action {
  strategy: string
  args: any[]
  limitations?: ActionLimitation
  condition?: ActionCondition
}

export interface Condition {
  strategy: string
  operator?: string
  args?: any[]
  children?: Condition[]
}

/**
 * Promotions Builder
 * Description:Base Promotion Type
 */
export interface RulePromotionBase {
  type: 'rule_promotion'
  name: string
  description?: string
  enabled: boolean
  automatic?: boolean
  start: string
  end: string
  stackable: boolean
  priority?: number | null | undefined
  rule_set: {
    currencies: string[]
    catalog_ids: string[]
    rules: Condition
    actions: Action[]
  }
}

export interface RulePromotionMeta {
  timestamps: {
    created_at: string
    updated_at: string
  }
}

export interface RulePromotion extends Identifiable, RulePromotionBase {
  meta: RulePromotionMeta
}

export interface RulePromotionCode {
  code: string
  uses?: number
  user?: string
  created_by?: string
  max_uses?: number
  meta?: RulePromotionMeta
  consume_unit?: 'per_application' | 'per_checkout'
}

export interface RulePromotionCodesJob {
  type: 'promotion_job'
  job_type: 'code_generate' | 'code_export'
  name?: string
  parameters?: {
    number_of_codes: number
    consume_unit?: 'per_cart' | 'per_item'
    code_prefix?: string
    max_uses_per_code?: number
    code_length: number
  }
}

export interface RulePromotionJob extends Identifiable {
  type: string
  id: string
  promotion_id: string
  job_type: string
  name?: string
  parameters?: {
    number_of_codes: number
    consume_unit?: 'per_cart' | 'per_item'
    max_uses_per_code?: number
    code_length: number
    code_prefix?: string
  }
  status: 'pending' | 'processing' | 'completed' | 'failed'
  meta: {
    timestamps: {
      created_at: string
      updated_at: string
    }
  }
}

export interface DeleteRulePromotionCodes extends ResourceList<any> {
  code: string
}

export interface RulePromotionFilter {
  eq?: {
    job_type?: string
    code?: string
  }
}

export interface CodeFileHref {
  href: string
}

export interface RulePromotionsEndpoint
  extends CrudQueryableResource<
    RulePromotion,
    RulePromotionBase,
    Partial<RulePromotionBase>,
    RulePromotionFilter,
    never,
    never
  > {
  endpoint: 'rule-promotions'

  Filter(filter: RulePromotionFilter): RulePromotionsEndpoint

  Codes(promotionId: string): Promise<ResourcePage<RulePromotionCode>>

  Jobs(promotionId: string): Promise<ResourcePage<RulePromotionJob>>

  AddCodes(
    promotionId: string,
    codes: RulePromotionCode[]
  ): Promise<Resource<RulePromotionBase>>

  AddCodesJob(
    promotionId: string,
    body: RulePromotionCodesJob
  ): Promise<Resource<RulePromotionJob>>

  CancelJob(promotionId: string, jobId: string): Promise<{}>

  DeleteCode(promotionId: string, codeId: string): Promise<{}>

  DeleteCodes(
    promotionId: string,
    codes: DeleteRulePromotionCodes[]
  ): Promise<{}>

  GetCodeExportFile(promotionId:string, jobId: string): Promise<CodeFileHref>
}
