import { ShieldCheckIcon, DocumentTextIcon, CodeBracketIcon, KeyIcon } from '@heroicons/react/24/outline'

const categories = [
  {
    name: 'Smart Contract Security',
    icon: CodeBracketIcon,
    practices: [
      {
        title: 'Use Formal Verification',
        description: 'Implement formal verification for critical smart contract functions to ensure mathematical correctness.',
        priority: 5,
      },
      {
        title: 'Implement Access Controls',
        description: 'Use role-based access control (RBAC) and multi-signature requirements for sensitive operations.',
        priority: 5,
      },
      {
        title: 'Regular Security Audits',
        description: 'Conduct regular security audits by reputable firms and implement recommended fixes promptly.',
        priority: 5,
      },
    ],
  },
  {
    name: 'Key Management',
    icon: KeyIcon,
    practices: [
      {
        title: 'Use Hardware Security Modules',
        description: 'Implement HSM for secure key storage and management of critical private keys.',
        priority: 5,
      },
      {
        title: 'Key Rotation',
        description: 'Establish regular key rotation policies and automated key rotation mechanisms.',
        priority: 4,
      },
      {
        title: 'Multi-signature Wallets',
        description: 'Use multi-signature wallets for all treasury and high-value operations.',
        priority: 5,
      },
    ],
  },
  {
    name: 'Operational Security',
    icon: ShieldCheckIcon,
    practices: [
      {
        title: 'Incident Response Plan',
        description: 'Develop and regularly test an incident response plan for security breaches.',
        priority: 5,
      },
      {
        title: 'Regular Security Training',
        description: 'Conduct regular security training for all team members and stakeholders.',
        priority: 4,
      },
      {
        title: 'Security Monitoring',
        description: 'Implement comprehensive security monitoring and alerting systems.',
        priority: 5,
      },
    ],
  },
  {
    name: 'Documentation',
    icon: DocumentTextIcon,
    practices: [
      {
        title: 'Security Documentation',
        description: 'Maintain comprehensive security documentation and update it regularly.',
        priority: 4,
      },
      {
        title: 'Post-mortem Reports',
        description: 'Create detailed post-mortem reports for all security incidents.',
        priority: 4,
      },
      {
        title: 'Security Checklists',
        description: 'Develop and maintain security checklists for common operations.',
        priority: 3,
      },
    ],
  },
]

export default function BestPracticesPage() {
  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-2xl font-semibold text-gray-900">Security Best Practices</h1>
        <p className="mt-2 text-sm text-gray-700">
          Comprehensive guidelines and recommendations for maintaining security in the Solana ecosystem.
        </p>
      </div>

      <div className="grid grid-cols-1 gap-8 lg:grid-cols-2">
        {categories.map((category) => (
          <div key={category.name} className="rounded-lg bg-white shadow">
            <div className="p-6">
              <div className="flex items-center">
                <category.icon className="h-6 w-6 text-indigo-600" aria-hidden="true" />
                <h2 className="ml-3 text-lg font-medium text-gray-900">{category.name}</h2>
              </div>
              <div className="mt-6 space-y-6">
                {category.practices.map((practice) => (
                  <div key={practice.title} className="relative">
                    <div className="flex items-start">
                      <div className="flex-shrink-0">
                        <div
                          className={`flex h-8 w-8 items-center justify-center rounded-full ${
                            practice.priority >= 4
                              ? 'bg-red-100 text-red-600'
                              : practice.priority >= 3
                              ? 'bg-yellow-100 text-yellow-600'
                              : 'bg-green-100 text-green-600'
                          }`}
                        >
                          {practice.priority}
                        </div>
                      </div>
                      <div className="ml-4">
                        <h3 className="text-sm font-medium text-gray-900">{practice.title}</h3>
                        <p className="mt-1 text-sm text-gray-500">{practice.description}</p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Additional Resources */}
      <div className="rounded-lg bg-white shadow">
        <div className="p-6">
          <h2 className="text-lg font-medium text-gray-900">Additional Resources</h2>
          <div className="mt-6 grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
            <a
              href="https://docs.solana.com/security"
              className="group relative rounded-lg border border-gray-300 bg-white p-6 hover:border-gray-400"
            >
              <h3 className="text-sm font-medium text-gray-900">
                <span className="absolute inset-0" aria-hidden="true" />
                Solana Security Documentation
              </h3>
              <p className="mt-2 text-sm text-gray-500">
                Official security documentation and guidelines from the Solana team.
              </p>
            </a>
            <a
              href="https://github.com/solana-labs/solana/blob/master/SECURITY.md"
              className="group relative rounded-lg border border-gray-300 bg-white p-6 hover:border-gray-400"
            >
              <h3 className="text-sm font-medium text-gray-900">
                <span className="absolute inset-0" aria-hidden="true" />
                Solana Security Policy
              </h3>
              <p className="mt-2 text-sm text-gray-500">
                Security policy and responsible disclosure guidelines.
              </p>
            </a>
            <a
              href="https://solana.com/ecosystem/security"
              className="group relative rounded-lg border border-gray-300 bg-white p-6 hover:border-gray-400"
            >
              <h3 className="text-sm font-medium text-gray-900">
                <span className="absolute inset-0" aria-hidden="true" />
                Security Ecosystem
              </h3>
              <p className="mt-2 text-sm text-gray-500">
                Overview of security tools and services in the Solana ecosystem.
              </p>
            </a>
          </div>
        </div>
      </div>
    </div>
  )
} 