import {rest} from "msw";
import {setupServer} from "msw/node";

export default setupServer(
  rest.post("http://localhost:5000/user/reAuth", (req, res, ctx) => {
    return res(
      ctx.json({
        userId: "testId",
        username: "testUsername",
      })
    );
  }),

  rest.get('http://localhost:5000/chat/conversations', (req, res, ctx) => {
    return res(
      ctx.status(200),
      ctx.json({conversations: []})
    )
  })
);