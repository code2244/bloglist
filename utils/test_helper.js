const blogFixtures = [
  {
    'title': 'My first blog',
    'author': 'John',
    'url': 'http://localhost:3003',
    'likes': 5

  },
  {
    'title': 'Hello World',
    'author': 'David',
    'url': 'http://localhost:3003',
    'likes': 6
  }
]

const blogsInDb = async () => {
  const blogs = await Blog.find({})
  return blogs.map(blog => blog.toJSON())
}

module.exports = {
  blogFixtures,
  blogsInDb
}