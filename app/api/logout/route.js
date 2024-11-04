export async function POST() {
    const response = new Response(JSON.stringify({ message: 'Logout successful' }), { status: 200 });
  
    // Expire the token cookie by setting it with an expiration in the past
    response.headers.set('Set-Cookie', `token=; HttpOnly; Path=/; Max-Age=0;`);
  
    return response;
  }
  