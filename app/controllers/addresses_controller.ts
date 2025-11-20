import type { HttpContext } from '@adonisjs/core/http'
import Address from '#models/address'

export default class AddressesController {
  // List user addresses
  public async index({ auth, response }: HttpContext) {
    try {
      const user = auth.getUserOrFail()

      const addresses = await Address.query().where('user_id', user.id)

      return response.ok({
        status: 'success',
        data: addresses,
      })
    } catch (error) {
      return response.badRequest({
        status: 'error',
        message: (error as any)?.message ?? 'Failed to fetch addresses',
      })
    }
  }

  // Show single address
  public async show({ auth, params, response }: HttpContext) {
    try {
      const user = auth.getUserOrFail()

      const address = await Address.query()
        .where('id', params.id)
        .where('user_id', user.id)
        .firstOrFail()

      return response.ok({
        status: 'success',
        data: address,
      })
    } catch (error) {
      return response.notFound({
        status: 'error',
        message: 'Address not found',
      })
    }
  }

  // Create address
  public async store({ auth, request, response }: HttpContext) {
    try {
      const user = auth.getUserOrFail()

      const data = request.only([
        'label',
        'recipientName',
        'phoneNumber',
        'address',
        'city',
        'province',
        'postalCode',
      ])

      const address = await Address.create({
        userId: user.id,
        ...data,
      })

      return response.created({
        status: 'success',
        message: 'Address created successfully',
        data: address,
      })
    } catch (error) {
      return response.badRequest({
        status: 'error',
        message: (error as any)?.message ?? 'Failed to create address',
      })
    }
  }

  // Update address
  public async update({ auth, params, request, response }: HttpContext) {
    try {
      const user = auth.getUserOrFail()

      const address = await Address.query()
        .where('id', params.id)
        .where('user_id', user.id)
        .firstOrFail()

      const data = request.only([
        'label',
        'recipientName',
        'phoneNumber',
        'address',
        'city',
        'province',
        'postalCode',
      ])

      await address.merge(data).save()

      return response.ok({
        status: 'success',
        message: 'Address updated successfully',
        data: address,
      })
    } catch (error) {
      return response.badRequest({
        status: 'error',
        message: (error as any)?.message ?? 'Failed to update address',
      })
    }
  }

  // Delete address
  public async destroy({ auth, params, response }: HttpContext) {
    try {
      const user = auth.getUserOrFail()

      const address = await Address.query()
        .where('id', params.id)
        .where('user_id', user.id)
        .firstOrFail()

      await address.delete()

      return response.ok({
        status: 'success',
        message: 'Address deleted successfully',
      })
    } catch (error) {
      return response.badRequest({
        status: 'error',
        message: (error as any)?.message ?? 'Failed to delete address',
      })
    }
  }
}
