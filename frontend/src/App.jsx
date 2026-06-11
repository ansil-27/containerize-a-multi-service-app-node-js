import { Edit3, Loader2, Plus, RefreshCcw, Trash2, X } from "lucide-react";
import { useEffect, useMemo, useState } from "react";

const API_URL = import.meta.env.VITE_API_URL || "http://localhost:5000";

const emptyPost = {
  title: "",
  author: "Ansil",
  content: ""
};

function formatDate(value) {
  if (!value) return "Unknown date";
  const date = new Date(value);
  if (isNaN(date.getTime())) return "Invalid date";

  return new Intl.DateTimeFormat("en", {
    dateStyle: "medium",
    timeStyle: "short"
  }).format(date);
}

export default function App() {
  const [posts, setPosts] = useState([]);
  const [form, setForm] = useState(emptyPost);
  const [editingId, setEditingId] = useState(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");

  const editingPost = useMemo(
    () => posts.find((post) => post.id === editingId),
    [editingId, posts]
  );

  async function loadPosts() {
    setError("");
    setLoading(true);

    try {
      const response = await fetch(`${API_URL}/api/posts`);
      if (!response.ok) throw new Error("Unable to load posts");
      setPosts(await response.json());
    } catch (requestError) {
      setError(requestError.message);
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    loadPosts();
  }, []);

  function updateField(event) {
    const { name, value } = event.target;
    setForm((current) => ({ ...current, [name]: value }));
  }

  function beginEdit(post) {
    setEditingId(post.id);
    setForm({
      title: post.title,
      author: post.author,
      content: post.content
    });
  }

  function resetForm() {
    setEditingId(null);
    setForm(emptyPost);
  }

  async function savePost(event) {
    event.preventDefault();
    setSaving(true);
    setError("");

    const endpoint = editingId ? `${API_URL}/api/posts/${editingId}` : `${API_URL}/api/posts`;
    const method = editingId ? "PUT" : "POST";

    try {
      const response = await fetch(endpoint, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form)
      });

      const body = await response.json().catch(() => ({}));
      if (!response.ok) throw new Error(body.message || "Unable to save post");

      resetForm();
      await loadPosts();
    } catch (requestError) {
      setError(requestError.message);
    } finally {
      setSaving(false);
    }
  }

  async function deletePost(id) {
    setError("");

    try {
      const response = await fetch(`${API_URL}/api/posts/${id}`, { method: "DELETE" });
      if (!response.ok) throw new Error("Unable to delete post");

      if (editingId === id) resetForm();
      setPosts((current) => current.filter((post) => post.id !== id));
    } catch (requestError) {
      setError(requestError.message);
    }
  }

  return (
    <main className="app-shell">
      <section className="intro-band">
        <div>
          <p className="eyebrow">Personal notes and ideas</p>
          <h1>Ansil's Blog</h1>
        </div>
        <button className="icon-button" onClick={loadPosts} title="Refresh posts" type="button">
          <RefreshCcw size={20} />
        </button>
      </section>

      <section className="workspace">
        <form className="editor" onSubmit={savePost}>
          <div className="editor-heading">
            <div>
              <p className="eyebrow">{editingPost ? "Editing post" : "New post"}</p>
              <h2>{editingPost ? editingPost.title : "Write something fresh"}</h2>
            </div>
            {editingId && (
              <button className="icon-button subtle" onClick={resetForm} title="Cancel edit" type="button">
                <X size={20} />
              </button>
            )}
          </div>

          <label>
            Title
            <input
              name="title"
              onChange={updateField}
              placeholder="Post title"
              required
              value={form.title}
            />
          </label>

          <label>
            Author
            <input name="author" onChange={updateField} placeholder="Author" value={form.author} />
          </label>

          <label>
            Content
            <textarea
              name="content"
              onChange={updateField}
              placeholder="Write your blog post..."
              required
              rows="10"
              value={form.content}
            />
          </label>

          <button className="primary-button" disabled={saving} type="submit">
            {saving ? <Loader2 className="spin" size={18} /> : <Plus size={18} />}
            {editingId ? "Update Post" : "Publish Post"}
          </button>

          {error && <p className="error-text">{error}</p>}
        </form>

        <div className="posts-column">
          {loading ? (
            <div className="empty-state">
              <Loader2 className="spin" size={24} />
              Loading posts
            </div>
          ) : posts.length === 0 ? (
            <div className="empty-state">No posts yet.</div>
          ) : (
            posts.map((post) => (
              <article className="post-card" key={post.id}>
                <div className="post-meta">
                  <span>{post.author}</span>
                  <span>{formatDate(post.created_at)}</span>
                </div>
                <h3>{post.title}</h3>
                <p>{post.content}</p>
                <div className="post-actions">
                  <button onClick={() => beginEdit(post)} type="button">
                    <Edit3 size={16} />
                    Edit
                  </button>
                  <button className="danger" onClick={() => deletePost(post.id)} type="button">
                    <Trash2 size={16} />
                    Delete
                  </button>
                </div>
              </article>
            ))
          )}
        </div>
      </section>
    </main>
  );
}
