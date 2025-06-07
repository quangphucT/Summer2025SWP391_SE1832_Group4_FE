import './index.scss'
import { useState, useEffect } from 'react'
import { getAllBlogs } from '../../apis/blogsApi'

const BlogsPages = () => {
  const [blogs, setBlogs] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  useEffect(() => {
    const fetchBlogs = async () => {
      try {
        setLoading(true)
        const data = await getAllBlogs()
        setBlogs(data)
        setError(null)
      } catch (error) {
        console.error('Error fetching blogs:', error)
        setError('Failed to load blogs. Please try again later.')
      } finally {
        setLoading(false)
      }
    }

    fetchBlogs()
  }, [])

  const formatDate = (dateString) => {
    const date = new Date(dateString)
    return date.toLocaleDateString('vi-VN', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    })
  }

  if (loading) {
    return (
      <div className="blogs-container">
        <div className="spinner"></div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="blogs-container">
        <div className="error-message">{error}</div>
      </div>
    )
  }

  return (
    <div className="blogs-container">
      <div className="blogs-header">
        <h1 className="blogs-title">Latest Articles</h1>
        <p className="blogs-subtitle">Discover insights and stories from our community</p>
      </div>
      
      <div className="blogs-grid">
        {blogs.map((blog) => (
          <article key={blog.blogId} className="blog-card">
            <div className="blog-image">
              <img src={blog.blogImageUrl} alt={blog.title} loading="lazy" />
              <div className="blog-tag">{blog.blogTagName}</div>
            </div>
            <div className="blog-content">
              <h2 className="blog-title">{blog.title}</h2>
              <p className="blog-excerpt">{blog.content.substring(0, 150)}...</p>
              <div className="blog-footer">
                <span className="blog-date">{formatDate(blog.createdAt)}</span>
                <a href={`/blog/${blog.blogId}`} className="read-more">
                  Read More
                </a>
              </div>
            </div>
          </article>
        ))}
      </div>
    </div>
  )
}

export default BlogsPages
