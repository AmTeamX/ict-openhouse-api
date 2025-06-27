import { Elysia } from "elysia";

const app = new Elysia()

app.get("/", () => "Hello Team!!!");

app.listen(Bun.env.PORT || 5002);

console.log(
  `🦊 Elysia is running at ${app.server?.hostname}:${app.server?.port}`
);
