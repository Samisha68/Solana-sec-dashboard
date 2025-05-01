import { BellIcon, ExclamationTriangleIcon, CheckCircleIcon, ClockIcon } from '@heroicons/react/24/outline'

// This would typically come from your database
const activeHacks = [
  {
    id: 1,
    title: 'Suspicious Activity Detected',
    project: 'Protocol X',
    description: 'Unusual transaction patterns detected in the protocol\'s treasury wallet.',
    severity: 'High',
    status: 'Under Investigation',
    reportedAt: '2024-03-15T10:30:00Z',
    lastUpdated: '2024-03-15T11:45:00Z',
    txHash: '0x123...abc',
  },
  {
    id: 2,
    title: 'Potential Oracle Manipulation',
    project: 'DEX Y',
    description: 'Suspicious price feed activity detected, possible oracle manipulation attempt.',
    severity: 'Medium',
    status: 'Monitoring',
    reportedAt: '2024-03-15T09:15:00Z',
    lastUpdated: '2024-03-15T11:30:00Z',
    txHash: '0x456...def',
  },
]

const resolvedHacks = [
  {
    id: 3,
    title: 'False Alarm - Normal Activity',
    project: 'Protocol Z',
    description: 'Initial alert was triggered by legitimate protocol upgrade activity.',
    severity: 'Low',
    status: 'Resolved',
    reportedAt: '2024-03-14T15:20:00Z',
    resolvedAt: '2024-03-14T16:45:00Z',
    txHash: '0x789...ghi',
  },
]

export default function LiveHacksPage() {
  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-2xl font-semibold text-gray-900">Live Security Incidents</h1>
        <p className="mt-2 text-sm text-gray-700">
          Real-time tracking of active security incidents in the Solana ecosystem.
        </p>
      </div>

      {/* Active Incidents */}
      <div>
        <h2 className="text-lg font-medium text-gray-900">Active Incidents</h2>
        <div className="mt-4 grid grid-cols-1 gap-4">
          {activeHacks.map((hack) => (
            <div
              key={hack.id}
              className="relative rounded-lg border border-red-200 bg-white p-6 shadow-sm"
            >
              <div className="flex items-start">
                <div className="flex-shrink-0">
                  <ExclamationTriangleIcon className="h-6 w-6 text-red-600" aria-hidden="true" />
                </div>
                <div className="ml-4 flex-1">
                  <div className="flex items-center justify-between">
                    <h3 className="text-sm font-medium text-gray-900">{hack.title}</h3>
                    <span
                      className={`inline-flex items-center rounded-md px-2 py-1 text-xs font-medium ${
                        hack.severity === 'High'
                          ? 'bg-red-100 text-red-700'
                          : 'bg-yellow-100 text-yellow-700'
                      }`}
                    >
                      {hack.severity}
                    </span>
                  </div>
                  <p className="mt-1 text-sm text-gray-500">{hack.description}</p>
                  <div className="mt-4 flex items-center space-x-4 text-sm text-gray-500">
                    <div className="flex items-center">
                      <ClockIcon className="mr-1.5 h-4 w-4 text-gray-400" aria-hidden="true" />
                      Reported {new Date(hack.reportedAt).toLocaleString()}
                    </div>
                    <div className="flex items-center">
                      <BellIcon className="mr-1.5 h-4 w-4 text-gray-400" aria-hidden="true" />
                      Last updated {new Date(hack.lastUpdated).toLocaleString()}
                    </div>
                    <a
                      href={`https://solscan.io/tx/${hack.txHash}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-indigo-600 hover:text-indigo-900"
                    >
                      View Transaction
                    </a>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Recently Resolved */}
      <div>
        <h2 className="text-lg font-medium text-gray-900">Recently Resolved</h2>
        <div className="mt-4 grid grid-cols-1 gap-4">
          {resolvedHacks.map((hack) => (
            <div
              key={hack.id}
              className="relative rounded-lg border border-gray-200 bg-white p-6 shadow-sm"
            >
              <div className="flex items-start">
                <div className="flex-shrink-0">
                  <CheckCircleIcon className="h-6 w-6 text-green-600" aria-hidden="true" />
                </div>
                <div className="ml-4 flex-1">
                  <div className="flex items-center justify-between">
                    <h3 className="text-sm font-medium text-gray-900">{hack.title}</h3>
                    <span className="inline-flex items-center rounded-md bg-green-100 px-2 py-1 text-xs font-medium text-green-700">
                      Resolved
                    </span>
                  </div>
                  <p className="mt-1 text-sm text-gray-500">{hack.description}</p>
                  <div className="mt-4 flex items-center space-x-4 text-sm text-gray-500">
                    <div className="flex items-center">
                      <ClockIcon className="mr-1.5 h-4 w-4 text-gray-400" aria-hidden="true" />
                      Resolved {new Date(hack.resolvedAt).toLocaleString()}
                    </div>
                    <a
                      href={`https://solscan.io/tx/${hack.txHash}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-indigo-600 hover:text-indigo-900"
                    >
                      View Transaction
                    </a>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Report Incident */}
      <div className="rounded-lg bg-white p-6 shadow">
        <h2 className="text-lg font-medium text-gray-900">Report a Security Incident</h2>
        <p className="mt-1 text-sm text-gray-500">
          If you&apos;ve discovered a security incident, please report it immediately to help protect the ecosystem.
        </p>
        <div className="mt-4">
          <button
            type="button"
            className="inline-flex items-center rounded-md bg-indigo-600 px-3 py-2 text-sm font-semibold text-white shadow-sm hover:bg-indigo-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600"
          >
            Report Incident
          </button>
        </div>
      </div>
    </div>
  )
} 