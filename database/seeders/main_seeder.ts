import { BaseSeeder } from '@adonisjs/lucid/seeders'
import Category from '#models/category'
import Supplier from '#models/supplier'

export default class extends BaseSeeder {
  async run() {
    // 1. Create Categories
    const categories = [
      {
        categoryName: 'Obat Sakit Kepala',
        description: 'Obat untuk mengatasi sakit kepala, pusing, dan migrain',
      },
      { categoryName: 'Obat Demam', description: 'Obat untuk menurunkan demam dan panas' },
      { categoryName: 'Obat Batuk', description: 'Obat untuk mengatasi batuk kering dan berdahak' },
      { categoryName: 'Obat Flu', description: 'Obat untuk mengatasi gejala flu dan pilek' },
      {
        categoryName: 'Obat Maag',
        description: 'Obat untuk mengatasi sakit maag dan asam lambung',
      },
      { categoryName: 'Vitamin', description: 'Suplemen vitamin untuk menjaga kesehatan tubuh' },
    ]

    for (const category of categories) {
      await Category.updateOrCreate({ categoryName: category.categoryName }, category)
    }

    // 2. Create Suppliers
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

    console.log('✅ Seeding completed: 6 categories, 3 suppliers')
  }
}
