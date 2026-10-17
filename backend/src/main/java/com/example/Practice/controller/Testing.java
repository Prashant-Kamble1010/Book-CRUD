package com.example.Practice.controller;

import com.example.Practice.entity.Book;
import com.example.Practice.service.BookService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;
import java.util.Optional;

@RestController
@CrossOrigin(origins = "*", allowedHeaders = "*", methods = {
        RequestMethod.GET, RequestMethod.POST, RequestMethod.PUT, RequestMethod.DELETE, RequestMethod.OPTIONS
})
public class Testing {

    @Autowired
    private BookService bookService;

    // Supports /books and /api/books with optional query filtering
    @GetMapping({"/books", "/api/books"})
    public ResponseEntity<List<Book>> getBooks(
            @RequestParam(required = false) String search,
            @RequestParam(required = false) String category,
            @RequestParam(required = false) String status) {
        if ((search != null && !search.isEmpty()) || 
            (category != null && !category.isEmpty()) || 
            (status != null && !status.isEmpty())) {
            return ResponseEntity.ok(bookService.getFilteredBooks(search, category, status));
        }
        return ResponseEntity.ok(bookService.getAllBooks());
    }

    // Get book by id
    @GetMapping({"/books/{id}", "/api/books/{id}", "/book/{id}"})
    public ResponseEntity<?> getBook(@PathVariable int id) {
        Optional<Book> book = bookService.getBookById(id);
        if (book.isPresent()) {
            return ResponseEntity.ok(book.get());
        }
        return ResponseEntity.status(HttpStatus.NOT_FOUND).body(Map.of("message", "Book not found with id: " + id));
    }

    // Create book
    @PostMapping({"/books", "/api/books"})
    public ResponseEntity<Book> createBook(@RequestBody Book book) {
        Book created = bookService.addBook(book);
        return ResponseEntity.status(HttpStatus.CREATED).body(created);
    }

    // Delete book
    @DeleteMapping({"/books/{id}", "/api/books/{id}", "/book/{id}"})
    public ResponseEntity<?> removeBook(@PathVariable int id) {
        Book deleted = bookService.deleteBook(id);
        if (deleted != null) {
            return ResponseEntity.ok(Map.of("message", "Book deleted successfully", "book", deleted));
        }
        return ResponseEntity.status(HttpStatus.NOT_FOUND).body(Map.of("message", "Book not found with id: " + id));
    }

    // Update book (supports /book/{id} and /books/{id} and /api/books/{id})
    @PutMapping({"/book/{id}", "/books/{id}", "/api/books/{id}"})
    public ResponseEntity<?> updateBook(@RequestBody Book book, @PathVariable int id) {
        Book updated = bookService.updateBook(book, id);
        if (updated != null) {
            return ResponseEntity.ok(updated);
        }
        return ResponseEntity.status(HttpStatus.NOT_FOUND).body(Map.of("message", "Book not found with id: " + id));
    }

    // Library Statistics
    @GetMapping({"/books/stats", "/api/books/stats"})
    public ResponseEntity<Map<String, Object>> getStats() {
        return ResponseEntity.ok(bookService.getStats());
    }

    // All distinct categories
    @GetMapping({"/books/categories", "/api/books/categories"})
    public ResponseEntity<List<String>> getCategories() {
        return ResponseEntity.ok(bookService.getAllCategories());
    }
}
