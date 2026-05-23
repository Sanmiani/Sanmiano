import { Component, ReactNode } from 'react'

interface Props {
  children: ReactNode
}

interface State {
  hasError: boolean
  message: string
}

export default class ErrorBoundary extends Component<Props, State> {
  state: State = { hasError: false, message: '' }

  static getDerivedStateFromError(err: unknown): State {
    const message = err instanceof Error ? err.message : 'An unexpected error occurred.'
    return { hasError: true, message }
  }

  render() {
    if (this.state.hasError) {
      return (
        <div className="min-h-screen flex items-center justify-center bg-gray-50 px-4">
          <div className="text-center max-w-sm">
            <p className="text-5xl font-bold text-red-500">!</p>
            <h1 className="mt-4 text-xl font-semibold text-gray-900">Something went wrong</h1>
            <p className="mt-2 text-sm text-gray-500">{this.state.message}</p>
            <button
              onClick={() => window.location.assign('/')}
              className="mt-6 rounded-lg bg-indigo-600 px-5 py-2.5 text-sm font-medium text-white hover:bg-indigo-700 transition-colors"
            >
              Reload app
            </button>
          </div>
        </div>
      )
    }
    return this.props.children
  }
}
