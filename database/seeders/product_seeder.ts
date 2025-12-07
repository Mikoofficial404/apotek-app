import { BaseSeeder } from '@adonisjs/lucid/seeders'
import Product from '#models/product'

export default class extends BaseSeeder {
  async run() {
    const products = [
      {
        nameProduct: 'Bodrex',
        stock: 100,
        harga: 15000,
        categoryId: 1,
        supplierId: 1,
        imageUrl: null,
        deskripsi:
          'Obat pereda nyeri dan sakit kepala yang mengandung paracetamol dan caffeine untuk meredakan sakit kepala dengan cepat.',
        indikasi: 'Sakit kepala, nyeri ringan hingga sedang',
      },
      {
        nameProduct: 'Panadol',
        stock: 80,
        harga: 12000,
        categoryId: 1,
        supplierId: 2,
        imageUrl: null,
        deskripsi:
          'Obat analgesik dan antipiretik yang mengandung paracetamol untuk meredakan sakit kepala dan menurunkan demam.',
        indikasi: 'Sakit kepala, demam, nyeri otot',
      },
      {
        nameProduct: 'Paramex',
        stock: 50,
        harga: 10000,
        categoryId: 1,
        supplierId: 1,
        imageUrl: null,
        deskripsi: 'Obat kombinasi untuk meredakan sakit kepala, pusing, dan migrain.',
        indikasi: 'Sakit kepala, migrain, pusing',
      },
      {
        nameProduct: 'Counterpain',
        stock: 80,
        harga: 28000,
        categoryId: 1,
        supplierId: 2,
        imageUrl: null,
        deskripsi: 'Krim pereda nyeri otot dan sendi dengan sensasi hangat yang menenangkan.',
        indikasi: 'Nyeri otot, nyeri sendi, keseleo, pegal-pegal',
      },
      {
        nameProduct: 'Neo Rheumacyl',
        stock: 70,
        harga: 15000,
        categoryId: 1,
        supplierId: 1,
        imageUrl: null,
        deskripsi: 'Obat pereda nyeri otot dan sendi dalam bentuk tablet.',
        indikasi: 'Nyeri otot, pegal linu, encok',
      },

      {
        nameProduct: 'Paracetamol 500mg',
        stock: 200,
        harga: 5000,
        categoryId: 2,
        supplierId: 3,
        imageUrl: null,
        deskripsi: 'Obat generik penurun demam dan pereda nyeri yang aman untuk segala usia.',
        indikasi: 'Demam, nyeri ringan, sakit kepala',
      },
      {
        nameProduct: 'Sanmol',
        stock: 150,
        harga: 8000,
        categoryId: 2,
        supplierId: 2,
        imageUrl: null,
        deskripsi: 'Obat penurun demam untuk anak dan dewasa dalam bentuk sirup dan tablet.',
        indikasi: 'Demam pada anak dan dewasa',
      },
      {
        nameProduct: 'Tempra',
        stock: 60,
        harga: 25000,
        categoryId: 2,
        supplierId: 2,
        imageUrl: null,
        deskripsi: 'Obat penurun demam khusus anak dengan rasa buah yang disukai anak-anak.',
        indikasi: 'Demam pada anak, nyeri ringan',
      },

      {
        nameProduct: 'OBH Combi',
        stock: 75,
        harga: 18000,
        categoryId: 3,
        supplierId: 1,
        imageUrl: null,
        deskripsi:
          'Obat batuk hitam yang mengandung bahan herbal untuk meredakan batuk berdahak dan kering.',
        indikasi: 'Batuk berdahak, batuk kering',
      },
      {
        nameProduct: 'Vicks Formula 44',
        stock: 40,
        harga: 22000,
        categoryId: 3,
        supplierId: 1,
        imageUrl: null,
        deskripsi: 'Obat batuk sirup yang efektif meredakan batuk kering dan batuk berdahak.',
        indikasi: 'Batuk kering, batuk berdahak, tenggorokan gatal',
      },
      {
        nameProduct: 'Woods Peppermint',
        stock: 90,
        harga: 15000,
        categoryId: 3,
        supplierId: 2,
        imageUrl: null,
        deskripsi:
          'Obat batuk dengan sensasi mint yang menyegarkan untuk meredakan batuk dan tenggorokan gatal.',
        indikasi: 'Batuk, tenggorokan gatal, pilek',
      },

      {
        nameProduct: 'Decolgen',
        stock: 120,
        harga: 12000,
        categoryId: 4,
        supplierId: 1,
        imageUrl: null,
        deskripsi:
          'Obat flu yang mengandung kombinasi untuk meredakan gejala flu seperti hidung tersumbat, bersin, dan demam.',
        indikasi: 'Flu, hidung tersumbat, bersin-bersin, demam',
      },
      {
        nameProduct: 'Neozep',
        stock: 85,
        harga: 10000,
        categoryId: 4,
        supplierId: 2,
        imageUrl: null,
        deskripsi: 'Obat flu dan pilek yang efektif meredakan gejala flu dengan cepat.',
        indikasi: 'Flu, pilek, hidung mampet, sakit kepala',
      },
      {
        nameProduct: 'Mixagrip',
        stock: 100,
        harga: 8000,
        categoryId: 4,
        supplierId: 2,
        imageUrl: null,
        deskripsi:
          'Obat flu yang mengandung paracetamol, phenylpropanolamine, dan chlorpheniramine untuk meredakan gejala flu.',
        indikasi: 'Flu, demam, sakit kepala, hidung tersumbat',
      },
      {
        nameProduct: 'CTM (Chlorpheniramine)',
        stock: 150,
        harga: 3000,
        categoryId: 4,
        supplierId: 3,
        imageUrl: null,
        deskripsi:
          'Obat antihistamin untuk meredakan gejala alergi seperti bersin, gatal, dan hidung meler.',
        indikasi: 'Alergi, bersin-bersin, gatal-gatal, pilek alergi',
      },
      {
        nameProduct: 'Incidal',
        stock: 60,
        harga: 45000,
        categoryId: 4,
        supplierId: 1,
        imageUrl: null,
        deskripsi:
          'Obat antihistamin generasi baru yang tidak menyebabkan kantuk untuk mengatasi alergi.',
        indikasi: 'Alergi, rhinitis alergi, urtikaria',
      },

      {
        nameProduct: 'Promag',
        stock: 150,
        harga: 10000,
        categoryId: 5,
        supplierId: 2,
        imageUrl: null,
        deskripsi:
          'Obat maag yang mengandung antasida untuk menetralkan asam lambung dan meredakan nyeri ulu hati.',
        indikasi: 'Maag, nyeri ulu hati, kembung, mual',
      },
      {
        nameProduct: 'Mylanta',
        stock: 70,
        harga: 25000,
        categoryId: 5,
        supplierId: 1,
        imageUrl: null,
        deskripsi: 'Obat maag cair yang bekerja cepat menetralkan asam lambung berlebih.',
        indikasi: 'Maag, heartburn, perut kembung',
      },
      {
        nameProduct: 'Polysilane',
        stock: 60,
        harga: 20000,
        categoryId: 5,
        supplierId: 3,
        imageUrl: null,
        deskripsi:
          'Obat maag yang mengandung simetikon untuk mengatasi kembung dan gas berlebih di perut.',
        indikasi: 'Maag, kembung, perut begah',
      },
      {
        nameProduct: 'Entrostop',
        stock: 90,
        harga: 8000,
        categoryId: 5,
        supplierId: 1,
        imageUrl: null,
        deskripsi: 'Obat diare yang mengandung attapulgite untuk menghentikan diare dengan cepat.',
        indikasi: 'Diare akut, mencret',
      },
      {
        nameProduct: 'Diatabs',
        stock: 75,
        harga: 6000,
        categoryId: 5,
        supplierId: 2,
        imageUrl: null,
        deskripsi: 'Obat diare tablet yang efektif mengatasi diare dan gangguan pencernaan.',
        indikasi: 'Diare, gangguan pencernaan',
      },

      {
        nameProduct: 'Enervon-C',
        stock: 200,
        harga: 15000,
        categoryId: 6,
        supplierId: 1,
        imageUrl: null,
        deskripsi: 'Suplemen vitamin C dan B kompleks untuk menjaga daya tahan tubuh dan stamina.',
        indikasi: 'Meningkatkan daya tahan tubuh, kelelahan',
      },
      {
        nameProduct: 'Redoxon',
        stock: 80,
        harga: 35000,
        categoryId: 6,
        supplierId: 2,
        imageUrl: null,
        deskripsi:
          'Suplemen vitamin C dosis tinggi dalam bentuk tablet effervescent untuk meningkatkan imunitas.',
        indikasi: 'Meningkatkan imunitas, kekurangan vitamin C',
      },
      {
        nameProduct: 'Becom-C',
        stock: 100,
        harga: 12000,
        categoryId: 6,
        supplierId: 3,
        imageUrl: null,
        deskripsi: 'Suplemen vitamin B kompleks dan vitamin C untuk menjaga kesehatan tubuh.',
        indikasi: 'Kelelahan, kekurangan vitamin B dan C',
      },
    ]

    for (const product of products) {
      await Product.updateOrCreate({ nameProduct: product.nameProduct }, product)
    }

    console.log('✅ Product seeding completed: ' + products.length + ' products')
  }
}
