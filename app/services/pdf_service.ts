import PDFDocument from 'pdfkit'
import Product from '#models/product'
import Order from '#models/order'
import Supplier from '#models/supplier'

export default class PdfService {
  static async generateProductsPdf(products: Product[]): Promise<Buffer> {
    return new Promise((resolve, reject) => {
      const doc = new PDFDocument({ margin: 50 })
      const chunks: Buffer[] = []

      doc.on('data', (chunk) => chunks.push(chunk))
      doc.on('end', () => resolve(Buffer.concat(chunks)))
      doc.on('error', reject)

      // Header
      doc.fontSize(20).text('Laporan Data Produk', { align: 'center' })
      doc.moveDown()
      doc.fontSize(10).text(`Tanggal: ${new Date().toLocaleDateString('id-ID')}`, { align: 'center' })
      doc.moveDown(2)

      // Table header
      const tableTop = doc.y
      const col1 = 50
      const col2 = 150
      const col3 = 280
      const col4 = 350
      const col5 = 420
      const col6 = 490

      doc.fontSize(10).font('Helvetica-Bold')
      doc.text('No', col1, tableTop)
      doc.text('Nama Produk', col2, tableTop)
      doc.text('Stok', col3, tableTop)
      doc.text('Harga Beli', col4, tableTop)
      doc.text('Harga Jual', col5, tableTop)
      doc.text('Harga', col6, tableTop)

      doc.moveTo(col1, tableTop + 15).lineTo(550, tableTop + 15).stroke()

      // Table rows
      doc.font('Helvetica')
      let y = tableTop + 25

      products.forEach((product, index) => {
        if (y > 700) {
          doc.addPage()
          y = 50
        }

        doc.text(String(index + 1), col1, y)
        doc.text(product.nameProduct?.substring(0, 20) || '-', col2, y)
        doc.text(String(product.stock || 0), col3, y)
        doc.text(this.formatCurrency(product.hargaBeli), col4, y)
        doc.text(this.formatCurrency(product.hargaJual), col5, y)
        doc.text(this.formatCurrency(product.harga), col6, y)

        y += 20
      })

      // Footer
      doc.moveDown(2)
      doc.fontSize(8).text(`Total Produk: ${products.length}`, { align: 'right' })

      doc.end()
    })
  }

  private static formatCurrency(value: number | null): string {
    if (!value) return '-'
    return new Intl.NumberFormat('id-ID').format(value)
  }

  static async generateOrdersPdf(orders: Order[]): Promise<Buffer> {
    return new Promise((resolve, reject) => {
      const doc = new PDFDocument({ margin: 50 })
      const chunks: Buffer[] = []

      doc.on('data', (chunk) => chunks.push(chunk))
      doc.on('end', () => resolve(Buffer.concat(chunks)))
      doc.on('error', reject)

      // Header
      doc.fontSize(20).text('Laporan Data Order', { align: 'center' })
      doc.moveDown()
      doc.fontSize(10).text(`Tanggal: ${new Date().toLocaleDateString('id-ID')}`, { align: 'center' })
      doc.moveDown(2)

      // Table header
      const tableTop = doc.y
      const col1 = 50
      const col2 = 80
      const col3 = 180
      const col4 = 280
      const col5 = 360
      const col6 = 440
      const col7 = 510

      doc.fontSize(9).font('Helvetica-Bold')
      doc.text('No', col1, tableTop)
      doc.text('Order Code', col2, tableTop)
      doc.text('Customer', col3, tableTop)
      doc.text('Total', col4, tableTop)
      doc.text('Status', col5, tableTop)
      doc.text('Payment', col6, tableTop)
      doc.text('Tanggal', col7, tableTop)

      doc.moveTo(col1, tableTop + 15).lineTo(560, tableTop + 15).stroke()

      // Table rows
      doc.font('Helvetica')
      let y = tableTop + 25

      orders.forEach((order, index) => {
        if (y > 700) {
          doc.addPage()
          y = 50
        }

        doc.fontSize(8)
        doc.text(String(index + 1), col1, y)
        doc.text(order.orderCode || '-', col2, y)
        doc.text(order.user?.fullName?.substring(0, 15) || '-', col3, y)
        doc.text(this.formatCurrency(Number(order.totalPrice) || 0), col4, y)
        doc.text(order.status || '-', col5, y)
        doc.text(order.paymentStatus || '-', col6, y)
        doc.text(order.createdAt?.toFormat('dd/MM/yyyy') || '-', col7, y)

        y += 20
      })

      // Footer
      doc.moveDown(2)
      doc.fontSize(8).text(`Total Order: ${orders.length}`, { align: 'right' })

      const totalRevenue = orders.reduce((sum, o) => sum + (Number(o.totalPrice) || 0), 0)
      doc.text(`Total Pendapatan: Rp ${this.formatCurrency(totalRevenue)}`, { align: 'right' })

      doc.end()
    })
  }

  static async generateSuppliersPdf(suppliers: Supplier[]): Promise<Buffer> {
    return new Promise((resolve, reject) => {
      const doc = new PDFDocument({ margin: 50 })
      const chunks: Buffer[] = []

      doc.on('data', (chunk) => chunks.push(chunk))
      doc.on('end', () => resolve(Buffer.concat(chunks)))
      doc.on('error', reject)

      // Header
      doc.fontSize(20).text('Laporan Data Supplier', { align: 'center' })
      doc.moveDown()
      doc.fontSize(10).text(`Tanggal: ${new Date().toLocaleDateString('id-ID')}`, { align: 'center' })
      doc.moveDown(2)

      // Table header
      const tableTop = doc.y
      const col1 = 50
      const col2 = 80
      const col3 = 200
      const col4 = 350
      const col5 = 450

      doc.fontSize(10).font('Helvetica-Bold')
      doc.text('No', col1, tableTop)
      doc.text('Nama Supplier', col2, tableTop)
      doc.text('Alamat', col3, tableTop)
      doc.text('Telepon', col4, tableTop)
      doc.text('Email', col5, tableTop)

      doc.moveTo(col1, tableTop + 15).lineTo(560, tableTop + 15).stroke()

      // Table rows
      doc.font('Helvetica')
      let y = tableTop + 25

      suppliers.forEach((supplier, index) => {
        if (y > 700) {
          doc.addPage()
          y = 50
        }

        doc.fontSize(9)
        doc.text(String(index + 1), col1, y)
        doc.text(supplier.nameSupplier?.substring(0, 20) || '-', col2, y)
        doc.text(supplier.alamat?.substring(0, 25) || '-', col3, y)
        doc.text(supplier.phoneNumber || '-', col4, y)
        doc.text(supplier.email?.substring(0, 20) || '-', col5, y)

        y += 20
      })

      // Footer
      doc.moveDown(2)
      doc.fontSize(8).text(`Total Supplier: ${suppliers.length}`, { align: 'right' })

      doc.end()
    })
  }
}
