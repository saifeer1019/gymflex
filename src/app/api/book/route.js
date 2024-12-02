import dbConnect from '@/app/lib/dbconnect';
import Class from '@/models/Class';
import { NextResponse } from 'next/server';
import User from '@/models/User';

export async function POST(req) {
    await dbConnect();
    const { classId, userId } = await req.json();
 
    const user = await User.findById(userId);
    if (!user) {
        return NextResponse.json({ success: false, message: 'User not found' }, { status: 404 });
    }
    const class_ = await Class.findById(classId);
    console.log('class_', class_);
    if (class_.trainees.includes(userId)) {
        return NextResponse.json({ success: false, message: 'User already enrolled in this class' }, { status: 400 });
    }
    if (class_.currentEnrollment >= class_.maxCapacity) {
        return NextResponse.json({ success: false, message: 'Class is full' }, { status: 400 });
    }
    class_.trainees.push(userId);
    class_.currentEnrollment += 1;
    await class_.save();
    return NextResponse.json({ success: true, message: 'Class booked successfully' }, { status: 200 });
}
