/**
 * Products
 * Description: Products are the core resource to any Commerce Cloud project. They can be associated by category, collection, brands, and more.
 */
import {
  Identifiable,
  CrudQueryableResource,
  Resource,
  ResourcePage
} from './core'

  /**
   * Core PCM Product Base Interface
   * For custom flows, extend this interface
   */
export interface RuleBase {
  type: 'catalog_rule'
  attributes: {
    name: string
    description?: string
    catalog_id: string
    account_ids?: string[]
    customer_ids?: string[]
    channels?: string[]
    tags?: string[]
    pricebook_ids?: string[]
    schedules?: {valid_from: string, valid_to: string}[]
  }
}

export interface Rule extends Identifiable, RuleBase  {
  links: {
    self: string
  }
}

// Do Not have any relationships yet //TODO

export interface RuleFilterAttributes {
  id?: string
  catalog_id?: string
  account_ids?: string
  customer_ids?: string
  channels?: string
  tags?: string
  pricebook_ids?: string
}

export interface RuleFilter {
  eq?: RuleFilterAttributes
  in?: Pick<RuleFilterAttributes, 'pricebook_ids'>
}

type RuleSort = // TODO
| ''

type RuleInclude = // TODO
| ''

export interface RuleUpdateBody extends RuleBase {
  id: string
}

export type RuleValidationMatchType =
  | 'filter'
  | 'similarity'
  | 'conflict'
  | 'resolve_for_shopper'

export interface RuleValidationCriteria {
  channels?: string[]
  tags?: string[]
  account_ids?: string[]
  account_tag_ids?: string[]
  customer_ids?: string[]
}

export interface CatalogRuleValidatorRequest {
  data: {
    type: 'catalog_rule_validator'
    match_type: RuleValidationMatchType
    catalog_id?: string
    pricebook_ids?: string[]
    schedules?: { valid_from: string; valid_to: string }[]
    attributes?: RuleValidationCriteria
  }
}

export interface RuleMeta {
  similarity_score?: number
  active?: boolean
  resolved_for_shopper?: boolean
  release_id?: string
}

export interface ValidatedRule extends Rule {
  meta?: RuleMeta
}

export type ValidateRulesResponse = ResourcePage<ValidatedRule>

export interface CatalogsRulesEndpoint
extends CrudQueryableResource<Rule, RuleBase, RuleUpdateBody, RuleFilter, RuleSort, RuleInclude> {
  endpoint: 'rules'
  id: string

  /**
   * Validate Catalog Rules
   * @param body - validation request describing the match_type and rule criteria.
   * @param token - optional customer token.
   */
  Validate(body: CatalogRuleValidatorRequest, token?: string): Promise<ValidateRulesResponse>
}
