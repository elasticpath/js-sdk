import { expect } from 'chai'
import fetch from 'cross-fetch'
import {
  gateway as ElasticPathGateway,
  MemoryStorageFactory,
  LocalStorageFactory
} from '../../src'
import { throttleFetch } from '../../src/utils/throttle'
describe('ElasticPath config', () => {
  it('storage defaults to `StorageFactory`', () => {
    const ElasticPath = ElasticPathGateway({})
    expect(ElasticPath.storage).to.be.an.instanceof(LocalStorageFactory)
    expect(ElasticPath.config.storage).to.be.equal(ElasticPath.storage)
    expect(ElasticPath.request.storage).to.be.equal(ElasticPath.storage)
    expect(ElasticPath.Currencies.storage).to.equal(ElasticPath.storage)
  })

  it('storage can be overridden', () => {
    const memoryStorage = new MemoryStorageFactory()
    const ElasticPath = ElasticPathGateway({
      storage: memoryStorage
    })
    expect(ElasticPath.storage).to.be.an.instanceof(MemoryStorageFactory)
    expect(ElasticPath.config.storage).to.be.equal(ElasticPath.storage)
    expect(ElasticPath.request.storage).to.be.equal(ElasticPath.storage)
    expect(ElasticPath.Currencies.storage).to.be.equal(ElasticPath.storage)
  })

  it('custom_fetch can be overridden', () => {
    const ElasticPath = ElasticPathGateway({
      client_id: 'XXX',
      custom_fetch: fetch
    })

    expect(ElasticPath.config.auth.fetch).to.be.an.instanceof(Function)
    expect(ElasticPath.config.auth.fetch).to.equal(fetch)
  })

  it('custom_fetch will fail must be a Function', () => {
    const ElasticPath = ElasticPathGateway({
      client_id: 'XXX',
      custom_fetch: 'string'
    } as any)

    return ElasticPath.Authenticate().catch(error => {
      expect(error).to.be.an.instanceof(TypeError)
    })
  })

  it('should access throttleFetch if custom_fetch and throttle request is given', () => {
    // minimal test function
    const testCustomFetch = (url: string, options: object) => url

    const testOptions = {
      custom_fetch: testCustomFetch,
      throttleEnabled: true,
      throttleLimit: 3,
      throttleInterval: 125
    }

    let partiallyAppliedThrottleFetch = undefined
    const resolveFetchMethodMock = function (options) {
      const resolvedFetch = options.custom_fetch ?? fetch
      expect(resolvedFetch).to.equal(options.custom_fetch)
      partiallyAppliedThrottleFetch = throttleFetch(resolvedFetch)
      return options.throttleEnabled
        ? partiallyAppliedThrottleFetch
        : resolvedFetch
    }

    const response = resolveFetchMethodMock(testOptions)
    expect(response).to.equal(partiallyAppliedThrottleFetch)
  })

  it('should use fetch if custom_fetch and throttleRequest value are not given', () => {
    const ElasticPath = ElasticPathGateway({
      client_id: 'XXX'
    })
    expect(ElasticPath.config.auth.fetch).to.equal(fetch)
  })

  it('should use custom_fetch if throttleRequest value is not given', () => {
    // minimal test function
    const testCustomFetch = (url: string, options: object) => url
    const ElasticPath = ElasticPathGateway({
      client_id: 'XXX',
      custom_fetch: testCustomFetch
    })
    expect(ElasticPath.config.auth.fetch).to.equal(testCustomFetch)
  })

  it('should have throttling config options', () => {
    const ElasticPath = ElasticPathGateway({
      throttleEnabled: true,
      throttleLimit: 3,
      throttleInterval: 125
    })

    expect(ElasticPath.config.throttleConfig?.throttleEnabled).to.be.equal(true)
    expect(ElasticPath.config.throttleConfig?.throttleLimit).to.be.equal(3)
    expect(ElasticPath.config.throttleConfig?.throttleInterval).to.be.equal(125)
  })
})
