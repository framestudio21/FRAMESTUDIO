import jwt from 'jsonwebtoken';

export async function POST(req) {
  try {
    const { token } = await req.json();

    const decoded = jwt.verify(
      token,
      process.env.JWT_SECRET || 'e8ad46188b56c0b64a9b58262a0e114f8f777bee4e0ff35b7b5f72dda5786f40'
    );

    return new Response(JSON.stringify({ valid: true, decoded }), { status: 200 });
  } catch (error) {
    return new Response(JSON.stringify({ valid: false, error: 'Invalid token' }), { status: 401 });
  }
}
