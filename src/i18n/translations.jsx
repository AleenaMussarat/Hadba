const img = (id, w = 800) => `https://images.unsplash.com/${id}?auto=format&fit=crop&w=${w}&q=70`

// The client's own product shots — white background, do not swap these for
// stock photos. Everything else in MENU_ROWS uses 'logo' (the Samdan mark on
// white) as a placeholder until real photography exists for that dish, except
// where a verified royalty-free white-background stock photo was found (see
// dishTea below — checked individually, most homestyle Najdi/Hejazi dishes
// don't have an accurate isolated-background match available).
const dishKabdaBaladi = '/brand/dish-kabda-baladi.webp'
const dishFriedEggs = '/brand/dish-fried-eggs.webp'
const dishTuna = '/brand/dish-tuna.webp'
const dishSouthernBread = '/brand/dish-southern-bread.webp'
const dishTea = '/brand/dish-tea.webp'
const logoPlaceholder = '/brand/logo-red.webp'

export const menuImages = {
  lambKabsa: img('photo-1681116997174-76efb15220f4'),
  chickenKabsa: img('photo-1708184528306-f75a0a5118ee'),
  kabsaMashawi: img('photo-1739909364240-95e95db8dbc1'),
  jarish: img('photo-1630409351217-bc4fa6422075'),
  margoog: img('photo-1542627501-51dde88c1bdc'),
  saleeg: img('photo-1696950169710-bbed68aec0e1'),
  hejaziMandi: img('photo-1633945274309-2c16c9682a8c'),
  mutabbaq: img('photo-1696950169170-a433c9eefac4'),
  hejaziSaleeg: img('photo-1719239885399-f87d992e0f18'),
  coffeeDates: img('photo-1604924434662-4127d9fa3070'),
  luqaimat: img('photo-1553499944-76f9d2bc9349'),
  fattoush: img('photo-1540420773420-3366772f4999'),
  kabdaBaladi: dishKabdaBaladi,
  friedEggs: dishFriedEggs,
  tuna: dishTuna,
  southernBread: dishSouthernBread,
  tea: dishTea,
  logo: logoPlaceholder
}

const diningRoom = '/brand/photo-riyadh-skyline.webp'
const najdiArchitecture = '/brand/photo-najdi-architecture.webp'
const najdiBranch = '/brand/photo-najdi-branch.webp'
const saduInterior = '/brand/photo-sadu-interior.webp'

// Breakfast spread photos (Menu folder, images 1-8)
const breakfastSpread1 = '/brand/photo-breakfast-spread-1.webp'
const breakfastBread = '/brand/photo-breakfast-bread.webp'
const najdiBreakfastTable = '/brand/photo-najdi-breakfast-table.webp'
const eggsTomatoRelish = '/brand/photo-eggs-tomato-relish.webp'
const tomatoRelish = '/brand/photo-tomato-relish.webp'
const nawashefPhoto = '/brand/photo-nawashef.webp'
const tomatoPepperDip = '/brand/photo-tomato-pepper-dip.webp'
const hummusMeat = '/brand/photo-hummus-meat.webp'
const BRANCH_MAP_QUERY = 'Khalid bin Al Waleed Street, Qurtubah, Riyadh, Saudi Arabia'
const branchMapsLink = `https://maps.google.com/?q=${encodeURIComponent(BRANCH_MAP_QUERY)}`

// ---- Full real menu (from SAMDAN's printed menu) ----
// Each row: [en name, ar name, en desc, ar desc, category key, price, calories|null, imageKey, featured?]
// Category set + order as specified by the restaurant — Strapi's own
// categoryEn/categoryAr fields need to be updated to match these exact
// label strings (see note in Menu.jsx fetch call).
// Keys/labels mirror the live categoryEn/categoryAr values in the Strapi
// menu-item enumeration exactly, so the category filter pills query the same
// strings Strapi filters against — see fetchMenuItems in services/strapi.js.
export const CAT = {
  breakfast: { en: 'Breakfast', ar: 'الفطور' },
  traditionalDishes: { en: 'Traditional Dishes', ar: 'الأكلات الشعبية' },
  madhghoot: { en: 'Madhghoot & Kabsa Barriya', ar: 'المضغوط' },
  goatHaneeth: { en: 'Goat Haneeth', ar: 'الأطباق الرئيسية' },
  camelHaneeth: { en: 'Camel Haneeth', ar: 'الحاشي' },
  chicken: { en: 'Chicken', ar: 'الدجاج' },
  wholeLamb: { en: 'Whole Lamb', ar: 'لحم الذبيحة' },
  rice: { en: 'Rice', ar: 'الرز' },
  appetizers: { en: 'Appetizers', ar: 'المقبلات' },
  sides: { en: 'Sides', ar: 'الإدامات' },
  salads: { en: 'Salads', ar: 'السلطات' },
  drinks: { en: 'Drinks', ar: 'المشروبات' },
  desserts: { en: 'Desserts', ar: 'الحلا' }
}

export const CATEGORY_ORDER = Object.keys(CAT)

// imageKey 'logo' = no real dish photo yet, renders as the Samdan mark on
// white (see .is-placeholder in App.css) until real photography exists.
const MENU_ROWS = [
  // Goat Haneeth (تيس)
  ['Goat Haneeth Bashawer', 'نفر تيس حنيذ بشاور', 'Individual slow-roasted goat haneeth with bashawer-style rice', 'حنيذ تيس فردي مطهو ببطء مع أرز على طريقة البشاور', 'goatHaneeth', '95', 2467, 'logo'],
  ['Goat Haneeth Shaabi', 'نفر تيس حنيذ شعبي', 'Individual goat haneeth, traditional folk-style rice', 'حنيذ تيس فردي مع أرز على الطريقة الشعبية', 'goatHaneeth', '95', 2467, 'logo'],
  ['Goat Haneeth Saleeg', 'نفر تيس حنيذ سليق', 'Individual goat haneeth served with creamy saleeg rice', 'حنيذ تيس فردي يقدم مع أرز السليق الكريمي', 'goatHaneeth', '95', 2467, 'logo'],
  ['Goat Haneeth Mathloutha', 'نفر تيس حنيذ مثلوثة', 'Individual slow-roasted goat haneeth over spiced rice', 'حنيذ تيس فردي مطهو ببطء فوق أرز متبل', 'goatHaneeth', '100', 2467, 'logo', true],
  ['Quarter Goat Haneeth', 'ربع تيس حنيذ', 'Slow-roasted quarter goat haneeth — serves 2–3', 'ربع تيس حنيذ مطهو ببطء - يكفي ٢-٣ أشخاص', 'goatHaneeth', '380', 9870, 'logo'],
  ['Half Goat Haneeth', 'نصف تيس حنيذ', 'Slow-roasted half goat haneeth — serves 4–6', 'نصف تيس حنيذ مطهو ببطء - يكفي ٤-٦ أشخاص', 'goatHaneeth', '760', 20350, 'logo', true],
  ['Whole Goat Haneeth', 'تيس كامل حنيذ', 'Slow-roasted whole goat haneeth — serves 8–10', 'تيس كامل حنيذ مطهو ببطء - يكفي ٨-١٠ أشخاص', 'goatHaneeth', '1520', 40750, 'logo'],

  // Whole Lamb (raw butchered lamb)
  ['Quarter Lamb', 'ربع ذبيحة', 'Quarter raw lamb, butchered to order — serves 2–3', 'ربع ذبيحة نيّة حسب الطلب - يكفي ٢-٣ أشخاص', 'wholeLamb', '350', null, 'logo'],
  ['Half Lamb', 'نصف ذبيحة', 'Half raw lamb, butchered to order — serves 4–6', 'نصف ذبيحة نيّة حسب الطلب - يكفي ٤-٦ أشخاص', 'wholeLamb', '700', null, 'logo'],
  ['Whole Lamb', 'ذبيحة كاملة', 'Whole raw lamb, butchered to order — serves 8–10', 'ذبيحة كاملة نيّة حسب الطلب - يكفي ٨-١٠ أشخاص', 'wholeLamb', '1400', null, 'logo'],

  // Traditional Dishes
  ['Areeka Janoubia', 'عريكة جنوبية', 'Southern-style bread mash with meat and ghee', 'عريكة على الطريقة الجنوبية مع اللحم والسمن', 'traditionalDishes', '35', 690, 'logo', true],
  ['Mashghoutha', 'مشغوثة', 'Traditional mashed bread and meat dish', 'طبق تقليدي من الخبز المهروس واللحم', 'traditionalDishes', '35', 610, 'logo'],
  ['Fattah with Ghee & Honey', 'فتة بالسمن والعسل', 'Layered bread soaked in ghee and honey', 'خبز مطبق منقوع بالسمن والعسل', 'traditionalDishes', '20', 780, 'logo'],
  ['Marasa', 'مرسة', 'Traditional Najdi bread and broth dish', 'طبق نجدي تقليدي من الخبز والمرق', 'traditionalDishes', '20', 480, 'logo'],
  ['Maksaf', 'مكسف', 'Hearty traditional bread and meat mash', 'طبق تراثي دسم من الخبز واللحم المهروس', 'traditionalDishes', '20', 640, 'logo'],
  ['Local Ghee', 'سمن بلدي', 'Pure traditional Saudi ghee', 'سمن بلدي أصيل', 'traditionalDishes', '9', 180, 'logo'],
  ['Natural Honey', 'عسل طبيعي', 'Pure natural Saudi honey', 'عسل طبيعي سعودي خالص', 'traditionalDishes', '10', 95, 'logo'],
  ['Radeefa', 'رضيفة', 'Traditional bread side', 'طبق خبز تقليدي', 'traditionalDishes', '6', 320, 'logo'],
  ['Mabthoutha Janoubia', 'مبثوثة جنوبية', 'Traditional southern-style bread and meat mash', 'طبق تقليدي من الخبز واللحم المهروس على الطريقة الجنوبية', 'traditionalDishes', '30', 580, 'logo'],
  ['Thareef Dakhn', 'ثريف دخن', 'Traditional millet thareef bread dish', 'طبق ثريد تقليدي من خبز الدخن', 'traditionalDishes', '30', 520, 'logo'],
  ['Masabib', 'مصابيب', 'Traditional Saudi pancake-style bread', 'طبق مصابيب تقليدي، فطائر سعودية', 'traditionalDishes', '20', 450, 'logo'],

  // Breakfast
  ['Kabda Baladi', 'كبدة بلدي', 'Sautéed local liver with onions and warm spices', 'كبدة طازجة سوتيه مع البصل والبهارات الدافئة', 'breakfast', '25', 420, 'kabdaBaladi'],
  ['Muqalqal Lahm', 'مقلقل لحم', 'Pan-tossed beef with peppers, onion, and tomato', 'لحم مقلقل مع الفلفل والبصل والطماطم', 'breakfast', '30', 510, 'logo'],
  ['Muqalqal Dajaj', 'مقلقل دجاج', 'Pan-tossed chicken with peppers and tomato', 'دجاج مقلقل مع الفلفل والطماطم', 'breakfast', '20', 430, 'logo'],
  ['Nawashef', 'نواشف', 'Traditional dried-meat morning stew', 'طبق فطور تقليدي من اللحم المجفف', 'breakfast', '30', 540, 'logo'],
  ['Homaisa', 'حميسة', 'Slow-simmered wheat and meat breakfast porridge', 'قمح مطهو ببطء مع اللحم، فطور تقليدي', 'breakfast', '27', 390, 'logo'],
  ['Tuna', 'تونة', 'Fresh tuna breakfast plate with vegetables', 'طبق تونة طازج مع الخضار', 'breakfast', '15', 280, 'tuna'],
  ['Shakshuka', 'شكشوكة', 'Eggs poached in a spiced tomato and pepper sauce', 'بيض مطهو في صلصة الطماطم والفلفل المتبلة', 'breakfast', '10', 330, 'logo'],
  ['Lahsa', 'لحسة', 'Warm spiced flour porridge, a Najdi breakfast classic', 'عصيدة دقيق دافئة ومتبلة، طبق نجدي تقليدي', 'breakfast', '12', 350, 'logo'],
  ['Fried Eggs', 'بيض عيون', 'Two eggs, sunny side up, with fresh bread', 'بيضتان مقليتان مع خبز طازج', 'breakfast', '10', 240, 'friedEggs'],
  ['Foul', 'فول', 'Slow-cooked fava beans with olive oil and spices', 'فول مدمس مطهو ببطء مع زيت الزيتون والبهارات', 'breakfast', '10', 360, 'logo'],
  ['Qishta & Honey', 'قشطة وعسل', 'Clotted cream drizzled with natural honey', 'قشطة طازجة مغطاة بالعسل الطبيعي', 'breakfast', '20', 420, 'logo'],

  // Camel Haneeth (حاشي / young camel haneeth)
  ['Camel Haneeth Bashawer', 'حاشي حنيذ بشاور', 'Individual camel haneeth with bashawer-style rice', 'حنيذ حاشي فردي مع أرز على طريقة البشاور', 'camelHaneeth', '75', 760, 'logo'],
  ['Camel Haneeth Shaabi', 'حاشي حنيذ شعبي', 'Individual camel haneeth, traditional folk style', 'حنيذ حاشي فردي على الطريقة الشعبية', 'camelHaneeth', '75', 650, 'logo'],
  ['Camel Haneeth Saleeg', 'حاشي حنيذ سليق', 'Individual camel haneeth served with creamy saleeg rice', 'حنيذ حاشي فردي يقدم مع أرز السليق الكريمي', 'camelHaneeth', '75', 720, 'logo'],
  ['Camel Haneeth Mathloutha', 'حاشي حنيذ مثلوثة', 'Individual slow-roasted camel haneeth over spiced rice', 'حنيذ حاشي فردي مطهو ببطء فوق أرز متبل', 'camelHaneeth', '80', 780, 'logo'],

  // Madhghoot & Kabsa Barriya (مضغوط / pressed rice with lamb or camel)
  ['Lamb Mandi', 'مضغوط غنم', 'Rice slow-pressed with tender mutton and warm spices', 'أرز مضغوط ببطء مع لحم الغنم الطري والبهارات الدافئة', 'madhghoot', '95', 980, 'logo'],
  ['Camel Mandi', 'مضغوط حاشي', 'Rice slow-pressed with tender camel meat and warm spices', 'أرز مضغوط ببطء مع لحم الحاشي الطري والبهارات الدافئة', 'madhghoot', '75', 900, 'logo'],
  ['Lamb Mandi Arabic', 'مضغوط عربي غنم', 'Arabic-style pressed rice with mutton', 'أرز مضغوط على الطريقة العربية مع لحم الغنم', 'madhghoot', '95', 1040, 'logo'],
  ['Camel Mandi Arabic', 'مضغوط عربي حاشي', 'Arabic-style pressed rice with camel meat', 'أرز مضغوط على الطريقة العربية مع لحم الحاشي', 'madhghoot', '75', 950, 'logo'],
  ['Lamb Kabsa', 'كبسة بريه غنم', 'Open-fire Bedouin-style kabsa with mutton', 'كبسة بريّة على الفحم مع لحم الغنم', 'madhghoot', '95', 950, 'logo'],
  ['Camel Kabsa', 'كبسة بريه حاشي', 'Open-fire Bedouin-style kabsa with camel meat', 'كبسة بريّة على الفحم مع لحم الحاشي', 'madhghoot', '75', 870, 'logo'],

  // Chicken
  ['Whole Chicken (Madhbi-Haneeth)', 'حبة دجاج (مضبي - حنيذ)', 'Whole chicken, roasted or Madhbi-style, over spiced rice', 'دجاجة كاملة مشوية أو مضبي فوق أرز متبل', 'chicken', '50', 2625, 'logo'],
  ['Half Chicken (Madhbi-Haneeth)', 'نصف دجاج (مضبي - حنيذ)', 'Half chicken, roasted or Madhbi-style, over spiced rice', 'نصف دجاجة مشوية أو مضبي فوق أرز متبل', 'chicken', '25', 1313, 'logo'],

  // Rice
  ['Rice Bashawer', 'رز بشاور', 'Fragrant bashawer-style rice', 'أرز على طريقة البشاور العطر', 'rice', '10', null, 'logo'],
  ['Rice Shaabi', 'رز شعبي', 'Traditional folk-style rice', 'أرز على الطريقة الشعبية', 'rice', '10', null, 'logo'],
  ['Sahn Qasdeer (Medium)', 'صحن قصدير وسط', 'Medium tin-plate rice portion', 'صحن قصدير أرز - حجم وسط', 'rice', '6', null, 'logo'],
  ['Sahn Qasdeer (Large)', 'صحن قصدير كبير', 'Large tin-plate rice portion', 'صحن قصدير أرز - حجم كبير', 'rice', '10', null, 'logo'],

  // Sides
  ['Jareesh (Side)', 'جريش', 'Cracked wheat side, simmered with spices', 'جريش جانبي مطهو مع البهارات', 'sides', '10', 577, 'logo'],
  ['Qursan', 'قرصان', 'Traditional layered bread side', 'خبز مطبق تقليدي', 'sides', '10', 447, 'logo'],
  ['Musaqqaa', 'مسقعة', 'Sautéed vegetable and meat side', 'خضار ولحم سوتيه', 'sides', '10', 543, 'logo'],
  ['Bamia Lahm', 'بامية لحم', 'Okra stewed with tender meat', 'بامية مطهوة مع اللحم الطري', 'sides', '15', 340, 'logo'],
  ['Mulukhiyah', 'ملوخية', 'Traditional jute-leaf stew', 'طبق الملوخية التقليدي', 'sides', '10', 116, 'logo'],
  ['Vegetable Idam', 'ايدام خضار', 'Mixed vegetable stew', 'إيدام خضار مشكل', 'sides', '10', 190, 'logo'],
  ['Southern Bread', 'خبز جنوبي', 'Fresh-baked traditional southern bread', 'خبز جنوبي طازج تقليدي', 'sides', '5', 260, 'southernBread'],

  // Salads
  ['Green Salad', 'سلطة خضراء', 'Crisp seasonal green salad', 'سلطة خضراء طازجة', 'salads', '10', 90, 'logo'],
  ['Laban Khiyar', 'لبن خيار', 'Cucumber and yogurt salad', 'سلطة اللبن والخيار', 'salads', '10', 120, 'logo'],
  ['Samtara', 'سمطرة', 'Traditional Saudi vegetable salad', 'سلطة سعودية تقليدية', 'salads', '4', 170, 'logo'],
  ['Spicy Salad', 'سلطة حارة', 'Chopped salad with a spiced dressing', 'سلطة مفرومة مع تتبيلة حارة', 'salads', '0', 70, 'logo'],
  ['Tahini', 'طحينية', 'Traditional sesame tahini dip', 'طحينة تقليدية', 'salads', '0', 180, 'logo'],

  // Appetizers
  ['Samdan Soup', 'شوربة سمدان', 'Our signature house soup', 'شوربتنا المميزة الخاصة بسمدان', 'appetizers', '5', 180, 'logo'],
  ['Meat Samosa', 'سمبوسة لحم', 'Crisp pastry filled with spiced meat', 'سمبوسة مقرمشة محشوة باللحم المتبل', 'appetizers', '3', 130, 'logo'],

  // Drinks
  ['Laban Samdan', 'لبن سمدان', 'Our house-style traditional buttermilk', 'لبن سمدان التقليدي الخاص بنا', 'drinks', '5', 160, 'logo'],
  ['Soft Drink', 'مشروب غازي', 'Assorted soft drinks', 'مشروبات غازية متنوعة', 'drinks', '4', 132, 'logo'],
  ['Al-Qarya Laban', 'لبن القرية', 'Chilled traditional laban', 'لبن القرية بارد', 'drinks', '4', 175, 'logo'],
  ['Almarai Laban', 'لبن مراعي', 'Chilled Almarai laban', 'لبن مراعي بارد', 'drinks', '2', 120, 'logo'],
  ['Water', 'ماء', 'Bottled water', 'مياه معدنية', 'drinks', '1', 0, 'logo'],
  ['Tea', 'شاهي تلقية', 'Traditional Saudi tea', 'شاهي سعودي تقليدي', 'drinks', '3', 2, 'tea'],
  ['Arabic Coffee Pot with Dates', 'دلة مع التمر', 'Traditional dallah of qahwa served with premium dates', 'دلة قهوة عربية تقدم مع أجود أنواع التمر', 'drinks', '20', 220, 'logo'],

  // Desserts
  ['Kunafa', 'كنافة', 'Crisp shredded pastry with cheese and syrup', 'كنافة مقرمشة بالجبن والقطر', 'desserts', '10', 560, 'logo', true],
  ['Crème Caramel', 'كريم كرميل', 'Silky caramel custard dessert', 'حلا الكريم كرميل الحريري', 'desserts', '10', 290, 'logo']
]

const buildMenuItems = (lang) =>
  MENU_ROWS.map(([enName, arName, enDesc, arDesc, catKey, price, calories, imageKey, featured]) => ({
    name: lang === 'ar' ? arName : enName,
    category: lang === 'ar' ? CAT[catKey].ar : CAT[catKey].en,
    description: lang === 'ar' ? arDesc : enDesc,
    price,
    calories: calories || undefined,
    image: menuImages[imageKey],
    isPlaceholder: imageKey === 'logo',
    featured: !!featured
  }))

export const translations = {
  en: {
    nav: {
      home: 'Home',
      about: 'Our Story',
      menu: 'Menu',
      branches: 'Branches',
      gallery: 'Gallery',
      contact: 'Contact',
      reserve: 'Reserve a Table'
    },
    hero: {
      eyebrow: 'Saudi Heritage Dining',
      title: 'Authentic <span>Kabsa</span> & Najdi Flavors',
      subtitle: 'In the heart of Saudi Arabia, SAMDAN serves exquisite Kabsa, Jarish, Najdi, and Hejazi cuisine — a remarkable dining adventure rooted in tradition.',
      tagline: 'Authentic Traditions. Refined Experiences.',
      ctaPrimary: 'View Menu',
      ctaSecondary: 'Reserve a Table',
      hours: 'Open Daily',
      hoursValue: '12:00 PM – 12:00 AM',
      promoTitle: 'Grand Opening',
      promoText: 'Now open in Riyadh — visit us today and taste authentic Najdi hospitality',
      carousel: [
        { badge: 'Now Open', title: 'Now Open in Riyadh', subtitle: 'Join us today — the doors are open and the kitchen is ready to welcome you.', image: diningRoom },
        { badge: 'Signature Dish', title: 'Lamb Kabsa', subtitle: 'Tender lamb slow-cooked with heirloom spices over saffron rice.', image: menuImages.lambKabsa },
        { badge: "Chef's Pick", title: 'Hejazi Mandi', subtitle: 'Slow-roasted lamb with smoky flavors and crispy fried onions.', image: menuImages.hejaziMandi }
      ]
    },
    story: {
      eyebrow: 'The Story Behind Samdan',
      title: 'Welcome to SAMDAN',
      intro: 'Inspired by the timeless landscapes and enduring values of Najd, Samdan is more than a name — it is a tribute to Saudi heritage, reimagined for a modern dining experience.',
      description: 'In the heart of Saudi Arabia, SAMDAN stands as a culinary treasure, celebrated for its exquisite Kabsa, Jarish, Najdi, and Hejazi cuisine. This extraordinary restaurant enchants guests with its mouthwatering dishes and unparalleled hospitality, offering a diverse menu brimming with authentic flavors.',
      chefTitle: 'Our Kitchen',
      chefName: 'Masters of Saudi Cuisine',
      chefRole: 'Culinary Heritage Team',
      chefBio: 'Our chefs draw on generations of Najdi and Hejazi tradition, slow-cooking every dish with heirloom spice blends and time-honored technique.',
      qualityTitle: 'Our Promise',
      qualityText: 'To elevate Saudi heritage into a refined dining experience where tradition, authenticity, and modern elegance come together.',
      highlights: ['Authentic Recipes', 'Fresh Ingredients', 'Warm Hospitality', 'Saudi Heritage'],
      ambienceTitle: 'Our Ambience',
      ambienceText: 'A warm, elegant setting designed to welcome family, friends, and honored guests for a remarkable dining adventure.'
    },
    menu: {
      eyebrow: 'Our Menu',
      title: 'Our Signature Dishes',
      subtitle: 'Prepared with love and tradition, each dish tells a story',
      itemsLabel: 'dishes',
      recommended: "Chef's Pick",
      caloriesLabel: 'kcal',
      filterAll: 'All Categories',
      prev: 'Previous',
      next: 'Next',
      pageOf: 'Page {page} of {count}',
      fullMenuHeading: 'Our Curated Menu',
      fullMenuSubtitle: 'Browse every dish we serve, organized by category so you can find your favorite fast.',
      items: buildMenuItems('en')
    },
    featuredMenu: {
      eyebrow: "Chef's Selections",
      title: 'From Our Menu',
      subtitle: 'A taste of our most-loved dishes',
      viewFullMenu: 'View Full Menu',
      scrollToExplore: 'Scroll down to explore'
    },
    contact: {
      eyebrow: 'Get In Touch',
      title: 'Visit Us',
      description: "We'd love to welcome you to SAMDAN. Reach out to reserve your table or ask about our menu.",
      address: 'Khalid bin Al Waleed Street, Qurtubah, Riyadh, Saudi Arabia',
      phone: '+966 55 518 5657 |  +966 53 334 7721',
      email: 'reservations@samdan.sa',
      hours: 'Daily 12:00 PM – 12:00 AM',
      mapTitle: 'Our Location'
    },
    branches: {
      eyebrow: 'Find Us',
      title: 'Our Branches',
      subtitle: 'Visit us at our Riyadh location, with more branches opening soon.',
      directionsLabel: 'Get Directions',
      items: [
        {
          name: 'SAMDAN — Qurtubah',
          location: 'Khalid bin Al Waleed Street, Qurtubah, Riyadh, Saudi Arabia',
          hours: 'Daily 12:00 PM – 12:00 AM',
          mapsLink: branchMapsLink,
          image: najdiBranch
        }
      ]
    },
    gallery: {
      eyebrow: 'A Glimpse Inside',
      title: 'Gallery',
      subtitle: "A visual journey through SAMDAN's ambiance and signature dishes.",
      images: [
        { caption: 'Najdi Architecture', image: najdiArchitecture },
        { caption: 'Sadu-Inspired Interior', image: saduInterior },
        { caption: 'SAMDAN, Riyadh', image: diningRoom },
        { caption: 'Hejazi Mandi', image: menuImages.hejaziMandi },
        { caption: 'Lamb Kabsa', image: menuImages.lambKabsa },
        { caption: 'Kabsa Mashawi', image: menuImages.kabsaMashawi },
        { caption: 'Saleeg', image: menuImages.saleeg },
        { caption: 'Arabic Coffee & Dates', image: menuImages.coffeeDates },
        { caption: 'Luqaimat', image: menuImages.luqaimat },
        { caption: 'Traditional Breakfast Spread', image: breakfastSpread1 },
        { caption: 'Golden Breakfast Bread', image: breakfastBread },
        { caption: 'Najdi Breakfast Table', image: najdiBreakfastTable },
        { caption: 'Eggs & Tomato Relish', image: eggsTomatoRelish },
        { caption: 'Spiced Tomato Relish', image: tomatoRelish },
        { caption: 'Spiced Meat Nawashef', image: nawashefPhoto },
        { caption: 'Tomato & Pepper Dip', image: tomatoPepperDip },
        { caption: 'Hummus with Spiced Meat', image: hummusMeat }
      ]
    },
    notFound: {
      title: 'Page Not Found',
      subtitle: "The page you're looking for doesn't exist or may have been moved.",
      backHome: 'Back to Home'
    },
    footer: {
      rights: '© 2026 SAMDAN Restaurant. All rights reserved.',
      follow: 'Follow Us',
      cta: 'Reserve a Table',
      addressTitle: 'Visit Us',
      hoursTitle: 'Opening Hours',
      contactTitle: 'Contact',
      linksTitle: 'Pages'
    },
    reserve: {
      title: 'Reservation Inquiry',
      subtitle: "Tell us about your visit and our team will get back to you shortly to confirm the details.",
      name: 'Full Name',
      phone: 'Phone Number',
      phoneHint: 'Enter a valid Saudi mobile number, e.g. 05XXXXXXXX or +9665XXXXXXXX',
      guests: 'Guests',
      date: 'Date',
      time: 'Time',
      notes: 'Special Requests (optional)',
      notesPlaceholder: 'Allergies, occasion, seating preference…',
      submit: 'Send Inquiry',
      submitting: 'Sending…',
      errorText: "Something went wrong sending your request — please try again, or call us at +966 55 518 5657 | +966 53 334 7721.",
      successTitle: "Thank you, {name}!",
      successText: "We've received your request and will be in touch shortly to confirm your table.",
      close: 'Close'
    }
  },
  ar: {
    nav: {
      home: 'الرئيسية',
      about: 'قصتنا',
      menu: 'القائمة',
      branches: 'الفروع',
      gallery: 'معرض الصور',
      contact: 'تواصل معنا',
      reserve: 'احجز طاولة'
    },
    hero: {
      eyebrow: 'أصالة الضيافة السعودية',
      title: '<span>كبسة</span> أصيلة ونكهات نجدية',
      subtitle: 'في قلب المملكة العربية السعودية، تقدّم سمدان أشهى أطباق الكبسة والجريش والمطبخ النجدي والحجازي، في رحلة طعام استثنائية متجذرة في التراث.',
      tagline: 'تقاليد أصيلة.<br />تجارب راقية.',
      ctaPrimary: 'استكشف القائمة',
      ctaSecondary: 'احجز طاولة',
      hours: 'نستقبلكم يومياً',
      hoursValue: '١٢:٠٠ ظهراً - ١٢:٠٠ منتصف الليل',
      promoTitle: 'الافتتاح الكبير',
      promoText: 'افتتحنا الآن في الرياض — زورونا اليوم وتذوقوا الضيافة النجدية الأصيلة',
      carousel: [
        { badge: 'افتتحنا الآن', title: 'افتتحنا الآن في الرياض', subtitle: 'انضموا إلينا اليوم — الأبواب مفتوحة والمطبخ جاهز لاستقبالكم.', image: diningRoom },
        { badge: 'طبق مميز', title: 'كبسة لحم', subtitle: 'لحم ضأن طري مطهو ببطء مع بهارات تراثية فوق أرز الزعفران.', image: menuImages.lambKabsa },
        { badge: 'اختيار الشيف', title: 'مندي حجازي', subtitle: 'لحم ضأن مشوي ببطء بنكهات مدخنة وبصل مقرمش.', image: menuImages.hejaziMandi }
      ]
    },
    story: {
      eyebrow: 'قصة سمدان',
      title: 'مرحباً بكم في سمدان',
      intro: 'مستوحاة من مشهد نجد الخالد وقيمها الراسخة، سمدان أكثر من مجرد اسم — إنها تحية للتراث السعودي، أُعيد تقديمها بروح عصرية.',
      description: 'في قلب المملكة العربية السعودية، تقف سمدان كنزاً مطبخياً، مشهورة بأطباقها الرائعة من الكبسة والجريش والمطبخ النجدي والحجازي. يسحر هذا المطعم الاستثنائي ضيوفه بأطباقه الشهية وضيافته التي لا مثيل لها، مع قائمة متنوعة تفيض بالنكهات الأصيلة.',
      chefTitle: 'مطبخنا',
      chefName: 'أسياد المطبخ السعودي',
      chefRole: 'فريق التراث الطهوي',
      chefBio: 'يعتمد طهاتنا على أجيال من التقاليد النجدية والحجازية، يطهون كل طبق ببطء بمزيج بهارات موروث وتقنيات عريقة.',
      qualityTitle: 'وعدنا',
      qualityText: 'أن نرتقي بالتراث السعودي إلى تجربة طعام راقية، حيث تلتقي الأصالة والتقاليد بالأناقة العصرية.',
      highlights: ['وصفات أصيلة', 'مكونات طازجة', 'ضيافة دافئة', 'تراث سعودي'],
      ambienceTitle: 'أجواؤنا',
      ambienceText: 'أجواء دافئة وأنيقة مصممة لاستقبال العائلة والأصدقاء وكرام الضيوف في رحلة طعام استثنائية.'
    },
    menu: {
      eyebrow: 'قائمتنا',
      title: 'أطباقنا المميزة',
      subtitle: 'محضرة بحب وتقاليد، كل طبق يحكي قصة',
      itemsLabel: 'أطباق',
      recommended: 'اختيار الشيف',
      caloriesLabel: 'سعرة حرارية',
      filterAll: 'كل الأصناف',
      prev: 'السابق',
      next: 'التالي',
      pageOf: 'صفحة {page} من {count}',
      fullMenuHeading: 'قائمتنا المنتقاة',
      fullMenuSubtitle: 'تصفح جميع أطباقنا مصنّفة حسب النوع لتجد طبقك المفضل بسهولة.',
      items: buildMenuItems('ar')
    },
    featuredMenu: {
      eyebrow: 'اختيارات الشيف',
      title: 'من قائمتنا',
      subtitle: 'تذوق أشهى أطباقنا المفضلة',
      viewFullMenu: 'عرض القائمة الكاملة',
      scrollToExplore: 'مرر للأسفل لاستكشاف القائمة'
    },
    contact: {
      eyebrow: 'تواصل معنا',
      title: 'زورونا',
      description: 'يسعدنا الترحيب بكم في سمدان. تواصلوا معنا لحجز طاولتكم أو للاستفسار عن قائمتنا.',
      address: 'شارع خالد بن الوليد، قرطبة، الرياض، المملكة العربية السعودية',
      phone: '+966 55 518 5657 |  +966 53 334 7721',
      email: 'reservations@samdan.sa',
      hours: 'يومياً ١٢:٠٠ ظهراً - ١٢:٠٠ منتصف الليل',
      mapTitle: 'موقعنا'
    },
    branches: {
      eyebrow: 'موقعنا',
      title: 'فروعنا',
      subtitle: 'زورونا في فرعنا بالرياض، مع افتتاح فروع جديدة قريباً.',
      directionsLabel: 'احصل على الاتجاهات',
      items: [
        {
          name: 'سمدان - قرطبة',
          location: 'شارع خالد بن الوليد، قرطبة، الرياض، المملكة العربية السعودية',
          hours: 'يومياً ١٢:٠٠ ظهراً - ١٢:٠٠ منتصف الليل',
          mapsLink: branchMapsLink,
          image: najdiBranch
        }
      ]
    },
    gallery: {
      eyebrow: 'لمحة من الداخل',
      title: 'معرض الصور',
      subtitle: 'جولة بصرية عبر أجواء سمدان وأطباقها المميزة.',
      images: [
        { caption: 'العمارة النجدية', image: najdiArchitecture },
        { caption: 'الديكور المستوحى من السدو', image: saduInterior },
        { caption: 'سمدان، الرياض', image: diningRoom },
        { caption: 'مندي حجازي', image: menuImages.hejaziMandi },
        { caption: 'كبسة لحم', image: menuImages.lambKabsa },
        { caption: 'كبسة مشاوي', image: menuImages.kabsaMashawi },
        { caption: 'سليق', image: menuImages.saleeg },
        { caption: 'قهوة عربية وتمر', image: menuImages.coffeeDates },
        { caption: 'لقيمات', image: menuImages.luqaimat },
        { caption: 'مائدة فطور تقليدية', image: breakfastSpread1 },
        { caption: 'خبز الفطور الذهبي', image: breakfastBread },
        { caption: 'مائدة فطور نجدية', image: najdiBreakfastTable },
        { caption: 'بيض ومرقة طماطم', image: eggsTomatoRelish },
        { caption: 'مرقة طماطم متبلة', image: tomatoRelish },
        { caption: 'نواشف باللحم المتبل', image: nawashefPhoto },
        { caption: 'غموس طماطم وفلفل', image: tomatoPepperDip },
        { caption: 'حمص باللحم المتبل', image: hummusMeat }
      ]
    },
    notFound: {
      title: 'الصفحة غير موجودة',
      subtitle: 'الصفحة التي تبحث عنها غير موجودة أو ربما تم نقلها.',
      backHome: 'العودة للرئيسية'
    },
    footer: {
      rights: '© ٢٠٢٦ مطعم سمدان. جميع الحقوق محفوظة.',
      follow: 'تابعونا',
      cta: 'احجز طاولة',
      addressTitle: 'زورونا',
      hoursTitle: 'ساعات العمل',
      contactTitle: 'تواصل معنا',
      linksTitle: 'صفحات'
    },
    reserve: {
      title: 'استفسار حجز',
      subtitle: 'أخبرونا عن زيارتكم وسيتواصل معكم فريقنا قريباً لتأكيد التفاصيل.',
      name: 'الاسم الكامل',
      phone: 'رقم الجوال',
      phoneHint: 'أدخل رقم جوال سعودي صحيح، مثال: 05XXXXXXXX أو +9665XXXXXXXX',
      guests: 'عدد الضيوف',
      date: 'التاريخ',
      time: 'الوقت',
      notes: 'طلبات خاصة (اختياري)',
      notesPlaceholder: 'حساسية طعام، مناسبة خاصة، تفضيل مكان الجلوس…',
      submit: 'إرسال الاستفسار',
      submitting: 'جارِ الإرسال…',
      errorText: 'حدث خطأ أثناء إرسال طلبكم — يرجى المحاولة مرة أخرى، أو الاتصال بنا على +966 55 518 5657 | +966 53 334 7721.',
      successTitle: 'شكراً لك، {name}!',
      successText: 'لقد استلمنا طلبكم وسنتواصل معكم قريباً لتأكيد طاولتكم.',
      close: 'إغلاق'
    }
  }
}
