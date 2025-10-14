/**
 * HelpDrawer Component
 * 
 * Mobile-friendly drawer with help resources and quick actions.
 * Uses Vaul drawer for smooth mobile experience.
 * 
 * @component
 */

import { Drawer } from 'vaul'
import { Shield, Mail, Smartphone, HelpCircle } from 'lucide-react'

interface HelpDrawerProps {
  isOpen: boolean
  onOpenChange: (open: boolean) => void
}

interface QuickAction {
  id: string
  icon: typeof Shield
  title: string
  description: string
  bgColor: string
  borderColor: string
  iconColor: string
}

const QUICK_ACTIONS: QuickAction[] = [
  {
    id: 'reset-password',
    icon: Shield,
    title: 'Reset Password',
    description: 'Get help accessing your account',
    bgColor: 'bg-blue-600/20',
    borderColor: 'border-blue-600/30',
    iconColor: 'text-blue-400',
  },
  {
    id: 'contact-support',
    icon: Mail,
    title: 'Contact Support',
    description: 'Get in touch with our team',
    bgColor: 'bg-green-600/20',
    borderColor: 'border-green-600/30',
    iconColor: 'text-green-400',
  },
  {
    id: 'mobile-app',
    icon: Smartphone,
    title: 'Mobile App',
    description: 'Download our mobile app',
    bgColor: 'bg-purple-600/20',
    borderColor: 'border-purple-600/30',
    iconColor: 'text-purple-400',
  },
]

const LOGIN_TIPS = [
  'Use your company email address to sign in',
  'Enable "Remember me" for faster future logins',
]

export function HelpDrawer({ isOpen, onOpenChange }: HelpDrawerProps) {
  return (
    <Drawer.Root open={isOpen} onOpenChange={onOpenChange}>
      <Drawer.Portal>
        <Drawer.Overlay className="fixed inset-0 bg-black/70 backdrop-blur-sm z-50" />
        <Drawer.Content className="bg-[#141414] border-t border-gray-800 flex flex-col rounded-t-[20px] h-fit mt-24 max-h-[80vh] fixed bottom-0 left-0 right-0 z-50">
          {/* Drawer Handle */}
          <div className="mx-auto w-12 h-1.5 flex-shrink-0 rounded-full bg-gray-700 mt-4" />
          
          {/* Drawer Header */}
          <div className="p-6 pb-4">
            <Drawer.Title className="text-xl font-semibold text-white mb-2">
              Need Help?
            </Drawer.Title>
            <p className="text-gray-400 text-sm">
              Get help with your login or learn more about HR Manager
            </p>
          </div>

          {/* Drawer Content */}
          <div className="px-6 pb-6 overflow-y-auto">
            <div className="space-y-4">
              {/* Quick Actions */}
              <section className="space-y-3">
                <h3 className="text-xs font-medium text-gray-500 uppercase tracking-wide">
                  Quick Actions
                </h3>
                
                {QUICK_ACTIONS.map((action) => {
                  const Icon = action.icon
                  return (
                    <button 
                      key={action.id}
                      className="w-full p-4 rounded-lg bg-[#1a1a1a] border border-gray-800 hover:bg-gray-800 transition-colors flex items-center space-x-3"
                    >
                      <div className={`p-2 rounded-lg ${action.bgColor} border ${action.borderColor}`}>
                        <Icon className={`w-5 h-5 ${action.iconColor}`} />
                      </div>
                      <div className="text-left">
                        <p className="font-medium text-white">{action.title}</p>
                        <p className="text-sm text-gray-400">{action.description}</p>
                      </div>
                    </button>
                  )
                })}
              </section>

              {/* About */}
              <section className="space-y-3">
                <h3 className="text-xs font-medium text-gray-500 uppercase tracking-wide">
                  About HR Manager
                </h3>
                
                <div className="p-4 rounded-lg bg-gradient-to-br from-purple-600/10 to-blue-600/10 border border-purple-600/20">
                  <div className="flex items-center space-x-3 mb-3">
                    <div className="p-2 rounded-lg bg-gradient-to-br from-purple-600 to-blue-600">
                      <HelpCircle className="w-5 h-5 text-white" />
                    </div>
                    <h4 className="font-medium text-white">Enterprise HR Solution</h4>
                  </div>
                  <p className="text-sm text-gray-400 leading-relaxed">
                    Streamline your HR processes with our comprehensive dashboard. 
                    Manage employees, track performance, and gain insights with powerful analytics.
                  </p>
                </div>
              </section>

              {/* Login Tips */}
              <section className="space-y-3">
                <h3 className="text-xs font-medium text-gray-500 uppercase tracking-wide">
                  Login Tips
                </h3>
                
                <ul className="space-y-2" role="list">
                  {LOGIN_TIPS.map((tip, index) => (
                    <li 
                      key={index} 
                      className="flex items-start space-x-3 p-3 rounded-lg bg-[#1a1a1a]"
                    >
                      <div className="w-2 h-2 rounded-full bg-purple-500 mt-2 flex-shrink-0" />
                      <p className="text-sm text-gray-400">{tip}</p>
                    </li>
                  ))}
                </ul>
              </section>
            </div>
          </div>

          {/* Drawer Footer */}
          <div className="p-6 pt-4 border-t border-gray-800">
            <button
              onClick={() => onOpenChange(false)}
              className="w-full py-3 px-4 rounded-lg bg-gray-800 hover:bg-gray-700 text-white font-medium transition-colors"
            >
              Close
            </button>
          </div>
        </Drawer.Content>
      </Drawer.Portal>
    </Drawer.Root>
  )
}
