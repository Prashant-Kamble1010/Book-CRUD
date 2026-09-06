package com.example.Practice.controller;

import com.example.Practice.dao.BookRepository;
import com.example.Practice.entity.Book;
import com.example.Practice.service.BookService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Optional;

@RestController
public class Testing
{
    @Autowired
    BookService bookService;

    @GetMapping("/books")
    public List<Book> demo()
    {
        return bookService.getAllBooks();
    }

    @GetMapping("/books/{id}")
    public Optional<Book> getBook(@PathVariable int id)
    {
        return bookService.getBookById(id);
    }

    @PostMapping("/books")
    public Book CreateBook(@RequestBody Book book)
    {
        return bookService.addBook(book);
    }

    @DeleteMapping("/books/{id}")
    public Book removeBook(@PathVariable int id)
    {
      return bookService.deleteBook(id);
    }

    @PutMapping("/book/{id}")
    public Book updateB(@RequestBody Book book,@PathVariable int id)
    {
         return bookService.updateBook(book,id);
    }

}
