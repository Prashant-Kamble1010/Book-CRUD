package com.example.Practice.service;

import com.example.Practice.dao.BookRepository;
import com.example.Practice.entity.Book;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import java.util.ArrayList;
import java.util.List;
import java.util.Optional;

@Service
public class BookService
{
    @Autowired
    BookRepository bookRepository;

  private static List<Book> books = new ArrayList<>();
    static {
        books.add(new Book(2,"Marathi","Balasaheb Shinde"));
        books.add(new Book(3,"Science","Aaba Pakhre"));
        books.add(new Book(4,"Englsh","Vaibhav Rane"));

    }

    //get all Book
    public List<Book> getAllBooks()
    {
        return bookRepository.findAll();
    }

    //get book by id
    public Optional<Book> getBookById(int id)
    {
        Optional<Book> book = bookRepository.findById(id);
        return book;
    }

    //add books
    public Book addBook(Book book)
    {
        return bookRepository.save(book);
    }

    //Delete book
    public Book deleteBook(int id)
    {
        Optional<Book> book = bookRepository.findById(id);

        if (book.isPresent())
        {
            Book b= book.get();
            bookRepository.delete(b);
            return b;
        }
        return null;
    }

    //Update Books
    public Book updateBook(Book book,int id)
    {
        Book book1 = bookRepository.findById(id).orElse(null);
        if (book1 == null)
        {
            return  null;
        }
        book1.setTitle(book.getTitle());
        book1.setAutor(book.getAutor());

        return bookRepository.save(book1);
    }

}
