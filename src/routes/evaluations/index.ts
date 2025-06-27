import { Elysia } from 'elysia';
import { getAuthorizationToken } from '~/utils/headers';
import isEvaluated from './helpers/isEvaluated';
import submitEvaluation from './helpers/submitEvaluation';


export const evaluationsRouter = new Elysia({ prefix: '/evaluations' })
  // GET /
  .get('/', () => {
    return {
      message: 'This evaluation endpoint is working!',
    };
  })

  // POST /
  .post('/', async ({ request, body, set }) => {
    try {
      const token = getAuthorizationToken(request) ?? undefined; // แปลง null เป็น undefined

      const p = await submitEvaluation(body, token);

      return {
        success: true,
        payload: p,
      };
    } catch (error: any) {
      set.status = 500;
      return {
        success: false,
        payload: {
          message: error.message,
        },
      };
    }
  })

  // GET /isEvaluated
  .get('/isEvaluated', async ({ request, set }) => {
    try {
      const token = getAuthorizationToken(request) ?? undefined; // แปลง null เป็น undefined

      const isEvaluatedValue = await isEvaluated(token);

      return {
        success: true,
        payload: {
          isEvaluated: isEvaluatedValue,
        },
      };
    } catch (error: any) {
      set.status = 500;
      return {
        success: false,
        payload: {
          message: error.message,
        },
      };
    }
  });
