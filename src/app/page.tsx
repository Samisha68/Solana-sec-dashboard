import Link from 'next/link'
import { ShieldCheckIcon, ChartBarIcon, BookOpenIcon, BellIcon } from '@heroicons/react/24/outline'

const stats = [
  { name: 'Total Exploits', value: '150+', icon: ShieldCheckIcon },
  { name: 'Total Value Lost', value: '$500M+', icon: ChartBarIcon },
  { name: 'Best Practices', value: '50+', icon: BookOpenIcon },
  { name: 'Active Incidents', value: '2', icon: BellIcon },
]

const features = [
  {
    name: 'Comprehensive Exploit Database',
    description: 'Detailed analysis of all major security incidents in the Solana ecosystem with onchain data and technical context.',
    href: '/exploits',
  },
  {
    name: 'Real-time Analytics',
    description: 'Track security metrics, response times, and impact analysis with interactive visualizations.',
    href: '/analytics',
  },
  {
    name: 'Best Practices Guide',
    description: 'Curated security guidelines and best practices for developers and users.',
    href: '/best-practices',
  },
  {
    name: 'Live Hack Tracking',
    description: 'Real-time monitoring and reporting of active security incidents.',
    href: '/live-hacks',
  },
]

export default function Home() {
  return (
    <div className="space-y-12">
      {/* Hero section */}
      <div className="text-center">
        <h1 className="text-4xl font-bold tracking-tight text-gray-900 sm:text-5xl md:text-6xl">
          <span className="block">Solana Security</span>
          <span className="block text-indigo-600">Dashboard</span>
        </h1>
        <p className="mx-auto mt-3 max-w-md text-base text-gray-500 sm:text-lg md:mt-5 md:max-w-3xl md:text-xl">
          A comprehensive platform tracking security incidents, providing analytics, and promoting best practices in the Solana ecosystem.
        </p>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4">
        {stats.map((stat) => (
          <div
            key={stat.name}
            className="relative overflow-hidden rounded-lg bg-white px-4 pt-5 pb-12 shadow sm:px-6 sm:pt-6"
          >
            <dt>
              <div className="absolute rounded-md bg-indigo-500 p-3">
                <stat.icon className="h-6 w-6 text-white" aria-hidden="true" />
              </div>
              <p className="ml-16 truncate text-sm font-medium text-gray-500">{stat.name}</p>
            </dt>
            <dd className="ml-16 flex items-baseline pb-6 sm:pb-7">
              <p className="text-2xl font-semibold text-gray-900">{stat.value}</p>
            </dd>
          </div>
        ))}
      </div>

      {/* Features */}
      <div className="grid grid-cols-1 gap-8 sm:grid-cols-2 lg:grid-cols-4">
        {features.map((feature) => (
          <div
            key={feature.name}
            className="relative rounded-lg border border-gray-300 bg-white px-6 py-5 shadow-sm hover:border-gray-400"
          >
            <div className="mt-4">
              <h3 className="text-lg font-medium leading-6 text-gray-900">
                <Link href={feature.href} className="focus:outline-none">
                  <span className="absolute inset-0" aria-hidden="true" />
                  {feature.name}
                </Link>
              </h3>
              <p className="mt-2 text-sm text-gray-500">{feature.description}</p>
            </div>
          </div>
        ))}
      </div>

      {/* CTA */}
      <div className="bg-indigo-50">
        <div className="mx-auto max-w-7xl py-12 px-4 sm:px-6 lg:flex lg:items-center lg:justify-between lg:py-16 lg:px-8">
          <h2 className="text-3xl font-bold tracking-tight text-gray-900 sm:text-4xl">
            <span className="block">Ready to contribute?</span>
            <span className="block text-indigo-600">Help make Solana more secure.</span>
          </h2>
          <div className="mt-8 flex lg:mt-0 lg:flex-shrink-0">
            <div className="inline-flex rounded-md shadow">
              <a
                href="https://github.com/yourusername/solana-security-dashboard"
                className="inline-flex items-center justify-center rounded-md border border-transparent bg-indigo-600 px-5 py-3 text-base font-medium text-white hover:bg-indigo-700"
              >
                View on GitHub
              </a>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
