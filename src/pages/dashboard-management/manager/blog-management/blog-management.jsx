import React, { useEffect, useState } from "react";
import "./blog-management.scss";
import { toast } from "react-toastify";

import {
  getAllBlogTags,
  createBlogTag,
  updateBlogTagById,
  deleteBlogTagById,
} from "../../../../apis/blogsApi/blogtagsApi.js";
import {
  getAllBlogs,
  createBlog,
  updateBlogById,
  deleteBlogById,
} from "../../../../apis/blogsApi";

export default function BlogManagement() {
  // --- Tag State & Handlers ---
  const [tags, setTags] = useState([]);
  const [tagLoading, setTagLoading] = useState(false);
  const [tagFilters, setTagFilters] = useState({ name: "" });
  const [tagModalOpen, setTagModalOpen] = useState(false);
  const [editingTag, setEditingTag] = useState(null);
  const [tagForm, setTagForm] = useState({ name: "", description: "" });

  async function fetchTags(customFilters = tagFilters) {
    setTagLoading(true);
    try {
      const cleanFilters = {};
      Object.entries(customFilters).forEach(([key, value]) => {
        if (value !== undefined && value !== null) cleanFilters[key] = value;
      });
      const qs = new URLSearchParams(cleanFilters).toString();
      const data = await getAllBlogTags(qs ? `?${qs}` : "");
      let filtered = data;
      if (customFilters.name) {
        filtered = filtered.filter(tag =>
          tag.name.toLowerCase().includes(customFilters.name.toLowerCase())
        );
      }
      setTags(Array.isArray(filtered) ? filtered : []);
    } catch {}
    setTagLoading(false);
  }

  useEffect(() => {
    fetchTags();
  }, []);

  function handleTagFilterChange(e) {
    const { name, value } = e.target;
    setTagFilters(prev => ({ ...prev, [name]: value }));
  }
  function handleTagSearch(e) {
    e.preventDefault();
    fetchTags(tagFilters);
  }
  function openAddTag() {
    setEditingTag(null);
    setTagForm({ name: "", description: "" });
    setTagModalOpen(true);
  }
  function openEditTag(tag) {
    setEditingTag(tag);
    setTagForm({ name: tag.name, description: tag.description });
    setTagModalOpen(true);
  }
  function closeTagModal() {
    setEditingTag(null);
    setTagModalOpen(false);
    setTagForm({ name: "", description: "" });
  }
  async function saveTag(e) {
    e.preventDefault();
    const payload = { name: tagForm.name, description: tagForm.description };
    try {
      if (editingTag) {
        await updateBlogTagById(editingTag.blogTagId, payload);
        toast.success("Tag updated successfully");
      } else {
        await createBlogTag(payload);
        toast.success("Tag created successfully");
      }
      closeTagModal();
      fetchTags();
    } catch (error) {
      toast.error(error.message || "Operation failed");
    }
  }
  async function removeTag(id) {
    if (!window.confirm("Delete this tag?")) return;
    try {
      await deleteBlogTagById(id);
      toast.success("Tag deleted successfully");
      fetchTags();
    } catch (error) {
      toast.error(error.message || "Failed to delete tag");
    }
  }

  // --- Blog State & Handlers ---
  const [blogs, setBlogs] = useState([]);
  const [blogLoading, setBlogLoading] = useState(false);
  const [blogFilters, setBlogFilters] = useState({ title: "", blogTagId: "", createdFrom: "", createdTo: "" });
  const [blogModalOpen, setBlogModalOpen] = useState(false);
  const [editingBlog, setEditingBlog] = useState(null);
  const [blogForm, setBlogForm] = useState({
    title: "",
    content: "",
    blogImageUrl: "",
    blogTagId: "",
  });

  async function fetchBlogs(customFilters = blogFilters) {
    setBlogLoading(true);
    try {
      const cleanFilters = {};
      Object.entries(customFilters).forEach(([key, value]) => {
        if (value !== undefined && value !== null) cleanFilters[key] = value;
      });
      const qs = new URLSearchParams(cleanFilters).toString();
      const data = await getAllBlogs(qs ? `?${qs}` : "");
      let filtered = data;
      if (customFilters.title) {
        filtered = filtered.filter(blog =>
          blog.title.toLowerCase().includes(customFilters.title.toLowerCase())
        );
      }
      if (customFilters.blogTagId) {
        filtered = filtered.filter(blog =>
          String(blog.blogTagId) === String(customFilters.blogTagId)
        );
      }
      setBlogs(Array.isArray(filtered) ? filtered : []);
    } catch {}
    setBlogLoading(false);
  }

  useEffect(() => {
    fetchBlogs();
  }, []);

  function handleBlogFilterChange(e) {
    const { name, value } = e.target;
    setBlogFilters(prev => ({ ...prev, [name]: value }));
  }
  function handleBlogSearch(e) {
    e.preventDefault();
    fetchBlogs(blogFilters);
  }
  function openAddBlog() {
    setEditingBlog(null);
    setBlogForm({ title: "", content: "", blogImageUrl: "", blogTagId: "" });
    setBlogModalOpen(true);
  }
  function openEditBlog(blog) {
    setEditingBlog(blog);
    setBlogForm({
      title: blog.title,
      content: blog.content,
      blogImageUrl: blog.blogImageUrl,
      blogTagId: blog.blogTagId?.toString() || "",
    });
    setBlogModalOpen(true);
  }
  function closeBlogModal() {
    setEditingBlog(null);
    setBlogModalOpen(false);
    setBlogForm({ title: "", content: "", blogImageUrl: "", blogTagId: "" });
  }
  async function saveBlog(e) {
    e.preventDefault();
    const payload = {
      title: blogForm.title,
      content: blogForm.content,
      blogImageUrl: blogForm.blogImageUrl,
      blogTagId: Number(blogForm.blogTagId),
    };
    try {
      if (editingBlog) {
        await updateBlogById(editingBlog.blogId, payload);
        toast.success("Blog updated successfully");
      } else {
        await createBlog(payload);
        toast.success("Blog created successfully");
      }
      closeBlogModal();
      fetchBlogs();
    } catch (error) {
      toast.error(error.message || "Operation failed");
    }
  }
  async function removeBlog(id) {
    if (!window.confirm("Delete this blog?")) return;
    try {
      await deleteBlogById(id);
      toast.success("Blog deleted successfully");
      fetchBlogs();
    } catch (error) {
      toast.error(error.message || "Failed to delete blog");
    }
  }

  return (
    <div className="management-content-wrapper">
      <div className="blog-mgmt-root">
        {/* Blog Tag Section */}
        <h2 className="blog-mgmt-title">Blog Tags</h2>
        <form onSubmit={handleTagSearch} className="blog-mgmt-form">
          <input
            name="name"
            value={tagFilters.name}
            onChange={handleTagFilterChange}
            placeholder="Search by name"
          />
          <button type="submit">Search</button>
          <button type="button" onClick={openAddTag}>Add Tag</button>
        </form>
        {tagLoading ? (
          <p className="loading-text">Loading...</p>
        ) : (
          <div className="blog-mgmt-table-wrap">
            <table className="blog-mgmt-table">
              <thead>
                <tr>
                  <th>ID</th>
                  <th>Name</th>
                  <th>Description</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {tags.map(tag => (
                  <tr key={tag.blogTagId}>
                    <td>{tag.blogTagId}</td>
                    <td>{tag.name}</td>
                    <td>{tag.description}</td>
                    <td>
                      <button onClick={() => openEditTag(tag)} className="blog-mgmt-btn edit">Edit</button>
                      <button onClick={() => removeTag(tag.blogTagId)} className="blog-mgmt-btn delete">Delete</button>
                    </td>
                  </tr>
                ))}
                {tags.length === 0 && (
                  <tr>
                    <td colSpan="4" style={{ textAlign: "center" }}>No tags found</td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        )}
        {/* Tag Modal */}
        {tagModalOpen && (
          <div className="blog-mgmt-modal-bg">
            <form className="blog-mgmt-modal blog-mgmt-modal--large" onSubmit={saveTag}>
              <h3>{editingTag ? "Edit Tag" : "Add Tag"}</h3>
              <input
                required
                placeholder="Tag Name"
                value={tagForm.name}
                onChange={e => setTagForm(f => ({ ...f, name: e.target.value }))}
              />
              <input
                placeholder="Description"
                value={tagForm.description}
                onChange={e => setTagForm(f => ({ ...f, description: e.target.value }))}
              />
              <div className="blog-mgmt-modal__actions">
                <button type="submit" className="blog-mgmt-btn save">Save</button>
                <button type="button" className="blog-mgmt-btn cancel" onClick={closeTagModal}>Cancel</button>
              </div>
            </form>
          </div>
        )}

        {/* Blog Section */}
        <h2 className="blog-mgmt-title" style={{ marginTop: 32 }}>Blogs</h2>
        <form onSubmit={handleBlogSearch} className="blog-mgmt-form">
          <input
            name="title"
            value={blogFilters.title}
            onChange={handleBlogFilterChange}
            placeholder="Search by title"
          />
          <select
            name="blogTagId"
            value={blogFilters.blogTagId}
            onChange={handleBlogFilterChange}
          >
            <option value="">All Tags</option>
            {tags.map(tag => (
              <option key={tag.blogTagId} value={tag.blogTagId}>{tag.name}</option>
            ))}
          </select>
          <input
            type="date"
            name="createdFrom"
            value={blogFilters.createdFrom}
            onChange={handleBlogFilterChange}
          />
          <input
            type="date"
            name="createdTo"
            value={blogFilters.createdTo}
            onChange={handleBlogFilterChange}
          />
          <button type="submit">Search</button>
          <button type="button" onClick={openAddBlog}>Add Blog</button>
        </form>
        {blogLoading ? (
          <p className="loading-text">Loading...</p>
        ) : (
          <div className="blog-mgmt-table-wrap">
            <table className="blog-mgmt-table">
              <thead>
                <tr>
                  <th>ID</th>
                  <th>Title</th>
                  <th>Content</th>
                  <th>Image</th>
                  <th>Tag</th>
                  <th>Date</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {blogs.map(blog => (
                  <tr key={blog.blogId}>
                    <td>{blog.blogId}</td>
                    <td>{blog.title}</td>
                    <td>{blog.content}</td>
                    <td>
                      {blog.blogImageUrl ? (
                        <img src={blog.blogImageUrl} alt="" className="blog-image-thumb" />
                      ) : (
                        <span>No image</span>
                      )}
                    </td>
                    <td>{blog.blogTagName}</td>
                    <td>{blog.createdAt ? new Date(blog.createdAt).toLocaleDateString() : ""}</td>
                    <td>
                      <button onClick={() => openEditBlog(blog)} className="blog-mgmt-btn edit">Edit</button>
                      <button onClick={() => removeBlog(blog.blogId)} className="blog-mgmt-btn delete">Delete</button>
                    </td>
                  </tr>
                ))}
                {blogs.length === 0 && (
                  <tr>
                    <td colSpan="7" style={{ textAlign: "center" }}>No blogs found</td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        )}
        {/* Blog Modal */}
        {blogModalOpen && (
          <div className="blog-mgmt-modal-bg">
            <form className="blog-mgmt-modal blog-mgmt-modal--large" onSubmit={saveBlog}>
              <h3>{editingBlog ? "Edit Blog" : "Add Blog"}</h3>
              <input
                required
                placeholder="Title"
                value={blogForm.title}
                onChange={e => setBlogForm(f => ({ ...f, title: e.target.value }))}
              />
              <textarea
                required
                placeholder="Content"
                value={blogForm.content}
                onChange={e => setBlogForm(f => ({ ...f, content: e.target.value }))}
              />
              <input
                required
                placeholder="Image URL"
                value={blogForm.blogImageUrl}
                onChange={e => setBlogForm(f => ({ ...f, blogImageUrl: e.target.value }))}
              />
              <select
                required
                value={blogForm.blogTagId}
                onChange={e => setBlogForm(f => ({ ...f, blogTagId: e.target.value }))}
              >
                <option value="">Select Tag</option>
                {tags.map(tag => (
                  <option key={tag.blogTagId} value={tag.blogTagId}>{tag.name}</option>
                ))}
              </select>
              <div className="blog-mgmt-modal__actions">
                <button type="submit" className="blog-mgmt-btn save">Save</button>
                <button type="button" className="blog-mgmt-btn cancel" onClick={closeBlogModal}>Cancel</button>
              </div>
            </form>
          </div>
        )}
      </div>
    </div>
  );
}
