import dbConnect from '../../../lib/dbconnect';
import User from '@/models/User';
import jwt from 'jsonwebtoken';
import cookie from 'cookie';
import { NextResponse } from 'next/server';
export async function POST(req) { // Change to named export for POST
  await dbConnect();

  try {
    const { email, password } = await req.json(); // Use req.json() to parse the body

    // Find user and select password for comparison
    const user = await User.findOne({ email }).select('+password');
    if (!user) {
      return NextResponse.json({ message: 'Invalid credentials' }, { status: 401 });
    }

    // Check password
    const isMatch = await user.comparePassword(password);
    if (!isMatch) {
      return NextResponse.json({ message: 'Invalid credentials' }, { status: 401 });
    }

    // Generate JWT token
    const token = jwt.sign(
      { id: user._id, email: user.email }, 
      process.env.JWT_SECRET, 
      { expiresIn: '1d' }
    );

    // Set HTTP-only cookie
    const response = NextResponse.json({ 
      message: 'Login successful',
      user: { 
        id: user._id, 
        email: user.email, 
        name: user.name,
        role: user.role
      }
    });
    response.cookies.set('auth_token', token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'strict',
      maxAge: 86400,
      path: '/'
    });

    return response; // Return the response
  } catch (error) {
    console.error('Login error:', error);
    return NextResponse.json({ 
      message: 'Login failed', 
      error: error.message 
    }, { status: 500 });
  }
}