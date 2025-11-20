import env from '#start/env'
import Order from '#models/order'

interface MidtransItem {
  id: string
  price: number
  quantity: number
  name: string
}

interface MidtransResponse {
  token: string
  redirect_url: string
}

export default class MidtransService {
  private serverKey: string
  private isProduction: boolean
  private snapUrl: string

  constructor() {
    this.serverKey = env.get('MIDTRANS_SERVER_KEY', '')
    this.isProduction = env.get('MIDTRANS_IS_PRODUCTION', false)
    this.snapUrl = this.isProduction
      ? 'https://app.midtrans.com/snap/v1/transactions'
      : 'https://app.sandbox.midtrans.com/snap/v1/transactions'
  }

  getClientKey(): string {
    return env.get('MIDTRANS_CLIENT_KEY', '')
  }

  async createTransaction(order: Order, items: MidtransItem[]): Promise<MidtransResponse> {
    await order.load('user')
    await order.load('shippingAddress')

    const user = order.user
    const address = order.shippingAddress

    const payload = {
      transaction_details: {
        order_id: order.orderCode,
        gross_amount: order.totalPrice,
      },
      customer_details: {
        first_name: user.fullName || 'Customer',
        email: user.email,
        phone: address.phoneNumber || '',
        shipping_address: {
          first_name: address.recipientName,
          address: address.address,
          city: address.city,
          postal_code: address.postalCode,
          country_code: 'IDN',
        },
      },
      item_details: items,
      callbacks: {
        finish: `${env.get('APP_URL')}/payment/finish`,
        error: `${env.get('APP_URL')}/payment/error`,
        pending: `${env.get('APP_URL')}/payment/pending`,
      },
    }

    const response = await fetch(this.snapUrl, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': 'Basic ' + Buffer.from(this.serverKey + ':').toString('base64'),
      },
      body: JSON.stringify(payload),
    })

    if (!response.ok) {
      const error = (await response.json()) as any
      throw new Error(`Midtrans error: ${JSON.stringify(error)}`)
    }

    const data = (await response.json()) as any
    return {
      token: data.token,
      redirect_url: data.redirect_url,
    }
  }

  verifySignature(orderId: string, statusCode: string, grossAmount: string, serverKey: string) {
    const crypto = require('node:crypto')
    const hash = crypto
      .createHash('sha512')
      .update(orderId + statusCode + grossAmount + serverKey)
      .digest('hex')
    return hash
  }
}
