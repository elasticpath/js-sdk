import { ResourcePage } from './core'

export interface MetricsBase {
  value: number
  time: string
}

export interface MetricsQuery {
  currency?: string
  from: string
  to: string
  interval: string
}

// V2 Metrics Types
export interface MetricsFilter {
  contains?: Record<string, string>
}

export interface MetricsV2Query {
  start_date: string
  end_date: string
  currency: string
  interval?: '1hr' | '1d' | '1wk'
  filter?: MetricsFilter
}

export interface OrderMetricsSummary {
  count: number
  total_value: number
  total_discount: number
  updated_at: string
}

export interface OrderCountTimeSeries {
  start_date: string
  count: number
}

export interface OrderDiscountTimeSeries {
  start_date: string
  discount: number
}

export interface OrderValueTimeSeries {
  start_date: string
  value: number
}

export interface MetricsEndpoint {
  TotalOrders(query: MetricsQuery): Promise<ResourcePage<MetricsBase>>

  TotalValue(query: MetricsQuery): Promise<ResourcePage<MetricsBase>>

  // V2 Metrics Endpoints
  GetOrderMetricsSummary(
    query: MetricsV2Query
  ): Promise<{ data: OrderMetricsSummary }>

  GetOrderCountTimeSeries(
    query: MetricsV2Query
  ): Promise<{ data: OrderCountTimeSeries[] }>

  GetOrderDiscountTimeSeries(
    query: MetricsV2Query
  ): Promise<{ data: OrderDiscountTimeSeries[] }>

  GetOrderValueTimeSeries(
    query: MetricsV2Query
  ): Promise<{ data: OrderValueTimeSeries[] }>
}
