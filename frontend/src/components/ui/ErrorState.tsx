import { AlertCircle } from 'lucide-react'

interface ErrorStateProps {
    message?: string
    onRetry?: () => void
}

export default function ErrorState({
    message = 'Something went wrong. Please try again.',
    onRetry,
}: ErrorStateProps) {
    return (
        <div className="card text-center py-12">
            <AlertCircle className="w-12 h-12 text-red-500 mx-auto mb-4" />
            <h3 className="text-lg font-semibold text-gray-900 mb-2">Error Loading Data</h3>
            <p className="text-gray-600 mb-6">{message}</p>
            {onRetry && (
                <button
                    onClick={onRetry}
                    className="px-6 py-2 bg-primary-700 text-white rounded-full hover:bg-primary-600 transition-colors"
                >
                    Try Again
                </button>
            )}
        </div>
    )
}
