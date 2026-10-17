import React from 'react';
import { AlertTriangle, X, Trash2 } from 'lucide-react';

export default function DeleteConfirmModal({ isOpen, book, onConfirm, onCancel }) {
  if (!isOpen || !book) return null;

  return (
    <div className="modal-backdrop" onClick={onCancel}>
      <div className="modal-dialog modal-sm" onClick={(e) => e.stopPropagation()}>
        <div className="delete-modal-content">
          <div className="delete-warning-icon">
            <AlertTriangle size={32} />
          </div>

          <h3 className="delete-modal-title">Decommission Volume?</h3>
          <p className="delete-modal-text">
            Are you sure you want to permanently remove <strong>"{book.title}"</strong> by {book.author || book.autor} from the archive?
          </p>

          <p className="delete-modal-warning">
            This action removes the entry from the database ledger.
          </p>

          <div className="delete-modal-actions">
            <button type="button" className="btn-outline" onClick={onCancel}>
              Cancel & Keep
            </button>
            <button
              type="button"
              className="btn-danger"
              onClick={() => onConfirm(book.bookId)}
            >
              <Trash2 size={16} />
              <span>Decommission</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
