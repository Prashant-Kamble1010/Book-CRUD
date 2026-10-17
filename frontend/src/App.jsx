import React, { useState, useEffect, useMemo } from 'react';
import Header from './components/Header';
import StatsBanner from './components/StatsBanner';
import FilterBar from './components/FilterBar';
import BookCard from './components/BookCard';
import BookTable from './components/BookTable';
import BookDetailModal from './components/BookDetailModal';
import BookFormModal from './components/BookFormModal';
import DeleteConfirmModal from './components/DeleteConfirmModal';
import Toast from './components/Toast';
import { fetchBooks, fetchStats, createBook, updateBook, deleteBook } from './api';
import { BookOpen, RefreshCw, PlusCircle, SearchX, AlertCircle } from 'lucide-react';
import './index.css';

export default function App() {
  const [books, setBooks] = useState([]);
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);
  const [isConnected, setIsConnected] = useState(false);
  const [isDark, setIsDark] = useState(() => {
    return localStorage.getItem('library_theme') === 'dark';
  });

  // Filter & Search states
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('ALL');
  const [selectedStatus, setSelectedStatus] = useState('ALL');
  const [sortBy, setSortBy] = useState('title_asc');
  const [viewMode, setViewMode] = useState('grid'); // 'grid' | 'table'

  // Modals state
  const [viewingBook, setViewingBook] = useState(null);
  const [editingBook, setEditingBook] = useState(null);
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [deletingBook, setDeletingBook] = useState(null);

  // Toast
  const [toast, setToast] = useState(null);

  const showToast = (message, type = 'success') => {
    setToast({ message, type });
  };

  // Toggle Dark/Light Theme
  const toggleTheme = () => {
    setIsDark((prev) => {
      const next = !prev;
      localStorage.setItem('library_theme', next ? 'dark' : 'light');
      return next;
    });
  };

  useEffect(() => {
    if (isDark) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  }, [isDark]);

  // Load books & stats from Spring Boot
  const loadData = async () => {
    try {
      setLoading(true);
      const [booksData, statsData] = await Promise.all([
        fetchBooks(),
        fetchStats().catch(() => null),
      ]);

      setBooks(Array.isArray(booksData) ? booksData : []);
      if (statsData) {
        setStats(statsData);
      } else {
        // Compute stats locally if stats endpoint unavailable
        computeLocalStats(booksData);
      }
      setIsConnected(true);
    } catch (err) {
      console.warn('Backend connection issue:', err);
      setIsConnected(false);
      showToast('Backend offline or connecting to localhost:8081...', 'info');
    } finally {
      setLoading(false);
    }
  };

  const computeLocalStats = (bookList) => {
    const list = Array.isArray(bookList) ? bookList : [];
    const total = list.length;
    const available = list.filter((b) => (b.status || 'AVAILABLE') === 'AVAILABLE').length;
    const borrowed = list.filter((b) => b.status === 'BORROWED').length;
    const reading = list.filter((b) => b.status === 'READING').length;
    const categories = new Set(list.map((b) => b.category || 'General'));
    setStats({
      totalBooks: total,
      availableBooks: available,
      borrowedBooks: borrowed,
      readingBooks: reading,
      categoriesCount: categories.size,
    });
  };

  useEffect(() => {
    loadData();
  }, []);

  // Handle Create Book
  const handleCreateBook = async (bookData) => {
    try {
      const created = await createBook(bookData);
      showToast(`"${created.title}" successfully added to the catalog!`, 'success');
      setIsAddModalOpen(false);
      loadData();
    } catch (err) {
      showToast(`Error adding book: ${err.message}`, 'error');
    }
  };

  // Handle Update Book
  const handleUpdateBook = async (bookData) => {
    try {
      const id = editingBook?.bookId;
      const updated = await updateBook(id, bookData);
      showToast(`"${updated.title}" updated successfully!`, 'success');
      setEditingBook(null);
      if (viewingBook?.bookId === id) {
        setViewingBook(updated);
      }
      loadData();
    } catch (err) {
      showToast(`Error updating book: ${err.message}`, 'error');
    }
  };

  // Handle Delete Book
  const handleDeleteBook = async (id) => {
    try {
      await deleteBook(id);
      showToast('Book successfully decommissioned from archive.', 'info');
      setDeletingBook(null);
      if (viewingBook?.bookId === id) {
        setViewingBook(null);
      }
      loadData();
    } catch (err) {
      showToast(`Error deleting book: ${err.message}`, 'error');
    }
  };

  // Quick Toggle Status (Available <-> Borrowed)
  const handleToggleStatus = async (book) => {
    try {
      const newStatus = book.status === 'BORROWED' ? 'AVAILABLE' : 'BORROWED';
      const updated = await updateBook(book.bookId, { status: newStatus });
      const statusText = newStatus === 'AVAILABLE' ? 'returned to shelf' : 'loaned out';
      showToast(`"${book.title}" ${statusText}!`, 'success');
      if (viewingBook?.bookId === book.bookId) {
        setViewingBook(updated);
      }
      loadData();
    } catch (err) {
      showToast(`Failed to update status: ${err.message}`, 'error');
    }
  };

  // Filter and sort books in memory for instant feedback
  const filteredBooks = useMemo(() => {
    return books
      .filter((b) => {
        // Search filter
        if (searchQuery.trim()) {
          const q = searchQuery.toLowerCase();
          const title = (b.title || '').toLowerCase();
          const author = (b.author || b.autor || '').toLowerCase();
          const category = (b.category || '').toLowerCase();
          const isbn = (b.isbn || '').toLowerCase();
          if (!title.includes(q) && !author.includes(q) && !category.includes(q) && !isbn.includes(q)) {
            return false;
          }
        }

        // Category filter
        if (selectedCategory && selectedCategory !== 'ALL') {
          if ((b.category || 'General').toLowerCase() !== selectedCategory.toLowerCase()) {
            return false;
          }
        }

        // Status filter
        if (selectedStatus && selectedStatus !== 'ALL') {
          if ((b.status || 'AVAILABLE').toUpperCase() !== selectedStatus.toUpperCase()) {
            return false;
          }
        }

        return true;
      })
      .sort((a, b) => {
        if (sortBy === 'title_asc') {
          return (a.title || '').localeCompare(b.title || '');
        }
        if (sortBy === 'title_desc') {
          return (b.title || '').localeCompare(a.title || '');
        }
        if (sortBy === 'author_asc') {
          const authA = a.author || a.autor || '';
          const authB = b.author || b.autor || '';
          return authA.localeCompare(authB);
        }
        if (sortBy === 'year_desc') {
          return (b.publishedYear || 0) - (a.publishedYear || 0);
        }
        if (sortBy === 'rating_desc') {
          return (b.rating || 0) - (a.rating || 0);
        }
        if (sortBy === 'price_asc') {
          return (a.price || 0) - (b.price || 0);
        }
        return 0;
      });
  }, [books, searchQuery, selectedCategory, selectedStatus, sortBy]);

  return (
    <div className="library-app">
      {/* Library Top Header */}
      <Header
        isDark={isDark}
        onToggleTheme={toggleTheme}
        onOpenAddModal={() => setIsAddModalOpen(true)}
        isConnected={isConnected}
        onRefresh={loadData}
      />

      {/* Main Library Hall Content */}
      <main className="library-main">
        {/* Offline notice if backend isn't reachable */}
        {!isConnected && !loading && (
          <div className="connection-alert">
            <AlertCircle size={20} />
            <div className="connection-alert-text">
              <strong>Spring Boot Service Reconnecting:</strong> Connecting to port 8081. Ensure your Java backend is active.
            </div>
            <button type="button" className="btn-retry" onClick={loadData}>
              <RefreshCw size={14} /> Recheck
            </button>
          </div>
        )}

        {/* Library Stats Banner */}
        <StatsBanner stats={stats} />

        {/* Controls, Search, Filter pills and View Toggles */}
        <FilterBar
          searchQuery={searchQuery}
          onSearchChange={setSearchQuery}
          selectedCategory={selectedCategory}
          onCategoryChange={setSelectedCategory}
          selectedStatus={selectedStatus}
          onStatusChange={setSelectedStatus}
          sortBy={sortBy}
          onSortChange={setSortBy}
          viewMode={viewMode}
          onViewModeChange={setViewMode}
          totalMatching={filteredBooks.length}
        />

        {/* Loading Spinner */}
        {loading ? (
          <div className="loading-state">
            <div className="library-spinner"></div>
            <p>Browsing the archive shelves...</p>
          </div>
        ) : filteredBooks.length > 0 ? (
          /* Book Collection Views */
          viewMode === 'grid' ? (
            <div className="bookshelf-grid">
              {filteredBooks.map((book) => (
                <BookCard
                  key={book.bookId}
                  book={book}
                  onView={setViewingBook}
                  onEdit={setEditingBook}
                  onDelete={setDeletingBook}
                  onToggleStatus={handleToggleStatus}
                />
              ))}
            </div>
          ) : (
            <BookTable
              books={filteredBooks}
              onView={setViewingBook}
              onEdit={setEditingBook}
              onDelete={setDeletingBook}
              onToggleStatus={handleToggleStatus}
            />
          )
        ) : (
          /* Empty Search / Catalog State */
          <div className="empty-catalog-state">
            <div className="empty-icon-wrapper">
              <SearchX size={44} />
            </div>
            <h3 className="empty-title">No Volumes Found in Archives</h3>
            <p className="empty-description">
              {searchQuery || selectedCategory !== 'ALL' || selectedStatus !== 'ALL'
                ? 'Try adjusting your search criteria or resetting filters to reveal more books.'
                : 'The library ledger is currently empty. Shelve your first book to begin the catalog.'}
            </p>
            <div className="empty-actions">
              {(searchQuery || selectedCategory !== 'ALL' || selectedStatus !== 'ALL') && (
                <button
                  type="button"
                  className="btn-outline"
                  onClick={() => {
                    setSearchQuery('');
                    setSelectedCategory('ALL');
                    setSelectedStatus('ALL');
                  }}
                >
                  Clear All Filters
                </button>
              )}
              <button
                type="button"
                className="btn-primary"
                onClick={() => setIsAddModalOpen(true)}
              >
                <PlusCircle size={17} />
                <span>Shelve New Book</span>
              </button>
            </div>
          </div>
        )}
      </main>

      {/* Footer */}
      <footer className="library-footer">
        <div className="footer-content">
          <p className="footer-title">
            <BookOpen size={16} className="inline-icon" /> The Grand Archive • Spring Boot &amp; React CRUD System
          </p>
          <p className="footer-sub">
            Connected to Spring Boot API running on port 8081 • MySQL Database &bull; Java 21
          </p>
        </div>
      </footer>

      {/* Book Details Modal */}
      {viewingBook && (
        <BookDetailModal
          book={viewingBook}
          onClose={() => setViewingBook(null)}
          onEdit={(book) => {
            setViewingBook(null);
            setEditingBook(book);
          }}
          onDelete={(book) => {
            setViewingBook(null);
            setDeletingBook(book);
          }}
          onToggleStatus={handleToggleStatus}
        />
      )}

      {/* Add Book Modal */}
      <BookFormModal
        isOpen={isAddModalOpen}
        onClose={() => setIsAddModalOpen(false)}
        onSave={handleCreateBook}
        initialBook={null}
      />

      {/* Edit Book Modal */}
      <BookFormModal
        isOpen={Boolean(editingBook)}
        onClose={() => setEditingBook(null)}
        onSave={handleUpdateBook}
        initialBook={editingBook}
      />

      {/* Delete Confirmation Modal */}
      <DeleteConfirmModal
        isOpen={Boolean(deletingBook)}
        book={deletingBook}
        onConfirm={handleDeleteBook}
        onCancel={() => setDeletingBook(null)}
      />

      {/* Notification Toast */}
      <Toast toast={toast} onClose={() => setToast(null)} />
    </div>
  );
}
