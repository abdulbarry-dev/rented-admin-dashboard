/**
 * BackgroundEffects Component
 * 
 * Animated gradient background effects for the login page.
 * Creates ambient visual interest without distracting from content.
 * 
 * @component
 */

export function BackgroundEffects() {
  return (
    <div className="fixed inset-0 overflow-hidden pointer-events-none">
      <div className="absolute top-0 left-1/4 w-96 h-96 bg-purple-600/10 rounded-full blur-3xl" />
      <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-blue-600/10 rounded-full blur-3xl" />
    </div>
  )
}
