import { AlertCircle } from 'lucide-react'

export const Error = ({ message }: { message?: string }) => {
  return (
    <div className="flex flex-col items-center justify-center h-full gap-3 text-center p-6">
      <AlertCircle className="w-10 h-10 text-red-400" />
      <p className="text-gray-600 font-medium">{message ?? "Une erreur est survenue"}</p>
    </div>
  )
}