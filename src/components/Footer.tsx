export default function Footer() {
  return (
    <footer className="bg-white border-t">
      <div className="container mx-auto px-4 py-8">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <div>
            <h3 className="text-sm font-semibold text-gray-400 tracking-wider uppercase">About</h3>
            <p className="mt-4 text-base text-gray-500">
              A comprehensive dashboard tracking security incidents and best practices in the Solana ecosystem.
            </p>
          </div>
          <div>
            <h3 className="text-sm font-semibold text-gray-400 tracking-wider uppercase">Resources</h3>
            <ul className="mt-4 space-y-4">
              <li>
                <a href="https://docs.solana.com/security" className="text-base text-gray-500 hover:text-gray-900">
                  Solana Security Documentation
                </a>
              </li>
              <li>
                <a href="https://github.com/solana-labs/solana" className="text-base text-gray-500 hover:text-gray-900">
                  Solana GitHub
                </a>
              </li>
            </ul>
          </div>
          <div>
            <h3 className="text-sm font-semibold text-gray-400 tracking-wider uppercase">Contribute</h3>
            <p className="mt-4 text-base text-gray-500">
              This is an open-source project. Help us make the Solana ecosystem more secure by contributing.
            </p>
            <div className="mt-4">
              <a
                href="https://github.com/yourusername/solana-security-dashboard"
                className="text-base text-gray-500 hover:text-gray-900"
              >
                View on GitHub
              </a>
            </div>
          </div>
        </div>
        <div className="mt-8 border-t border-gray-200 pt-8">
          <p className="text-base text-gray-400 text-center">
            Built with ❤️ for the Solana community
          </p>
        </div>
      </div>
    </footer>
  )
} 