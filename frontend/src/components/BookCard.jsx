import React from 'react';
import { Eye, Edit3, Trash2, Star, BookOpen, Clock, Check, ArrowRightLeft } from 'lucide-react';
import { getCategoryGradient } from '../constants/presets';

export default function BookCard({ book, onView, onEdit, onDelete, onToggleStatus }) {
  const authorName = book.author || book.autor || 'Unknown Scholar';
  const category = book.category || 'General';
  const status = book.status || 'AVAILABLE';
  const rating = book.rating ?? 4.8;
  const year = book.publishedYear || 2023;
  const pages = book.pages || 320;
  const price = book.price ? Number(book.price).toFixed(2) : '24.99';

  const isAvailable = status === 'AVAILABLE';

  return (
    <article className="book-card">
      <div className="book-card-inner">
        {/* Book Cover Area */}
        <div className="book-cover-container" onClick={() => onView(book)}>
          <div className="book-spine-effect"></div>
          
          {book.coverImageUrl ? (
            <img
              src={book.coverImageUrl}
              alt={book.title}
              className="book-cover-img"
              loading="lazy"
              onError={(e) => {
                // If remote image fails, show decorative fallback cover
                e.target.style.display = 'none';
                e.target.nextSibling.style.display = 'flex';
              }}
            />
          ) : null}

          {/* Fallback decorative cover with elegant typography and gradient */}
          <div
            className="book-cover-fallback"
            style={{
              display: book.coverImageUrl ? 'none' : 'flex',
              background: getCategoryGradient(category),
            }}
          >
            <div className="fallback-frame">
              <span className="fallback-category-label">{category}</span>
              <h3 className="fallback-title">{book.title}</h3>
              <div className="fallback-divider"></div>
              <span className="fallback-author">{authorName}</span>
            </div>
          </div>

          {/* Category ribbon */}
          <div className="card-category-ribbon">{category}</div>

          {/* Quick preview hover badge */}
          <div className="cover-hover-overlay">
            <span className="cover-inspect-pill">
              <Eye size={15} /> Examine Volume
            </span>
          </div>
        </div>

        {/* Book Details Info */}
        <div className="book-info">
          {/* Status & Rating Bar */}
          <div className="book-meta-top">
            <span className={`status-badge status-${status.toLowerCase()}`}>
              <span className="badge-dot"></span>
              {status === 'AVAILABLE' ? 'Available' : status === 'BORROWED' ? 'Loaned Out' : 'Reading Room'}
            </span>

            <div className="rating-pill" title={`${rating} / 5.0 stars`}>
              <Star size={13} className="star-icon" fill="currentColor" />
              <span>{rating}</span>
            </div>
          </div>

          {/* Book Title */}
          <h3 className="book-title" title={book.title} onClick={() => onView(book)}>
            {book.title}
          </h3>

          {/* Author */}
          <p className="book-author">by <strong>{authorName}</strong></p>

          {/* Specs: Year, Pages, Price */}
          <div className="book-specs">
            <span className="spec-item" title="Published Year">{year}</span>
            <span className="spec-separator">•</span>
            <span className="spec-item" title="Page Count">{pages} pages</span>
            <span className="spec-separator">•</span>
            <span className="spec-price" title="Catalog Price">${price}</span>
          </div>

          {/* Card Action Footer */}
          <div className="card-action-footer">
            {/* Quick Status Toggle Button */}
            <button
              type="button"
              className={`btn-quick-status ${isAvailable ? 'btn-borrow' : 'btn-return'}`}
              onClick={() => onToggleStatus(book)}
              title={isAvailable ? 'Issue loan (Mark Borrowed)' : 'Return volume to shelf (Mark Available)'}
            >
              <ArrowRightLeft size={14} />
              <span>{isAvailable ? 'Check Out' : 'Return'}</span>
            </button>

            {/* Action Icon Buttons */}
            <div className="card-icon-actions">
              <button
                type="button"
                className="btn-icon-action"
                onClick={() => onView(book)}
                title="View Full Volume Details"
                aria-label="View Details"
              >
                <Eye size={16} />
              </button>

              <button
                type="button"
                className="btn-icon-action"
                onClick={() => onEdit(book)}
                title="Edit Tome Record"
                aria-label="Edit Book"
              >
                <Edit3 size={16} />
              </button>

              <button
                type="button"
                className="btn-icon-action btn-icon-delete"
                onClick={() => onDelete(book)}
                title="Decommission / Remove Tome"
                aria-label="Delete Book"
              >
                <Trash2 size={16} />
              </button>
            </div>
          </div>
        </div>
      </div>
    </article>
  );
}
