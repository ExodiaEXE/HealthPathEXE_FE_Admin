"use client";

import { useEffect, useState, useCallback } from "react";
import ProtectedRoute from "@/components/ProtectedRoute";
import DashboardLayout from "@/components/DashboardLayout";
import blogApi from "@/lib/api/blogApi";
import {
  BlogCategory,
  CreateBlogCategory,
  Blog,
  BlogDetail,
  CreateBlog,
} from "@/schema/blog";
import { PageResponse } from "@/schema/user";

// ─── Category Modal ─────────────────────────────────────────────────────────

function CategoryModal({
  category,
  onClose,
  onSaved,
}: {
  category?: BlogCategory;
  onClose: () => void;
  onSaved: () => void;
}) {
  const isEdit = !!category;
  const [form, setForm] = useState<CreateBlogCategory>({
    name: category?.name || "",
    description: category?.description || "",
    isActive: category?.isActive ?? true,
  });
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState("");

  const handleSubmit = async () => {
    setError("");
    if (!form.name.trim()) {
      setError("Tên danh mục không được để trống.");
      return;
    }
    setSubmitting(true);
    try {
      if (isEdit && category) {
        await blogApi.updateCategory(category.id, form);
      } else {
        await blogApi.createCategory(form);
      }
      onSaved();
      onClose();
    } catch {
      setError(isEdit ? "Cập nhật danh mục thất bại." : "Tạo danh mục thất bại.");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-content" onClick={(e) => e.stopPropagation()}>
        <h2 className="modal-title">
          {isEdit ? "Chỉnh sửa danh mục" : "Tạo danh mục mới"}
        </h2>
        {error && (
          <div className="alert-error" style={{ marginBottom: "1rem" }}>
            {error}
          </div>
        )}
        <div className="form-group">
          <label className="input-label">Tên danh mục *</label>
          <input
            className="input-field"
            value={form.name}
            onChange={(e) => setForm({ ...form, name: e.target.value })}
            placeholder="Sức khỏe tinh thần"
            maxLength={150}
          />
        </div>
        <div className="form-group">
          <label className="input-label">Mô tả</label>
          <input
            className="input-field"
            value={form.description || ""}
            onChange={(e) => setForm({ ...form, description: e.target.value })}
            placeholder="Mô tả ngắn gọn về danh mục..."
            maxLength={500}
          />
        </div>
        <div className="form-group">
          <label className="input-label">Trạng thái</label>
          <button
            className={`toggle-switch ${form.isActive ? "active" : ""}`}
            onClick={() => setForm({ ...form, isActive: !form.isActive })}
            style={{ marginTop: "0.5rem" }}
          />
        </div>
        <div className="modal-actions">
          <button className="btn-ghost" onClick={onClose}>
            Hủy
          </button>
          <button
            className="btn-primary"
            onClick={handleSubmit}
            disabled={submitting}
          >
            {submitting ? "Đang lưu..." : isEdit ? "Cập nhật" : "Tạo mới"}
          </button>
        </div>
      </div>
    </div>
  );
}

// ─── Blog Modal ─────────────────────────────────────────────────────────────

function BlogModal({
  blog,
  categories,
  onClose,
  onSaved,
}: {
  blog?: BlogDetail;
  categories: BlogCategory[];
  onClose: () => void;
  onSaved: () => void;
}) {
  const isEdit = !!blog;
  const [form, setForm] = useState<CreateBlog>({
    title: blog?.title || "",
    body: blog?.body || "",
    summary: blog?.summary || "",
    thumbnailUrl: blog?.thumbnailUrl || "",
    categoryId: blog?.categoryId || (categories[0]?.id ?? ""),
    isActive: blog?.isActive ?? true,
  });
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState("");

  const handleSubmit = async () => {
    setError("");
    if (!form.title.trim()) {
      setError("Tiêu đề bài viết không được để trống.");
      return;
    }
    if (!form.body.trim()) {
      setError("Nội dung bài viết không được để trống.");
      return;
    }
    if (!form.categoryId) {
      setError("Vui lòng chọn danh mục.");
      return;
    }
    setSubmitting(true);
    try {
      if (isEdit && blog) {
        await blogApi.updateBlog(blog.id, form);
      } else {
        await blogApi.createBlog(form);
      }
      onSaved();
      onClose();
    } catch {
      setError(
        isEdit ? "Cập nhật bài viết thất bại." : "Tạo bài viết thất bại."
      );
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div
        className="modal-content"
        onClick={(e) => e.stopPropagation()}
        style={{ maxWidth: 680 }}
      >
        <h2 className="modal-title">
          {isEdit ? "Chỉnh sửa bài viết" : "Tạo bài viết mới"}
        </h2>
        {error && (
          <div className="alert-error" style={{ marginBottom: "1rem" }}>
            {error}
          </div>
        )}
        <div className="form-group">
          <label className="input-label">Tiêu đề *</label>
          <input
            className="input-field"
            value={form.title}
            onChange={(e) => setForm({ ...form, title: e.target.value })}
            placeholder="Nhập tiêu đề bài viết..."
            maxLength={250}
          />
        </div>
        <div className="form-row">
          <div className="form-group">
            <label className="input-label">Danh mục *</label>
            <select
              className="select-field"
              value={form.categoryId}
              onChange={(e) =>
                setForm({ ...form, categoryId: e.target.value })
              }
            >
              <option value="">— Chọn danh mục —</option>
              {categories.map((c) => (
                <option key={c.id} value={c.id}>
                  {c.name}
                </option>
              ))}
            </select>
          </div>
          <div className="form-group">
            <label className="input-label">Trạng thái</label>
            <button
              className={`toggle-switch ${form.isActive ? "active" : ""}`}
              onClick={() => setForm({ ...form, isActive: !form.isActive })}
              style={{ marginTop: "0.5rem" }}
            />
          </div>
        </div>
        <div className="form-group">
          <label className="input-label">Tóm tắt</label>
          <input
            className="input-field"
            value={form.summary || ""}
            onChange={(e) => setForm({ ...form, summary: e.target.value })}
            placeholder="Mô tả ngắn gọn bài viết..."
            maxLength={500}
          />
        </div>
        <div className="form-group">
          <label className="input-label">Ảnh đại diện (URL)</label>
          <input
            className="input-field"
            value={form.thumbnailUrl || ""}
            onChange={(e) =>
              setForm({ ...form, thumbnailUrl: e.target.value })
            }
            placeholder="https://example.com/image.jpg"
          />
          {form.thumbnailUrl && (
            <div
              style={{
                marginTop: "0.75rem",
                borderRadius: "var(--radius-md)",
                overflow: "hidden",
                border: "1px solid var(--border-default)",
                maxHeight: 160,
              }}
            >
              <img
                src={form.thumbnailUrl}
                alt="Preview"
                style={{
                  width: "100%",
                  height: 160,
                  objectFit: "cover",
                  display: "block",
                }}
                onError={(e) =>
                  ((e.target as HTMLImageElement).style.display = "none")
                }
              />
            </div>
          )}
        </div>
        <div className="form-group">
          <label className="input-label">Nội dung bài viết * (HTML)</label>
          <textarea
            className="input-field"
            value={form.body}
            onChange={(e) => setForm({ ...form, body: e.target.value })}
            placeholder="Nội dung bài viết (hỗ trợ HTML)..."
            rows={10}
            style={{ resize: "vertical", minHeight: 180, lineHeight: 1.6 }}
          />
        </div>
        <div className="modal-actions">
          <button className="btn-ghost" onClick={onClose}>
            Hủy
          </button>
          <button
            className="btn-primary"
            onClick={handleSubmit}
            disabled={submitting}
          >
            {submitting
              ? "Đang lưu..."
              : isEdit
                ? "Cập nhật"
                : "Đăng bài"}
          </button>
        </div>
      </div>
    </div>
  );
}

// ─── Blog Detail View Modal ─────────────────────────────────────────────────

function BlogDetailModal({
  blog,
  onClose,
}: {
  blog: BlogDetail;
  onClose: () => void;
}) {
  return (
    <div className="modal-overlay" onClick={onClose}>
      <div
        className="modal-content"
        onClick={(e) => e.stopPropagation()}
        style={{ maxWidth: 720 }}
      >
        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "flex-start",
            marginBottom: "1.25rem",
          }}
        >
          <div style={{ flex: 1, minWidth: 0 }}>
            <h2
              className="modal-title"
              style={{ marginBottom: "0.5rem", lineHeight: 1.3 }}
            >
              {blog.title}
            </h2>
            <div
              style={{
                display: "flex",
                flexWrap: "wrap",
                gap: "0.75rem",
                alignItems: "center",
              }}
            >
              <span className="badge badge-info">{blog.categoryName}</span>
              {blog.isActive ? (
                <span className="badge badge-success">Đang hiển thị</span>
              ) : (
                <span className="badge badge-danger">Đã ẩn</span>
              )}
              <span
                style={{
                  fontSize: "0.75rem",
                  color: "var(--text-muted)",
                  display: "flex",
                  alignItems: "center",
                  gap: "0.35rem",
                }}
              >
                <svg
                  width="14"
                  height="14"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                >
                  <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z" />
                  <circle cx="12" cy="12" r="3" />
                </svg>
                {blog.views.toLocaleString()} lượt xem
              </span>
            </div>
          </div>
          <button
            className="btn-ghost"
            onClick={onClose}
            style={{ padding: "0.4rem", flexShrink: 0, marginLeft: "0.75rem" }}
          >
            <svg
              width="18"
              height="18"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <line x1="18" y1="6" x2="6" y2="18" />
              <line x1="6" y1="6" x2="18" y2="18" />
            </svg>
          </button>
        </div>

        {blog.thumbnailUrl && (
          <div
            style={{
              borderRadius: "var(--radius-md)",
              overflow: "hidden",
              border: "1px solid var(--border-default)",
              marginBottom: "1.25rem",
              maxHeight: 240,
            }}
          >
            <img
              src={blog.thumbnailUrl}
              alt={blog.title}
              style={{
                width: "100%",
                height: 240,
                objectFit: "cover",
                display: "block",
              }}
            />
          </div>
        )}

        {blog.summary && (
          <p
            style={{
              fontSize: "0.9rem",
              color: "var(--text-secondary)",
              fontStyle: "italic",
              marginBottom: "1rem",
              padding: "0.75rem 1rem",
              background: "var(--bg-glass)",
              borderRadius: "var(--radius-sm)",
              borderLeft: "3px solid var(--accent-primary)",
            }}
          >
            {blog.summary}
          </p>
        )}

        <div
          className="blog-body-preview"
          style={{
            fontSize: "0.9rem",
            color: "var(--text-secondary)",
            lineHeight: 1.8,
            maxHeight: 360,
            overflowY: "auto",
            padding: "0.5rem 0",
          }}
          dangerouslySetInnerHTML={{ __html: blog.body }}
        />

        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            marginTop: "1.25rem",
            paddingTop: "1rem",
            borderTop: "1px solid var(--border-default)",
            fontSize: "0.75rem",
            color: "var(--text-muted)",
          }}
        >
          <span>Tạo: {new Date(blog.createdAt).toLocaleDateString("vi-VN")}</span>
          <span>
            Cập nhật: {new Date(blog.updatedAt).toLocaleDateString("vi-VN")}
          </span>
        </div>
      </div>
    </div>
  );
}

// ─── Categories Tab ─────────────────────────────────────────────────────────

function CategoriesTab() {
  const [categories, setCategories] = useState<BlogCategory[]>([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [editCat, setEditCat] = useState<BlogCategory | undefined>();
  const [deleting, setDeleting] = useState<string | null>(null);

  const fetchCategories = useCallback(async () => {
    setLoading(true);
    try {
      const data = await blogApi.getCategories();
      setCategories(data);
    } catch {
      // API not available
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchCategories();
  }, [fetchCategories]);

  const handleDelete = async (id: string) => {
    if (!confirm("Bạn có chắc chắn muốn xóa danh mục này?")) return;
    setDeleting(id);
    try {
      await blogApi.deleteCategory(id);
      fetchCategories();
    } catch {
      // silently handled
    } finally {
      setDeleting(null);
    }
  };

  return (
    <>
      <div className="search-bar">
        <div style={{ flex: 1 }} />
        <button
          className="btn-primary"
          onClick={() => {
            setEditCat(undefined);
            setShowModal(true);
          }}
        >
          + Thêm danh mục
        </button>
      </div>

      <div className="glass-card-static" style={{ padding: "1.5rem" }}>
        {loading ? (
          <div className="empty-state">
            <div className="spinner" />
          </div>
        ) : categories.length === 0 ? (
          <div className="empty-state">
            <svg
              width="48"
              height="48"
              viewBox="0 0 24 24"
              fill="none"
              stroke="var(--text-muted)"
              strokeWidth="1.2"
              strokeLinecap="round"
              strokeLinejoin="round"
              style={{ opacity: 0.5 }}
            >
              <path d="M22 19a2 2 0 01-2 2H4a2 2 0 01-2-2V5a2 2 0 012-2h5l2 3h9a2 2 0 012 2z" />
            </svg>
            <p>Chưa có danh mục nào.</p>
          </div>
        ) : (
          <div style={{ overflowX: "auto" }}>
            <table className="data-table">
              <thead>
                <tr>
                  <th>Tên danh mục</th>
                  <th>Slug</th>
                  <th>Mô tả</th>
                  <th>Trạng thái</th>
                  <th>Ngày tạo</th>
                  <th>Thao tác</th>
                </tr>
              </thead>
              <tbody>
                {categories.map((cat) => (
                  <tr key={cat.id}>
                    <td
                      style={{
                        fontWeight: 600,
                        color: "var(--text-primary)",
                      }}
                    >
                      {cat.name}
                    </td>
                    <td>
                      <span
                        style={{
                          fontSize: "0.8rem",
                          color: "var(--text-muted)",
                          fontFamily: "monospace",
                        }}
                      >
                        {cat.slug}
                      </span>
                    </td>
                    <td>
                      <span
                        style={{
                          maxWidth: 200,
                          display: "inline-block",
                          overflow: "hidden",
                          textOverflow: "ellipsis",
                          whiteSpace: "nowrap",
                        }}
                      >
                        {cat.description || "—"}
                      </span>
                    </td>
                    <td>
                      {cat.isActive ? (
                        <span className="badge badge-success">Hoạt động</span>
                      ) : (
                        <span className="badge badge-danger">Đã ẩn</span>
                      )}
                    </td>
                    <td style={{ fontSize: "0.8rem", color: "var(--text-muted)" }}>
                      {new Date(cat.createdAt).toLocaleDateString("vi-VN")}
                    </td>
                    <td>
                      <div style={{ display: "flex", gap: "0.5rem" }}>
                        <button
                          className="btn-ghost"
                          style={{
                            fontSize: "0.75rem",
                            padding: "0.35rem 0.65rem",
                          }}
                          onClick={() => {
                            setEditCat(cat);
                            setShowModal(true);
                          }}
                        >
                          Sửa
                        </button>
                        <button
                          className="btn-danger"
                          style={{
                            fontSize: "0.75rem",
                            padding: "0.35rem 0.65rem",
                          }}
                          onClick={() => handleDelete(cat.id)}
                          disabled={deleting === cat.id}
                        >
                          {deleting === cat.id ? "..." : "Xóa"}
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {showModal && (
        <CategoryModal
          category={editCat}
          onClose={() => setShowModal(false)}
          onSaved={fetchCategories}
        />
      )}
    </>
  );
}

// ─── Blogs Tab ──────────────────────────────────────────────────────────────

function BlogsTab() {
  const [data, setData] = useState<PageResponse<Blog> | null>(null);
  const [categories, setCategories] = useState<BlogCategory[]>([]);
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(1);
  const [search, setSearch] = useState("");
  const [filterCategory, setFilterCategory] = useState("");
  const [showModal, setShowModal] = useState(false);
  const [editBlog, setEditBlog] = useState<BlogDetail | undefined>();
  const [viewBlog, setViewBlog] = useState<BlogDetail | null>(null);
  const [deleting, setDeleting] = useState<string | null>(null);
  const [toggling, setToggling] = useState<string | null>(null);
  const [loadingDetail, setLoadingDetail] = useState(false);

  const fetchCategories = useCallback(async () => {
    try {
      const cats = await blogApi.getCategories();
      setCategories(cats);
    } catch {
      // API not available — empty state will show
    }
  }, []);

  const fetchBlogs = useCallback(async () => {
    setLoading(true);
    try {
      const res = await blogApi.getBlogs(
        filterCategory || undefined,
        search || undefined,
        page,
        10
      );
      setData(res);
    } catch {
      // API error — empty state will show
    } finally {
      setLoading(false);
    }
  }, [page, search, filterCategory]);

  useEffect(() => {
    fetchCategories();
  }, [fetchCategories]);

  useEffect(() => {
    fetchBlogs();
  }, [fetchBlogs]);

  // Debounced search
  const [searchInput, setSearchInput] = useState("");
  useEffect(() => {
    const timer = setTimeout(() => {
      setSearch(searchInput);
      setPage(1);
    }, 400);
    return () => clearTimeout(timer);
  }, [searchInput]);

  const handleDelete = async (id: string) => {
    if (!confirm("Bạn có chắc chắn muốn xóa bài viết này?")) return;
    setDeleting(id);
    try {
      await blogApi.deleteBlog(id);
      fetchBlogs();
    } catch {
      // silently handled
    } finally {
      setDeleting(null);
    }
  };

  const handleToggle = async (id: string) => {
    setToggling(id);
    try {
      await blogApi.toggleBlogActive(id);
      fetchBlogs();
    } catch {
      // silently handled
    } finally {
      setToggling(null);
    }
  };

  const handleView = async (id: string) => {
    setLoadingDetail(true);
    try {
      const detail = await blogApi.getBlogById(id);
      setViewBlog(detail);
    } catch {
      // silently handled
    } finally {
      setLoadingDetail(false);
    }
  };

  const handleEdit = async (id: string) => {
    setLoadingDetail(true);
    try {
      const detail = await blogApi.getBlogById(id);
      setEditBlog(detail);
      setShowModal(true);
    } catch {
      // silently handled
    } finally {
      setLoadingDetail(false);
    }
  };

  return (
    <>
      <div className="search-bar">
        <div className="search-wrapper">
          <svg
            width="18"
            height="18"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <circle cx="11" cy="11" r="8" />
            <line x1="21" y1="21" x2="16.65" y2="16.65" />
          </svg>
          <input
            className="search-input"
            placeholder="Tìm kiếm bài viết..."
            value={searchInput}
            onChange={(e) => setSearchInput(e.target.value)}
          />
        </div>
        <select
          className="select-field"
          style={{ maxWidth: 200, marginBottom: 0 }}
          value={filterCategory}
          onChange={(e) => {
            setFilterCategory(e.target.value);
            setPage(1);
          }}
        >
          <option value="">Tất cả danh mục</option>
          {categories.map((c) => (
            <option key={c.id} value={c.id}>
              {c.name}
            </option>
          ))}
        </select>
        <button
          className="btn-primary"
          onClick={() => {
            setEditBlog(undefined);
            setShowModal(true);
          }}
        >
          + Viết bài mới
        </button>
      </div>

      <div className="glass-card-static" style={{ padding: "1.5rem" }}>
        {loading || loadingDetail ? (
          <div className="empty-state">
            <div className="spinner" />
            {loadingDetail && <p style={{ fontSize: "0.8rem" }}>Đang tải...</p>}
          </div>
        ) : !data || data.items.length === 0 ? (
          <div className="empty-state">
            <svg
              width="48"
              height="48"
              viewBox="0 0 24 24"
              fill="none"
              stroke="var(--text-muted)"
              strokeWidth="1.2"
              strokeLinecap="round"
              strokeLinejoin="round"
              style={{ opacity: 0.5 }}
            >
              <path d="M14 2H6a2 2 0 00-2 2v16a2 2 0 002 2h12a2 2 0 002-2V8z" />
              <polyline points="14,2 14,8 20,8" />
              <line x1="16" y1="13" x2="8" y2="13" />
              <line x1="16" y1="17" x2="8" y2="17" />
              <polyline points="10,9 9,9 8,9" />
            </svg>
            <p>Chưa có bài viết nào.</p>
          </div>
        ) : (
          <>
            <div style={{ overflowX: "auto" }}>
              <table className="data-table">
                <thead>
                  <tr>
                    <th style={{ minWidth: 240 }}>Bài viết</th>
                    <th>Danh mục</th>
                    <th>Lượt xem</th>
                    <th>Trạng thái</th>
                    <th>Ngày tạo</th>
                    <th>Thao tác</th>
                  </tr>
                </thead>
                <tbody>
                  {data.items.map((blog) => (
                    <tr key={blog.id}>
                      <td>
                        <div
                          style={{
                            display: "flex",
                            alignItems: "center",
                            gap: "0.75rem",
                          }}
                        >
                          {blog.thumbnailUrl ? (
                            <div
                              style={{
                                width: 48,
                                height: 48,
                                borderRadius: "var(--radius-sm)",
                                overflow: "hidden",
                                flexShrink: 0,
                                border: "1px solid var(--border-default)",
                              }}
                            >
                              <img
                                src={blog.thumbnailUrl}
                                alt=""
                                style={{
                                  width: "100%",
                                  height: "100%",
                                  objectFit: "cover",
                                }}
                              />
                            </div>
                          ) : (
                            <div
                              style={{
                                width: 48,
                                height: 48,
                                borderRadius: "var(--radius-sm)",
                                background: "var(--bg-glass-hover)",
                                display: "flex",
                                alignItems: "center",
                                justifyContent: "center",
                                flexShrink: 0,
                              }}
                            >
                              <svg
                                width="20"
                                height="20"
                                viewBox="0 0 24 24"
                                fill="none"
                                stroke="var(--text-muted)"
                                strokeWidth="1.5"
                              >
                                <rect
                                  x="3"
                                  y="3"
                                  width="18"
                                  height="18"
                                  rx="2"
                                  ry="2"
                                />
                                <circle cx="8.5" cy="8.5" r="1.5" />
                                <polyline points="21,15 16,10 5,21" />
                              </svg>
                            </div>
                          )}
                          <div style={{ minWidth: 0 }}>
                            <div
                              style={{
                                fontWeight: 600,
                                color: "var(--text-primary)",
                                fontSize: "0.875rem",
                                whiteSpace: "nowrap",
                                overflow: "hidden",
                                textOverflow: "ellipsis",
                                maxWidth: 220,
                                cursor: "pointer",
                              }}
                              onClick={() => handleView(blog.id)}
                              title={blog.title}
                            >
                              {blog.title}
                            </div>
                            {blog.summary && (
                              <div
                                style={{
                                  fontSize: "0.75rem",
                                  color: "var(--text-muted)",
                                  whiteSpace: "nowrap",
                                  overflow: "hidden",
                                  textOverflow: "ellipsis",
                                  maxWidth: 220,
                                }}
                              >
                                {blog.summary}
                              </div>
                            )}
                          </div>
                        </div>
                      </td>
                      <td>
                        <span className="badge badge-info">
                          {blog.categoryName}
                        </span>
                      </td>
                      <td>
                        <span
                          style={{
                            display: "flex",
                            alignItems: "center",
                            gap: "0.35rem",
                            fontSize: "0.85rem",
                          }}
                        >
                          <svg
                            width="14"
                            height="14"
                            viewBox="0 0 24 24"
                            fill="none"
                            stroke="currentColor"
                            strokeWidth="2"
                          >
                            <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z" />
                            <circle cx="12" cy="12" r="3" />
                          </svg>
                          {blog.views.toLocaleString()}
                        </span>
                      </td>
                      <td>
                        <button
                          className={`toggle-switch ${blog.isActive ? "active" : ""}`}
                          onClick={() => handleToggle(blog.id)}
                          disabled={toggling === blog.id}
                          title={
                            blog.isActive ? "Nhấn để ẩn" : "Nhấn để hiển thị"
                          }
                        />
                      </td>
                      <td
                        style={{
                          fontSize: "0.8rem",
                          color: "var(--text-muted)",
                        }}
                      >
                        {new Date(blog.createdAt).toLocaleDateString("vi-VN")}
                      </td>
                      <td>
                        <div style={{ display: "flex", gap: "0.5rem" }}>
                          <button
                            className="btn-ghost"
                            style={{
                              fontSize: "0.75rem",
                              padding: "0.35rem 0.65rem",
                            }}
                            onClick={() => handleView(blog.id)}
                            title="Xem chi tiết"
                          >
                            <svg
                              width="14"
                              height="14"
                              viewBox="0 0 24 24"
                              fill="none"
                              stroke="currentColor"
                              strokeWidth="2"
                              strokeLinecap="round"
                              strokeLinejoin="round"
                            >
                              <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z" />
                              <circle cx="12" cy="12" r="3" />
                            </svg>
                          </button>
                          <button
                            className="btn-ghost"
                            style={{
                              fontSize: "0.75rem",
                              padding: "0.35rem 0.65rem",
                            }}
                            onClick={() => handleEdit(blog.id)}
                          >
                            Sửa
                          </button>
                          <button
                            className="btn-danger"
                            style={{
                              fontSize: "0.75rem",
                              padding: "0.35rem 0.65rem",
                            }}
                            onClick={() => handleDelete(blog.id)}
                            disabled={deleting === blog.id}
                          >
                            {deleting === blog.id ? "..." : "Xóa"}
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            {data.totalPages > 1 && (
              <div className="pagination">
                <button
                  className="page-btn"
                  disabled={!data.hasPrev}
                  onClick={() => setPage((p) => p - 1)}
                >
                  ←
                </button>
                {Array.from({ length: data.totalPages }, (_, i) => i + 1)
                  .slice(Math.max(0, page - 3), page + 2)
                  .map((p) => (
                    <button
                      key={p}
                      className={`page-btn ${p === page ? "active" : ""}`}
                      onClick={() => setPage(p)}
                    >
                      {p}
                    </button>
                  ))}
                <button
                  className="page-btn"
                  disabled={!data.hasNext}
                  onClick={() => setPage((p) => p + 1)}
                >
                  →
                </button>
              </div>
            )}
          </>
        )}
      </div>

      {showModal && (
        <BlogModal
          blog={editBlog}
          categories={categories}
          onClose={() => setShowModal(false)}
          onSaved={fetchBlogs}
        />
      )}

      {viewBlog && (
        <BlogDetailModal
          blog={viewBlog}
          onClose={() => setViewBlog(null)}
        />
      )}
    </>
  );
}

// ─── Main Content ───────────────────────────────────────────────────────────

function BlogsContent() {
  const [activeTab, setActiveTab] = useState<"posts" | "categories">("posts");

  return (
    <div className="animate-fade-in">
      {/* Tab Bar */}
      <div className="tab-bar">
        <button
          className={`tab-btn ${activeTab === "posts" ? "active" : ""}`}
          onClick={() => setActiveTab("posts")}
        >
          <span
            style={{
              display: "inline-flex",
              alignItems: "center",
              gap: "0.5rem",
            }}
          >
            <svg
              width="16"
              height="16"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <path d="M14 2H6a2 2 0 00-2 2v16a2 2 0 002 2h12a2 2 0 002-2V8z" />
              <polyline points="14,2 14,8 20,8" />
              <line x1="16" y1="13" x2="8" y2="13" />
              <line x1="16" y1="17" x2="8" y2="17" />
            </svg>
            Bài viết
          </span>
        </button>
        <button
          className={`tab-btn ${activeTab === "categories" ? "active" : ""}`}
          onClick={() => setActiveTab("categories")}
        >
          <span
            style={{
              display: "inline-flex",
              alignItems: "center",
              gap: "0.5rem",
            }}
          >
            <svg
              width="16"
              height="16"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <path d="M22 19a2 2 0 01-2 2H4a2 2 0 01-2-2V5a2 2 0 012-2h5l2 3h9a2 2 0 012 2z" />
            </svg>
            Danh mục
          </span>
        </button>
      </div>

      {/* Tab Content */}
      {activeTab === "posts" ? <BlogsTab /> : <CategoriesTab />}
    </div>
  );
}

export default function BlogsPage() {
  return (
    <ProtectedRoute>
      <DashboardLayout>
        <BlogsContent />
      </DashboardLayout>
    </ProtectedRoute>
  );
}
