import { BaseSeeder } from '@adonisjs/lucid/seeders'
import Supplier from '#models/supplier'

export default class extends BaseSeeder {
  async run() {
    const suppliers = [
      {
        nameSupplier: 'PT Tempo Scan Pacific',
        alamat: 'Jakarta Selatan',
        phoneNumber: '021-1234567',
        email: 'info@temposcan.com',
      },
      {
        nameSupplier: 'PT Kalbe Farma',
        alamat: 'Jakarta Timur',
        phoneNumber: '021-7654321',
        email: 'info@kalbe.com',
      },
      {
        nameSupplier: 'PT Kimia Farma',
        alamat: 'Jakarta Pusat',
        phoneNumber: '021-9876543',
        email: 'info@kimiafarma.com',
      },
    ]

    for (const supplier of suppliers) {
      await Supplier.updateOrCreate({ email: supplier.email }, supplier)
    }
  }
}
