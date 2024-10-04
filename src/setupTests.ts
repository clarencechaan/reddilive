import "@testing-library/jest-dom";
import "jest-fetch-mock";
import { rest } from "msw";
import { setupServer } from "msw/node";
import thread from "./__test-data__/thread.json";

const server = setupServer(
  rest.post("https://www.reddit.com/api/v1/access_token", (req, res, ctx) => {
    return res(ctx.json({ access_token: "123456" }));
  }),
  rest.get("https://oauth.reddit.com/comments/xb0fqv", (req, res, ctx) => {
    return res(ctx.json(thread));
  })
);

beforeAll(() => server.listen());
afterEach(() => server.resetHandlers());
afterAll(() => server.close());
