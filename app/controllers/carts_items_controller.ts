import Cart from '#models/cart'
import CartItem from '#models/cart_item'
import Product from '#models/product'
import CartItemPolicy from '#policies/cart_item_policy'
import {
  addCartItemValidator,
  removeCartItemValidator,
  updateCartItemValidator,
} from '#validators/cart_item'
import type { HttpContext } from '@adonisjs/core/http'

export default class CartsItemsController {
  public async store({ request, response, bouncer }: HttpContext) {
    try {
      const payload = await request.validateUsing(addCartItemValidator)
      const cart = await Cart.findOrFail(payload.cartId)
      const product = await Product.findOrFail(payload.productId)

      if (await bouncer.with(CartItemPolicy).denies('create', payload.cartId)) {
        return response.forbidden({ message: 'You are not authorized to add items to this cart' })
      }

      if (product.stock < payload.quantity) {
        return response.forbidden({ message: 'Insufficient stock' })
      }

      const existingItem = await CartItem.query()
        .where('cart_id', cart.id)
        .where('product_id', product.id)
        .first()

      if (existingItem) {
        existingItem.quantity = existingItem.quantity + payload.quantity
        await existingItem.save()
        await existingItem.load('product')

        return response.ok(existingItem)
      } else {
        const newItem = await CartItem.create({
          cartId: payload.cartId,
          productId: payload.productId,
          quantity: payload.quantity,
        })

        await newItem.load('product')

        return response.created(newItem)
      }
    } catch (error) {
      return response.badRequest({ message: error.message })
    }
  }

  public async update({ request, response, bouncer }: HttpContext) {
    try {
      const payload = await request.validateUsing(updateCartItemValidator)
      await Cart.findOrFail(payload.cartId)
      const product = await Product.findOrFail(payload.productId)

      const cartItem = await CartItem.query()
        .where('cart_id', payload.cartId)
        .where('product_id', payload.productId)
        .firstOrFail()

      if (await bouncer.with(CartItemPolicy).denies('update', cartItem)) {
        return response.forbidden({ message: 'You are not authorized to update this item' })
      }

      if (product.stock < payload.quantity) {
        return response.forbidden({ message: 'Insufficient stock' })
      }

      cartItem.quantity = payload.quantity
      await cartItem.save()
      await cartItem.load('product')

      return response.ok(cartItem)
    } catch (error) {
      return response.badRequest({ message: error.message })
    }
  }

  public async destroy({ request, bouncer, response }: HttpContext) {
    try {
      const payload = await request.validateUsing(removeCartItemValidator)
      await Cart.findOrFail(payload.cartId)

      const cartItem = await CartItem.query()
        .where('cart_id', payload.cartId)
        .where('product_id', payload.productId)
        .firstOrFail()

      if (await bouncer.with(CartItemPolicy).denies('delete', cartItem)) {
        return response.forbidden({ message: 'You are not authorized to delete this item' })
      }

      await cartItem.delete()

      return response.ok({ message: 'Item removed from cart' })
    } catch (error) {
      return response.badRequest({ message: error.message })
    }
  }
}
