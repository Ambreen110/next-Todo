
import { NextRequest, NextResponse } from 'next/server';
import { connect } from '@/app/dbConfig/db';
import User from '@/app/models/user';
import { v4 as uuidv4 } from 'uuid'; 
connect();

export async function GET(request: NextRequest, response: NextResponse) {
  try {
    const users = await User.find({});
    console.log(users);
    return NextResponse.json({ success: true, users });
  } catch (error) {
    console.error('Error fetching users:', error);
    return NextResponse.json({ success: false, message: 'Error fetching users' }, { status: 500 });
  }
}

export async function POST(request: NextRequest, response: NextResponse) {
  try {
    const reqBody = await request.json();
    const { username } = reqBody;

    const existingUser = await User.findOne({ username });
    if (existingUser) {
      return NextResponse.json({ success: false, message: 'User already exists', user: existingUser });
    }

    const newUser = new User({
      _id: uuidv4(), 
      username,
    });

    const savedUser = await newUser.save();
    return NextResponse.json({ success: true, message: 'User created successfully', user: savedUser });
  } catch (error) {
    console.error('Error creating user:', error);
    return NextResponse.json({ success: false, message: 'Error creating user' }, { status: 400 }); 
  }
}

