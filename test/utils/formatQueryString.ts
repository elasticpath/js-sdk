import { expect } from 'chai'
import rewire from 'rewire'

const mod = rewire('../../src/utils/formatQueryString')

describe('Format query string', () => {
  const formatQueryString = mod.__get__('formatQueryString')

  it('should handle pagination value', () => {
    const res = formatQueryString('limit', 2)

    expect(res).to.equal('page2')
  })

  it('should handle pagination value', () => {
    const res = formatQueryString('offset', 2)

    expect(res).to.equal('page2')
  })

  it('should handle filter value', () => {
    const res = formatQueryString('filter', { eq: { name: 'Test' } })

    expect(res).to.equal('filter=eq(name,Test)')
  })

  it('should handle multiple filter types', () => {
    const res = formatQueryString('filter', {
      eq: { name: 'sku-123' },
      gt: { price: '100' }
    })
    expect(res).to.equal('filter=eq(name,sku-123):gt(price,100)')
  })

  it('should handle OR conditions in filters', () => {
    const res = formatQueryString('filter', {
      or: [{ eq: { category: 'hoodies' } }, { eq: { category: 't-shirts' } }]
    })
    expect(res).to.equal('filter=(eq(category,hoodies)|eq(category,t-shirts))')
  })

  it('should handle complex OR conditions with multiple filter types', () => {
    const res = formatQueryString('filter', {
      eq: {
        enabled: '"true"',
        stackable: '"true"'
      },
      or: [
        {
          le: {
            start: '"2025-02-06T22:19:56.492Z"'
          },
          gt: {
            end: '"2025-02-06T22:19:56.492Z"'
          }
        },
        {
          le: {
            end: '"2025-02-06T22:19:56.492Z"'
          }
        }
      ]
    })
    expect(res).to.equal(
      'filter=(le(start,"2025-02-06T22:19:56.492Z"):gt(end,"2025-02-06T22:19:56.492Z")|le(end,"2025-02-06T22:19:56.492Z")):eq(enabled,"true"):eq(stackable,"true")'
    )
  })

  it('should handle OR conditions with datetime comparisons', () => {
    const res = formatQueryString('filter', {
      or: [
        {
          le: { start: '"2025-01-29T23:31:08.400Z"' },
          gt: { end: '"2025-01-29T23:31:08.400Z"' }
        },
        {
          gt: {
            start: '"2025-01-29T23:31:08.400Z"',
            end: '"2025-01-29T23:31:08.400Z"'
          }
        }
      ]
    })
    expect(res).to.equal(
      'filter=(le(start,"2025-01-29T23:31:08.400Z"):gt(end,"2025-01-29T23:31:08.400Z")|gt(start,"2025-01-29T23:31:08.400Z"):gt(end,"2025-01-29T23:31:08.400Z"))'
    )
  })
})

describe('Format filter string', () => {
  const formatFilterString = mod.__get__('formatFilterString')
  it('should return a filter string', () => {
    const res = formatFilterString('eq', { name: 'Test' })

    expect(res).to.equal('eq(name,Test)')
  })

  it('should handle nested objects', () => {
    const res = formatFilterString('eq', { user: { name: 'Test' } })

    expect(res).to.equal('eq(user.name,Test)')
  })

  it('should return a valid filter string for "in" operator', () => {
    const res = formatFilterString('in', {
      sku: ['prod12', 'prod34', 'prod56']
    })

    expect(res).to.equal('in(sku,prod12,prod34,prod56)')
  })

  it('should handle multiple filters of the same type', () => {
    const res = formatFilterString('eq', {
      name: 'Code',
      age: 'welcome10'
    })
    expect(res).to.equal('eq(name,Code):eq(age,welcome10)')
  })

  it('should handle nested object with multiple attributes', () => {
    const res = formatFilterString('eq', {
      price: { gt: '100', lt: '200' }
    })
    expect(res).to.equal('eq(price.gt,100:price.lt,200)')
  })
})
