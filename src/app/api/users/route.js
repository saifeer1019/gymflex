import { NextResponse } from 'next/server';
import connectDB from '@/lib/db';
import User from '@/models/User';

export async function GET(request) {

try {
    await connectDB();
    console.log('connected to db');
    const { searchParams } = new URL(request.url);
    const role = searchParams.get('role');
    
    const query = role ? { role } : {};
    const users = await User.find(query).select('-password');
    
    return NextResponse.json(users);
  } catch (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

export async function POST(request) {

try {
    await connectDB();
    const data = await request.json();
    console.log(data);
    
    const newUser = await User.create(data);
    const userWithoutPassword = newUser.toObject();
    delete userWithoutPassword.password;
    
    return NextResponse.json(userWithoutPassword, { status: 201 });
  } catch (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
} 