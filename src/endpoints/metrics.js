import BaseExtend from '../extends/base'
import { formatQueryParams } from '../utils/helpers'

class MetricsEndpoint extends BaseExtend {
  constructor(endpoint) {
    super(endpoint)

    this.endpoint = 'metrics'
  }

  TotalOrders(query) {
    const formattedString = formatQueryParams(query)
    return this.request.send(
      `${this.endpoint}/orders/total?${formattedString}`,
      'GET'
    )
  }

  TotalValue(query) {
    const formattedString = formatQueryParams(query)
    return this.request.send(
      `${this.endpoint}/orders/value?${formattedString}`,
      'GET'
    )
  }

  // V2 Metrics Endpoints

  GetOrderMetricsSummary(query) {
    const formattedString = formatQueryParams(query)
    return this.request.send(
      `${this.endpoint}/orders/summary?${formattedString}`,
      'GET'
    )
  }

  GetOrderCountTimeSeries(query) {
    const formattedString = formatQueryParams(query)
    return this.request.send(
      `${this.endpoint}/orders/timeseries/count?${formattedString}`,
      'GET'
    )
  }

  GetOrderDiscountTimeSeries(query) {
    const formattedString = formatQueryParams(query)
    return this.request.send(
      `${this.endpoint}/orders/timeseries/discount?${formattedString}`,
      'GET'
    )
  }

  GetOrderValueTimeSeries(query) {
    const formattedString = formatQueryParams(query)
    return this.request.send(
      `${this.endpoint}/orders/timeseries/value?${formattedString}`,
      'GET'
    )
  }
}

export default MetricsEndpoint
