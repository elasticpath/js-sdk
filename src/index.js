import './utils/fetch-polyfill'
import 'es6-promise'

import Config from './config'
import RequestFactory from './factories/request'
import ProductsEndpoint from './endpoints/products'
import CurrenciesEndpoint from './endpoints/currencies'
import BrandsEndpoint from './endpoints/brands'
import CartEndpoint from './endpoints/cart'
import PCMEndpoint from './endpoints/pcm'
import CategoriesEndpoint from './endpoints/categories'
import CollectionsEndpoint from './endpoints/collections'
import IntegrationsEndpoint from './endpoints/integrations'
import OrdersEndpoint from './endpoints/orders'
import GatewaysEndpoint from './endpoints/gateways'
import CustomersEndpoint from './endpoints/customers'
import InventoriesEndpoint from './endpoints/inventories'
import JobsEndpoint from './endpoints/jobs'
import FlowsEndpoint from './endpoints/flows'
import PriceBooksEndpoint from './endpoints/price-books'
import FieldsEndpoint from './endpoints/fields'
import FilesEndpoint from './endpoints/files'
import CustomerAddressesEndpoint from './endpoints/customer-addresses'
import AccountAddressesEndpoint from './endpoints/account-addresses'
import TransactionsEndpoint from './endpoints/transactions'
import SettingsEndpoint from './endpoints/settings'
import LocalStorageFactory from './factories/local-storage'
import MemoryStorageFactory from './factories/memory-storage'
import PromotionsEndpoint from './endpoints/promotions'
import VariationsEndpoint from './endpoints/variations'
import AuthenticationRealmEndpoint from './endpoints/authentication-realm'
import OidcProfileEndpoint from './endpoints/oidc-profile'
import UserAuthenticationInfoEndpoint from './endpoints/user-authentication-info'
import PasswordProfileEndpoint from './endpoints/password-profile'
import UserAuthenticationPasswordProfileEndpoint from './endpoints/user-authentication-password-profile'
import AuthenticationSettingsEndpoint from './endpoints/authentication-settings'
import HierarchiesEndpoint from './endpoints/hierarchies'
import MerchantRealmMappingsEndpoint from './endpoints/merchant-realm-mappings'
import Accounts from './endpoints/accounts'
import AccountMembersEndpoint from './endpoints/account-members'
import AccountAuthenticationSettingsEndpoint from './endpoints/account-authentication-settings'
import AccountMembershipsEndpoint from './endpoints/account-memberships'
import OneTimePasswordTokenRequestEndpoint from './endpoints/one-time-password-token-request'
import PCMVariationsEndpoint from './endpoints/pcm-variations'
import MetricsEndpoint from './endpoints/metrics'
import PersonalDataEndpoint from './endpoints/personal-data'
import DataEntriesEndpoint from './endpoints/data-entry'
import AccountMembershipSettingsEndpoint from './endpoints/account-membership-settings'
import ErasureRequestsEndpoint from './endpoints/erasure-requests'
import ApplicationKeysEndpoint from './endpoints/application-keys'
import SubscriptionProductsEndpoint from './endpoints/subscription-products'
import SubscriptionPlansEndpoint from './endpoints/subscription-plan'
import SubscriptionOfferingsEndpoint from './endpoints/subscription-offerings'
import SubscriptionsEndpoint from './endpoints/subscriptions'
import RulePromotionsEndpoint from './endpoints/rule-promotions'
import SubscriptionSubscribersEndpoint from './endpoints/subscription-subscribers'
import SubscriptionJobsEndpoint from './endpoints/subscription-jobs'
import SubscriptionSchedulesEndpoint from './endpoints/subscription-schedules'
import SubscriptionDunningRulesEndpoint from './endpoints/subscription-dunning-rules'
import SubscriptionProrationPoliciesEndpoint from './endpoints/subscription-proration-policies'
import SubscriptionInvoicesEndpoint from './endpoints/subscription-invoices'
import CustomRelationshipsEndpoint from './endpoints/custom-relationships'
import MultiLocationInventoriesEndpoint from './endpoints/multi-location-inventories'
import AccountTagsEndpoint from './endpoints/account-tags'

import {
  cartIdentifier,
  tokenInvalid,
  getCredentials,
  resolveCredentialsStorageKey
} from './utils/helpers'
import CatalogsEndpoint from './endpoints/catalogs'
import ShopperCatalogEndpoint from './endpoints/catalog'
import CustomApisEndpoint from './endpoints/custom-apis'
import CustomApiRolePoliciesEndpoint from './endpoints/custom-api-role-policies'

export default class ElasticPath {
  constructor(config) {
    this.config = config

    if (!config.disableCart)
      this.cartId = cartIdentifier(config.storage, config.name)

    this.tokenInvalid = () => tokenInvalid(config)

    this.request = new RequestFactory(config)
    this.storage = config.storage

    this.credentials = () =>
      getCredentials(config.storage, resolveCredentialsStorageKey(config.name))

    this.Products = new ProductsEndpoint(config)
    this.PCM = new PCMEndpoint(config)
    this.Catalogs = new CatalogsEndpoint(config)
    this.ShopperCatalog = new ShopperCatalogEndpoint(config)
    this.Currencies = new CurrenciesEndpoint(config)
    this.Brands = new BrandsEndpoint(config)
    this.PriceBooks = new PriceBooksEndpoint(config)
    this.Categories = new CategoriesEndpoint(config)
    this.Hierarchies = new HierarchiesEndpoint(config)
    this.Collections = new CollectionsEndpoint(config)
    this.Integrations = new IntegrationsEndpoint(config)
    this.Orders = new OrdersEndpoint(config)
    this.Gateways = new GatewaysEndpoint(config)
    this.Customers = new CustomersEndpoint(config)
    this.Inventories = new InventoriesEndpoint(config)
    this.Jobs = new JobsEndpoint(config)
    this.Files = new FilesEndpoint(config)
    this.Flows = new FlowsEndpoint(config)
    this.Fields = new FieldsEndpoint(config)
    this.CustomerAddresses = new CustomerAddressesEndpoint(config)
    this.AccountAddresses = new AccountAddressesEndpoint(config)
    this.Transactions = new TransactionsEndpoint(config)
    this.Settings = new SettingsEndpoint(config)
    this.Promotions = new PromotionsEndpoint(config)
    this.Variations = new VariationsEndpoint(config)
    this.PCMVariations = new PCMVariationsEndpoint(config)
    this.PersonalData = new PersonalDataEndpoint(config)
    this.DataEntries = new DataEntriesEndpoint(config)
    this.ErasureRequests = new ErasureRequestsEndpoint(config)
    this.AuthenticationRealm = new AuthenticationRealmEndpoint(config)
    this.OidcProfile = new OidcProfileEndpoint(config)
    this.UserAuthenticationInfo = new UserAuthenticationInfoEndpoint(config)
    this.PasswordProfile = new PasswordProfileEndpoint(config)
    this.AuthenticationSettings = new AuthenticationSettingsEndpoint(config)
    this.MerchantRealmMappings = new MerchantRealmMappingsEndpoint(config)
    this.Accounts = new Accounts(config)
    this.AccountAuthenticationSettings =
      new AccountAuthenticationSettingsEndpoint(config)
    this.AccountMembers = new AccountMembersEndpoint(config)
    this.AccountMemberships = new AccountMembershipsEndpoint(config)
    this.AccountMembershipSettings = new AccountMembershipSettingsEndpoint(
      config
    )
    this.UserAuthenticationPasswordProfile =
      new UserAuthenticationPasswordProfileEndpoint(config)
    this.Metrics = new MetricsEndpoint(config)
    this.ApplicationKeys = new ApplicationKeysEndpoint(config)
    this.SubscriptionProducts = new SubscriptionProductsEndpoint(config)
    this.SubscriptionPlans = new SubscriptionPlansEndpoint(config)
    this.SubscriptionOfferings = new SubscriptionOfferingsEndpoint(config)
    this.OneTimePasswordTokenRequest = new OneTimePasswordTokenRequestEndpoint(
      config
    )
    this.Subscriptions = new SubscriptionsEndpoint(config)
    this.RulePromotions = new RulePromotionsEndpoint(config)
    this.SubscriptionSubscribers = new SubscriptionSubscribersEndpoint(config)
    this.SubscriptionJobs = new SubscriptionJobsEndpoint(config)
    this.SubscriptionSchedules = new SubscriptionSchedulesEndpoint(config)
    this.CustomApis = new CustomApisEndpoint(config)
    this.CustomApiRolePolicies = new CustomApiRolePoliciesEndpoint(config)
    this.SubscriptionDunningRules = new SubscriptionDunningRulesEndpoint(config)
    this.SubscriptionProrationPolicies =
      new SubscriptionProrationPoliciesEndpoint(config)
    this.SubscriptionInvoices = new SubscriptionInvoicesEndpoint(config)
    this.CustomRelationships = new CustomRelationshipsEndpoint(config)
    this.MultiLocationInventories = new MultiLocationInventoriesEndpoint(config)
    this.AccountTags = new AccountTagsEndpoint(config)
  }

  // Expose `Cart` class on ElasticPath class
  Cart(id = this.cartId) {
    return !this.config.disableCart ? new CartEndpoint(this.request, id) : null
  }

  // Expose `authenticate` function on the ElasticPath class
  Authenticate() {
    return this.request.authenticate()
  }
}

// Export a function to instantiate the ElasticPath class
const gateway = config => new ElasticPath(new Config(config))

export { gateway, MemoryStorageFactory, LocalStorageFactory }
