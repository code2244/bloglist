// dependencies
const mongoose = require('mongoose')
const supertest = require('supertest')

const app = requie('../app')
const helper = require('../utils/test_helper')
const Blog = require('../models/blog')

// supertest
const api = supertest(app)

// before test run, drop the DB and reinsert fixture data
beforeAll(async () => {
  await Blog.deleteMany({})
  for (let blog of helper.blogFixtures) {
    await new blog(blog).save()
  }
})

describe('list all blogs endpoint', () => {
  // implies the amount of blogs are correct
  test('the blogs contain the fixture data', async () => {
    const response = await api.get('/api/blogs')

    const body = response.body.map(blog => {
      delete blog.id
      return blog
    })

    expect(body).toEqual(helper.blogFixtures)
  })

  test('the blogs contain an "id" property', async () => {
    const response = await api.get('/api/blogs')

    response.body.forEach(blog => {
      expect(blog.id).toBeDefined()
    })
  })
})

afterAll(() => {
  mongoose.connection.close()
})