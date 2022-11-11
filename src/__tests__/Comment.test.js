import React from "react";
import {
  render,
  fireEvent,
  screen,
  waitFor,
  within,
} from "@testing-library/react";
import user from "@testing-library/user-event";
import App from "../App";

beforeEach(() => {
  render(<App />);

  const threadId = "xb0fqv";
  const userInput = screen.getByPlaceholderText("thread URL or ID");
  const goButton = screen.getByText("GO");

  user.type(userInput, threadId);
  fireEvent.click(goButton);
});

test("loads comment", async () => {
  await waitFor(() => {
    const comment = screen.getByTestId("iny9y61");
    expect(comment).toBeInTheDocument();
    expect(
      within(comment).getByText(
        "Khamzat’s grappling was fairly impressive when you compare to Vettori and Brunson. I wonder if Khamzat will move up. This card wasn’t great overall."
      )
    ).toBeInTheDocument();
    expect(within(comment).getByText("Jonez120")).toBeInTheDocument();
    expect(
      comment.querySelector(".bubble > .info > .score > .num").innerHTML
    ).toBe("12");
    expect(
      comment.querySelector(".bubble > .info > .reply-btn").innerHTML.slice(-1)
    ).toBe("5");
  });
});

test("show replies button works", async () => {
  await waitFor(() => {
    const comment = screen.getByTestId("iny9y61");
    expect(comment.classList.contains("show-children")).toBeFalsy();
    expect(
      comment.querySelector(".replies-container > .replies > .CommentForm")
    ).not.toBeInTheDocument();

    const replyButton = comment.querySelector(".reply-btn");
    fireEvent.click(replyButton);
    expect(comment.classList.contains("show-children")).toBeTruthy();
    expect(
      comment.querySelector(".replies-container > .replies > .CommentForm")
    ).toBeInTheDocument();
  });
});
