import axios from 'axios'

// En desarrollo usamos el proxy de Vite, en producción la URL directa
const isDev = import.meta.env.DEV
const baseURL = isDev ? '' : ''

interface CreateTransactionParams {
  buyOrder: string
  sessionId: string
  amount: number
  returnUrl: string
}

interface CreateTransactionResponse {
  token: string
  url: string
}

interface TransactionResult {
  vci: string
  amount: number
  status: 'INITIALIZED' | 'AUTHORIZED' | 'REVERSED' | 'FAILED' | 'NULLIFIED' | 'PARTIALLY_NULLIFIED' | 'CAPTURED'
  buy_order: string
  session_id: string
  card_detail: {
    card_number: string
  }
  accounting_date: string
  transaction_date: string
  authorization_code: string
  payment_type_code: 'VN' | 'VD' | 'VC' | 'SI' | 'S2' | 'NC' | 'VP'
  response_code: number
  installments_number: number
  installments_amount?: number
  balance?: number
}

class TransbankAPI {
  /**
   * Crear una nueva transacción en Webpay Plus
   * Retorna token y URL para redirigir al usuario
   */
  async createTransaction(params: CreateTransactionParams): Promise<CreateTransactionResponse> {
    const response = await axios.post(`${baseURL}/api/transbank/create.php`, {
      buy_order: params.buyOrder,
      session_id: params.sessionId,
      amount: params.amount,
      return_url: params.returnUrl,
    })
    return response.data
  }

  /**
   * Confirmar una transacción después de que el usuario vuelve de Webpay
   * IMPORTANTE: Solo se puede llamar UNA vez por token
   */
  async confirmTransaction(token: string): Promise<TransactionResult> {
    const response = await axios.post(`${baseURL}/api/transbank/confirm.php`, {
      token,
    })
    return response.data
  }

  /**
   * Consultar el estado de una transacción
   * Útil para verificar transacciones ya confirmadas
   */
  async getTransactionStatus(token: string): Promise<TransactionResult> {
    const response = await axios.post(`${baseURL}/api/transbank/status.php`, {
      token,
    })
    return response.data
  }

  /**
   * Genera la URL de redirección a Webpay con el token
   */
  getWebpayRedirectUrl(url: string, token: string): string {
    return `${url}?token_ws=${token}`
  }

  /**
   * Redirige al usuario al formulario de pago de Webpay
   */
  redirectToWebpay(url: string, token: string): void {
    // Crear form y enviarlo (método recomendado por Transbank)
    const form = document.createElement('form')
    form.method = 'POST'
    form.action = url

    const tokenInput = document.createElement('input')
    tokenInput.type = 'hidden'
    tokenInput.name = 'token_ws'
    tokenInput.value = token

    form.appendChild(tokenInput)
    document.body.appendChild(form)
    form.submit()
  }

  /**
   * Verifica si la transacción fue exitosa
   */
  isTransactionSuccessful(result: TransactionResult): boolean {
    return result.response_code === 0 && result.status === 'AUTHORIZED'
  }

  /**
   * Obtiene una descripción legible del tipo de pago
   */
  getPaymentTypeDescription(code: string): string {
    const types: Record<string, string> = {
      'VN': 'Crédito sin cuotas',
      'VD': 'Débito',
      'VC': 'Crédito en cuotas',
      'SI': '3 cuotas sin interés',
      'S2': '2 cuotas sin interés',
      'NC': 'N cuotas sin interés',
      'VP': 'Prepago',
    }
    return types[code] || code
  }

  /**
   * Genera un ID de orden único
   */
  generateBuyOrder(prefix: string = 'PO'): string {
    const timestamp = Date.now().toString(36)
    const random = Math.random().toString(36).substring(2, 8)
    return `${prefix}-${timestamp}-${random}`.substring(0, 26)
  }

  /**
   * Genera un ID de sesión único
   */
  generateSessionId(): string {
    return `sess-${Date.now()}-${Math.random().toString(36).substring(2, 15)}`
  }
}

export const transbankAPI = new TransbankAPI()
export default transbankAPI
