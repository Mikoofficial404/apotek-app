import Order from '#models/order'
import OrderPolicy from '#policies/order_policy'
import { createOrderValidator, updateOrderValidator } from '#validators/order'
import { sortOrder } from '#validators/sort_order'
import type { HttpContext } from '@adonisjs/core/http'

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
