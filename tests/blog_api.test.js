// dependencies
const mongoose = require('mongoose')
const supertest = require('supertest')

const app = require('../app')
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
    const response = await api
      .get('/api/blogs')
      .expect(200)
      .expect('Content-Type', /application\/json/)

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

describe('add new blog endpoint', () => {
  test('can add new blog', async () => {
    // add new blog
    const newBlog = {
      title: 'A new blog',
      author: 'Carolin',
      url: 'http://www.fullheadopen.com',
      likes: 3
    }
    const post_response = await api
      .post('/api/blogs')
      .send(newBlog)
      .expect(201)
      .expect('Content-Type', /application\/json/)
    // make sure it got an ID assigned
    expect(post_response.body.id).toBeDefined()

    // remove the id and make sure the rest of the properties have the right data
    delete post_response.body.id
    expect(post_response.body).toEqual(newBlog)

    // verify that the total number of blogs has increased by 1
    const get_response = await api.get('/api/blogs')
    expect(get_response.body.length).toEqual(helper.blogFixtures.length + 1)
  })
})

afterAll(() => {
  mongoose.connection.close()
})