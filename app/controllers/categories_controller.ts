import Category from '#models/category'
import CategoryPolicy from '#policies/category_policy'
import { CategoryValidator } from '#validators/category'
import { sortCategory } from '#validators/sort_category'
import type { HttpContext } from '@adonisjs/core/http'

export default class CategoriesController {
  public async index({ request, response }: HttpContext) {
    try {
      const page = request.input('page', 1)
      const perPage = request.input('per_page', 10)
      const sortValidate = await request.validateUsing(sortCategory)
      const sortBy = sortValidate.sort_by || 'id'
      const order = sortValidate.order_by || 'asc'

      const category = await Category.query().orderBy(sortBy, order).paginate(page, perPage)
      return response.json({
        data: category,
      })
    } catch (error) {}
  }
  public async store({ bouncer, request, response }: HttpContext) {
    try {
      if (await bouncer.with(CategoryPolicy).denies('create')) {
        return response.forbidden('You are not authorized to create categories')
      }
      const payload = await request.validateUsing(CategoryValidator)
      const category = await Category.create(payload)

      return response.status(201).json({
        status: 'success',
        message: 'Category created successfully',
        data: category,
      })
    } catch (error) {
      return response.status(400).json({
        status: 'error',
        message: (error as any)?.messages ?? (error as any)?.message ?? 'Failed to create category',
      })
    }
  }

  public async update({ request, response, bouncer, params }: HttpContext) {
    try {
      const category = await Category.findOrFail(params.id)
      if (await bouncer.with(CategoryPolicy).denies('update', category)) {
        return response.forbidden('You are not authorized to update this category')
      }
      const validateData = await request.validateUsing(CategoryValidator)

      await category.merge(validateData).save()
      return response.status(200).json({
        data: category,
      })
    } catch (error) {
      return response.status(400).json({
        status: 'error',
        message: (error as any)?.messages ?? (error as any)?.message ?? 'Failed to update category',
      })
    }
  }

  public async destroy({ response, bouncer, params }: HttpContext) {
    try {
      const category = await Category.findOrFail(params.id)
      if (await bouncer.with(CategoryPolicy).denies('delete', category)) {
        return response.forbidden('You are not authorized to delete this category')
      }

      await category.delete()
      return response.status(200).json({
        status: 'success',
        message: 'Category deleted successfully',
      })
    } catch (error) {
      return response.status(400).json({
        status: 'error',
        message: (error as any)?.messages ?? (error as any)?.message ?? 'Failed to delete category',
      })
    }
  }
}
