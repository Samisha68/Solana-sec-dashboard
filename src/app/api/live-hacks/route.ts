import { NextRequest, NextResponse } from 'next/server';
import mongoose from 'mongoose';
import LiveHack from '@/models/LiveHack';

// Connect to MongoDB
async function connectDB() {
  try {
    if (mongoose.connection.readyState === 0) {
      await mongoose.connect(process.env.MONGODB_URI!);
    }
  } catch (error) {
    console.error('MongoDB connection error:', error);
    throw new Error('Failed to connect to database');
  }
}

// GET /api/live-hacks
export async function GET(request: NextRequest) {
  try {
    await connectDB();

    // Get query parameters
    const { searchParams } = new URL(request.url);
    const status = searchParams.get('status');
    const severity = searchParams.get('severity');
    const search = searchParams.get('search');
    const page = parseInt(searchParams.get('page') || '1');
    const limit = parseInt(searchParams.get('limit') || '10');

    // Build query
    const query: Record<string, unknown> = {};
    if (status) query.status = status;
    if (severity) query.severity = severity;
    if (search) {
      query.$or = [
        { title: { $regex: search, $options: 'i' } },
        { description: { $regex: search, $options: 'i' } },
        { project: { $regex: search, $options: 'i' } }
      ];
    }

    // Execute query with pagination
    const skip = (page - 1) * limit;
    const [liveHacks, total] = await Promise.all([
      LiveHack.find(query)
        .sort({ reportedAt: -1 })
        .skip(skip)
        .limit(limit),
      LiveHack.countDocuments(query)
    ]);

    return NextResponse.json({
      liveHacks,
      pagination: {
        total,
        page,
        limit,
        totalPages: Math.ceil(total / limit)
      }
    });

  } catch (error) {
    console.error('Error fetching live hacks:', error);
    return NextResponse.json(
      { error: 'Failed to fetch live hacks' },
      { status: 500 }
    );
  }
}

// POST /api/live-hacks
export async function POST(request: NextRequest) {
  try {
    await connectDB();

    const body = await request.json();
    const liveHack = new LiveHack(body);
    await liveHack.save();

    return NextResponse.json(liveHack, { status: 201 });

  } catch (error) {
    console.error('Error creating live hack:', error);
    return NextResponse.json(
      { error: 'Failed to create live hack' },
      { status: 500 }
    );
  }
} 