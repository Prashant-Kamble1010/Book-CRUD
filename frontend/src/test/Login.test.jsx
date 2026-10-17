
import { render, screen } from "@testing-library/react";
import { describe, it, expect } from "vitest";
import App from "../App";

describe("Digital Library Application", () => {
    it("renders the application successfully", () => {
        render(<App />);
        expect(document.body).toBeTruthy();
    });
});
