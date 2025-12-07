import { BaseSeeder } from '@adonisjs/lucid/seeders'
import Category from '#models/category'

export default class extends BaseSeeder {
  async run() {
    await Category.createMany([
      {
        categoryName: 'Obat Sakit Kepala',
        description: 'Obat untuk mengatasi sakit kepala, pusing, dan migrain',
      },
      {
        categoryName: 'Obat Demam',
        description: 'Obat untuk menurunkan demam dan panas',
      },
      {
        categoryName: 'Obat Batuk',
        description: 'Obat untuk mengatasi batuk kering dan berdahak',
      },
      {
        categoryName: 'Obat Flu',
        description: 'Obat untuk mengatasi gejala flu dan pilek',
      },
      {
        categoryName: 'Obat Maag',
        description: 'Obat untuk mengatasi sakit maag dan asam lambung',
      },
      {
        categoryName: 'Vitamin',
        description: 'Suplemen vitamin untuk menjaga kesehatan tubuh',
      },
    ])
  }
}
