import { Link } from 'react-router-dom'
import { AlertTriangle } from 'lucide-react'

export default function Unauthorized() {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gray-50">
      <div className="flex flex-col items-center bg-white shadow-lg rounded-2xl p-10">
        <AlertTriangle className="text-red-500 w-16 h-16 mb-4" />
        <h1 className="text-2xl font-semibold text-gray-800 mb-2">
          Access Denied
        </h1>
        <p className="text-gray-600 mb-6 text-center">
          You are not authorized to access this page.
        </p>
      </div>
    </div>
  )
}
