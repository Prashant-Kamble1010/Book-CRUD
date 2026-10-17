import React, { useState, useEffect } from 'react';
import { X, Upload, Image, Sparkles, AlertCircle } from 'lucide-react';
import { PRESET_COVERS, CATEGORIES, STATUS_OPTIONS, getCategoryGradient } from '../constants/presets';
import { uploadCoverImage } from '../api';

export default function BookFormModal({ isOpen, onClose, onSave, initialBook = null }) {
  const isEdit = Boolean(initialBook?.bookId);

  const [formData, setFormData] = useState({
    title: '',
    author: '',
    category: 'Programming',
    status: 'AVAILABLE',
    publishedYear: 2024,
    pages: 350,
    price: 29.99,
    rating: 4.8,
    isbn: '',
    description: '',
    coverImageUrl: '',
  });

  const [isUploading, setIsUploading] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    if (initialBook) {
      setFormData({
        title: initialBook.title || '',
        author: initialBook.author || initialBook.autor || '',
        category: initialBook.category || 'Programming',
        status: initialBook.status || 'AVAILABLE',
        publishedYear: initialBook.publishedYear || 2024,
        pages: initialBook.pages || 350,
        price: initialBook.price ?? 29.99,
        rating: initialBook.rating ?? 4.8,
        isbn: initialBook.isbn || '',
        description: initialBook.description || '',
        coverImageUrl: initialBook.coverImageUrl || '',
      });
    } else {
      setFormData({
        title: '',
        author: '',
        category: 'Programming',
        status: 'AVAILABLE',
        publishedYear: 2024,
        pages: 350,
        price: 29.99,
        rating: 4.8,
        isbn: '978-' + Math.floor(1000000000 + Math.random() * 9000000000),
        description: '',
        coverImageUrl: PRESET_COVERS[0].url,
      });
    }
    setError('');
  }, [initialBook, isOpen]);

  if (!isOpen) return null;

  const handleChange = (e) => {
    const { name, value, type } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: type === 'number' ? (value === '' ? '' : Number(value)) : value,
    }));
  };

  const handleFileUpload = async (e) => {
    const file = e.target.files?.[0];
    if (!file) return;

    try {
      setIsUploading(true);
      setError('');
      const uploadedUrl = await uploadCoverImage(file);
      if (uploadedUrl) {
        setFormData((prev) => ({ ...prev, coverImageUrl: uploadedUrl }));
      }
    } catch (err) {
      setError('File upload failed: ' + err.message);
    } finally {
      setIsUploading(false);
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!formData.title.trim()) {
      setError('Title is required for cataloging.');
      return;
    }
    if (!formData.author.trim()) {
      setError('Author is required.');
      return;
    }

    onSave({
      ...formData,
      autor: formData.author, // Ensure autor field is also populated for Spring Boot backend
    });
  };

  return (
    <div className="modal-backdrop" onClick={onClose}>
      <div className="modal-dialog modal-xl" onClick={(e) => e.stopPropagation()}>
        {/* Header */}
        <div className="modal-header">
          <div className="modal-title-group">
            <span className="modal-subtitle">BIBLIOTHECA REGISTRY</span>
            <h3 className="modal-title">
              {isEdit ? 'Update Catalog Record' : 'Shelve New Tome into Archive'}
            </h3>
          </div>
          <button type="button" className="modal-close-btn" onClick={onClose}>
            <X size={20} />
          </button>
        </div>

        {error && (
          <div className="form-error-banner">
            <AlertCircle size={18} />
            <span>{error}</span>
          </div>
        )}

        <form onSubmit={handleSubmit} className="book-form">
          <div className="form-grid-layout">
            {/* Left Column: Cover Preview & Cover Chooser */}
            <div className="form-cover-column">
              <label className="field-label">Volume Cover Art</label>

              {/* Cover Live Preview */}
              <div className="form-cover-preview-card">
                {formData.coverImageUrl ? (
                  <img
                    src={formData.coverImageUrl}
                    alt="Cover preview"
                    className="form-cover-img"
                    onError={(e) => {
                      e.target.style.display = 'none';
                      e.target.nextSibling.style.display = 'flex';
                    }}
                  />
                ) : null}

                <div
                  className="form-cover-fallback"
                  style={{
                    display: formData.coverImageUrl ? 'none' : 'flex',
                    background: getCategoryGradient(formData.category),
                  }}
                >
                  <div className="fallback-frame">
                    <span className="fallback-category-label">{formData.category || 'General'}</span>
                    <h4 className="fallback-title">{formData.title || 'Untitled Volume'}</h4>
                    <span className="fallback-author">{formData.author || 'Author Name'}</span>
                  </div>
                </div>
              </div>

              {/* Upload Button */}
              <div className="cover-upload-section">
                <label className="btn-file-upload">
                  <Upload size={16} />
                  <span>{isUploading ? 'Uploading...' : 'Upload Cover Image'}</span>
                  <input
                    type="file"
                    accept="image/*"
                    onChange={handleFileUpload}
                    disabled={isUploading}
                    className="hidden-file-input"
                  />
                </label>
              </div>

              {/* Presets Gallery */}
              <div className="cover-presets-section">
                <span className="presets-label">
                  <Sparkles size={13} /> Or Select Curated Cover:
                </span>
                <div className="presets-grid">
                  {PRESET_COVERS.map((preset, idx) => (
                    <button
                      key={idx}
                      type="button"
                      className={`preset-thumb-btn ${formData.coverImageUrl === preset.url ? 'selected' : ''}`}
                      onClick={() => setFormData((p) => ({ ...p, coverImageUrl: preset.url }))}
                      title={preset.name}
                    >
                      <img src={preset.url} alt={preset.name} />
                    </button>
                  ))}
                </div>
              </div>
            </div>

            {/* Right Column: Form Inputs */}
            <div className="form-fields-column">
              {/* Title */}
              <div className="form-group">
                <label className="field-label required">Volume Title</label>
                <input
                  type="text"
                  name="title"
                  className="library-input"
                  placeholder="e.g. Clean Code: Handbook of Agile Software"
                  value={formData.title}
                  onChange={handleChange}
                  required
                />
              </div>

              {/* Author */}
              <div className="form-group">
                <label className="field-label required">Author / Scholar</label>
                <input
                  type="text"
                  name="author"
                  className="library-input"
                  placeholder="e.g. Robert C. Martin"
                  value={formData.author}
                  onChange={handleChange}
                  required
                />
              </div>

              {/* Category & Status */}
              <div className="form-row-2">
                <div className="form-group">
                  <label className="field-label">Genre / Category</label>
                  <select
                    name="category"
                    className="library-select"
                    value={formData.category}
                    onChange={handleChange}
                  >
                    {CATEGORIES.filter((c) => c !== 'All').map((cat) => (
                      <option key={cat} value={cat}>
                        {cat}
                      </option>
                    ))}
                  </select>
                </div>

                <div className="form-group">
                  <label className="field-label">Circulation Status</label>
                  <select
                    name="status"
                    className="library-select"
                    value={formData.status}
                    onChange={handleChange}
                  >
                    {STATUS_OPTIONS.map((opt) => (
                      <option key={opt.value} value={opt.value}>
                        {opt.label}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              {/* Year, Pages, Price, Rating */}
              <div className="form-row-4">
                <div className="form-group">
                  <label className="field-label">Year</label>
                  <input
                    type="number"
                    name="publishedYear"
                    className="library-input"
                    value={formData.publishedYear}
                    onChange={handleChange}
                    min="1400"
                    max="2099"
                  />
                </div>

                <div className="form-group">
                  <label className="field-label">Pages</label>
                  <input
                    type="number"
                    name="pages"
                    className="library-input"
                    value={formData.pages}
                    onChange={handleChange}
                    min="1"
                  />
                </div>

                <div className="form-group">
                  <label className="field-label">Price ($)</label>
                  <input
                    type="number"
                    step="0.01"
                    name="price"
                    className="library-input"
                    value={formData.price}
                    onChange={handleChange}
                    min="0"
                  />
                </div>

                <div className="form-group">
                  <label className="field-label">Rating (1-5)</label>
                  <input
                    type="number"
                    step="0.1"
                    name="rating"
                    className="library-input"
                    value={formData.rating}
                    onChange={handleChange}
                    min="1"
                    max="5"
                  />
                </div>
              </div>

              {/* ISBN */}
              <div className="form-group">
                <label className="field-label">ISBN Catalog Number</label>
                <input
                  type="text"
                  name="isbn"
                  className="library-input"
                  placeholder="e.g. 978-0132350884"
                  value={formData.isbn}
                  onChange={handleChange}
                />
              </div>

              {/* Custom Cover Image URL input */}
              <div className="form-group">
                <label className="field-label">Custom Image URL (Optional)</label>
                <input
                  type="url"
                  name="coverImageUrl"
                  className="library-input"
                  placeholder="https://images.unsplash.com/..."
                  value={formData.coverImageUrl}
                  onChange={handleChange}
                />
              </div>

              {/* Description */}
              <div className="form-group">
                <label className="field-label">Archival Synopsis / Description</label>
                <textarea
                  name="description"
                  rows={3}
                  className="library-textarea"
                  placeholder="Brief synopsis, key themes, or historical notes..."
                  value={formData.description}
                  onChange={handleChange}
                />
              </div>
            </div>
          </div>

          {/* Form Actions Footer */}
          <div className="modal-footer">
            <button type="button" className="btn-outline" onClick={onClose}>
              Cancel
            </button>
            <button type="submit" className="btn-primary">
              {isEdit ? 'Save Changes' : 'Confirm & Shelve Book'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
