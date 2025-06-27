import { Elysia } from "elysia";

const app = new Elysia()

app.get("/", () => "Hello Team!!!");

app.listen(5001);

console.log(
  `🦊 Elysia is running at ${app.server?.hostname}:${app.server?.port}`
);
