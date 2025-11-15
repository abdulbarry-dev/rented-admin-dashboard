// Authentication middleware
export function authMiddleware() {
  const token = localStorage.getItem('authToken')

  if (!token) {
    return '/login'
  }

  return true
}

// Guest middleware (only allow non-authenticated users)
export function guestMiddleware() {
  const token = localStorage.getItem('authToken')

  if (token) {
    return '/'
  }

  return true
}

// Admin middleware
export function adminMiddleware() {
  const token = localStorage.getItem('authToken')
  const userRole = localStorage.getItem('userRole')

  if (!token) {
    return '/login'
  }

  if (userRole !== 'admin') {
    return '/'
  }

  return true
}

// ID verification middleware
export function idVerificationMiddleware() {
  const idVerified = localStorage.getItem('idVerified')

  if (idVerified !== 'true') {
    return '/upload-id'
  }

  return true
}
