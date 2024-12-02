import cookie from 'cookie';

export async function POST(req) {
  // Clear the authentication cookie
  const res = new Response(null, {
    status: 200,
    headers: {
      'Set-Cookie': cookie.serialize('auth_token', '', {
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        sameSite: 'strict',
        expires: new Date(0),
        path: '/'
      }),
    },
  });

  return res; // Return the response
}