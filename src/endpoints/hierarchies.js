import CRUDExtend from '../extends/crud'
import NodesEndpoint from './nodes'
import NodeRelationships from './node-relationships'
import { buildURL } from '../utils/helpers'

class HierarchiesEndpoint extends CRUDExtend {
  constructor(endpoint) {
    const config = { ...endpoint } // Need to clone config so it is only updated in PCM
    config.version = 'pcm'
    super(config)
    this.Nodes = new NodesEndpoint(config)
    this.Relationships = new NodeRelationships(config)
    this.endpoint = 'hierarchies'
  }

  Children(id, token = null) {
    const { limit, offset } = this

    this.call = this.request.send(
      buildURL(`${this.endpoint}/${id}/children`, {
        limit,
        offset
      }),
      'GET',
      null,
      token
    )

    return this.call
  }

  Duplicate(hierarchyId, body, token = null) {
    return this.request.send(
      `${this.endpoint}/${hierarchyId}/duplicate_job`,
      'POST',
      body,
      token
    )
  }

  GetNodesByIds(nodeIds, token = null) {
    if (!nodeIds || nodeIds.length === 0) {
      return Promise.resolve({
        data: [],
        links: {},
        meta: {
          page: {
            current: 1,
            limit: 100,
            offset: 0,
            total: 0
          },
          results: {
            total: 0
          }
        }
      })
    }

    const filter = {
      or: nodeIds.map(id => ({
        eq: { id }
      }))
    }

    return this.request.send(
      buildURL('hierarchies/nodes', {
        filter,
        include_hierarchies: true
      }),
      'GET',
      undefined,
      token
    )
  }
}

export default HierarchiesEndpoint
