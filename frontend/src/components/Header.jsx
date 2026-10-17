import React from 'react';
import { BookOpen, Plus, Moon, Sun, Sparkles, Database } from 'lucide-react';

export default function Header({ isDark, onToggleTheme, onOpenAddModal, isConnected, onRefresh }) {
  return (
    <header className="library-header">
      <div className="header-container">
        <div className="brand-group">
          <div className="crest-badge">
            <BookOpen className="crest-icon" size={26} />
          </div>
          <div className="brand-text">
            <div className="brand-tagline">
              <span>EST. 1894</span>
              <span className="dot">•</span>
              <span>BIBLIOTHECA SYSTEM</span>
            </div>
            <h1 className="brand-title">The Grand Archive</h1>
          </div>
        </div>

        <div className="header-actions">
          {/* Live backend status pill */}
          <button 
            type="button" 
            className={`status-pill ${isConnected ? 'connected' : 'offline'}`}
            onClick={onRefresh}
            title={isConnected ? 'Connected to Spring Boot on :8081 (Click to refresh)' : 'Backend offline (Click to retry)'}
          >
            <Database size={14} className="status-db-icon" />
            <span className="status-dot"></span>
            <span className="status-label">
              {isConnected ? 'Spring Boot 8081' : 'Offline'}
            </span>
          </button>

          {/* Theme Toggle */}
          <button
            type="button"
            className="theme-toggle-btn"
            onClick={onToggleTheme}
            aria-label="Toggle Library Ambiance"
            title={isDark ? 'Switch to Parchment Day' : 'Switch to Candlelit Study'}
          >
            {isDark ? <Sun size={18} className="theme-icon sun" /> : <Moon size={18} className="theme-icon moon" />}
            <span className="theme-text">{isDark ? 'Day' : 'Night'}</span>
          </button>

          {/* Add New Tome Button */}
          <button
            type="button"
            className="btn-primary add-book-btn"
            onClick={onOpenAddModal}
          >
            <Plus size={18} />
            <span>Shelve New Tome</span>
          </button>
        </div>
      </div>
    </header>
  );
}
