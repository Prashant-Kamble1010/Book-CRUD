package com.example.Practice.entity;

import com.fasterxml.jackson.annotation.JsonAlias;
import com.fasterxml.jackson.annotation.JsonProperty;
import jakarta.persistence.*;

@Entity
@Table(name = "book")
public class Book {

    @Id
    @GeneratedValue(strategy = GenerationType.AUTO)
    private Integer bookId;

    private String title;

    @Column(name = "autor")
    @JsonProperty("autor")
    @JsonAlias({"autor", "author"})
    private String autor;

    private String category;

    @Column(length = 2000)
    private String description;

    private String isbn;

    private Double price;

    private Integer publishedYear;

    private Integer pages;

    private String status; // "AVAILABLE", "BORROWED", "READING"

    private Double rating;

    @Column(length = 1000)
    private String coverImageUrl;

    public Book() {
    }

    public Book(Integer bookId, String title, String autor) {
        this.bookId = bookId;
        this.title = title;
        this.autor = autor;
        applyDefaults();
    }

    public Book(Integer bookId, String title, String autor, String category, String description,
                String isbn, Double price, Integer publishedYear, Integer pages,
                String status, Double rating, String coverImageUrl) {
        this.bookId = bookId;
        this.title = title;
        this.autor = autor;
        this.category = category;
        this.description = description;
        this.isbn = isbn;
        this.price = price;
        this.publishedYear = publishedYear;
        this.pages = pages;
        this.status = status;
        this.rating = rating;
        this.coverImageUrl = coverImageUrl;
        applyDefaults();
    }

    @PostLoad
    public void postLoad() {
        applyDefaults();
    }

    private void applyDefaults() {
        if (this.category == null || this.category.trim().isEmpty()) {
            if (this.title != null) {
                String lower = this.title.toLowerCase();
                if (lower.contains("c++") || lower.contains("java") || lower.contains("kotlin") || lower.contains("python") || lower.contains("code")) {
                    this.category = "Programming";
                } else if (lower.contains("science") || lower.contains("physics") || lower.contains("chemistry")) {
                    this.category = "Science";
                } else if (lower.contains("marathi") || lower.contains("english") || lower.contains("literature")) {
                    this.category = "Literature";
                } else {
                    this.category = "General";
                }
            } else {
                this.category = "General";
            }
        }

        if (this.status == null || this.status.trim().isEmpty()) {
            this.status = "AVAILABLE";
        }

        if (this.price == null || this.price <= 0) {
            this.price = 29.99;
        }

        if (this.publishedYear == null) {
            this.publishedYear = 2023;
        }

        if (this.pages == null || this.pages <= 0) {
            this.pages = 320;
        }

        if (this.rating == null || this.rating <= 0) {
            this.rating = 4.8;
        }

        if (this.isbn == null || this.isbn.trim().isEmpty()) {
            this.isbn = "978-0" + (10000000 + (bookId != null ? (bookId * 7919) % 90000000 : 12345678));
        }

        if (this.description == null || this.description.trim().isEmpty()) {
            this.description = "A valuable volume on " + (this.title != null ? this.title : "this subject") + 
                               " by " + (this.autor != null ? this.autor : "an esteemed author") + 
                               ". Part of the library's curated catalog.";
        }
    }

    public Integer getBookId() {
        return bookId;
    }

    public void setBookId(Integer bookId) {
        this.bookId = bookId;
    }

    public String getTitle() {
        return title;
    }

    public void setTitle(String title) {
        this.title = title;
    }

    public String getAutor() {
        return autor;
    }

    public void setAutor(String autor) {
        this.autor = autor;
    }

    // Author alias getter/setter for modern standard naming
    @JsonProperty("author")
    public String getAuthor() {
        return autor;
    }

    public void setAuthor(String author) {
        this.autor = author;
    }

    public String getCategory() {
        return category;
    }

    public void setCategory(String category) {
        this.category = category;
    }

    public String getDescription() {
        return description;
    }

    public void setDescription(String description) {
        this.description = description;
    }

    public String getIsbn() {
        return isbn;
    }

    public void setIsbn(String isbn) {
        this.isbn = isbn;
    }

    public Double getPrice() {
        return price;
    }

    public void setPrice(Double price) {
        this.price = price;
    }

    public Integer getPublishedYear() {
        return publishedYear;
    }

    public void setPublishedYear(Integer publishedYear) {
        this.publishedYear = publishedYear;
    }

    public Integer getPages() {
        return pages;
    }

    public void setPages(Integer pages) {
        this.pages = pages;
    }

    public String getStatus() {
        return status;
    }

    public void setStatus(String status) {
        this.status = status;
    }

    public Double getRating() {
        return rating;
    }

    public void setRating(Double rating) {
        this.rating = rating;
    }

    public String getCoverImageUrl() {
        return coverImageUrl;
    }

    public void setCoverImageUrl(String coverImageUrl) {
        this.coverImageUrl = coverImageUrl;
    }

    @Override
    public String toString() {
        return "Book{" +
<<<<<<< HEAD
                "bookId=" + bookId +
                ", title='" + title + '\'' +
                ", autor='" + autor + '\'' +
                ", category='" + category + '\'' +
                ", status='" + status + '\'' +
=======
                "bookId =" + bookId +
                ", title ='" + title + '\'' +
                ", autor ='" + autor + '\'' +
>>>>>>> 5333772ddb7a903120a97fba3b4a0eae2c973875
                '}';
    }
}
