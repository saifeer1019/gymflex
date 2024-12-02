import dbConnect from '@/app/lib/dbconnect';
import User from '@/models/User';
import { NextResponse } from 'next/server';

export async function POST(req) {
    await dbConnect();
    const { id } = await req.json();
    console.log(id);
    const user = await User.findById(id);
    if (!user) {
        return NextResponse.json({ success: false, message: 'User not found' }, { status: 404 });
    }
    user.role = 'trainer';
    await user.save();
    return NextResponse.json({ success: true, message: 'Application submitted successfully' }, { status: 200 });
}