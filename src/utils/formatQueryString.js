function formatFilterString(type, filter) {
    const filterStringArray = Object.keys(filter).map(key => {
      const value = filter[key]
      let queryString = `${key},${value}`
  
      if (Array.isArray(value)) {
        queryString = `${key},${value.join(',')}`
      } else if (typeof value === 'object' && value !== null) {
        queryString = Object.keys(value)
          .map(attr => `${key}.${attr},${value[attr]}`)
          .join(':')
      }
      return `${type}(${queryString})`
    })
  
    return filterStringArray.join(':')
  }
  
  

export function formatQueryString(key, value) {
  if (key === 'limit' || key === 'offset') {
    return `page${value}`
  }

  if (key === 'total_method') {
    return `page[total_method]=${value}`
  }

  if (key === 'filter') {
    const filterValues = []
    
    // Handle 'or' conditions if they exist
    if (value.or && Array.isArray(value.or)) {
      const orQueries = value.or.map(filterGroup => Object.keys(filterGroup)
        .map(filterType => formatFilterString(filterType, filterGroup[filterType]))
        .join(':')
      )
      filterValues.push(`(${orQueries.join('|')})`)
    }

    // Handle other filter types
    Object.keys(value).forEach(filter => {
      if (filter !== 'or') {
        filterValues.push(formatFilterString(filter, value[filter]))
      }
    })

    return `${key}=${filterValues.join(':')}`
  }

  return `${key}=${value}`
}
