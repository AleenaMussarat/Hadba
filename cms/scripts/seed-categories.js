'use strict'

// Run with: npm run seed:categories

module.exports = async ({ strapi }) => {
  const categories = [
    { nameEn: 'Breakfast', nameAr: 'الفطور', order: 1 },
    { nameEn: 'Traditional Dishes', nameAr: 'الأكلات الشعبية', order: 2 },
    { nameEn: 'Madhghoot & Kabsa Barriya', nameAr: 'المضغوط', order: 3 },
    { nameEn: 'Goat Haneeth', nameAr: 'الأطباق الرئيسية', order: 4 },
    { nameEn: 'Camel Haneeth', nameAr: 'الحاشي', order: 5 },
    { nameEn: 'Chicken', nameAr: 'الدجاج', order: 6 },
    { nameEn: 'Whole Lamb', nameAr: 'لحم الذبيحة', order: 7 },
    { nameEn: 'Rice', nameAr: 'الرز', order: 8 },
    { nameEn: 'Appetizers', nameAr: 'المقبلات', order: 9 },
    { nameEn: 'Sides', nameAr: 'الإيدامات', order: 10 },
    { nameEn: 'Salads', nameAr: 'السلطات', order: 11 },
    { nameEn: 'Drinks', nameAr: 'المشروبات', order: 12 },
    { nameEn: 'Desserts', nameAr: 'الحلا', order: 13 }
  ]

  for (const cat of categories) {
    try {
      const existing = await strapi.db.query('api::menu-category.menu-category').findOne({
        where: { nameEn: cat.nameEn }
      })

      if (!existing) {
        await strapi.db.query('api::menu-category.menu-category').create({
          data: {
            nameEn: cat.nameEn,
            nameAr: cat.nameAr,
            order: cat.order
          }
        })
        console.log(`✅ Created category: ${cat.nameEn}`)
      } else {
        console.log(`⏩ Category already exists: ${cat.nameEn}`)
      }
    } catch (error) {
      console.error(`❌ Error creating category ${cat.nameEn}:`, error.message)
    }
  }
}