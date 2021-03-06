const test = require('tap').test
const server = require('./../../server')
const sinon = require('sinon')
const sinonTest = require('sinon-test')
const testWrap = sinonTest(sinon)
var arrow = require('arrow')

var ARROW
var CONNECTOR

test('### Start Arrow ###', function (t) {
  server()
    .then((inst) => {
      ARROW = inst
      CONNECTOR = ARROW.getConnector('appc.mongo')
      t.ok(ARROW, 'Arrow has been started')
      t.end()
    })
    .catch((err) => {
      t.threw(err)
    })
})

test('### createModelsFromSchema ###', testWrap(function (t) {
  if (CONNECTOR.schema) { var temp = CONNECTOR.schema }

  CONNECTOR.schema = { objects: { test: 'test' } }

  const extendModelStub = this.stub(arrow.Model, 'extend').callsFake(() => {})

  CONNECTOR.createModelsFromSchema()

  t.ok(extendModelStub.calledOnce)
  t.ok(CONNECTOR.models)

  CONNECTOR.schema = temp
  t.end()
}))

test('### Stop Arrow ###', function (t) {
  ARROW.stop(function () {
    t.pass('Arrow has been stopped!')
    t.end()
  })
})
