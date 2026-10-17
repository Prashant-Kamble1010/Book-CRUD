import React from 'react';
import { Eye, Edit3, Trash2, ArrowRightLeft, Star } from 'lucide-react';
import { getCategoryGradient } from '../constants/presets';

export default function BookTable({ books, onView, onEdit, onDelete, onToggleStatus }) {
  if (!books || books.length === 0) {
    return null;
  }

  return (
    <div className="table-responsive-wrapper">
      <table className="archival-table">
        <thead>
          <tr>
            <th className="th-cover">Cover</th>
            <th className="th-title">Title & Author</th>
            <th className="th-category">Genre</th>
            <th className="th-isbn">ISBN</th>
            <th className="th-specs">Year / Pages</th>
            <th className="th-status">Status</th>
            <th className="th-price">Price</th>
            <th className="th-actions text-right">Ledger Actions</th>
          </tr>
        </thead>
        <tbody>
          {books.map((book) => {
            const author = book.author || book.autor || 'Unknown Scholar';
            const category = book.category || 'General';
            const status = book.status || 'AVAILABLE';
            const year = book.publishedYear || 2023;
            const pages = book.pages || 320;
            const price = book.price ? Number(book.price).toFixed(2) : '24.99';
            const isAvailable = status === 'AVAILABLE';

            return (
              <tr key={book.bookId} className="table-row">
                {/* Thumbnail */}
                <td className="td-cover" onClick={() => onView(book)}>
                  <div className="table-thumbnail-wrapper">
                    {book.coverImageUrl ? (
                      <img
                        src={book.coverImageUrl}
                        alt={book.title}
                        className="table-thumbnail-img"
                        onError={(e) => {
                          e.target.style.display = 'none';
                          e.target.nextSibling.style.display = 'flex';
                        }}
                      />
                    ) : null}
                    <div
                      className="table-thumbnail-fallback"
                      style={{
                        display: book.coverImageUrl ? 'none' : 'flex',
                        background: getCategoryGradient(category),
                      }}
                    >
                      <span>{book.title?.substring(0, 2).toUpperCase()}</span>
                    </div>
                  </div>
                </td>

                {/* Title & Author */}
                <td className="td-title">
                  <div className="cell-title-block">
                    <span className="cell-book-title" onClick={() => onView(book)}>
                      {book.title}
                    </span>
                    <span className="cell-book-author">by {author}</span>
                  </div>
                </td>

                {/* Category */}
                <td className="td-category">
                  <span className="cell-category-pill">{category}</span>
                </td>

                {/* ISBN */}
                <td className="td-isbn">
                  <code className="isbn-code">{book.isbn || '—'}</code>
                </td>

                {/* Specs */}
                <td className="td-specs">
                  <div className="cell-specs">
                    <span>{year}</span>
                    <span className="spec-sub">{pages} pp.</span>
                  </div>
                </td>

                {/* Status */}
                <td className="td-status">
                  <span className={`status-badge status-${status.toLowerCase()}`}>
                    <span className="badge-dot"></span>
                    {status === 'AVAILABLE' ? 'Available' : status === 'BORROWED' ? 'Loaned' : 'Reading'}
                  </span>
                </td>

                {/* Price */}
                <td className="td-price">
                  <span className="price-tag">${price}</span>
                </td>

                {/* Actions */}
                <td className="td-actions text-right">
                  <div className="table-actions-group">
                    <button
                      type="button"
                      className="btn-table-action"
                      onClick={() => onToggleStatus(book)}
                      title={isAvailable ? 'Check Out' : 'Return Book'}
                    >
                      <ArrowRightLeft size={15} />
                    </button>
                    <button
                      type="button"
                      className="btn-table-action"
                      onClick={() => onView(book)}
                      title="Examine Details"
                    >
                      <Eye size={15} />
                    </button>
                    <button
                      type="button"
                      className="btn-table-action"
                      onClick={() => onEdit(book)}
                      title="Edit Record"
                    >
                      <Edit3 size={15} />
                    </button>
                    <button
                      type="button"
                      className="btn-table-action btn-table-delete"
                      onClick={() => onDelete(book)}
                      title="Remove from Catalog"
                    >
                      <Trash2 size={15} />
                    </button>
                  </div>
                </td>
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
}
