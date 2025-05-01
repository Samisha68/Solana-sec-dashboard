import { NextResponse } from 'next/server';
import mongoose from 'mongoose';
import LiveHack from '@/models/LiveHack';

// Connect to MongoDB
const connectDB = async () => {
  if (mongoose.connections[0].readyState) return;
  await mongoose.connect(process.env.MONGODB_URI!);
};

export async function GET() {
  try {
    await connectDB();

    // Get recent alerts from live hacks
    const alerts = await LiveHack.find({
      status: 'Active',
      reportedAt: {
        $gte: new Date(Date.now() - 24 * 60 * 60 * 1000), // Last 24 hours
      },
    })
      .sort({ reportedAt: -1 })
      .limit(10)
      .select('title description severity reportedAt');

    // Transform the data to match the Alert interface
    const formattedAlerts = alerts.map((alert) => ({
      id: alert._id.toString(),
      type: 'LiveHack',
      severity: alert.severity,
      message: alert.title,
      timestamp: alert.reportedAt.toISOString(),
    }));

    return NextResponse.json({ alerts: formattedAlerts });
  } catch (error) {
    console.error('Error fetching alerts:', error);
    return NextResponse.json(
      { error: 'Failed to fetch alerts' },
      { status: 500 }
    );
  }
} 