'use strict'

// Run with: npm run migrate:categories

const categoryData = {
  'Breakfast': { en: 'Breakfast', ar: 'الفطور', order: 1 },
  'Traditional Dishes': { en: 'Traditional Dishes', ar: 'الأكلات الشعبية', order: 2 },
  'Madhghoot & Kabsa Barriya': { en: 'Madhghoot & Kabsa Barriya', ar: 'المضغوط', order: 3 },
  'Goat Haneeth': { en: 'Goat Haneeth', ar: 'الأطباق الرئيسية', order: 4 },
  'Camel Haneeth': { en: 'Camel Haneeth', ar: 'الحاشي', order: 5 },
  'Chicken': { en: 'Chicken', ar: 'الدجاج', order: 6 },
  'Whole Lamb': { en: 'Whole Lamb', ar: 'لحم الذبيحة', order: 7 },
  'Rice': { en: 'Rice', ar: 'الرز', order: 8 },
  'Appetizers': { en: 'Appetizers', ar: 'المقبلات', order: 9 },
  'Sides': { en: 'Sides', ar: 'الإيدامات', order: 10 },
  'Salads': { en: 'Salads', ar: 'السلطات', order: 11 },
  'Drinks': { en: 'Drinks', ar: 'المشروبات', order: 12 },
  'Desserts': { en: 'Desserts', ar: 'الحلا', order: 13 }
}

module.exports = async ({ strapi }) => {
  console.log('🔄 Starting category migration...')

  const categoryMap = {}

  // First, create all categories from the enum values
  for (const [en, data] of Object.entries(categoryData)) {
    // Check if category already exists
    let category = await strapi.db.query('api::menu-category.menu-category').findOne({
      where: { nameEn: en }
    })
    
    if (!category) {
      // Create the category
      category = await strapi.db.query('api::menu-category.menu-category').create({
        data: {
          nameEn: data.en,
          nameAr: data.ar,
          order: data.order
        }
      })
      console.log(`✅ Created category: ${en}`)
    } else {
      console.log(`⏩ Category already exists: ${en}`)
    }
    
    categoryMap[en] = category.id
  }

  // Now migrate all menu items to use the relation
  const menuItems = await strapi.db.query('api::menu-item.menu-item').findMany({
    populate: { menuCategory: true }
  })

  let updatedCount = 0
  let skippedCount = 0
  let errorCount = 0

  for (const item of menuItems) {
    try {
      // If the item already has a menuCategory, skip it
      if (item.menuCategory) {
        skippedCount++
        continue
      }
      
      // Find the category based on the old enum field
      let categoryId = null
      
      // Check if the item has categoryEn field (old enum)
      if (item.categoryEn && categoryMap[item.categoryEn]) {
        categoryId = categoryMap[item.categoryEn]
      } else if (item.categoryAr) {
        // If only Arabic category exists, find by Arabic name
        for (const [en, data] of Object.entries(categoryData)) {
          if (data.ar === item.categoryAr) {
            categoryId = categoryMap[en]
            break
          }
        }
      }
      
      if (categoryId) {
        await strapi.db.query('api::menu-item.menu-item').update({
          where: { id: item.id },
          data: {
            menuCategory: categoryId
          }
        })
        updatedCount++
        console.log(`✅ Updated item: ${item.nameEn || item.id} (ID: ${item.id})`)
      } else {
        console.log(`⚠️ No category found for item: ${item.nameEn || item.id} (ID: ${item.id})`)
      }
    } catch (error) {
      errorCount++
      console.error(`❌ Error updating item ${item.id}:`, error.message)
    }
  }

  console.log(`\n🎉 Migration complete!`)
  console.log(`📊 Summary:`)
  console.log(`   - Categories created: ${Object.keys(categoryMap).length}`)
  console.log(`   - Items updated: ${updatedCount}`)
  console.log(`   - Items skipped (already had category): ${skippedCount}`)
  console.log(`   - Errors: ${errorCount}`)
}