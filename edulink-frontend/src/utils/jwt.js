// Simple JWT decoder (for client-side only, not for verification)
export const decodeJWT = (token) => {
  try {
    if (!token) return null
    
    const parts = token.split('.')
    if (parts.length !== 3) {
      console.error('Invalid JWT token format')
      return null
    }
    
    const base64Url = parts[1]
    const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/')
    const jsonPayload = decodeURIComponent(
      atob(base64)
        .split('')
        .map((c) => '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2))
        .join('')
    )
    const decoded = JSON.parse(jsonPayload)
    
    // Check if token is expired
    if (decoded.exp && decoded.exp * 1000 < Date.now()) {
      console.error('JWT token has expired')
      return null
    }
    
    return decoded
  } catch (error) {
    console.error('Error decoding JWT:', error)
    return null
  }
}

