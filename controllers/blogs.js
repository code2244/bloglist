const blogsRouter = require('express').Router()
const Blog = require('../models/blog')

// list all blogs
blogsRouter.get('/', async (request, response) => {
  const blogs = await Blog.find({})
  return response.json(blogs.map(blog => blog.toJSON()))
})

// add new blog
blogsRouter.post('/', async (request, response) => {
  // eslint-disable-next-line no-prototype-builtins
  if (!request.body.hasOwnProperty('title')) {
    return response.status(400).json({ error: 'Missing title property' })
  }
  // eslint-disable-next-line no-prototype-builtins
  if (!request.body.hasOwnProperty('url')) {
    return response.status(400).json({ error: 'Missing url property'  })
  }
  const blog = new Blog({
    title: request.body.title,
    author: request.body.author,
    url: request.body.url,
    likes: request.body.likes === undefined ? 0 : request.body.likes
  })
  const result = await blog.save()
  return response.status(201).json(result)
})

module.exports = blogsRouter