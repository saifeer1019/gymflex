import axios from 'axios';
import { NextResponse } from 'next/server';
import jwt from 'jsonwebtoken';
import dbConnect from '@/app/lib/dbconnect';
import User from '@/models/User';

export async function GET(req) {
  const token = req.headers.get('Authorization');
  if (!token) {
    return NextResponse.json({ error: 'No token provided' }, { status: 401 });
  }



  try {
    console.log('token', token);
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    await dbConnect();
    const user = await User.findById(decoded.id);
    if (!user) {
      return NextResponse.json({ error: 'User not found' }, { status: 401 });
    }
    const role = user.role;
    return NextResponse.json({ message: 'Token is valid', role: role }, { status: 200 });
  } catch (error) {
    return NextResponse.json({ error: 'Invalid token' }, { status: 401 });
  }
}