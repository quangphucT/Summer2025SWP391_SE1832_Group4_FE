import React, { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import { getAllBlogs } from "../../apis/blogsApi";
import "./index.scss";

const BlogDetailPage = () => {
  const { blogId } = useParams();
  const [blog, setBlog] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchBlog = async () => {
      try {
        setLoading(true);
        // If you have getBlogById, use it. Otherwise, filter from all blogs.
        const blogs = await getAllBlogs();
        const found = blogs.find((b) => String(b.blogId) === String(blogId));
        setBlog(found);
        setError(null);
      } catch (err) {
        setError("Failed to load blog detail.");
      } finally {
        setLoading(false);
      }
    };
    fetchBlog();
  }, [blogId]);

  if (loading) return <div className="blogs-container"><div className="spinner"></div></div>;
  if (error || !blog) return <div className="blogs-container"><div className="error-message">{error || "Blog not found."}</div></div>;

  return (
    <div className="blogs-container">
      <div className="blog-detail-card">
        <img className="blog-detail-image" src={blog.blogImageUrl} alt={blog.title} />
        <div className="blog-detail-tag">{blog.blogTagName}</div>
        <h1 className="blog-detail-title">{blog.title}</h1>
        <div className="blog-detail-content">{blog.content}</div>
        <div className="blog-detail-footer">
          <Link to="/blogs-page" className="read-more">Back to Blogs</Link>
        </div>
      </div>
    </div>
  );
};

export default BlogDetailPage; 