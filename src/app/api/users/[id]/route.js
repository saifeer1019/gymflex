import { NextResponse } from 'next/server';
import connectDB from '@/lib/db';
import User from '@/models/User';


export async function PATCH(request, { params }) {
  try {
  

    await connectDB();
    const { id } = params;
    const data = await request.json();
    
    const updatedUser = await User.findByIdAndUpdate(
      id,
      { $set: data },
      { new: true, runValidators: true }
    ).select('-password');
    
    if (!updatedUser) {
      return NextResponse.json({ error: 'User not found' }, { status: 404 });
    }
    
    return NextResponse.json(updatedUser);
  } catch (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
} 

export async function DELETE(request, { params }) {
  try {
    await connectDB();
    const { id } = params;
    await User.findByIdAndDelete(id);
    return NextResponse.json({ message: 'User deleted' }, { status: 200 });
  } catch (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
