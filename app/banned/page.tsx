'use client'

import { ShieldOff, Mail, LogOut } from 'lucide-react'
import { useRouter } from 'next/navigation'
import { logout } from '@/lib/auth'

export default function BannedPage() {
  const router = useRouter()

  const handleLogout = async () => {
    await logout()
    router.push('/login')
  }

  return (
    <div className="min-h-screen bg-[#0a0a0a] text-[#ededed] flex items-center justify-center p-4">
      {/* Background gradient effects */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-0 left-1/4 w-96 h-96 bg-red-600/10 rounded-full blur-3xl"></div>
        <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-orange-600/10 rounded-full blur-3xl"></div>
      </div>

      <div className="max-w-2xl mx-auto relative z-10">
        <div className="bg-[#141414] border border-gray-800 rounded-2xl p-8 md:p-12 text-center shadow-2xl">
          {/* Icon */}
          <div className="w-24 h-24 bg-red-600/20 border-2 border-red-600/50 rounded-full flex items-center justify-center mx-auto mb-6">
            <ShieldOff className="w-12 h-12 text-red-500" />
          </div>

          {/* Title */}
          <h1 className="text-3xl md:text-4xl font-bold text-white mb-4">
            Account Suspended
          </h1>

          {/* Description */}
          <p className="text-gray-400 text-lg mb-8 leading-relaxed">
            Your admin account has been suspended due to a violation of our terms of service
            or suspicious activity. You no longer have access to the admin dashboard.
          </p>

          {/* Info Box */}
          <div className="bg-red-600/10 border border-red-600/30 rounded-lg p-6 mb-8 text-left">
            <h2 className="text-lg font-semibold text-red-400 mb-3 flex items-center gap-2">
              <Mail className="w-5 h-5" />
              Need Help?
            </h2>
            <p className="text-gray-400 text-sm leading-relaxed mb-3">
              If you believe this is a mistake or would like to appeal this decision, please contact our support team:
            </p>
            <ul className="space-y-2 text-sm">
              <li className="flex items-start gap-2">
                <span className="text-red-400 font-medium min-w-[70px]">Email:</span>
                <span className="text-gray-300">support@hrmanager.com</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-red-400 font-medium min-w-[70px]">Phone:</span>
                <span className="text-gray-300">+1 (555) 123-4567</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-red-400 font-medium min-w-[70px]">Hours:</span>
                <span className="text-gray-300">Monday - Friday, 9:00 AM - 5:00 PM EST</span>
              </li>
            </ul>
          </div>

          {/* Logout Button */}
          <button
            onClick={handleLogout}
            className="bg-gradient-to-r from-red-600 to-orange-600 hover:from-red-700 hover:to-orange-700 text-white font-medium py-3 px-8 rounded-lg transition-all flex items-center justify-center gap-2 mx-auto shadow-lg shadow-red-600/20"
          >
            <LogOut className="w-5 h-5" />
            Sign Out
          </button>

          {/* Additional Note */}
          <p className="text-gray-500 text-xs mt-6">
            Reference ID: {Math.random().toString(36).substring(2, 15).toUpperCase()}
          </p>
        </div>
      </div>
    </div>
  )
}
