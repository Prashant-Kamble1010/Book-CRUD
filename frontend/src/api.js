const API_BASE_URL = 'http://localhost:8081';

export async function fetchBooks(search = '', category = '', status = '') {
  const params = new URLSearchParams();
  if (search) params.append('search', search);
  if (category && category !== 'ALL') params.append('category', category);
  if (status && status !== 'ALL') params.append('status', status);

  const query = params.toString() ? `?${params.toString()}` : '';
  const response = await fetch(`${API_BASE_URL}/books${query}`);
  if (!response.ok) {
    throw new Error(`Failed to fetch books: ${response.statusText}`);
  }
  return response.json();
}

export async function fetchBookById(id) {
  const response = await fetch(`${API_BASE_URL}/books/${id}`);
  if (!response.ok) {
    throw new Error(`Failed to fetch book #${id}`);
  }
  return response.json();
}

export async function createBook(bookData) {
  const response = await fetch(`${API_BASE_URL}/books`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(bookData),
  });
  if (!response.ok) {
    throw new Error(`Failed to add book: ${response.statusText}`);
  }
  return response.json();
}

export async function updateBook(id, bookData) {
  const response = await fetch(`${API_BASE_URL}/books/${id}`, {
    method: 'PUT',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(bookData),
  });
  if (!response.ok) {
    throw new Error(`Failed to update book #${id}`);
  }
  return response.json();
}

export async function deleteBook(id) {
  const response = await fetch(`${API_BASE_URL}/books/${id}`, {
    method: 'DELETE',
  });
  if (!response.ok) {
    throw new Error(`Failed to delete book #${id}`);
  }
  return response.json();
}

export async function fetchStats() {
  const response = await fetch(`${API_BASE_URL}/books/stats`);
  if (!response.ok) {
    throw new Error(`Failed to fetch library stats`);
  }
  return response.json();
}

export async function uploadCoverImage(file) {
  const formData = new FormData();
  formData.append('file', file);

  const response = await fetch(`${API_BASE_URL}/uploadfile`, {
    method: 'POST',
    body: formData,
  });

  if (!response.ok) {
    throw new Error('Image upload failed');
  }

  const result = await response.json();
  if (result.url) {
    return `${API_BASE_URL}${result.url}`;
  }
  return null;
}

export { API_BASE_URL };
