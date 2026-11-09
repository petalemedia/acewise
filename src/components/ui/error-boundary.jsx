import React from 'react'
import { AlertTriangle, RotateCcw, House } from 'lucide-react'

export class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props)
    this.state = { hasError: false, error: null, errorInfo: null }
  }

  static getDerivedStateFromError(error) {
    return { hasError: true, error }
  }

  componentDidCatch(error, errorInfo) {
    this.setState({ errorInfo })
    console.error('Unhandled application error:', error, errorInfo)
  }

  handleReset = () => {
    this.setState({ hasError: false, error: null, errorInfo: null })
  }

  handleReload = () => {
    window.location.reload()
  }

  render() {
    if (this.state.hasError) {
      if (this.props.fallback) {
        return this.props.fallback
      }

      const errorMessage = this.state.error?.message || 'An unexpected runtime error occurred.'

      return (
        <div className="min-h-screen w-full flex items-center justify-center p-6 bg-[#fcfcfd] text-[#171717] font-sans">
          <div className="w-full max-w-md bg-white border border-[#e5e7eb] rounded-2xl p-6 sm:p-8 shadow-[0_10px_30px_rgba(0,0,0,0.06)] text-center">
            <div className="w-12 h-12 mx-auto mb-4 rounded-full bg-[#fef2f2] text-[#dc2626] flex items-center justify-center shadow-xs">
              <AlertTriangle className="w-6 h-6 stroke-[2]" />
            </div>

            <h1 className="text-xl font-bold tracking-tight mb-2">Something went wrong</h1>
            <p className="text-sm text-[#525252] leading-relaxed mb-6">
              We encountered an unexpected problem while rendering this page. You can try refreshing or returning to the home page.
            </p>

            <div className="flex flex-col sm:flex-row gap-2.5 justify-center mb-6">
              <button
                type="button"
                onClick={this.handleReload}
                className="inline-flex items-center justify-center gap-2 px-4 py-2.5 text-sm font-semibold rounded-xl bg-[#171717] text-white hover:bg-[#2e2e2e] transition-colors cursor-pointer"
              >
                <RotateCcw className="w-4 h-4" />
                Reload page
              </button>

              <a
                href="/"
                className="inline-flex items-center justify-center gap-2 px-4 py-2.5 text-sm font-semibold rounded-xl bg-[#f5f5f5] text-[#171717] hover:bg-[#e8e8e8] transition-colors cursor-pointer border border-[#e5e7eb]"
              >
                <House className="w-4 h-4" />
                Back to home
              </a>
            </div>

            {process.env.NODE_ENV !== 'production' && this.state.error && (
              <details className="text-left text-xs bg-[#f9fafb] border border-[#f3f4f6] rounded-xl p-3 text-[#4b5563] overflow-auto max-h-48">
                <summary className="font-semibold cursor-pointer text-[#374151] mb-1 select-none">
                  Error Details
                </summary>
                <p className="font-mono text-[#dc2626] whitespace-pre-wrap break-all mb-2">
                  {errorMessage}
                </p>
                {this.state.errorInfo?.componentStack && (
                  <pre className="font-mono text-[11px] text-[#6b7280] whitespace-pre-wrap">
                    {this.state.errorInfo.componentStack}
                  </pre>
                )}
              </details>
            )}
          </div>
        </div>
      )
    }

    return this.props.children
  }
}

export default ErrorBoundary
