import { NextResponse } from 'next/server';
import mongoose from 'mongoose';
import LiveHack from '@/models/LiveHack';

// Connect to MongoDB
const connectDB = async () => {
  if (mongoose.connections[0].readyState) return;
  await mongoose.connect(process.env.MONGODB_URI!);
};

export async function POST(request: Request) {
  try {
    await connectDB();
    const body = await request.json();
    const { activities, timestamp } = body;

    // Process each suspicious activity
    for (const activity of activities) {
      const severity = determineSeverity(activity);
      const title = generateTitle(activity);
      const description = generateDescription(activity);

      // Create a new live hack entry
      const liveHack = new LiveHack({
        title,
        description,
        status: 'Active',
        reportedAt: timestamp,
        updatedAt: timestamp,
        severity,
        project: 'Unknown', // Can be updated later
        txHash: activity.signature,
        tags: [activity.type],
      });

      await liveHack.save();
    }

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Error processing security report:', error);
    return NextResponse.json(
      { error: 'Failed to process security report' },
      { status: 500 }
    );
  }
}

function determineSeverity(activity: Record<string, unknown>): 'Low' | 'Medium' | 'High' | 'Critical' {
  switch (activity.type) {
    case 'LARGE_TRANSFER':
      return (activity.amount as number) > 10000 ? 'Critical' : 'High';
    case 'KNOWN_EXPLOIT_ADDRESS':
      return 'Critical';
    case 'RAPID_TRANSFERS':
      return (activity.count as number) > 10 ? 'High' : 'Medium';
    default:
      return 'Low';
  }
}

function generateTitle(activity: Record<string, unknown>): string {
  switch (activity.type) {
    case 'LARGE_TRANSFER':
      return `Large Transfer Detected: ${(activity.amount as number)} SOL`;
    case 'KNOWN_EXPLOIT_ADDRESS':
      return `Known Exploit Address Activity Detected`;
    case 'RAPID_TRANSFERS':
      return `Rapid Transfer Pattern Detected: ${(activity.count as number)} transfers`;
    default:
      return 'Suspicious Activity Detected';
  }
}

function generateDescription(activity: Record<string, unknown>): string {
  switch (activity.type) {
    case 'LARGE_TRANSFER':
      return `A large transfer of ${(activity.amount as number)} SOL was detected. This could indicate a potential exploit or security incident.`;
    case 'KNOWN_EXPLOIT_ADDRESS':
      return `Activity detected from a known exploit address: ${activity.address}. Immediate investigation required.`;
    case 'RAPID_TRANSFERS':
      return `A pattern of ${(activity.count as number)} rapid transfers was detected. This could indicate automated exploit activity.`;
    default:
      return 'Suspicious activity was detected and requires investigation.';
  }
} 