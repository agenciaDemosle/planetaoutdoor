import axios from 'axios'

// En desarrollo usamos localhost, en producción el dominio real
const API_URL = import.meta.env.DEV
  ? 'https://planetaoutdoor.cl/api/mercadopago.php'
  : '/api/mercadopago.php'

interface MercadoPagoItem {
  title: string
  description?: string
  picture_url?: string
  quantity: number
  currency_id: string
  unit_price: number
}

interface MercadoPagoPayer {
  name: string
  surname: string
  email: string
  phone?: {
    area_code: string
    number: string
  }
  address?: {
    street_name: string
    street_number: number
    zip_code: string
  }
}

interface CreatePreferenceData {
  items: MercadoPagoItem[]
  payer: MercadoPagoPayer
  back_urls: {
    success: string
    failure: string
    pending: string
  }
  auto_return?: 'approved' | 'all'
  external_reference?: string
  notification_url?: string
}

interface PreferenceResponse {
  id: string
  init_point: string
  sandbox_init_point: string
}

class MercadoPagoAPI {
  async createPreference(data: CreatePreferenceData): Promise<PreferenceResponse> {
    const response = await axios.post<PreferenceResponse>(API_URL, data, {
      headers: {
        'Content-Type': 'application/json',
      },
    })
    return response.data
  }
}

export const mercadoPagoAPI = new MercadoPagoAPI()
export type { MercadoPagoItem, MercadoPagoPayer, CreatePreferenceData, PreferenceResponse }
