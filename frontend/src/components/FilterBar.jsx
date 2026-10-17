import React from 'react';
import { Search, X, LayoutGrid, List, SlidersHorizontal } from 'lucide-react';
import { CATEGORIES } from '../constants/presets';

export default function FilterBar({
  searchQuery,
  onSearchChange,
  selectedCategory,
  onCategoryChange,
  selectedStatus,
  onStatusChange,
  sortBy,
  onSortChange,
  viewMode,
  onViewModeChange,
  totalMatching,
}) {
  return (
    <div className="filter-bar-container">
      {/* Top row: Search + Status Filter + Sort + View Mode */}
      <div className="filter-top-row">
        {/* Search input with vintage motif */}
        <div className="search-input-wrapper">
          <Search size={18} className="search-icon" />
          <input
            type="text"
            className="search-input"
            placeholder="Search volumes by title, author, genre or ISBN..."
            value={searchQuery}
            onChange={(e) => onSearchChange(e.target.value)}
          />
          {searchQuery && (
            <button
              type="button"
              className="clear-search-btn"
              onClick={() => onSearchChange('')}
              title="Clear search"
            >
              <X size={15} />
            </button>
          )}
        </div>

        {/* Right controls: Status filter, Sort, and View Mode */}
        <div className="filter-controls-group">
          {/* Status selector */}
          <div className="select-wrapper">
            <select
              className="library-select"
              value={selectedStatus}
              onChange={(e) => onStatusChange(e.target.value)}
            >
              <option value="ALL">All Circulation Statuses</option>
              <option value="AVAILABLE">Available on Shelf</option>
              <option value="BORROWED">Currently Loaned</option>
              <option value="READING">In Reading Room</option>
            </select>
          </div>

          {/* Sort selector */}
          <div className="select-wrapper">
            <select
              className="library-select"
              value={sortBy}
              onChange={(e) => onSortChange(e.target.value)}
            >
              <option value="title_asc">Title (A to Z)</option>
              <option value="title_desc">Title (Z to A)</option>
              <option value="author_asc">Author (A to Z)</option>
              <option value="year_desc">Year (Newest First)</option>
              <option value="rating_desc">Highest Rated</option>
              <option value="price_asc">Price (Low to High)</option>
            </select>
          </div>

          {/* View Mode Toggle: Grid vs Table */}
          <div className="view-mode-toggle">
            <button
              type="button"
              className={`view-btn ${viewMode === 'grid' ? 'active' : ''}`}
              onClick={() => onViewModeChange('grid')}
              title="Bookshelf Grid View"
            >
              <LayoutGrid size={18} />
            </button>
            <button
              type="button"
              className={`view-btn ${viewMode === 'table' ? 'active' : ''}`}
              onClick={() => onViewModeChange('table')}
              title="Archival Ledger Table View"
            >
              <List size={18} />
            </button>
          </div>
        </div>
      </div>

      {/* Bottom row: Category Filter Pills & Results Counter */}
      <div className="category-pills-row">
        <div className="category-scroll-container">
          {CATEGORIES.map((cat) => {
            const isActive = selectedCategory === cat || (cat === 'All' && selectedCategory === 'ALL');
            return (
              <button
                key={cat}
                type="button"
                className={`category-pill ${isActive ? 'active' : ''}`}
                onClick={() => onCategoryChange(cat === 'All' ? 'ALL' : cat)}
              >
                {cat}
              </button>
            );
          })}
        </div>

        <div className="results-counter">
          <span>{totalMatching}</span> {totalMatching === 1 ? 'Volume' : 'Volumes'} Found
        </div>
      </div>
    </div>
  );
}
