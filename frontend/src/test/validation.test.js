import { describe, it, expect } from "vitest";

function validateLogin(username, password) {
    return username.trim() !== "" &&
        password.trim() !== "";
}

function validateBook(title, author, category) {
    return title.trim() !== "" &&
        author.trim() !== "" &&
        category.trim() !== "";
}

describe("Login Validation", () => {
    it("accepts non-empty username and password", () => {
        expect(validateLogin("student", "pass123"))
            .toBe(true);
    });

    it("rejects empty login fields", () => {
        expect(validateLogin("", "pass123"))
            .toBe(false);
    });
});

describe("Book Validation", () => {
    it("accepts complete book details", () => {
        expect(
            validateBook("Java Programming", "James Gosling", "Science")
        ).toBe(true);
    });

    it("rejects missing book details", () => {
        expect(validateBook("", "James Gosling", "Science"))
            .toBe(false);
    });
});
