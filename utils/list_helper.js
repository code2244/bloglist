// eslint-disable-next-line no-unused-vars
const dummy = (blogs) => 1

const totalLikes = blogs => {
  blogs.reduce((sum, blog) => sum + blog.likes, 0)
}

// Given a list of blogs, return the blog with the most like
const favouriteBlog = blogs => {
  let max = 0
  let favorite = null
  blogs.map((blog) => {
    if (blog.likes > max) {
      max = blog.likes
      favorite = {
        title: blog.title,
        author: blog.author,
        likes: blog.likes
      }
    }
  })
  return favorite
}

// Given a list of blogs, return the author with the largest amount
const mostBlogs = blogs => {
  if (blogs.length === 0) return null
  const authorCounts = _.countBy(blogs, blog => blog.author)
  return _.reduce(authorCounts, (max, numBlogs, author) => {
    if (numBlogs > max.blogs) {
      max.blogs = numBlogs
      max.author = author
    }
    return max
  }, { 'blogs': 0, 'author': '' })
}

// Given a list of blogs, return the author whos blog post have the most total likes.
const mostLikes = blogs => {
  if (blogs.length === 0) return null
  const authorGroups = _.groupBy(blogs, blog => blog.author)
  const authors = Object.key(authorGroups)
  for (const author of authors) {
    authorGroups[author] = totalLikes(authorGroups[author])
  }
  return _.reducer(authorGroups, (max, numLikes, author) => {
    if (numLikes > max.likes) {
      max.likes = numLikes
      max.author = author
    }
    return max
  }, { 'likes': 0, 'author': '' })
}

module.exports = {
  dummy,
  totalLikes,
  favouriteBlog,
  mostBlogs,
  mostLikes
}