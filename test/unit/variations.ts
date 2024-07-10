import { assert } from 'chai'
import nock from 'nock'
import { gateway as ElasticPathGateway, MemoryStorageFactory } from '../../src'
import {
  variationsArray as variations,
  optionsArray as options,
  modifiersArray as modifiers,
  auth
} from '../factories'

const apiUrl = 'https://euwest.api.elasticpath.com/v2'
const accessToken = 'testaccesstoken'

describe('ElasticPath variations', () => {
  const ElasticPath = ElasticPathGateway({
    custom_authenticator: () => auth(accessToken),
    storage: new MemoryStorageFactory()
  })

  it('should return an a single variation', () => {
    nock(apiUrl, {
      reqheaders: {
        Authorization: `Bearer ${accessToken}`
      }
    })
      .get('/variations')
      .reply(200, { data: variations })

    return ElasticPath.Variations.All().then(response => {
      assert.lengthOf(response.data, 2)
    })
  })

  it('should return an array of variations', () => {
    nock(apiUrl, {
      reqheaders: {
        Authorization: `Bearer ${accessToken}`
      }
    })
      .get('/variations/variation-1')
      .reply(200, { data: variations[0] })

    return ElasticPath.Variations.Get('variation-1').then(response => {
      assert.propertyVal(response.data, 'id', 'variation-1')
    })
  })

  it('should create variation', () => {
    const newVariation = { name: 'Color' }

    nock(apiUrl, { reqheaders: { Authorization: `Bearer ${accessToken}` } })
      .post('/variations')
      .reply(200, { data: { ...newVariation, id: 'newVariation' } })

    return ElasticPath.Variations.Create(newVariation).then(response => {
      assert.propertyVal(response.data, 'id', 'newVariation')
      assert.propertyVal(response.data, 'name', 'Color')
    })
  })

  it('should update variation', () => {
    const variation = { name: 'Color' }

    nock(apiUrl, { reqheaders: { Authorization: `Bearer ${accessToken}` } })
      .put('/variations/variation-1')
      .reply(200, { data: { ...variation, id: 'variation-1' } })

    return ElasticPath.Variations.Update('variation-1', variation).then(
      response => {
        assert.propertyVal(response.data, 'id', 'variation-1')
        assert.propertyVal(response.data, 'name', 'Color')
      }
    )
  })

  it('should delete variation', () => {
    nock(apiUrl, {
      reqheaders: {
        Authorization: `Bearer ${accessToken}`
      }
    })
      .delete('/variations/variation-1')
      .reply(204)

    return ElasticPath.Variations.Delete('variation-1').then(response => {
      assert.equal(response, '{}')
    })
  })

  it('should return an a single option', () => {
    nock(apiUrl, {
      reqheaders: {
        Authorization: `Bearer ${accessToken}`
      }
    })
      .get('/variations/variation-1/options/option-1')
      .reply(200, { data: options[0] })

    return ElasticPath.Variations.Option('variation-1', 'option-1').then(
      response => {
        assert.propertyVal(response.data, 'id', 'option-1')
      }
    )
  })

  it('should return an array of options', () => {
    nock(apiUrl, {
      reqheaders: {
        Authorization: `Bearer ${accessToken}`
      }
    })
      .get('/variations/variation-1/options')
      .reply(200, { data: options })

    return ElasticPath.Variations.Options('variation-1').then(response => {
      assert.lengthOf(response.data, 2)
    })
  })

  it('should create option', () => {
    const newOption = {
      name: 'Blue',
      description: 'Blue color'
    }
    nock(apiUrl, {
      reqheaders: {
        Authorization: `Bearer ${accessToken}`
      }
    })
      .post('/variations/variation-1/options')
      .reply(200, { data: { ...newOption, id: 'new-option' } })

    return ElasticPath.Variations.CreateOption('variation-1', newOption).then(
      response => {
        assert.propertyVal(response.data, 'id', 'new-option')
      }
    )
  })

  it('should update option', () => {
    const option = {
      name: 'Blue',
      description: 'Blue color'
    }
    nock(apiUrl, {
      reqheaders: {
        Authorization: `Bearer ${accessToken}`
      }
    })
      .put('/variations/variation-1/options/option-1')
      .reply(200, { data: { ...option, id: 'option-1' } })

    return ElasticPath.Variations.UpdateOption(
      'variation-1',
      'option-1',
      option
    ).then(response => {
      assert.propertyVal(response.data, 'id', 'option-1')
    })
  })

  it('should delete option', () => {
    nock(apiUrl, {
      reqheaders: {
        Authorization: `Bearer ${accessToken}`
      }
    })
      .delete('/variations/variation-1/options/option-1')
      .reply(204)

    return ElasticPath.Variations.DeleteOption('variation-1', 'option-1').then(
      response => {
        assert.equal(response, '{}')
      }
    )
  })

  it('should return an a single modifier', () => {
    nock(apiUrl, {
      reqheaders: {
        Authorization: `Bearer ${accessToken}`
      }
    })
      .get('/variations/variation-1/options/option-1/modifiers/modifier-1')
      .reply(200, { data: modifiers[0] })

    return ElasticPath.Variations.Modifier(
      'variation-1',
      'option-1',
      'modifier-1'
    ).then(response => {
      assert.propertyVal(response.data, 'id', 'modifier-1')
    })
  })

  it('should an array of modifiers', () => {
    nock(apiUrl, {
      reqheaders: {
        Authorization: `Bearer ${accessToken}`
      }
    })
      .get('/variations/variation-1/options/option-1/modifiers')
      .reply(200, { data: modifiers })

    return ElasticPath.Variations.Modifiers('variation-1', 'option-1').then(
      response => {
        assert.lengthOf(response.data, 3)
      }
    )
  })

  it('should create modifier', () => {
    const newModifier = {
      modifier_type: 'name_append',
      value: 'White'
    }

    nock(apiUrl, {
      reqheaders: {
        Authorization: `Bearer ${accessToken}`
      }
    })
      .post('/variations/variation-1/options/option-1/modifiers')
      .reply(200, { data: { ...newModifier, id: 'new-modifier' } })

    return ElasticPath.Variations.CreateModifier(
      'variation-1',
      'option-1',
      newModifier
    ).then(response => {
      assert.propertyVal(response.data, 'id', 'new-modifier')
    })
  })

  it('should update modifier', () => {
    const modifier = {
      modifier_type: 'name_append',
      value: 'White'
    }

    nock(apiUrl, {
      reqheaders: {
        Authorization: `Bearer ${accessToken}`
      }
    })
      .put('/variations/variation-1/options/option-1/modifiers/modifier-1')
      .reply(200, { data: { ...modifier, id: 'modifier-1' } })

    return ElasticPath.Variations.UpdateModifier(
      'variation-1',
      'option-1',
      'modifier-1',
      modifier
    ).then(response => {
      assert.propertyVal(response.data, 'id', 'modifier-1')
    })
  })

  it('should delete modifier', () => {
    nock(apiUrl, {
      reqheaders: {
        Authorization: `Bearer ${accessToken}`
      }
    })
      .delete('/variations/variation-1/options/option-1/modifiers/modifier-1')
      .reply(204)

    return ElasticPath.Variations.DeleteModifier(
      'variation-1',
      'option-1',
      'modifier-1'
    ).then(response => {
      assert.equal(response, '{}')
    })
  })
})
