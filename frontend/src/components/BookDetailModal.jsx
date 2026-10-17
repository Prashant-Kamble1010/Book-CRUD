import React from 'react';
import { X, Star, Calendar, FileText, Tag, Barcode, ArrowRightLeft, Edit3, Trash2 } from 'lucide-react';
import { getCategoryGradient } from '../constants/presets';

export default function BookDetailModal({ book, onClose, onEdit, onDelete, onToggleStatus }) {
  if (!book) return null;

  const author = book.author || book.autor || 'Unknown Scholar';
  const category = book.category || 'General';
  const status = book.status || 'AVAILABLE';
  const rating = book.rating ?? 4.8;
  const year = book.publishedYear || 2023;
  const pages = book.pages || 320;
  const price = book.price ? Number(book.price).toFixed(2) : '24.99';
  const isbn = book.isbn || '978-0123456789';
  const description = book.description || 'No detailed synopsis has been recorded for this volume yet.';
  const isAvailable = status === 'AVAILABLE';

  return (
    <div className="modal-backdrop" onClick={onClose}>
      <div className="modal-dialog modal-lg" onClick={(e) => e.stopPropagation()}>
        {/* Modal Close Button */}
        <button type="button" className="modal-close-btn" onClick={onClose} aria-label="Close modal">
          <X size={20} />
        </button>

        <div className="detail-modal-layout">
          {/* Left Column: Book Cover, Barcode & Quick Status */}
          <div className="detail-cover-sidebar">
            <div className="detail-cover-frame">
              {book.coverImageUrl ? (
                <img
                  src={book.coverImageUrl}
                  alt={book.title}
                  className="detail-cover-image"
                  onError={(e) => {
                    e.target.style.display = 'none';
                    e.target.nextSibling.style.display = 'flex';
                  }}
                />
              ) : null}

              <div
                className="detail-cover-fallback"
                style={{
                  display: book.coverImageUrl ? 'none' : 'flex',
                  background: getCategoryGradient(category),
                }}
              >
                <div className="fallback-frame">
                  <span className="fallback-category-label">{category}</span>
                  <h3 className="fallback-title">{book.title}</h3>
                  <div className="fallback-divider"></div>
                  <span className="fallback-author">{author}</span>
                </div>
              </div>
            </div>

            {/* Circulation Status Card */}
            <div className="detail-status-box">
              <span className="status-box-label">Circulation Status</span>
              <div className={`status-badge status-${status.toLowerCase()}`}>
                <span className="badge-dot"></span>
                {status === 'AVAILABLE' ? 'Available on Shelf' : status === 'BORROWED' ? 'Currently Loaned' : 'In Reading Room'}
              </div>

              <button
                type="button"
                className={`btn-primary detail-status-toggle ${isAvailable ? 'btn-loan' : 'btn-checkin'}`}
                onClick={() => onToggleStatus(book)}
              >
                <ArrowRightLeft size={16} />
                <span>{isAvailable ? 'Check Out Volume' : 'Return to Shelf'}</span>
              </button>
            </div>

            {/* ISBN Barcode Badge */}
            <div className="detail-barcode-box">
              <Barcode size={28} className="barcode-icon" />
              <div className="barcode-numbers">
                <span className="barcode-label">CATALOG ISBN</span>
                <span className="barcode-value">{isbn}</span>
              </div>
            </div>
          </div>

          {/* Right Column: Title, Author, Specs, Description & Actions */}
          <div className="detail-content-body">
            <div className="detail-genre-pill">{category}</div>
            <h2 className="detail-title">{book.title}</h2>
            <p className="detail-author">Written by <span className="author-highlight">{author}</span></p>

            {/* Rating and Price banner */}
            <div className="detail-highlight-row">
              <div className="detail-rating-pill">
                <Star size={16} fill="currentColor" className="star-icon" />
                <strong>{rating}</strong>
                <span className="rating-scale">/ 5.0</span>
              </div>
              <div className="detail-price-pill">
                <span>Value:</span>
                <strong>${price}</strong>
              </div>
            </div>

            {/* Meta Specs Grid */}
            <div className="detail-specs-grid">
              <div className="spec-tile">
                <Calendar size={18} className="spec-tile-icon" />
                <div className="spec-tile-text">
                  <span className="spec-tile-label">Published</span>
                  <span className="spec-tile-val">{year}</span>
                </div>
              </div>
              <div className="spec-tile">
                <FileText size={18} className="spec-tile-icon" />
                <div className="spec-tile-text">
                  <span className="spec-tile-label">Extent</span>
                  <span className="spec-tile-val">{pages} pages</span>
                </div>
              </div>
              <div className="spec-tile">
                <Tag size={18} className="spec-tile-icon" />
                <div className="spec-tile-text">
                  <span className="spec-tile-label">Collection</span>
                  <span className="spec-tile-val">{category}</span>
                </div>
              </div>
            </div>

            {/* Description / Synopsis */}
            <div className="detail-synopsis-section">
              <h4 className="section-title">Archival Synopsis</h4>
              <p className="synopsis-paragraph">{description}</p>
            </div>

            {/* Modal Bottom Actions */}
            <div className="detail-footer-actions">
              <button
                type="button"
                className="btn-secondary"
                onClick={() => {
                  onClose();
                  onEdit(book);
                }}
              >
                <Edit3 size={16} />
                <span>Edit Record</span>
              </button>

              <button
                type="button"
                className="btn-danger"
                onClick={() => {
                  onClose();
                  onDelete(book);
                }}
              >
                <Trash2 size={16} />
                <span>Decommission</span>
              </button>

              <button type="button" className="btn-outline ml-auto" onClick={onClose}>
                Close Ledger
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
