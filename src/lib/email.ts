/**
 * Email Service
 * Uses Resend for sending emails
 *
 * Setup:
 * 1. npm install resend
 * 2. Add RESEND_API_KEY to .env
 * 3. Verify domain in Resend dashboard
 */

import { logger } from './logger'

// Type definitions
interface EmailOptions {
  to: string | string[]
  subject: string
  html: string
  from?: string
}

interface PasswordResetEmailData {
  email: string
  name: string
  resetToken: string
}

interface OrderConfirmationEmailData {
  email: string
  name: string
  orderNumber: string
  total: number
  items: Array<{
    nome: string
    preco: number
    quantidade: number
    imagemPrincipal?: string
  }>
  endereco: {
    rua: string
    numero: string
    complemento?: string
    bairro: string
    cidade: string
    estado: string
    cep: string
  }
}

class EmailService {
  private resendApiKey: string | undefined
  private from: string
  private isConfigured: boolean

  constructor() {
    this.resendApiKey = process.env.RESEND_API_KEY
    this.from = process.env.EMAIL_FROM || 'Retrô Carólis <noreply@retrocarolis.com>'
    this.isConfigured = !!this.resendApiKey

    if (!this.isConfigured) {
      logger.warn('Resend API key not configured. Emails will be logged to console.')
    }
  }

  /**
   * Send generic email
   */
  async sendEmail(options: EmailOptions): Promise<boolean> {
    try {
      if (!this.isConfigured) {
        // In development/testing, just log the email
        logger.info('Email would be sent (Resend not configured)', {
          to: options.to,
          subject: options.subject,
          from: options.from || this.from
        })
        console.log('\n=== EMAIL PREVIEW ===')
        console.log('To:', options.to)
        console.log('Subject:', options.subject)
        console.log('From:', options.from || this.from)
        console.log('Body:', options.html.substring(0, 200) + '...')
        console.log('=====================\n')
        return true
      }

      // Use Resend in production
      const { Resend } = await import('resend')
      const resend = new Resend(this.resendApiKey)

      const { data, error } = await resend.emails.send({
        from: options.from || this.from,
        to: Array.isArray(options.to) ? options.to : [options.to],
        subject: options.subject,
        html: options.html
      })

      if (error) {
        logger.error('Failed to send email', { error, to: options.to })
        return false
      }

      logger.info('Email sent successfully', {
        to: options.to,
        subject: options.subject,
        emailId: data?.id
      })

      return true
    } catch (error) {
      logger.error('Error sending email', { error, to: options.to })
      return false
    }
  }

  /**
   * Send password reset email
   */
  async sendPasswordResetEmail(data: PasswordResetEmailData): Promise<boolean> {
    const resetLink = `${process.env.NEXTAUTH_URL || 'http://localhost:3000'}/redefinir-senha?token=${data.resetToken}`

    const html = `
      <!DOCTYPE html>
      <html>
      <head>
        <meta charset="utf-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>Redefinir Senha</title>
      </head>
      <body style="font-family: Arial, sans-serif; line-height: 1.6; color: #333; max-width: 600px; margin: 0 auto; padding: 20px;">
        <div style="background-color: #8B5CF6; padding: 20px; text-align: center;">
          <h1 style="color: white; margin: 0;">Retrô Carólis</h1>
        </div>

        <div style="background-color: #f9f9f9; padding: 30px; border: 1px solid #ddd;">
          <h2 style="color: #8B5CF6;">Redefinir Senha</h2>

          <p>Olá ${data.name},</p>

          <p>Você solicitou a redefinição de senha da sua conta no Retrô Carólis.</p>

          <p>Clique no botão abaixo para criar uma nova senha:</p>

          <div style="text-align: center; margin: 30px 0;">
            <a href="${resetLink}"
               style="background-color: #8B5CF6; color: white; padding: 12px 30px; text-decoration: none; border-radius: 5px; display: inline-block; font-weight: bold;">
              Redefinir Senha
            </a>
          </div>

          <p style="color: #666; font-size: 14px;">
            Ou copie e cole este link no seu navegador:<br>
            <a href="${resetLink}" style="color: #8B5CF6; word-break: break-all;">${resetLink}</a>
          </p>

          <p style="color: #999; font-size: 12px; margin-top: 30px; padding-top: 20px; border-top: 1px solid #ddd;">
            ⚠️ Este link expira em 1 hora.<br>
            ⚠️ Se você não solicitou esta redefinição, ignore este email.
          </p>
        </div>

        <div style="text-align: center; padding: 20px; color: #999; font-size: 12px;">
          <p>© ${new Date().getFullYear()} Retrô Carólis. Todos os direitos reservados.</p>
        </div>
      </body>
      </html>
    `

    return this.sendEmail({
      to: data.email,
      subject: 'Redefinir sua senha - Retrô Carólis',
      html
    })
  }

  /**
   * Send order confirmation email
   */
  async sendOrderConfirmationEmail(data: OrderConfirmationEmailData): Promise<boolean> {
    const totalFormatado = (data.total / 100).toFixed(2).replace('.', ',')

    const itemsHtml = data.items.map(item => {
      const precoFormatado = (item.preco / 100).toFixed(2).replace('.', ',')
      const subtotalFormatado = ((item.preco * item.quantidade) / 100).toFixed(2).replace('.', ',')

      return `
        <tr>
          <td style="padding: 10px; border-bottom: 1px solid #eee;">
            ${item.imagemPrincipal ? `<img src="${item.imagemPrincipal}" alt="${item.nome}" style="width: 50px; height: 50px; object-fit: cover; border-radius: 5px; margin-right: 10px; vertical-align: middle;">` : ''}
            <span style="vertical-align: middle;">${item.nome}</span>
          </td>
          <td style="padding: 10px; border-bottom: 1px solid #eee; text-align: center;">${item.quantidade}</td>
          <td style="padding: 10px; border-bottom: 1px solid #eee; text-align: right;">R$ ${precoFormatado}</td>
          <td style="padding: 10px; border-bottom: 1px solid #eee; text-align: right; font-weight: bold;">R$ ${subtotalFormatado}</td>
        </tr>
      `
    }).join('')

    const html = `
      <!DOCTYPE html>
      <html>
      <head>
        <meta charset="utf-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>Pedido Confirmado</title>
      </head>
      <body style="font-family: Arial, sans-serif; line-height: 1.6; color: #333; max-width: 600px; margin: 0 auto; padding: 20px;">
        <div style="background-color: #8B5CF6; padding: 20px; text-align: center;">
          <h1 style="color: white; margin: 0;">Retrô Carólis</h1>
        </div>

        <div style="background-color: #f9f9f9; padding: 30px; border: 1px solid #ddd;">
          <div style="text-align: center; margin-bottom: 30px;">
            <div style="font-size: 48px; margin-bottom: 10px;">✅</div>
            <h2 style="color: #8B5CF6; margin: 0;">Pedido Confirmado!</h2>
          </div>

          <p>Olá ${data.name},</p>

          <p>Seu pedido foi confirmado com sucesso! Obrigado por comprar no Retrô Carólis.</p>

          <div style="background-color: white; padding: 20px; border-radius: 5px; margin: 20px 0;">
            <h3 style="margin-top: 0; color: #8B5CF6;">Detalhes do Pedido</h3>
            <p><strong>Número do Pedido:</strong> #${data.orderNumber}</p>
            <p><strong>Total:</strong> <span style="font-size: 24px; color: #8B5CF6; font-weight: bold;">R$ ${totalFormatado}</span></p>
          </div>

          <h3 style="color: #8B5CF6;">Itens do Pedido</h3>
          <table style="width: 100%; border-collapse: collapse;">
            <thead>
              <tr style="background-color: #f0f0f0;">
                <th style="padding: 10px; text-align: left;">Produto</th>
                <th style="padding: 10px; text-align: center;">Qtd</th>
                <th style="padding: 10px; text-align: right;">Preço</th>
                <th style="padding: 10px; text-align: right;">Subtotal</th>
              </tr>
            </thead>
            <tbody>
              ${itemsHtml}
            </tbody>
          </table>

          <h3 style="color: #8B5CF6; margin-top: 30px;">Endereço de Entrega</h3>
          <p style="background-color: white; padding: 15px; border-radius: 5px; margin: 10px 0;">
            ${data.endereco.rua}, ${data.endereco.numero}${data.endereco.complemento ? ', ' + data.endereco.complemento : ''}<br>
            ${data.endereco.bairro}<br>
            ${data.endereco.cidade} - ${data.endereco.estado}<br>
            CEP: ${data.endereco.cep}
          </p>

          <div style="background-color: #fff3cd; border: 1px solid #ffc107; padding: 15px; border-radius: 5px; margin: 30px 0;">
            <p style="margin: 0; font-size: 14px;">
              📦 Seu pedido será preparado e enviado em até 2 dias úteis.<br>
              📧 Você receberá um email com o código de rastreio assim que o pedido for despachado.
            </p>
          </div>
        </div>

        <div style="text-align: center; padding: 20px; color: #999; font-size: 12px;">
          <p>Dúvidas? Entre em contato conosco!</p>
          <p>© ${new Date().getFullYear()} Retrô Carólis. Todos os direitos reservados.</p>
        </div>
      </body>
      </html>
    `

    return this.sendEmail({
      to: data.email,
      subject: `Pedido #${data.orderNumber} confirmado! - Retrô Carólis`,
      html
    })
  }
}

// Export singleton instance
export const emailService = new EmailService()

// Export individual functions for convenience
export const sendPasswordResetEmail = (data: PasswordResetEmailData) =>
  emailService.sendPasswordResetEmail(data)

export const sendOrderConfirmationEmail = (data: OrderConfirmationEmailData) =>
  emailService.sendOrderConfirmationEmail(data)
