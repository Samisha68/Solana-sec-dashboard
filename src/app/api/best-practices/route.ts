import { NextRequest, NextResponse } from 'next/server';
import mongoose from 'mongoose';
import BestPractice from '@/models/BestPractice';

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

// GET /api/best-practices
export async function GET(request: NextRequest) {
  try {
    await connectDB();

    // Get query parameters
    const { searchParams } = new URL(request.url);
    const category = searchParams.get('category');
    const priority = searchParams.get('priority');
    const search = searchParams.get('search');
    const page = parseInt(searchParams.get('page') || '1');
    const limit = parseInt(searchParams.get('limit') || '10');

    // Build query
    const query: Record<string, unknown> = {};
    if (category) query.category = category;
    if (priority) query.priority = parseInt(priority);
    if (search) {
      query.$or = [
        { title: { $regex: search, $options: 'i' } },
        { description: { $regex: search, $options: 'i' } },
        { tags: { $regex: search, $options: 'i' } }
      ];
    }

    // Execute query with pagination
    const skip = (page - 1) * limit;
    const [bestPractices, total] = await Promise.all([
      BestPractice.find(query)
        .sort({ priority: 1, createdAt: -1 })
        .skip(skip)
        .limit(limit),
      BestPractice.countDocuments(query)
    ]);

    return NextResponse.json({
      bestPractices,
      pagination: {
        total,
        page,
        limit,
        totalPages: Math.ceil(total / limit)
      }
    });

  } catch (error) {
    console.error('Error fetching best practices:', error);
    return NextResponse.json(
      { error: 'Failed to fetch best practices' },
      { status: 500 }
    );
  }
}

// POST /api/best-practices
export async function POST(request: NextRequest) {
  try {
    await connectDB();

    const body = await request.json();
    const bestPractice = new BestPractice(body);
    await bestPractice.save();

    return NextResponse.json(bestPractice, { status: 201 });

  } catch (error) {
    console.error('Error creating best practice:', error);
    return NextResponse.json(
      { error: 'Failed to create best practice' },
      { status: 500 }
    );
  }
} 