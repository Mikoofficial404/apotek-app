import Product from '#models/product'
import ProductPolicy from '#policies/product_policy'
import { ProductValidator } from '#validators/product'
import type { HttpContext } from '@adonisjs/core/http'
import app from '@adonisjs/core/services/app'

export default class ProductsController {
  // public async index({ request, response, bouncer }: HttpContext) {
  //   if (await bouncer.with(ProductPolicy).denies('view')) {
  //     return response.forbidden('You are not authorized to view products')
  //   }
  //   try {
  //     const page = request.input('page', 1)
  //     const perPage = request.input('per_page', 10)
  //     const userId = request.input('user_id')
  //   } catch (error) {}
  // }

  public async store({ request, response, bouncer }: HttpContext) {
    try {
      if (await bouncer.with(ProductPolicy).denies('create')) {
        return response.forbidden('You are not authorized to create products')
      }

      const payload = await request.validateUsing(ProductValidator)
      const product = await Product.create({
        nameProduct: payload.name_product,
        stock: payload.stock,
        harga: payload.harga,
        category_id: payload.category_id,
        supplier_id: payload.supplier_id,
        image_url: '',
      })

      await product.load('category')
      await product.load('supplier')

      const imageFile = payload.image_url
      await imageFile.move(app.makePath('uploads/products'), {
        name: `${product.id}.${imageFile.extname}`,
        overwrite: true,
      })

      product.image_url = `uploads/products/${imageFile.fileName}`
      await product.save()

      return response.status(201).json({
        data: product,
      })
    } catch (e) {
      console.error(e)
      return response.internalServerError('Failed to create product')
    }
  }
}
