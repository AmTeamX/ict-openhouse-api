export const getAuthorizationToken = (request: Request) => {
  const auth = request.headers.get('authorization');
  if (!auth) return null;

  const [type, token] = auth.split(' ');
  if (type !== 'Bearer') return null;

  return token;
};