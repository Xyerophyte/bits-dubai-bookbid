import type { User } from '@supabase/supabase-js'

/**
 * Checks if a user has admin privileges
 * @param user - The authenticated user object from Supabase
 * @returns boolean - true if user is admin, false otherwise
 */
export function isAdminUser(user: User | null | undefined): boolean {
  if (!user?.email) return false
  
  const adminEmail = process.env.NEXT_PUBLIC_ADMIN_EMAIL
  if (!adminEmail) {
    console.warn('NEXT_PUBLIC_ADMIN_EMAIL environment variable not set')
    return false
  }
  
  return user.email.toLowerCase() === adminEmail.toLowerCase()
}

/**
 * Checks if the current user can perform admin actions
 * This can be extended to check database-based roles in the future
 */
export function canPerformAdminAction(user: User | null | undefined): boolean {
  return isAdminUser(user)
}

/**
 * Gets admin status with additional metadata
 * @param user - The authenticated user object
 * @returns object with admin status and metadata
 */
export function getAdminStatus(user: User | null | undefined) {
  const isAdmin = isAdminUser(user)
  
  return {
    isAdmin,
    canSell: isAdmin,
    canManageBooks: isAdmin,
    canViewAdminPanel: isAdmin,
    userEmail: user?.email || null
  }
}
