import { cors } from '@elysiajs/cors';
import { Elysia } from 'elysia';
import { connectDB, disconnectDB } from './db';
import { evaluationsRouter } from './routes/evaluations';
import { statsRouter } from './routes/stats';
import { usersRouter } from './routes/users';

const PORT = Bun.env.PORT || 5001;
const app = new Elysia();

app.use(cors({ origin: '*' }));

app.onStart(async () => {
  await connectDB();
})
app.onStop(async () => {
  await disconnectDB();
})

app.onRequest(({ request, set }) => {
  const start = Date.now();
  set.headers['X-Request-Start'] = start.toString();
  console.log(`[${new Date().toISOString()}] Incoming request: ${request.method} ${request.url}`);
});

app.get('/', () => {
  return 'Hello Elysia! Try POSTing to /submit-data with JSON or URL-encoded body.';
});

app.use(usersRouter);
app.use(statsRouter);
app.use(evaluationsRouter);

app.listen(PORT, () => {
  console.log(
    `🦊 Elysia is running at ${app.server?.hostname}:${app.server?.port}`,
  );
});

