import React from 'react';
import { Library, CheckCircle2, BookMarked, Layers } from 'lucide-react';

export default function StatsBanner({ stats }) {
  const cards = [
    {
      label: 'Archived Volumes',
      value: stats?.totalBooks ?? 0,
      subtext: 'Cataloged in database',
      icon: Library,
      color: 'gold',
    },
    {
      label: 'Available on Shelf',
      value: stats?.availableBooks ?? 0,
      subtext: 'Ready for circulation',
      icon: CheckCircle2,
      color: 'emerald',
    },
    {
      label: 'Circulating / Loaned',
      value: stats?.borrowedBooks ?? 0,
      subtext: 'Currently in checkout',
      icon: BookMarked,
      color: 'amber',
    },
    {
      label: 'Curated Genres',
      value: stats?.categoriesCount ?? 0,
      subtext: 'Distinct sections',
      icon: Layers,
      color: 'sapphire',
    },
  ];

  return (
    <div className="stats-banner">
      <div className="stats-grid">
        {cards.map((card, idx) => {
          const Icon = card.icon;
          return (
            <div key={idx} className={`stat-card card-${card.color}`}>
              <div className="stat-card-inner">
                <div className="stat-content">
                  <span className="stat-label">{card.label}</span>
                  <div className="stat-number">{card.value}</div>
                  <span className="stat-subtext">{card.subtext}</span>
                </div>
                <div className={`stat-icon-wrapper icon-${card.color}`}>
                  <Icon size={24} />
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
