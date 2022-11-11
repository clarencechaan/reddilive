import React from "react";
import { render, fireEvent, screen, waitFor } from "@testing-library/react";
import user from "@testing-library/user-event";
import App from "../App";

test("loads thread", async () => {
  render(<App />);
  const threadId = "xb0fqv";
  const userInput = screen.getByPlaceholderText("thread URL or ID");
  const goButton = screen.getByText("GO");

  user.type(userInput, threadId);
  fireEvent.click(goButton);

  const title =
    "[Official] UFC 279: Diaz vs. Ferguson - Live Discussion Thread";
  const comment = "so happy that Nate Diaz leaves the UFC with a W";
  const selftext = "Enjoy the fights! Get HYPE!";
  await waitFor(() => {
    expect(screen.getByText(title)).toBeInTheDocument();
    expect(screen.getByText(comment)).toBeInTheDocument();
    expect(screen.getByText(selftext)).toBeInTheDocument();
  });
});
