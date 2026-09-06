package com.example.Practice.dao;

import com.example.Practice.entity.Book;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.List;

public interface BookRepository  extends JpaRepository<Book,Integer>
{

}
