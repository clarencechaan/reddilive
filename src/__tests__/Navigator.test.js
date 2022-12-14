import React from "react";
import { render, fireEvent, screen } from "@testing-library/react";
import user from "@testing-library/user-event";
import App from "../App";

beforeEach(() => {
  render(<App />);
});

test("blank input", async () => {
  const goButton = screen.getByText("GO");

  fireEvent.click(goButton);
  expect(window.location.pathname).toBe("/");
});

test("invalid URL", async () => {
  const invalid = "https://www.google.com/";
  const userInput = screen.getByPlaceholderText("thread URL or ID");
  const goButton = screen.getByText("GO");

  user.type(userInput, invalid);
  fireEvent.click(goButton);
  expect(window.location.pathname).toBe("/");
});

test("full URL", async () => {
  const URL =
    "https://www.reddit.com/r/MMA/comments/xb0fqv/official_ufc_279_diaz_vs_ferguson_live_discussion/";
  const userInput = screen.getByPlaceholderText("thread URL or ID");
  const goButton = screen.getByText("GO");

  user.type(userInput, URL);
  fireEvent.click(goButton);
  expect(window.location.pathname).toBe("/comments/xb0fqv");
});

test("only thread ID", async () => {
  const threadId = "yap2dt";
  const userInput = screen.getByPlaceholderText("thread URL or ID");
  const goButton = screen.getByText("GO");

  user.type(userInput, threadId);
  fireEvent.click(goButton);
  expect(window.location.pathname).toBe("/comments/yap2dt");
});

test("shortlink", async () => {
  const shortlink = "https://redd.it/wti10n";
  const userInput = screen.getByPlaceholderText("thread URL or ID");
  const goButton = screen.getByText("GO");

  user.type(userInput, shortlink);
  fireEvent.click(goButton);
  expect(window.location.pathname).toBe("/comments/wti10n");
});
