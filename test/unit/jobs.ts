import { assert } from 'chai'
import nock from 'nock'
import { gateway as ElasticPathGateway } from '../../src'
import { jobsArray as jobs } from '../factories'

const apiUrl = 'https://euwest.api.elasticpath.com/v2'

describe('ElasticPath jobs', () => {
  const ElasticPath = ElasticPathGateway({
    client_id: 'XXX'
  })

  it('should return an array of jobs', () => {
    // Intercept the API request
    nock(apiUrl, {
      reqheaders: {
        Authorization: 'Bearer a550d8cbd4a4627013452359ab69694cd446615a'
      }
    })
      .get('/jobs')
      .reply(200, { data: jobs })

    return ElasticPath.Jobs.All().then(response => {
      assert.lengthOf(response.data, 3)
    })
  })

  it('should return a single job', () => {
    // Intercept the API request
    nock(apiUrl, {
      reqheaders: {
        Authorization: 'Bearer a550d8cbd4a4627013452359ab69694cd446615a'
      }
    })
      .get('/jobs/1')
      .reply(200, jobs[0])

    return ElasticPath.Jobs.Get('1').then(response => {
      assert.propertyVal(response, 'id', 'job-1')
    })
  })

  it('should return a file', () => {
    // Intercept the API request
    nock(apiUrl, {
      reqheaders: {
        Authorization: 'Bearer a550d8cbd4a4627013452359ab69694cd446615a'
      }
    })
      .get('/jobs/1/file')
      .reply(200, jobs[0])

    return ElasticPath.Jobs.GetFile('1').then(response => {
      assert.propertyVal(response, 'id', 'job-1')
    })
  })

  it('should create a new job', () => {
    const newJobs = {
      filter: '',
      job_type: 'order_export'
    }

    // Intercept the API request
    nock(apiUrl, {
      reqheaders: {
        Authorization: 'Bearer a550d8cbd4a4627013452359ab69694cd446615a'
      }
    })
      .post('/jobs', { data: newJobs })
      .reply(201, jobs[0])

    return ElasticPath.Jobs.Create(newJobs).then(response => {
      assert.propertyVal(response, 'id', 'job-1')
    })
  })
})
