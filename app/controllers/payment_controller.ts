import Order from '#models/order'
import MidtransService from '#services/midtrans_service'
import type { HttpContext } from '@adonisjs/core/http'
import env from '#start/env'

export default class PaymentController {
  public async notification({ request, response }: HttpContext) {
    try {
      const notification = request.body()

      const orderId = notification.order_id
      const transactionStatus = notification.transaction_status
      const fraudStatus = notification.fraud_status
      const statusCode = notification.status_code
      const grossAmount = notification.gross_amount
      const signatureKey = notification.signature_key

      const midtrans = new MidtransService()
      const serverKey = env.get('MIDTRANS_SERVER_KEY', '')
      const expectedSignature = midtrans.verifySignature(
        orderId,
        statusCode,
        grossAmount,
        serverKey
      )

      if (signatureKey !== expectedSignature) {
        return response.unauthorized({ message: 'Invalid signature' })
      }

      const order = await Order.query().where('order_code', orderId).firstOrFail()

      if (transactionStatus === 'capture') {
        if (fraudStatus === 'accept') {
          order.paymentStatus = 'paid'
          order.status = 'processing'
        }
      } else if (transactionStatus === 'settlement') {
        order.paymentStatus = 'paid'
        order.status = 'processing'
      } else if (
        transactionStatus === 'cancel' ||
        transactionStatus === 'deny' ||
        transactionStatus === 'expire'
      ) {
        order.paymentStatus = 'unpaid'
        order.status = 'cancelled'
      } else if (transactionStatus === 'pending') {
        order.paymentStatus = 'unpaid'
        order.status = 'pending'
      } else if (transactionStatus === 'refund') {
        order.paymentStatus = 'refunded'
        order.status = 'cancelled'
      }

      await order.save()

      return response.ok({
        status: 'success',
        message: 'Payment notification processed',
      })
    } catch (error) {
      return response.badRequest({
        status: 'error',
        message: (error as any)?.message ?? 'Failed to process payment notification',
      })
    }
  }

  public async checkStatus({ params, response }: HttpContext) {
    try {
      const order = await Order.query()
        .where('order_code', params.orderCode)
        .preload('orderItems', (query) => {
          query.preload('product')
        })
        .firstOrFail()

      return response.ok({
        status: 'success',
        data: {
          order_code: order.orderCode,
          payment_status: order.paymentStatus,
          order_status: order.status,
          total_price: order.totalPrice,
          payment_url: order.paymentUrl,
        },
      })
    } catch (error) {
      return response.notFound({
        status: 'error',
        message: 'Order not found',
      })
    }
  }
}
