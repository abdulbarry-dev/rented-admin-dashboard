/**
 * RememberMeSwitch Component
 * 
 * Toggle switch for "Remember me" functionality using Radix UI.
 * Includes accessible label and smooth transitions.
 * 
 * @component
 */

import * as Switch from '@radix-ui/react-switch'

interface RememberMeSwitchProps {
  checked: boolean
  onCheckedChange: (checked: boolean) => void
}

export function RememberMeSwitch({ checked, onCheckedChange }: RememberMeSwitchProps) {
  return (
    <div className="flex items-center space-x-2">
      <Switch.Root
        checked={checked}
        onCheckedChange={onCheckedChange}
        className="w-9 h-5 bg-gray-700 rounded-full relative data-[state=checked]:bg-purple-600 transition-colors duration-200"
        id="remember-me"
      >
        <Switch.Thumb className="block w-4 h-4 bg-white rounded-full shadow-sm transform transition-transform duration-200 data-[state=checked]:translate-x-4 translate-x-0.5" />
      </Switch.Root>
      <label 
        htmlFor="remember-me"
        className="text-xs text-gray-400 cursor-pointer"
      >
        Remember me
      </label>
    </div>
  )
}
