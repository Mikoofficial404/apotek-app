import type { HttpContext } from '@adonisjs/core/http'
import Product from '#models/product'
import Category from '#models/category'

export default class ChatbotController {
  private expandKeyword(keyword: string): string[] {
    const expansions: Record<string, string[]> = {
      pusing: ['pusing', 'sakit kepala', 'kepala', 'migrain', 'headache'],
      demam: ['demam', 'panas', 'meriang', 'fever'],
      batuk: ['batuk', 'cough', 'tenggorokan'],
      flu: ['flu', 'pilek', 'bersin', 'influenza'],
      maag: ['maag', 'lambung', 'mual', 'asam lambung', 'gastritis'],
      vitamin: ['vitamin', 'stamina', 'daya tahan', 'imun', 'lemas', 'capek'],
      nyeri: ['nyeri', 'pegal', 'linu', 'sakit', 'pain'],
      diare: ['diare', 'mencret', 'diarrhea'],
      alergi: ['alergi', 'gatal', 'allergy'],
    }
    return expansions[keyword] || [keyword]
  }

  async searchProducts({ request, response }: HttpContext) {
    const keyword = request.input('keyword', '').toLowerCase().trim()

    if (!keyword) {
      return response.badRequest({ success: false, message: 'Keyword diperlukan' })
    }

    const searchTerms = this.expandKeyword(keyword)
    console.log(`Search: "${keyword}" → terms: ${searchTerms.join(', ')}`)

    let products = await Product.query()
      .where((query) => {
        for (const term of searchTerms) {
          query.orWhereILike('name_product', `%${term}%`)
          query.orWhereILike('deskripsi', `%${term}%`)
          query.orWhereILike('indikasi', `%${term}%`)
        }
      })
      .preload('category')
      .limit(10)

    console.log(`Found ${products.length} products`)

    if (products.length === 0) {
      products = await Product.query()
        .whereHas('category', (q) => {
          for (const term of searchTerms) {
            q.orWhereILike('category_name', `%${term}%`)
          }
        })
        .preload('category')
        .limit(10)
      console.log(`Fallback: found ${products.length} by category`)
    }

    return response.ok({
      success: true,
      keyword,
      search_terms: searchTerms,
      total: products.length,
      products: products.map((p) => ({
        id: p.id,
        nama_produk: p.nameProduct,
        harga: `Rp ${Number(p.harga).toLocaleString('id-ID')}`,
        kategori: p.category?.categoryName || '-',
        stok: p.stock > 0 ? `Tersedia (${p.stock})` : 'Habis',
        deskripsi: p.deskripsi || '-',
        url: `http://localhost:5173/product/${p.id}`,
      })),
    })
  }

  async debug({ response }: HttpContext) {
    const categories = await Category.all()
    const products = await Product.query().preload('category')
    return response.ok({
      categories: categories.map((c) => ({ id: c.id, name: c.categoryName })),
      products: products.map((p) => ({
        id: p.id,
        name: p.nameProduct,
        categoryId: p.categoryId,
        categoryName: p.category?.categoryName,
        indikasi: p.indikasi,
      })),
    })
  }
}
