import { redirect } from 'next/navigation'

/**
 * Home Page - Redirects to appropriate page based on user type
 * For now, redirects to login
 */
export default function HomePage() {
  // TODO: Check if user is authenticated and redirect accordingly
  // - Admin/Dono/Vendedor -> /dashboard
  // - Fornecedor -> /portal-fornecedora
  // - Cliente -> /loja
  // - Not authenticated -> /login

  redirect('/login')
}
