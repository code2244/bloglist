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
    const blogsAtStart = await helper.blogsInDb()
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
    const blogsAtEnd = await helper.blogsInDb()
    expect(blogsAtEnd.body.length).toBe(blogsAtStart.length + 1)
  })

  test('can add a new blog without likes and they default to 0', async () => {
    const newBlog = {
      title: 'Another new blog',
      author: 'Jared',
      url: 'http://www.example.com'
    }
    const response = await api
      .post('/api/blogs')
      .send(newBlog)
      .expect(201)
      .expect('Content-Type', /application\/json/)
    expect(response.body.likes).toBe(0)
  })

  test('cannot add a new blog without a title', async () => {
    const blogsAtStart = await helper.blogsInDb()
    // attempting to add a blog without a title returns a 400 response
    const newBlog = {
      author: 'Joe',
      url: 'http://www.google.com'
    }
    const post_response = await api
      .post('/api/blogs')
      .send(newBlog)
      .expect(400)
    // make sure the user got the error message
    expect(post_response.body.error).toBeDefined

    // the number of blogs in the system is unchanged
    const blogsAtEnd = await helper.blogsInDb()
    expect(blogsAtEnd.length).toBe(blogsAtStart.length)
  })

  test('cannot add a new blog without a url', async () => {
    const blogsAtStart = await helper.blogsInDb()
    // attempting to add a blog without a title returns a 400 response
    const newBlog = {
      title: 'This should fail',
      author: 'Joe'
    }
    const post_response = await api
      .post('/api/blogs')
      .send(newBlog)
      .expect(400)
    // Make sure the user got an error message
    expect(post_response.body.error).toBeDefined()
    // the number of blogs in the system in unchanged
    const blogsAtEnd = await helper.blogsInDb()
    expect(blogsAtEnd.length).toBe(blogsAtStart.length)
  })
})

describe('delete blog endpoint', () => {

  test('can delete an existing blog', async () => {
    const blogsAtStart = await helper.blogsInDb()
    const blogIdToDelete = blogsAtStart[0].id

    await api.delete('/api/blogs/' + blogIdToDelete).expect(204)

    // the number of blogs in the system went down by 1
    const blogsAtEnd = await helper.blogsInDb()
    expect(blogsAtEnd.length).toBe(blogsAtStart.length - 1)
  })

  test('deleting a non existing blog has no effect', async () => {
    const blogsAtStart = await helper.blogsInDb()
    await api.delete('/api/blogs/5e962f0db69261c21414f95d').expect(204)

    // the number of blogs in the system is unchanged
    const blogsAtEnd = await helper.blogsInDb()
    expect(blogsAtEnd.length).toBe(blogsAtStart.length)
  })
})

describe('update blog endpoint', () => {

  test('can update an existing blog', async () => {
    const blogsAtStart = await helper.blogsInDb()

    const newBlog = {
      title: 'An updated blog',
      author: 'William',
      url: 'http://www.bing.com',
      likes: 100,
    }
    const response = await api.put('/api/blogs/' + blogsAtStart[0].id).send(newBlog)

    // Make sure it uses the existing ID
    expect(response.body.id).toBe(blogsAtStart[0].id)

    // Remove the ID and make sure the rest of the properties have the right data
    delete response.body.id
    expect(response.body).toEqual(newBlog)

    // the number of blogs in the system is unchanged
    const blogsAtEnd = await helper.blogsInDb()
    expect(blogsAtEnd.length).toBe(blogsAtStart.length)

    // the old blog was overwritten
    delete blogsAtEnd[0].id
    expect(blogsAtEnd[0]).toEqual(newBlog)
  })

  test('cannot update an existing blog without a title', async () => {
    const blogsAtStart = await helper.blogsInDb()

    // attempting to add a blog without a title returns a 400 response
    const newBlog = {
      author: 'Joe',
      url: 'http://www.google.com'
    }
    const response = await api.put('/api/blogs/' + blogsAtStart[0].id).send(newBlog)

    // Make sure the user got an error message
    expect(response.body.error).toBeDefined()

    // the number of blogs in the system is unchanged
    const blogsAtEnd = await helper.blogsInDb()
    expect(blogsAtEnd.length).toBe(blogsAtStart.length)
  })

  test('cannot update an existing blog without a url', async () => {
    const blogsAtStart = await helper.blogsInDb()

    // attempting to update a blog without a title returns a 400 response
    const newBlog = {
      title: 'This should fail',
      author: 'Joe'
    }
    const response = await api.put('/api/blogs/' + blogsAtStart[0].id).send(newBlog)

    // Make sure the user got an error message
    expect(response.body.error).toBeDefined()

    // the number of blogs in the system is unchanged
    const blogsAtEnd = await helper.blogsInDb()
    expect(blogsAtEnd.length).toBe(blogsAtStart.length)
  })

  test('can update an existing blog without likes and they default to 0', async () => {
    const blogsAtStart = await helper.blogsInDb()
    const newBlog = {
      title: 'Another New Blog',
      author: 'Jared',
      url: 'http://www.example.com'
    }
    const response = await api.put('/api/blogs/' + blogsAtStart[0].id).send(newBlog)

    expect(response.body.likes).toBe(0)
  })
})

afterAll(() => {
  mongoose.connection.close()
})