import type { HttpContext } from '@adonisjs/core/http'
import SupplierPolicy from '#policies/supplier_policy'
import Supplier from '#models/supplier'
import { SupplierValidator, SupplierUpdateValidator } from '#validators/supplier'
import { sortSupplier } from '#validators/sort_supplier'
import PdfService from '#services/pdf_service'

export default class SuppliersController {
  public async index({ request, response, bouncer }: HttpContext) {
    try {
      if (await bouncer.with(SupplierPolicy).denies('view')) {
        return response.forbidden('You are not authorized to view supplier')
      }
      const page = request.input('page', 1)
      const perPage = request.input('per_page', 10)
      const sortValidate = await request.validateUsing(sortSupplier)
      const sortBy = sortValidate.sort_by || 'id'
      const order = sortValidate.order_by || 'asc'

      const supplier = await Supplier.query().orderBy(sortBy, order).paginate(page, perPage)
      return response.status(200).json({
        data: supplier,
      })
    } catch (error) {
      return response.status(404).json({
        message: error.message,
      })
    }
  }
  public async show({ params, response, bouncer }: HttpContext) {
    try {
      if (await bouncer.with(SupplierPolicy).denies('view')) {
        return response.forbidden('You are not authorized to view Suplier')
      }
      const supplier = await Supplier.query().where('id', params.id).firstOrFail()
      return response.status(200).json({ data: supplier })
    } catch (error) {
      return response.status(404).json({
        message: error.message,
      })
    }
  }
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
      if (await bouncer.with(SupplierPolicy).denies('update', supplier)) {
        return response.forbidden('You are not authorized to update suppliers')
      }

      const validateData = await request.validateUsing(SupplierUpdateValidator)
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

  public async destroy({ response, bouncer, params }: HttpContext) {
    try {
      const supplier = await Supplier.findOrFail(params.id)
      if (await bouncer.with(SupplierPolicy).denies('delete', supplier)) {
        return response.forbidden('You are not authorized to delete suppliers')
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

  public async exportPdf({ response }: HttpContext) {
    try {
      const suppliers = await Supplier.query().orderBy('id', 'asc')
      const pdfBuffer = await PdfService.generateSuppliersPdf(suppliers)

      response.header('Content-Type', 'application/pdf')
      response.header('Content-Disposition', 'attachment; filename="laporan-supplier.pdf"')

      return response.send(pdfBuffer)
    } catch (error) {
      console.error(error)
      return response.internalServerError('Failed to export PDF')
    }
  }
}
