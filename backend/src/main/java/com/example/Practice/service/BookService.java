package com.example.Practice.service;

import com.example.Practice.dao.BookRepository;
import com.example.Practice.entity.Book;
import jakarta.annotation.PostConstruct;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.*;
import java.util.stream.Collectors;

@Service
public class BookService {

    @Autowired
    private BookRepository bookRepository;

    @PostConstruct
    public void initSeedData() {
        try {
            if (bookRepository.count() == 0) {
                List<Book> initialBooks = List.of(
                    new Book(null, "Clean Code: A Handbook of Agile Software Craftsmanship", "Robert C. Martin",
                            "Programming", "Even bad code can function. But if code isn't clean, it can bring a development organization to its knees.",
                            "978-0132350884", 44.99, 2008, 464, "AVAILABLE", 4.9,
                            "https://images.unsplash.com/photo-1532012164546-f432f2e379b2?w=600&auto=format&fit=crop&q=80"),
                    new Book(null, "The Great Gatsby", "F. Scott Fitzgerald",
                            "Fiction", "The story of the mysteriously wealthy Jay Gatsby and his love for the beautiful Daisy Buchanan.",
                            "978-0743273565", 15.99, 1925, 180, "AVAILABLE", 4.7,
                            "https://images.unsplash.com/photo-1544947950-fa07a98d237f?w=600&auto=format&fit=crop&q=80"),
                    new Book(null, "Atomic Habits", "James Clear",
                            "Self-Help", "An easy and proven way to build good habits and break bad ones.",
                            "978-0735211292", 21.50, 2018, 320, "BORROWED", 4.9,
                            "https://images.unsplash.com/photo-1512820790803-83ca734da794?w=600&auto=format&fit=crop&q=80"),
                    new Book(null, "A Brief History of Time", "Stephen Hawking",
                            "Science", "Explores profound questions about the universe, black holes, time, and the big bang.",
                            "978-0553380163", 18.00, 1988, 256, "AVAILABLE", 4.8,
                            "https://images.unsplash.com/photo-1506880018603-83d5b814b5a6?w=600&auto=format&fit=crop&q=80"),
                    new Book(null, "To Kill a Mockingbird", "Harper Lee",
                            "Literature", "A gripping, heart-wrenching, and wholly remarkable tale of coming-of-age in a South poisoned by virulent prejudice.",
                            "978-0061120084", 14.25, 1960, 336, "AVAILABLE", 4.9,
                            "https://images.unsplash.com/photo-1497633762265-9d179a990aa6?w=600&auto=format&fit=crop&q=80"),
                    new Book(null, "Design Patterns: Elements of Reusable Object-Oriented Software", "Erich Gamma et al.",
                            "Programming", "Capturing a wealth of experience about the design of object-oriented software.",
                            "978-0201633610", 54.99, 1994, 395, "BORROWED", 4.8,
                            "https://images.unsplash.com/photo-1589829085413-56de8ae18c73?w=600&auto=format&fit=crop&q=80")
                );
                bookRepository.saveAll(initialBooks);
            }
        } catch (Exception e) {
            System.err.println("Could not seed data: " + e.getMessage());
        }
    }

    // Get all books with optional search, category and status filtering
    public List<Book> getAllBooks() {
        return bookRepository.findAll();
    }

    public List<Book> getFilteredBooks(String query, String category, String status) {
        List<Book> books;
        if (query != null && !query.trim().isEmpty()) {
            books = bookRepository.searchBooks(query.trim());
        } else if (category != null && !category.trim().isEmpty() && !category.equalsIgnoreCase("ALL")) {
            books = bookRepository.findByCategoryIgnoreCase(category.trim());
        } else if (status != null && !status.trim().isEmpty() && !status.equalsIgnoreCase("ALL")) {
            books = bookRepository.findByStatusIgnoreCase(status.trim());
        } else {
            books = bookRepository.findAll();
        }

        // Apply secondary in-memory filters if multiple params are passed
        if (category != null && !category.trim().isEmpty() && !category.equalsIgnoreCase("ALL")) {
            books = books.stream()
                    .filter(b -> b.getCategory() != null && b.getCategory().equalsIgnoreCase(category.trim()))
                    .collect(Collectors.toList());
        }

        if (status != null && !status.trim().isEmpty() && !status.equalsIgnoreCase("ALL")) {
            books = books.stream()
                    .filter(b -> b.getStatus() != null && b.getStatus().equalsIgnoreCase(status.trim()))
                    .collect(Collectors.toList());
        }

        return books;
    }

    // Get book by id
    public Optional<Book> getBookById(int id) {
        return bookRepository.findById(id);
    }

    // Add book
    public Book addBook(Book book) {
        // If author was passed in getAuthor(), ensure autor is populated
        if (book.getAutor() == null && book.getAuthor() != null) {
            book.setAutor(book.getAuthor());
        }
        return bookRepository.save(book);
    }

    // Delete book
    public Book deleteBook(int id) {
        Optional<Book> bookOpt = bookRepository.findById(id);
        if (bookOpt.isPresent()) {
            Book b = bookOpt.get();
            bookRepository.delete(b);
            return b;
        }
        return null;
    }

    // Update Book
    public Book updateBook(Book book, int id) {
        Book existing = bookRepository.findById(id).orElse(null);
        if (existing == null) {
            return null;
        }

        if (book.getTitle() != null) {
            existing.setTitle(book.getTitle());
        }
        if (book.getAutor() != null) {
            existing.setAutor(book.getAutor());
        } else if (book.getAuthor() != null) {
            existing.setAuthor(book.getAuthor());
        }
        if (book.getCategory() != null) {
            existing.setCategory(book.getCategory());
        }
        if (book.getDescription() != null) {
            existing.setDescription(book.getDescription());
        }
        if (book.getIsbn() != null) {
            existing.setIsbn(book.getIsbn());
        }
        if (book.getPrice() != null) {
            existing.setPrice(book.getPrice());
        }
        if (book.getPublishedYear() != null) {
            existing.setPublishedYear(book.getPublishedYear());
        }
        if (book.getPages() != null) {
            existing.setPages(book.getPages());
        }
        if (book.getStatus() != null) {
            existing.setStatus(book.getStatus());
        }
        if (book.getRating() != null) {
            existing.setRating(book.getRating());
        }
        if (book.getCoverImageUrl() != null) {
            existing.setCoverImageUrl(book.getCoverImageUrl());
        }

        return bookRepository.save(existing);
    }

    // Library Statistics for dashboard
    public Map<String, Object> getStats() {
        List<Book> all = bookRepository.findAll();
        long total = all.size();
        long available = all.stream().filter(b -> "AVAILABLE".equalsIgnoreCase(b.getStatus())).count();
        long borrowed = all.stream().filter(b -> "BORROWED".equalsIgnoreCase(b.getStatus())).count();
        long reading = all.stream().filter(b -> "READING".equalsIgnoreCase(b.getStatus())).count();
        Set<String> categories = all.stream()
                .map(Book::getCategory)
                .filter(Objects::nonNull)
                .collect(Collectors.toSet());

        Map<String, Object> stats = new HashMap<>();
        stats.put("totalBooks", total);
        stats.put("availableBooks", available);
        stats.put("borrowedBooks", borrowed);
        stats.put("readingBooks", reading);
        stats.put("categoriesCount", categories.size());
        stats.put("categories", categories);

        return stats;
    }

    public List<String> getAllCategories() {
        return bookRepository.findAll().stream()
                .map(Book::getCategory)
                .filter(c -> c != null && !c.trim().isEmpty())
                .distinct()
                .sorted()
                .collect(Collectors.toList());
    }
}
