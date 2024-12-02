import { NextResponse } from 'next/server';
import connectDB from '@/lib/db';
import Class from '@/models/Class';

export async function GET() {
  try {
    await connectDB();
    const classes = await Class.find().populate('trainer', 'name email');
    return NextResponse.json(classes);
  } catch (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

export async function POST(request) {
  try {
    

    await connectDB();
    const data = await request.json();
    
    const newClass = await Class.create(data);
    return NextResponse.json(newClass, { status: 201 });
  } catch (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
} 