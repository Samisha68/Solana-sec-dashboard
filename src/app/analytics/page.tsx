'use client'

import { useEffect, useState } from 'react';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  Title,
  Tooltip,
  Legend,
  ArcElement,
} from 'chart.js'
import { Line, Bar, Pie, Chart } from 'react-chartjs-2'
import Link from 'next/link';

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  Title,
  Tooltip,
  Legend,
  ArcElement
)

interface AnalyticsData {
  analytics: Array<{
    metric: string;
    value: number;
    timestamp: string;
    category: string;
    period: string;
  }>;
  metrics: {
    totalValueLost: number;
    exploitTypeDistribution: Record<string, number>;
    responseTimeDistribution: Record<string, number>;
  };
  incidentsPerMonth?: Array<{ _id: string; count: number; valueLost: number }>;
  topProjects?: Array<{ _id: string; count: number; valueLost: number }>;
  severityDistribution?: Array<{ _id: string; count: number }>;
}

// Mock data for fallback
const mockData: AnalyticsData = {
  analytics: [
    { metric: 'Total Value Lost', value: 50000000, timestamp: '2024-01-01', category: 'Smart Contract', period: 'Daily' },
    { metric: 'Recovery Rate', value: 65, timestamp: '2024-01-01', category: 'Smart Contract', period: 'Daily' },
  ],
  metrics: {
    totalValueLost: 50000000,
    exploitTypeDistribution: {
      'Smart Contract': 15,
      'Oracle': 8,
      'Social Engineering': 12,
      'Key Management': 5,
    },
    responseTimeDistribution: {
      '<1h': 10,
      '1-6h': 15,
      '6-24h': 8,
      '>24h': 7,
    }
  }
};

// Historical incidents data
const historicalIncidents = [
  {
    date: '2024-02-15',
    title: 'Flash Loan Attack on Solana Protocol',
    amount: 2500000,
    type: 'Flash Loan',
    status: 'Resolved',
    links: {
      github: 'https://github.com/solana-labs/solana/issues/example',
      postmortem: 'https://solana.com/blog/example-postmortem',
    }
  },
  {
    date: '2024-02-10',
    title: 'Smart Contract Reentrancy Vulnerability',
    amount: 1500000,
    type: 'Reentrancy',
    status: 'Resolved',
    links: {
      github: 'https://github.com/solana-labs/solana/issues/example2',
      postmortem: 'https://solana.com/blog/example-postmortem2',
    }
  },
  // Add more historical incidents here
];

type IncidentMonth = { _id: string; count: number; valueLost: number };
type TopProject = { _id: string; count: number; valueLost: number };
type Severity = { _id: string; count: number };

export default function AnalyticsPage() {
  const [data, setData] = useState<AnalyticsData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetch('/api/analytics');
        if (!response.ok) throw new Error('Failed to fetch analytics');
        const analyticsData = await response.json();
        setData(analyticsData);
      } catch (err) {
        console.warn('Using mock data due to API error:', err);
        setData(mockData);
        setError('Using sample data due to API error');
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  if (loading) return <div className="p-4">Loading analytics...</div>;
  if (!data) return <div className="p-4">No data available</div>;

  const monthlyData = {
    labels: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'],
    datasets: [
      {
        label: 'Amount Lost (Millions USD)',
        data: data.analytics
          .filter(a => a.metric === 'Total Value Lost' && a.period === 'Daily')
          .map(a => a.value / 1000000),
        borderColor: 'rgb(99, 102, 241)',
        backgroundColor: 'rgba(99, 102, 241, 0.5)',
      },
    ],
  };

  const exploitTypesData = {
    labels: Object.keys(data.metrics.exploitTypeDistribution),
    datasets: [
      {
        data: Object.values(data.metrics.exploitTypeDistribution),
        backgroundColor: [
          'rgba(99, 102, 241, 0.8)',
          'rgba(16, 185, 129, 0.8)',
          'rgba(245, 158, 11, 0.8)',
          'rgba(239, 68, 68, 0.8)',
        ],
      },
    ],
  };

  const responseTimeData = {
    labels: Object.keys(data.metrics.responseTimeDistribution),
    datasets: [
      {
        label: 'Response Time Distribution',
        data: Object.values(data.metrics.responseTimeDistribution),
        backgroundColor: 'rgba(99, 102, 241, 0.8)',
      },
    ],
  };

  // Add new chart data for incidents per month, top projects, and severity distribution
  const incidentsPerMonthData = data.incidentsPerMonth ? {
    labels: data.incidentsPerMonth.map((d: IncidentMonth) => d._id),
    datasets: [
      {
        label: 'Incidents',
        data: data.incidentsPerMonth.map((d: IncidentMonth) => d.count),
        backgroundColor: 'rgba(99, 102, 241, 0.7)',
        borderColor: 'rgba(99, 102, 241, 1)',
        borderWidth: 1,
        yAxisID: 'y',
        type: 'bar' as const,
      },
      {
        label: 'Value Lost (M USD)',
        data: data.incidentsPerMonth.map((d: IncidentMonth) => d.valueLost / 1_000_000),
        backgroundColor: 'rgba(239, 68, 68, 0.5)',
        borderColor: 'rgba(239, 68, 68, 1)',
        borderWidth: 1,
        type: 'line' as const,
        yAxisID: 'y1',
      },
    ],
  } : null;

  const topProjectsData = data.topProjects ? {
    labels: data.topProjects.map((d: TopProject) => d._id),
    datasets: [
      {
        label: 'Incidents',
        data: data.topProjects.map((d: TopProject) => d.count),
        backgroundColor: 'rgba(99, 102, 241, 0.7)',
      },
      {
        label: 'Value Lost (M USD)',
        data: data.topProjects.map((d: TopProject) => d.valueLost / 1_000_000),
        backgroundColor: 'rgba(239, 68, 68, 0.5)',
      },
    ],
  } : null;

  const severityData = data.severityDistribution ? {
    labels: data.severityDistribution.map((d: Severity) => d._id || 'Unknown'),
    datasets: [
      {
        label: 'Incidents',
        data: data.severityDistribution.map((d: Severity) => d.count),
        backgroundColor: [
          'rgba(239, 68, 68, 0.8)', // Critical
          'rgba(245, 158, 11, 0.8)', // High
          'rgba(99, 102, 241, 0.8)', // Medium
          'rgba(16, 185, 129, 0.8)', // Low
        ],
      },
    ],
  } : null;

  return (
    <div className="space-y-8 p-4">
      {error && (
        <div className="rounded-md bg-yellow-50 p-4">
          <div className="flex">
            <div className="flex-shrink-0">
              <svg className="h-5 w-5 text-yellow-400" viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
              </svg>
            </div>
            <div className="ml-3">
              <h3 className="text-sm font-medium text-yellow-800">Sample Data</h3>
              <div className="mt-2 text-sm text-yellow-700">
                <p>{error}</p>
              </div>
            </div>
          </div>
        </div>
      )}

      <div>
        <h1 className="text-2xl font-semibold text-gray-900">Security Analytics</h1>
        <p className="mt-2 text-sm text-gray-700">
          Comprehensive analysis of security incidents, response times, and impact in the Solana ecosystem.
        </p>
      </div>

      {/* Key Metrics */}
      <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4">
        <div className="overflow-hidden rounded-lg bg-white px-4 py-5 shadow sm:p-6">
          <dt className="truncate text-sm font-medium text-gray-500">Total Value Lost</dt>
          <dd className="mt-1 text-3xl font-semibold tracking-tight text-gray-900">
            ${(data.metrics.totalValueLost / 1000000).toFixed(2)}M
          </dd>
        </div>
        <div className="overflow-hidden rounded-lg bg-white px-4 py-5 shadow sm:p-6">
          <dt className="truncate text-sm font-medium text-gray-500">Total Incidents</dt>
          <dd className="mt-1 text-3xl font-semibold tracking-tight text-gray-900">
            {Object.values(data.metrics.exploitTypeDistribution).reduce((a, b) => a + b, 0)}
          </dd>
        </div>
        <div className="overflow-hidden rounded-lg bg-white px-4 py-5 shadow sm:p-6">
          <dt className="truncate text-sm font-medium text-gray-500">Quick Response Rate</dt>
          <dd className="mt-1 text-3xl font-semibold tracking-tight text-gray-900">
            {Math.round((data.metrics.responseTimeDistribution['<1h'] || 0) / 
              Object.values(data.metrics.responseTimeDistribution).reduce((a, b) => a + b, 0) * 100)}%
          </dd>
        </div>
        <div className="overflow-hidden rounded-lg bg-white px-4 py-5 shadow sm:p-6">
          <dt className="truncate text-sm font-medium text-gray-500">Recovery Rate</dt>
          <dd className="mt-1 text-3xl font-semibold tracking-tight text-gray-900">
            {data.analytics.find(a => a.metric === 'Recovery Rate')?.value || 'N/A'}%
          </dd>
        </div>
      </div>

      {/* Charts */}
      <div className="grid grid-cols-1 gap-8 lg:grid-cols-2">
        <div className="rounded-lg bg-white p-6 shadow">
          <h3 className="text-lg font-medium text-gray-900">Monthly Value Lost</h3>
          <div className="mt-4 h-72">
            <Line data={monthlyData} options={{ maintainAspectRatio: false }} />
          </div>
        </div>
        <div className="rounded-lg bg-white p-6 shadow">
          <h3 className="text-lg font-medium text-gray-900">Exploit Type Distribution</h3>
          <div className="mt-4 h-72">
            <Pie data={exploitTypesData} options={{ maintainAspectRatio: false }} />
          </div>
        </div>
        <div className="rounded-lg bg-white p-6 shadow">
          <h3 className="text-lg font-medium text-gray-900">Response Time Distribution</h3>
          <div className="mt-4 h-72">
            <Bar data={responseTimeData} options={{ maintainAspectRatio: false }} />
          </div>
        </div>
        {/* New: Incidents per Month */}
        {incidentsPerMonthData && (
          <div className="rounded-lg bg-white p-6 shadow lg:col-span-2">
            <h3 className="text-lg font-medium text-gray-900">Incidents & Value Lost Per Month</h3>
            <div className="mt-4 h-80">
              <Chart
                type="bar"
                data={incidentsPerMonthData}
                options={{
                  maintainAspectRatio: false,
                  responsive: true,
                  interaction: { mode: 'index', intersect: false },
                  scales: {
                    y: {
                      type: 'linear',
                      display: true,
                      position: 'left',
                      title: { display: true, text: 'Incidents' },
                    },
                    y1: {
                      type: 'linear',
                      display: true,
                      position: 'right',
                      grid: { drawOnChartArea: false },
                      title: { display: true, text: 'Value Lost (M USD)' },
                    },
                  },
                }}
              />
            </div>
          </div>
        )}
        {/* New: Top Projects */}
        {topProjectsData && (
          <div className="rounded-lg bg-white p-6 shadow">
            <h3 className="text-lg font-medium text-gray-900">Top Affected Projects</h3>
            <div className="mt-4 h-72">
              <Bar data={topProjectsData} options={{ maintainAspectRatio: false, responsive: true }} />
            </div>
          </div>
        )}
        {/* New: Severity Distribution */}
        {severityData && (
          <div className="rounded-lg bg-white p-6 shadow">
            <h3 className="text-lg font-medium text-gray-900">Severity Distribution</h3>
            <div className="mt-4 h-72">
              <Pie data={severityData} options={{ maintainAspectRatio: false }} />
            </div>
          </div>
        )}
      </div>

      {/* Historical Incidents */}
      <div className="rounded-lg bg-white p-6 shadow">
        <h3 className="text-lg font-medium text-gray-900 mb-4">Historical Incidents</h3>
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead>
              <tr>
                <th className="px-6 py-3 bg-gray-50 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Date</th>
                <th className="px-6 py-3 bg-gray-50 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Title</th>
                <th className="px-6 py-3 bg-gray-50 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Amount</th>
                <th className="px-6 py-3 bg-gray-50 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Type</th>
                <th className="px-6 py-3 bg-gray-50 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                <th className="px-6 py-3 bg-gray-50 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Links</th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {historicalIncidents.map((incident, index) => (
                <tr key={index} className={index % 2 === 0 ? 'bg-white' : 'bg-gray-50'}>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{incident.date}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{incident.title}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">${(incident.amount / 1000000).toFixed(2)}M</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{incident.type}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                    <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                      incident.status === 'Resolved' ? 'bg-green-100 text-green-800' : 'bg-yellow-100 text-yellow-800'
                    }`}>
                      {incident.status}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                    <div className="flex space-x-2">
                      <Link href={incident.links.github} target="_blank" className="text-indigo-600 hover:text-indigo-900">
                        GitHub
                      </Link>
                      <Link href={incident.links.postmortem} target="_blank" className="text-indigo-600 hover:text-indigo-900">
                        Postmortem
                      </Link>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}