export default function CancelPage() {
  return (
    <main className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 flex items-center justify-center">
      <div className="bg-slate-800/50 backdrop-blur-sm rounded-2xl p-12 border border-slate-700 text-center max-w-md">
        <div className="text-6xl mb-6">😔</div>
        <h1 className="text-3xl font-bold text-white mb-4">Payment Canceled</h1>
        <p className="text-slate-300 mb-6">
          No worries! Your payment was canceled and you haven&apos;t been charged.
        </p>
        <div className="space-y-3">
          <a
            href="/pricing"
            className="block px-6 py-3 bg-blue-600 hover:bg-blue-700 text-white font-medium rounded-lg transition-colors"
          >
            Try Again
          </a>
          <a
            href="/"
            className="block px-6 py-3 bg-slate-700 hover:bg-slate-600 text-white font-medium rounded-lg transition-colors"
          >
            Back to Home
          </a>
        </div>
      </div>
    </main>
  )
}
