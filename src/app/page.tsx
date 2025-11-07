import { redirect } from 'next/navigation'
import { getServerSession } from '@/lib/auth'

/**
 * Home Page - Redirects to appropriate page based on user type
 */
export default async function HomePage() {
  const session = await getServerSession()

  // Not authenticated - redirect to login
  if (!session || !session.user) {
    redirect('/login')
  }

  // Redirect based on user role
  switch (session.user.role) {
    case 'ADMIN':
    case 'DONO':
    case 'VENDEDOR':
      redirect('/dashboard')

    case 'FORNECEDOR':
      redirect('/portal-fornecedora')

    case 'CLIENTE':
    default:
      redirect('/loja')
  }
}
