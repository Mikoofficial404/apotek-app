import Order from '#models/order'
import OrderPolicy from '#policies/order_policy'
import Cart from '#models/cart'
import OrderItem from '#models/order_item'
import MidtransService from '#services/midtrans_service'
import { checkoutValidator, createOrderValidator, updateOrderValidator } from '#validators/order'
import { sortOrder } from '#validators/sort_order'
import type { HttpContext } from '@adonisjs/core/http'
import db from '@adonisjs/lucid/services/db'

export default class OrdersController {
  public async index({ request, response, auth }: HttpContext) {
    try {
      const page = request.input('page', 1)
      const perPage = request.input('per_page', 10)
      const userId = request.input('user_id')
      const status = request.input('status')

      const user = auth.user!
      const query = Order.query()

      const sortValidate = await request.validateUsing(sortOrder)
      const sortBy = sortValidate.sort_by || 'id'
      const order = sortValidate.order_by || 'asc'

      if (user.role !== 'admin') {
        query.where('user_id', user.id)
      } else if (userId) {
        query.where('user_id', userId)
      }

      if (status) {
        query.where('status', status)
      }

      const orders = await query
        .preload('user')
        .preload('shippingAddress')
        .preload('orderItems', (orderItemQuery) => {
          orderItemQuery.preload('product')
        })
        .orderBy(sortBy, order)
        .paginate(page, perPage)

      return response.status(200).json({
        status: 'success',
        data: orders,
      })
    } catch (error) {
      return response.status(400).json({
        status: 'error',
        message: (error as any)?.messages ?? (error as any)?.message ?? 'Failed to fetch orders',
      })
    }
  }

  public async show({ params, response, bouncer }: HttpContext) {
    try {
      const order = await Order.query()
        .where('id', params.id)
        .preload('user')
        .preload('shippingAddress')
        .preload('orderItems', (orderItemQuery) => {
          orderItemQuery.preload('product', (productQuery) => {
            productQuery.preload('category').preload('supplier')
          })
        })
        .firstOrFail()

      if (await bouncer.with(OrderPolicy).denies('view', order)) {
        return response.forbidden('You are not authorized to view this order')
      }

      return response.status(200).json({
        status: 'success',
        data: order,
      })
    } catch (error) {
      return response.status(404).json({
        status: 'error',
        message: (error as any)?.messages ?? (error as any)?.message ?? 'Order not found',
      })
    }
  }

  public async checkout({ request, response, bouncer, auth }: HttpContext) {
    const trx = await db.transaction()

    try {
      if (await bouncer.with(OrderPolicy).denies('create')) {
        return response.forbidden('You are not authorized to create orders')
      }

      const payload = await request.validateUsing(checkoutValidator)
      const user = auth.getUserOrFail()

      const cart = await Cart.query({ client: trx })
        .where('id', payload.cartId)
        .where('user_id', user.id)
        .preload('cartItems', (query) => {
          query.preload('product')
        })
        .firstOrFail()

      if (cart.cartItems.length === 0) {
        await trx.rollback()
        return response.badRequest({ message: 'Cart is empty' })
      }

      let totalPrice = 0
      for (const item of cart.cartItems) {
        const product = item.product
        if (product.stock < item.quantity) {
          await trx.rollback()
          return response.badRequest({
            message: `Insufficient stock for ${product.nameProduct}`,
          })
        }
        totalPrice += product.harga * item.quantity
      }

      const order = await Order.create(
        {
          userId: user.id,
          shippingAddressId: payload.shippingAddressId,
          totalPrice: totalPrice,
          status: 'pending',
          paymentStatus: 'unpaid',
          paymentMethod: payload.paymentMethod,
        },
        { client: trx }
      )

      for (const item of cart.cartItems) {
        const product = item.product
        const subtotal = product.harga * item.quantity

        await OrderItem.create(
          {
            orderId: order.id,
            productId: item.productId,
            quantity: item.quantity,
            subtotal: subtotal,
          },
          { client: trx }
        )

        product.stock -= item.quantity
        await product.useTransaction(trx).save()
      }

      await db.from('cart_items').where('cart_id', cart.id).delete().useTransaction(trx)

      if (payload.paymentMethod === 'midtrans') {
        const midtrans = new MidtransService()
        const items = cart.cartItems.map((item) => {
          const product = item.product
          return {
            id: product.id.toString(),
            price: product.harga,
            quantity: item.quantity,
            name: product.nameProduct,
          }
        })

        const payment = await midtrans.createTransaction(order, items)
        order.paymentToken = payment.token
        order.paymentUrl = payment.redirect_url
        await order.useTransaction(trx).save()
      }

      await trx.commit()

      await order.load('orderItems', (query) => {
        query.preload('product')
      })

      return response.created({
        status: 'success',
        message: 'Order created successfully',
        data: {
          order,
          payment_url: order.paymentUrl,
          payment_token: order.paymentToken,
        },
      })
    } catch (error) {
      await trx.rollback()
      return response.badRequest({
        status: 'error',
        message: (error as any)?.messages ?? (error as any)?.message ?? 'Failed to checkout',
      })
    }
  }

  public async createOrder({ request, response, bouncer }: HttpContext) {
    try {
      if (await bouncer.with(OrderPolicy).denies('create')) {
        return response.forbidden('You are not authorized to create orders')
      }

      const payload = await request.validateUsing(createOrderValidator)
      const order = await Order.create(payload)

      return response.status(201).json({
        status: 'success',
        message: 'Order created successfully',
        data: order,
      })
    } catch (error) {
      return response.status(400).json({
        status: 'error',
        message: (error as any)?.messages ?? (error as any)?.message ?? 'Failed to create order',
      })
    }
  }

  public async update({ request, response, bouncer, params }: HttpContext) {
    try {
      const order = await Order.findOrFail(params.id)
      if (await bouncer.with(OrderPolicy).denies('update', order)) {
        return response.forbidden('You are not authorized to update this order')
      }

      const payload = await request.validateUsing(updateOrderValidator)
      await order.merge(payload).save()

      return response.status(200).json({
        status: 'success',
        message: 'Order updated successfully',
        data: order,
      })
    } catch (error) {
      return response.status(400).json({
        status: 'error',
        message: (error as any)?.messages ?? (error as any)?.message ?? 'Failed to update order',
      })
    }
  }

  public async destroy({ response, bouncer, params }: HttpContext) {
    try {
      const order = await Order.findOrFail(params.id)
      if (await bouncer.with(OrderPolicy).denies('delete', order)) {
        return response.forbidden('You are not authorized to delete this order')
      }

      await order.delete()

      return response.status(200).json({
        status: 'success',
        message: 'Order deleted successfully',
      })
    } catch (error) {
      return response.status(400).json({
        status: 'error',
        message: (error as any)?.messages ?? (error as any)?.message ?? 'Failed to delete order',
      })
    }
  }
}
