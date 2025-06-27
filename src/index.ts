// index.ts (Main Elysia Application File)

import { Elysia } from 'elysia';
import { connectDB, disconnectDB } from './db';

const app = new Elysia();

app.onStart(async () => {
  await connectDB();
})
app.onStop(async () => {
  await disconnectDB();
})
app.listen(3000, () => {
  console.log(
    `🦊 Elysia is running at ${app.server?.hostname}:${app.server?.port}`
  );
});

