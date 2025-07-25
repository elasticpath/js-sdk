// Type definitions for @elasticpath/js-sdk
// Project: @elasticpath/js-sdk
import {
  AuthenticateResponseBody,
  Config,
  ConfigOptions,
  RequestFactory
} from './types/config'
import { StorageFactory } from './types/storage'
import { ProductsEndpoint } from './types/product'
import { PcmProductsEndpoint } from './types/pcm'
import { CurrencyEndpoint } from './types/currency'
import { BrandEndpoint } from './types/brand'
import { CategoryEndpoint } from './types/category'
import { CollectionEndpoint } from './types/collection'
import { IntegrationEndpoint } from './types/integrations'
import { OrdersEndpoint } from './types/order'
import { GatewaysEndpoint } from './types/gateway'
import { CustomersEndpoint } from './types/customer'
import { InventoryEndpoint } from './types/inventory'
import { JobEndpoint } from './types/job'
import { PcmJobsEndpoint } from './types/pcm-jobs'
import { FileEndpoint } from './types/file'
import { FlowEndpoint } from './types/flow'
import { FieldsEndpoint } from './types/field'
import { CustomerAddressesEndpoint } from './types/customer-address'
import { TransactionEndpoint } from './types/transaction'
import { SettingsEndpoint } from './types/settings'
import { PromotionsEndpoint } from './types/promotions'
import { VariationsEndpoint } from './types/variations'
import { AuthenticationSettingsEndpoint } from './types/authentication-settings'
import { OidcProfileEndpoint } from './types/oidc-profile'
import { AuthenticationRealmEndpoint } from './types/authentication-realm'
import { CartEndpoint } from './types/cart'
import { HierarchiesEndpoint } from './types/hierarchies'
import { CatalogsEndpoint } from './types/catalogs'
import { CatalogsRulesEndpoint } from './types/catalogs-rules'
import { PriceBooksEndpoint } from './types/price-books'
import { MerchantRealmMappingsEndpoint } from './types/merchant-realm-mappings'
import { ShopperCatalogEndpoint } from './types/catalog'
import { AccountEndpoint } from './types/accounts'
import { AccountMembersEndpoint } from './types/account-members'
import { AccountAuthenticationSettingsEndpoint } from './types/account-authentication-settings'
import { AccountMembershipsEndpoint } from './types/account-memberships'
import { AccountAddressesEndpoint } from './types/account-address'
import { UserAuthenticationInfoEndpoint } from './types/user-authentication-info'
import { PasswordProfileEndpoint } from './types/password-profile'
import { PCMVariationsEndpoint } from './types/pcm-variations'
import { PcmVariationsRelationshipsEndpoint } from './types/pcm-variations-relationships'
import { UserAuthenticationPasswordProfileEndpoint } from './types/user-authentication-password-profile'
import { MetricsEndpoint } from './types/metrics'
import { PersonalDataEndpoint } from './types/personal-data'
import { DataEntriesEndpoint } from './types/data-entries'
import { ErasureRequestsEndpoint } from './types/erasure-requests'
import { PriceBookPriceModifierEndpoint } from './types/price-book-price-modifiers'
import { AccountMembershipSettingsEndpoint } from './types/account-membership-settings'
import { ApplicationKeysEndpoint } from './types/application-keys'
import { SubscriptionProductsEndpoint } from './types/subscription-products'
import { SubscriptionPlansEndpoint } from './types/subscription-plans'
import { SubscriptionOfferingsEndpoint } from './types/subscription-offerings'
import { OneTimePasswordTokenRequestEndpoint } from './types/one-time-password-token-request'
import { SubscriptionsEndpoint } from './types/subscriptions'
import { RulePromotionsEndpoint } from './types/rule-promotions'
import { SubscriptionSubscribersEndpoint } from './types/subscription-subscribers'
import { SubscriptionJobsEndpoint } from './types/subscription-jobs'
import { SubscriptionSchedulesEndpoint } from './types/subscription-schedules'
import { CustomApisEndpoint } from './types/custom-apis'
import { SubscriptionDunningRulesEndpoint } from './types/subscription-dunning-rules'
import { SubscriptionProrationPoliciesEndpoint } from './types/subscription-proration-policies'
import { SubscriptionInvoicesEndpoint } from './types/subscription-invoices'
import { CustomRelationshipsEndpoint } from './types/custom-relationships'
import { MultiLocationInventoriesEndpoint } from './types/multi-location-inventories'
import { CustomApiRolePoliciesEndpoint } from './types/custom-api-role-policies'
import { AccountTagsEndpoint } from './types/account-tags'

export * from './types/config'
export * from './types/storage'
export * from './types/price'
export * from './types/product'
export * from './types/core'
export * from './types/customer'
export * from './types/order'
export * from './types/cart'
export * from './types/address'
export * from './types/customer-address'
export * from './types/account-address'
export * from './types/inventory'
export * from './types/field'
export * from './types/nodes'
export * from './types/collection'
export * from './types/category'
export * from './types/brand'
export * from './types/currency'
export * from './types/pcm'
export * from './types/integrations'
export * from './types/hierarchies'
export * from './types/job'
export * from './types/pcm-jobs'
export * from './types/file'
export * from './types/flow'
export * from './types/transaction'
export * from './types/settings'
export * from './types/promotions'
export * from './types/catalog'
export * from './types/catalogs'
export * from './types/catalogs-nodes'
export * from './types/catalogs-products'
export * from './types/catalogs-releases'
export * from './types/catalogs-rules'
export * from './types/variations'
export * from './types/authentication-settings'
export * from './types/oidc-profile'
export * from './types/password-profile'
export * from './types/authentication-realm'
export * from './types/gateway'
export * from './types/price-books'
export * from './types/price-book-prices'
export * from './types/node-relationships'
export * from './types/merchant-realm-mappings'
export * from './types/pcm-file-relationship'
export * from './types/pcm-main-image-relationship'
export * from './types/pcm-template-relationship'
export * from './types/accounts'
export * from './types/account-authentication-settings'
export * from './types/account-members'
export * from './types/account-memberships'
export * from './types/account-membership-settings'
export * from './types/pcm-variations'
export * from './types/pcm-variations-relationships'
export * from './types/metrics'
export * from './types/personal-data'
export * from './types/data-entries'
export * from './types/erasure-requests'
export * from './types/price-book-price-modifiers'
export * from './types/user-authentication-info'
export * from './types/user-authentication-password-profile'
export * from './types/locales'
export * from './types/extensions'
export * from './types/application-keys'
export * from './types/subscription-products'
export * from './types/subscription-plans'
export * from './types/subscription-offerings'
export * from './types/one-time-password-token-request'
export * from './types/subscriptions'
export * from './types/rule-promotions'
export * from './types/custom-api-role-policies'
export * from './types/subscription-subscribers'
export * from './types/subscription-jobs'
export * from './types/subscription-schedules'
export * from './types/custom-apis'
export * from './types/subscription-dunning-rules'
export * from './types/subscription-proration-policies'
export * from './types/subscription-invoices'
export * from './types/custom-relationships'
export * from './types/pcm-custom-relationship'
export * from './types/mli-locations'
export * from './types/multi-location-inventories'
export * from './types/account-tags'

// UMD
export as namespace elasticpath

export class ElasticPath {
  config: Config
  cartId?: string
  request: RequestFactory
  storage: StorageFactory
  credentials: () => AuthenticateResponseBody | null
  Products: ProductsEndpoint
  PCM: PcmProductsEndpoint
  Catalogs: CatalogsEndpoint
  ShopperCatalog: ShopperCatalogEndpoint
  Rules: CatalogsRulesEndpoint
  PriceBooks: PriceBooksEndpoint
  Hierarchies: HierarchiesEndpoint
  Currencies: CurrencyEndpoint
  Brands: BrandEndpoint
  Categories: CategoryEndpoint
  Collections: CollectionEndpoint
  Integrations: IntegrationEndpoint
  Orders: OrdersEndpoint
  Gateways: GatewaysEndpoint
  Customers: CustomersEndpoint
  Inventories: InventoryEndpoint
  Jobs: JobEndpoint
  Files: FileEndpoint
  Flows: FlowEndpoint
  Fields: FieldsEndpoint
  CustomerAddresses: CustomerAddressesEndpoint
  AccountAddresses: AccountAddressesEndpoint
  Transactions: TransactionEndpoint
  Settings: SettingsEndpoint
  Promotions: PromotionsEndpoint
  Variations: VariationsEndpoint
  AuthenticationSettings: AuthenticationSettingsEndpoint
  OidcProfile: OidcProfileEndpoint
  AuthenticationRealm: AuthenticationRealmEndpoint
  MerchantRealmMappings: MerchantRealmMappingsEndpoint
  Accounts: AccountEndpoint
  AccountMembers: AccountMembersEndpoint
  AccountAuthenticationSettings: AccountAuthenticationSettingsEndpoint
  AccountMembershipSettings: AccountMembershipSettingsEndpoint
  AccountMemberships: AccountMembershipsEndpoint
  UserAuthenticationInfo: UserAuthenticationInfoEndpoint
  PasswordProfile: PasswordProfileEndpoint
  UserAuthenticationPasswordProfile: UserAuthenticationPasswordProfileEndpoint
  PCMVariations: PCMVariationsEndpoint
  PcmVariationsRelationship: PcmVariationsRelationshipsEndpoint
  Metrics: MetricsEndpoint
  PersonalData: PersonalDataEndpoint
  DataEntries: DataEntriesEndpoint
  ErasureRequests: ErasureRequestsEndpoint
  PriceBookPriceModifier: PriceBookPriceModifierEndpoint
  ApplicationKeys: ApplicationKeysEndpoint
  SubscriptionProducts: SubscriptionProductsEndpoint
  SubscriptionPlans: SubscriptionPlansEndpoint
  SubscriptionOfferings: SubscriptionOfferingsEndpoint
  OneTimePasswordTokenRequest: OneTimePasswordTokenRequestEndpoint
  Subscriptions: SubscriptionsEndpoint
  RulePromotions: RulePromotionsEndpoint
  CustomApiRolePolicies: CustomApiRolePoliciesEndpoint
  SubscriptionSubscribers: SubscriptionSubscribersEndpoint
  SubscriptionJobs: SubscriptionJobsEndpoint
  SubscriptionSchedules: SubscriptionSchedulesEndpoint
  CustomApis: CustomApisEndpoint
  SubscriptionDunningRules: SubscriptionDunningRulesEndpoint
  SubscriptionProrationPolicies: SubscriptionProrationPoliciesEndpoint
  SubscriptionInvoices: SubscriptionInvoicesEndpoint
  CustomRelationships: CustomRelationshipsEndpoint
  MultiLocationInventories: MultiLocationInventoriesEndpoint
  AccountTags: AccountTagsEndpoint

  Cart(id?: string): CartEndpoint // This optional cart id is super worrying when using the SDK in a node server :/
  constructor(config: Config)

  Authenticate(): Promise<AuthenticateResponseBody>
}

export function gateway(config: ConfigOptions): ElasticPath

export namespace elasticpath {
  export interface Settings {
    additional_languages?: string[]
    calculation_method?: string
    list_child_products?: boolean
    page_length?: number
  }
}
