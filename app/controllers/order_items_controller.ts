import OrderItem from '#models/order_item'
import OrderItemPolicy from '#policies/order_item_policy'
import { addOrderItemValidator, updateOrderItemValidator } from '#validators/order_item'
import type { HttpContext } from '@adonisjs/core/http'

export default class OrderItemsController {
  public async show({}: HttpContext) {}
  public async store({ bouncer, request, response }: HttpContext) {
    try {
      if (await bouncer.with(OrderItemPolicy).denies('create')) {
        return response.forbidden('You are not authorized to create order items')
      }
      const payload = await request.validateUsing(addOrderItemValidator)
      const orderItem = await OrderItem.create(payload)

      await orderItem.load('order')
      await orderItem.load('product')

      return response.status(201).json({
        status: 'success',
        message: 'Order item created successfully',
        data: orderItem,
      })
    } catch (error) {
      return response.status(400).json({
        status: 'error',
        message:
          (error as any)?.messages ?? (error as any)?.message ?? 'Failed to create order item',
      })
    }
  }

  public async update({ request, response, bouncer, params }: HttpContext) {
    try {
      const orderItem = await OrderItem.findOrFail(params.id)
      if (await bouncer.with(OrderItemPolicy).denies('update', orderItem)) {
        return response.forbidden('You are not authorized to update this order item')
      }

      const payload = await request.validateUsing(updateOrderItemValidator)
      await orderItem.merge(payload).save()

      await orderItem.load('order')
      await orderItem.load('product')

      return response.status(200).json({
        status: 'success',
        message: 'Order item updated successfully',
        data: orderItem,
      })
    } catch (error) {
      return response.status(400).json({
        status: 'error',
        message:
          (error as any)?.messages ?? (error as any)?.message ?? 'Failed to update order item',
      })
    }
  }

  public async destroy({ response, bouncer, params }: HttpContext) {
    try {
      const orderItem = await OrderItem.findOrFail(params.id)
      if (await bouncer.with(OrderItemPolicy).denies('delete', orderItem)) {
        return response.forbidden('You are not authorized to delete this order item')
      }

      await orderItem.delete()

      return response.status(200).json({
        status: 'success',
        message: 'Order item deleted successfully',
      })
    } catch (error) {
      return response.status(400).json({
        status: 'error',
        message:
          (error as any)?.messages ?? (error as any)?.message ?? 'Failed to delete order item',
      })
    }
  }
}
