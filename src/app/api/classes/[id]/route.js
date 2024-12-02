import { NextResponse } from 'next/server';
import connectDB from '@/lib/db';
import Class from '@/models/Class';


export async function DELETE(request, { params }) {
  try {
   

    await connectDB();
    const { id } = params;
    
    const deletedClass = await Class.findByIdAndDelete(id);
    if (!deletedClass) {
      return NextResponse.json({ error: 'Class not found' }, { status: 404 });
    }
    
    return NextResponse.json({ message: 'Class deleted successfully' });
  } catch (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
} 