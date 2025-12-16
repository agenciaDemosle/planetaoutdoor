export interface OrderBilling {
  first_name: string
  last_name: string
  address_1: string
  address_2?: string
  city: string
  state: string
  postcode: string
  country: string
  email: string
  phone: string
}

export interface OrderShipping {
  first_name: string
  last_name: string
  address_1: string
  address_2?: string
  city: string
  state: string
  postcode: string
  country: string
}

export interface OrderLineItem {
  product_id: number
  quantity: number
  meta_data?: Array<{
    key: string
    value: string
  }>
}

export interface CreateOrderData {
  payment_method: string
  payment_method_title: string
  set_paid: boolean
  billing: OrderBilling
  shipping: OrderShipping
  line_items: OrderLineItem[]
  meta_data?: Array<{
    key: string
    value: string
  }>
}

export interface Order {
  id: number
  parent_id: number
  number: string
  order_key: string
  created_via: string
  version: string
  status: string
  currency: string
  date_created: string
  date_modified: string
  discount_total: string
  discount_tax: string
  shipping_total: string
  shipping_tax: string
  cart_tax: string
  total: string
  total_tax: string
  prices_include_tax: boolean
  customer_id: number
  customer_ip_address: string
  customer_user_agent: string
  customer_note: string
  billing: OrderBilling
  shipping: OrderShipping
  payment_method: string
  payment_method_title: string
  payment_url: string
  transaction_id: string
  date_paid: string | null
  date_completed: string | null
  cart_hash: string
  meta_data: Array<{
    id: number
    key: string
    value: string
  }>
  line_items: Array<{
    id: number
    name: string
    product_id: number
    variation_id: number
    quantity: number
    tax_class: string
    subtotal: string
    subtotal_tax: string
    total: string
    total_tax: string
    taxes: Array<{
      id: number
      total: string
      subtotal: string
    }>
    meta_data: Array<{
      id: number
      key: string
      value: string
    }>
    sku: string
    price: number
  }>
}
