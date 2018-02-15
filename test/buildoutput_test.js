const Lab = require('lab')
const lab = exports.lab = Lab.script()
const test = lab.test
const sinon = require('sinon')
const expect = require('chai').expect

const BuildOutput = require('../src/buildoutput')

lab.experiment('the function', () => {
  let sandbox

  lab.beforeEach( (done) => {
    sandbox = sinon.sandbox.create()

    done()
  })

  lab.afterEach( (done) => {
    sandbox.restore()

    done()
  })

  test('something', (done) => {
    expect(true).to.be.true

    done()
  })
})