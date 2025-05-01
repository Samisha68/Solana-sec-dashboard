import { NextRequest, NextResponse } from 'next/server';
import mongoose from 'mongoose';
import Analytics from '@/models/Analytics';
import Exploit from '@/models/Exploit';

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

// GET /api/analytics
export async function GET(request: NextRequest) {
  try {
    await connectDB();

    // Get query parameters
    const { searchParams } = new URL(request.url);
    const period = searchParams.get('period') || 'Daily';
    const startDate = searchParams.get('startDate') 
      ? new Date(searchParams.get('startDate')!) 
      : new Date(Date.now() - 30 * 24 * 60 * 60 * 1000); // Last 30 days by default

    // Fetch latest analytics records
    const analytics = await Analytics.find({
      timestamp: { $gte: startDate },
      period
    }).sort({ timestamp: -1 }).limit(100);

    // Calculate total value lost from exploits
    const totalValueLost = await Exploit.aggregate([
      {
        $group: {
          _id: null,
          total: { $sum: '$amountLost' }
        }
      }
    ]);

    // Calculate exploit type distribution
    const exploitTypeDistribution = await Exploit.aggregate([
      {
        $group: {
          _id: '$type',
          count: { $sum: 1 }
        }
      }
    ]);

    // Calculate response time distribution
    const responseTimeDistribution = await Exploit.aggregate([
      {
        $project: {
          responseTime: {
            $divide: [
              { $subtract: ['$updatedAt', '$createdAt'] },
              1000 * 60 * 60 // Convert to hours
            ]
          }
        }
      },
      {
        $group: {
          _id: {
            $switch: {
              branches: [
                { case: { $lt: ['$responseTime', 1] }, then: '<1h' },
                { case: { $lt: ['$responseTime', 6] }, then: '1-6h' },
                { case: { $lt: ['$responseTime', 24] }, then: '6-24h' }
              ],
              default: '>24h'
            }
          },
          count: { $sum: 1 }
        }
      }
    ]);

    // Incidents per month (last 12 months)
    const incidentsPerMonth = await Exploit.aggregate([
      {
        $group: {
          _id: { $dateToString: { format: '%Y-%m', date: '$date' } },
          count: { $sum: 1 },
          valueLost: { $sum: '$amountLost' }
        }
      },
      { $sort: { _id: 1 } },
      { $limit: 12 }
    ]);

    // Top affected projects
    const topProjects = await Exploit.aggregate([
      {
        $group: {
          _id: '$project',
          count: { $sum: 1 },
          valueLost: { $sum: '$amountLost' }
        }
      },
      { $sort: { valueLost: -1 } },
      { $limit: 5 }
    ]);

    // Severity distribution (if you have a severity field)
    const severityDistribution = await Exploit.aggregate([
      {
        $group: {
          _id: '$severity',
          count: { $sum: 1 }
        }
      }
    ]);

    return NextResponse.json({
      analytics,
      metrics: {
        totalValueLost: totalValueLost[0]?.total || 0,
        exploitTypeDistribution: exploitTypeDistribution.reduce((acc: Record<string, unknown>, curr) => {
          acc[curr._id] = curr.count;
          return acc;
        }, {}),
        responseTimeDistribution: responseTimeDistribution.reduce((acc: Record<string, unknown>, curr) => {
          acc[curr._id] = curr.count;
          return acc;
        }, {})
      },
      incidentsPerMonth,
      topProjects,
      severityDistribution
    });

  } catch (error) {
    console.error('Error fetching analytics:', error);
    return NextResponse.json(
      { error: 'Failed to fetch analytics' },
      { status: 500 }
    );
  }
} 