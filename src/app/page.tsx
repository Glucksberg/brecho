import { redirect } from 'next/navigation'
import { getServerSession } from '@/lib/auth'

/**
 * Home Page - Redirects to appropriate page based on user type
 *
 * Lógica de redirecionamento:
 * - ADMIN, DONO, VENDEDOR → /dashboard
 * - CLIENTE com fornecedoraId → /portal-fornecedora (cliente que virou fornecedora)
 * - CLIENTE sem fornecedoraId → /loja (cliente comum)
 */
export default async function HomePage() {
  const session = (await getServerSession()) as any

  // Not authenticated - redirect to login
  if (!session || !session.user) {
    redirect('/login')
  }

  // Redirect based on user role
  switch ((session.user as any).tipo) {
    case 'ADMIN':
    case 'DONO':
    case 'VENDEDOR':
      redirect('/dashboard')

    case 'CLIENTE':
      // Se o cliente tem fornecedoraId, é uma fornecedora
      // Redireciona para o portal de fornecedoras
      if (session.user.fornecedoraId) {
        redirect('/portal-fornecedora')
      }
      // Cliente comum vai para a loja
      redirect('/loja')

    default:
      redirect('/loja')
  }
}
