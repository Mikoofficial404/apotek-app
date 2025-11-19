import Order from '#models/order'
import OrderPolicy from '#policies/order_policy'
import { createOrderValidator, updateOrderValidator } from '#validators/order'
import type { HttpContext } from '@adonisjs/core/http'

export default class OrdersController {
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
