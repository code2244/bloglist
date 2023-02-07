const blogsRouter = require('express').Router()
const Blog = require('../models/blog')

// list all blogs
blogsRouter.get('/', async (request, response) => {
  const blogs = await Blog.find({})
  return response.json(blogs.map(blog => blog.toJSON()))
})

// add new blog
blogsRouter.post('/',  async (request, response) => {
  const blog = new Blog(request.body)
  const result = await blog.save()
  return response.status(201).json(result)
})

module.exports = blogsRouter