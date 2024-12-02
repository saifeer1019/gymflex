import { NextResponse } from 'next/server';
import dbConnect from '../../../lib/dbconnect';
import User from '@/models/User';
import jwt from 'jsonwebtoken';

export async function POST(req) {
  console.log('Starting registration process');
  await dbConnect();

  try {
    const { email, password, name } = await req.json();
    console.log(`Attempting to register user with email: ${email}`);

    // Check if user already exists
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      console.log('User already exists');
      return NextResponse.json({ message: 'User already exists' }, { status: 400 });
    }

    // Create new user
    const user = new User({ email, password, name });
    await user.save();
    console.log(`User created successfully: ${user.email}`);

    // Generate JWT token
    const token = jwt.sign(
      { id: user._id, email: user.email }, 
      process.env.JWT_SECRET, 
      { expiresIn: '1d' }
    );
    console.log(`Generated JWT token for user: ${user.email}`);

    // Set HTTP-only cookie
    const response = NextResponse.json({ 
      message: 'User registered successfully',
      user: { 
        id: user._id, 
        email: user.email, 
        name: user.name 
      }
    });
    response.cookies.set('auth_token', token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'strict',
      maxAge: 86400,
      path: '/'
    });
    console.log('Set HTTP-only cookie for user');

    return response;
  } catch (error) {
    console.error('Registration error:', error);
    return NextResponse.json({ 
      message: 'Registration failed', 
      error: error.message 
    }, { status: 500 });
  }
}