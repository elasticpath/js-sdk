import { expect } from 'chai'
import '../../src/utils/fetch-polyfill'
import resolveFetchMethod from '../../src/utils/configFetch'
import { gateway as ElasticPathGateway } from '../../src'

describe('Config fetch parameters', () => {
  // minimal test function
  const testCustomFetch = (url: string, options: object) => url

  const ElasticPath = ElasticPathGateway({
    client_id: 'xxx',
    client_secret: 'xxx',
    custom_fetch: testCustomFetch,
    throttleEnabled: true,
    throttleLimit: 3,
    throttleInterval: 125
  })
  const mockOptions = {
    custom_fetch: ElasticPath.config.custom_fetch,
    throttleEnabled: ElasticPath.config.throttleConfig?.throttleEnabled,
    throttleLimit: ElasticPath.config.throttleConfig?.throttleLimit,
    throttleInterval: ElasticPath.config.throttleConfig?.throttleInterval
  }
  const throttleMock = async function (fn: () => any) {
    return fn()
  }

  it('should have correct config options for resolveFetchMethod', () => {
    const resolveFetchMethodMock = function (options: any) {
      const isCustomFetch = options.custom_fetch ?? fetch
      expect(options.custom_fetch).to.equal(ElasticPath.config.custom_fetch)
      expect(options.throttleEnabled).to.equal(
        ElasticPath.config.throttleConfig?.throttleEnabled
      )
      return options.throttleEnabled ? throttleMock : isCustomFetch
    }
    resolveFetchMethodMock(mockOptions)
    resolveFetchMethod.__Rewire__('resolveFetchMethod', resolveFetchMethodMock)
  })

  it('should access throttleFetch if custom_fetch and throttle request is given', () => {
    expect(throttleMock).to.not.be.undefined
    const resolveFetchMethodMock = function (options: any) {
      const isCustomFetch = options.custom_fetch ?? fetch
      return options.throttleEnabled ? throttleMock : isCustomFetch
    }

    const response = resolveFetchMethodMock(mockOptions)
    resolveFetchMethod.__Rewire__('resolveFetchMethod', resolveFetchMethodMock)
    expect(response).to.equal(throttleMock)
  })
})
