import Order from '#models/order'
import MidtransService from '#services/midtrans_service'
import type { HttpContext } from '@adonisjs/core/http'
import env from '#start/env'

export default class PaymentController {
  public async notification({ request, response }: HttpContext) {
    try {
      const notification = request.body()

      // Log notification untuk debug
      console.log('Midtrans notification received:', JSON.stringify(notification, null, 2))

      const orderId = notification.order_id
      const transactionStatus = notification.transaction_status
      const fraudStatus = notification.fraud_status
      const statusCode = notification.status_code
      const grossAmount = notification.gross_amount
      const signatureKey = notification.signature_key

      // Validasi data yang diperlukan
      if (!orderId || !transactionStatus || !statusCode || !grossAmount) {
        console.error('Missing required notification data:', {
          orderId,
          transactionStatus,
          statusCode,
          grossAmount,
        })
        return response.badRequest({
          status: 'error',
          message: 'Missing required notification data',
        })
      }

      const midtrans = new MidtransService()
      const serverKey = env.get('MIDTRANS_SERVER_KEY', '')
      const expectedSignature = midtrans.verifySignature(
        orderId,
        statusCode,
        grossAmount,
        serverKey
      )

      console.log('Signature verification:', {
        received: signatureKey,
        expected: expectedSignature,
        match: signatureKey === expectedSignature,
      })

      if (signatureKey !== expectedSignature) {
        console.error('Invalid signature')
        return response.unauthorized({ message: 'Invalid signature' })
      }

      const order = await Order.query().where('order_code', orderId).first()

      if (!order) {
        console.error(`Order not found: ${orderId}`)
        return response.notFound({
          status: 'error',
          message: `Order not found: ${orderId}`,
        })
      }

      console.log(`Processing order ${orderId} with status ${transactionStatus}`)

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

      console.log(`Order ${orderId} updated successfully`)

      return response.ok({
        status: 'success',
        message: 'Payment notification processed',
      })
    } catch (error) {
      console.error('Notification processing error:', error)
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

  public async manualUpdateStatus({ params, request, response }: HttpContext) {
    try {
      const order = await Order.query().where('order_code', params.orderCode).firstOrFail()

      const { paymentStatus, orderStatus } = request.body()

      if (paymentStatus) {
        order.paymentStatus = paymentStatus
      }

      if (orderStatus) {
        order.status = orderStatus
      }

      await order.save()

      return response.ok({
        status: 'success',
        message: 'Order status updated',
        data: {
          order_code: order.orderCode,
          payment_status: order.paymentStatus,
          order_status: order.status,
        },
      })
    } catch (error) {
      return response.notFound({
        status: 'error',
        message: 'Order not found',
      })
    }
  }

  public async finish({ request, response }: HttpContext) {
    const orderId = request.input('order_id')
    const statusCode = request.input('status_code')
    const transactionStatus = request.input('transaction_status')

    const frontendUrl = env.get('FRONTEND_URL', 'http://localhost:5173')
    return response.redirect(
      `${frontendUrl}/payment/finish?order_id=${orderId}&status_code=${statusCode}&transaction_status=${transactionStatus}`
    )
  }

  public async pending({ request, response }: HttpContext) {
    const orderId = request.input('order_id')

    const frontendUrl = env.get('FRONTEND_URL', 'http://localhost:5173')
    return response.redirect(`${frontendUrl}/payment/pending?order_id=${orderId}`)
  }

  public async error({ request, response }: HttpContext) {
    const orderId = request.input('order_id')

    const frontendUrl = env.get('FRONTEND_URL', 'http://localhost:5173')
    return response.redirect(`${frontendUrl}/payment/error?order_id=${orderId}`)
  }
}
