const request = require('supertest')
const { expect } = require('chai')
const app = require('../app')

describe('GET /', () => {
  it('returns status 200', async () => {
    const res = await request(app).get('/')
    expect(res.status).to.equal(200)
  })

  it('body has a message mentioning Grand Azure Hotel', async () => {
    const res = await request(app).get('/')
    expect(res.body).to.have.property('message')
    expect(res.body.message).to.include('Grand Azure Hotel')
  })
})

describe('GET /rooms', () => {
  it('returns 200 and an array of 7 rooms', async () => {
    const res = await request(app).get('/rooms')
    expect(res.status).to.equal(200)
    expect(res.body).to.be.an('array').with.lengthOf(7)
  })

  it('every room has id, name, type, pricePerNight, available', async () => {
    const res = await request(app).get('/rooms')
    res.body.forEach(room => {
      expect(room).to.include.all.keys('id', 'name', 'type', 'pricePerNight', 'available')
    })
  })

  it('?type=suite returns only suite rooms', async () => {
    const res = await request(app).get('/rooms?type=suite')
    expect(res.status).to.equal(200)
    expect(res.body).to.be.an('array').with.lengthOf.above(0)
    res.body.forEach(room => expect(room.type).to.equal('suite'))
  })

  it('?type=nonsense returns an empty array', async () => {
    const res = await request(app).get('/rooms?type=nonsense')
    expect(res.status).to.equal(200)
    expect(res.body).to.be.an('array').with.lengthOf(0)
  })
})

describe('GET /rooms/:id', () => {
  it('returns 200 and the correct room for a valid id', async () => {
    const res = await request(app).get('/rooms/3')
    expect(res.status).to.equal(200)
    expect(res.body).to.include({ id: 3, name: 'Deluxe King' })
  })

  it('returns 404 with an error property for an unknown id', async () => {
    const res = await request(app).get('/rooms/999')
    expect(res.status).to.equal(404)
    expect(res.body).to.have.property('error')
  })
})

describe('GET /available', () => {
  it('returns 200 and an array', async () => {
    const res = await request(app).get('/available')
    expect(res.status).to.equal(200)
    expect(res.body).to.be.an('array')
  })

  it('every returned room has available === true', async () => {
    const res = await request(app).get('/available')
    expect(res.body.length).to.be.above(0)
    res.body.forEach(room => expect(room.available).to.equal(true))
  })
})
