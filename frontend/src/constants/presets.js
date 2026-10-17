export const PRESET_COVERS = [
  {
    name: 'Classic Vintage',
    url: 'https://images.unsplash.com/photo-1544947950-fa07a98d237f?w=600&auto=format&fit=crop&q=80',
    category: 'Literature'
  },
  {
    name: 'Code & Tech',
    url: 'https://images.unsplash.com/photo-1532012164546-f432f2e379b2?w=600&auto=format&fit=crop&q=80',
    category: 'Programming'
  },
  {
    name: 'Cosmos & Science',
    url: 'https://images.unsplash.com/photo-1506880018603-83d5b814b5a6?w=600&auto=format&fit=crop&q=80',
    category: 'Science'
  },
  {
    name: 'Philosopher Study',
    url: 'https://images.unsplash.com/photo-1497633762265-9d179a990aa6?w=600&auto=format&fit=crop&q=80',
    category: 'Philosophy'
  },
  {
    name: 'Modern Non-Fiction',
    url: 'https://images.unsplash.com/photo-1512820790803-83ca734da794?w=600&auto=format&fit=crop&q=80',
    category: 'Self-Help'
  },
  {
    name: 'Grand Archives',
    url: 'https://images.unsplash.com/photo-1507842229452-9594411130e9?w=600&auto=format&fit=crop&q=80',
    category: 'History'
  },
  {
    name: 'Software Craft',
    url: 'https://images.unsplash.com/photo-1589829085413-56de8ae18c73?w=600&auto=format&fit=crop&q=80',
    category: 'Programming'
  },
  {
    name: 'Mystery & Novel',
    url: 'https://images.unsplash.com/photo-1516979187457-637abb4f9353?w=600&auto=format&fit=crop&q=80',
    category: 'Fiction'
  }
];

export const CATEGORIES = [
  'All',
  'Programming',
  'Literature',
  'Science',
  'Fiction',
  'Philosophy',
  'Self-Help',
  'History',
  'Mathematics'
];

export const STATUS_OPTIONS = [
  { value: 'AVAILABLE', label: 'Available on Shelf', color: 'emerald' },
  { value: 'BORROWED', label: 'Currently Borrowed', color: 'amber' },
  { value: 'READING', label: 'In Reading Room', color: 'blue' }
];

// Helper to get fallback book cover styling based on book title/category
export function getCategoryGradient(category = '') {
  const cat = category.toLowerCase();
  if (cat.includes('prog') || cat.includes('code') || cat.includes('tech')) {
    return 'linear-gradient(135deg, #1e293b 0%, #0f172a 100%)';
  }
  if (cat.includes('sci')) {
    return 'linear-gradient(135deg, #0c4a6e 0%, #082f49 100%)';
  }
  if (cat.includes('lit') || cat.includes('marathi') || cat.includes('eng')) {
    return 'linear-gradient(135deg, #78350f 0%, #451a03 100%)';
  }
  if (cat.includes('fic')) {
    return 'linear-gradient(135deg, #4c1d95 0%, #2e1065 100%)';
  }
  if (cat.includes('phil') || cat.includes('hist')) {
    return 'linear-gradient(135deg, #701a75 0%, #4a044e 100%)';
  }
  return 'linear-gradient(135deg, #3f3f46 0%, #18181b 100%)';
}
