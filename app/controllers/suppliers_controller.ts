import type { HttpContext } from '@adonisjs/core/http'
import SupplierPolicy from '#policies/supplier_policy'
import Supplier from '#models/supplier'
import { SupplierValidator } from '#validators/supplier'

export default class SuppliersController {
  public async store({ request, response, bouncer }: HttpContext) {
    try {
      if (await bouncer.with(SupplierPolicy).denies('create')) {
        return response.forbidden('You are not authorized to create suppliers')
      }
      const payload = await request.validateUsing(SupplierValidator)
      const supplier = await Supplier.create(payload)

      return response.status(201).json({
        status: 'success',
        message: 'Supplier created successfully',
        data: supplier,
      })
    } catch (error) {
      return response.status(400).json({
        status: 'error',
        message: (error as any)?.messages ?? (error as any)?.message ?? 'Failed to create supplier',
      })
    }
  }

  public async update({ request, response, bouncer, params }: HttpContext) {
    try {
      const supplier = await Supplier.findOrFail(params.id)
      if (await bouncer.with(SupplierPolicy).denies('create')) {
        return response.forbidden('You are not authorized to create suppliers')
      }

      const validateData = await request.validateUsing(SupplierValidator)
      await supplier.merge(validateData).save()
      return response.status(200).json({
        data: supplier,
      })
    } catch (error) {
      return response.status(400).json({
        status: 'error',
        message: (error as any)?.messages ?? (error as any)?.message ?? 'Failed to update supplier',
      })
    }
  }

  public async delete({ response, bouncer, params }: HttpContext) {
    try {
      const supplier = await Supplier.findOrFail(params.id)
      if (await bouncer.with(SupplierPolicy).denies('create')) {
        return response.forbidden('You are not authorized to create suppliers')
      }

      await supplier.delete()
      return response.status(200).json({
        status: 'success',
        message: 'Supplier deleted successfully',
      })
    } catch (error) {
      return response.status(400).json({
        status: 'error',
        message: (error as any)?.messages ?? (error as any)?.message ?? 'Failed to delete supplier',
      })
    }
  }
}
