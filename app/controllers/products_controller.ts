import Category from '#models/category'
import Product from '#models/product'
import ProductPolicy from '#policies/product_policy'
import { ProductValidator, UpdateValidator } from '#validators/product'
import { sortProduct } from '#validators/sort_product'
import type { HttpContext } from '@adonisjs/core/http'
import app from '@adonisjs/core/services/app'
import fs from 'node:fs'

export default class ProductsController {
  public async index({ request, response, bouncer }: HttpContext) {
    try {
      if (await bouncer.with(ProductPolicy).denies('view')) {
        return response.forbidden('You are not authorized to view products')
      }
      const page = request.input('page', 1)
      const perPage = request.input('per_page', 10)
      const categoryId = request.input('category_id')
      const supplierId = request.input('supplier_id')
      const sortValidate = await request.validateUsing(sortProduct)
      const sortBy = sortValidate.sort_by || 'id'
      const order = sortValidate.order_by || 'asc'
      const product = await Product.query()
        .if(categoryId, (query) => query.where('category_id', categoryId))
        .if(supplierId, (query) => query.where('supplier_id', supplierId))
        .orderBy(sortBy, order)
        .preload('category')
        .preload('supplier')
        .paginate(page, perPage)

      return response.status(200).json({
        data: product,
      })
    } catch (error) {
      return response.status(404).json({
        message: error.message,
      })
    }
  }

  public async show({ params, response, bouncer }: HttpContext) {
    try {
      if (await bouncer.with(ProductPolicy).denies('view')) {
        return response.forbidden('You are not authorized to view products')
      }
      const product = await Product.query()
        .where('id', params.id)
        .preload('category')
        .preload('supplier')
        .firstOrFail()
      return response.status(200).json({
        data: product,
      })
    } catch (error) {
      return response.status(404).json({
        message: error.message,
      })
    }
  }

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

  public async update({ params, bouncer, response, request }: HttpContext) {
    try {
      const id = params.id ?? request.input('id')
      if (!id) {
        return response.badRequest({
          errors: [{ field: 'id', message: 'Product id is required' }],
        })
      }

      const product = await Product.findOrFail(id)
      if (await bouncer.with(ProductPolicy).denies('update', product)) {
        return response.forbidden('You are not authorized to create products')
      }
      const payload = await request.validateUsing(UpdateValidator)
      const category = await Category.find(payload.category_id)
      if (!category) {
        return response.badRequest({
          errors: [{ field: 'category_id', message: 'Invalid category ID' }],
        })
      }

      if (payload.image_url) {
        if (product.image_url) {
          const oldImagePath = app.makePath(product.image_url)
          if (fs.existsSync(oldImagePath)) {
            fs.unlinkSync(oldImagePath)
          }
        }

        const imageFile = payload.image_url
        await imageFile.move(app.makePath('uploads/products'), {
          name: `${product.id}.${imageFile.extname}`,
          overwrite: true,
        })

        product.image_url = `uploads/products/${imageFile.fileName}`
      }

      await product
        .merge({
          nameProduct: payload.name_product,
          stock: payload.stock,
          harga: payload.harga,
          category_id: payload.category_id,
          supplier_id: payload.supplier_id,
        })
        .save()
      await product.load('category')
      await product.load('supplier')

      return response.ok({
        data: product,
      })
    } catch (error) {
      console.error(error)
      return response.internalServerError('Failed to update product')
    }
  }

  public async destroy({ params, response, bouncer, request }: HttpContext) {
    try {
      const id = params.id ?? request.input('id')
      if (!id) {
        return response.badRequest({
          errors: [{ field: 'id', message: 'Product id is required' }],
        })
      }
      const product = await Product.findOrFail(id)
      if (await bouncer.with(ProductPolicy).denies('delete', product)) {
        return response.forbidden('You are not authorized to create products')
      }
      if (product.image_url) {
        const oldImagePath = app.makePath(product.image_url)
        if (fs.existsSync(oldImagePath)) {
          fs.unlinkSync(oldImagePath)
        }
      }

      await product.delete()
      return response.status(200).json({
        data: product,
        messages: 'delete successfully',
      })
    } catch (error) {
      console.error(error)
      return response.internalServerError('Failed to delete product')
    }
  }
}
