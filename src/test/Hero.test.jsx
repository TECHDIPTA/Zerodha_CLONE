import React from "react";
import { render, screen } from "@testing-library/react";
import "@testing-library/jest-dom/vitest";
import Hero from "../landing_page/home/Hero";
import { expect } from "vitest";

// Test Suite
describe("Hero Component", () => {
  test("renders hero image", () => {
    render(<Hero />);

    const heroImage = screen.getByAltText("Hero");

    expect(heroImage).toBeInTheDocument();
    expect(heroImage).toHaveAttribute(
      "src",
      "media/homeHero.png"
    );
  });
  test("renders signup button", () => {
    render(<Hero />);
    const signupButton = screen.getByRole("button", { name: "Sign up for free" });
    expect(signupButton).toBeInTheDocument();
    expect(signupButton).toHaveClass("btn btn-primary px-5 py-2");
  });
});

