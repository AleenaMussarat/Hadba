'use strict';

const path = require('path');

// Local brand asset, copied into cms/public/brand so the seed script is
// self-contained and works when only the cms/ folder is deployed (e.g.
// Hostinger/Railway with Root Directory set to cms — it never sees the
// sibling frontend folder).
//
// Every image below is local (no remote fetches). This data previously used
// Unsplash URLs for menu items, which meant the bootstrap seed fetched ~80
// images over the network on first boot — on shared hosting with a startup
// timeout, that's slow enough to risk the process being killed before it
// ever finishes starting. Local files remove that risk entirely.
const localAsset = (filename) => path.join(__dirname, '..', 'public', 'brand', filename);

// Real production menu data, exported from the live CMS (Aug 2026). Category
// order values and the handful of items with no category or no photo yet are
// preserved exactly as exported, not re-derived — this is what staff had
// actually set up, not a guess at what it should be.
const CATEGORIES = [
  { nameEn: 'Breakfast', nameAr: 'الفطور', order: 0 },
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
  { nameEn: 'Desserts', nameAr: 'الحلا', order: 13 },
  { nameEn: 'Add-ons', nameAr: 'الإضافات', order: 0 },
  { nameEn: 'Raw Meat', nameAr: 'لحم ني', order: 0 }
];

// Default hero content for each secondary page — seeded once as real menu-category-
// style records, then editable in Strapi like everything else. Home's hero already
// works via its own richer fallback in Hero.jsx and isn't seeded here.
const pageHeroes = [
  {
    pageKey: 'home',
    titleEn: 'Authentic Experience... With A Modern Spirit',
    titleAr: 'تجربة أصيلة… بروح معاصرة',
    subtitleEn: 'In the heart of Saudi Arabia, SAMDAN serves exquisite Kabsa, Jarish, Najdi, and Hejazi cuisine — a remarkable dining adventure rooted in tradition.',
    subtitleAr: 'في سَمْدَان، نعيد تقديم المذاق الجنوبي الأصيل بروح عصرية، من الحنيذ إلى أطباق المائدة الشعبية، بتفاصيل تحكي أصالة الموروث السعودي',
    image: localAsset('photo-sadu-interior.jpg')
  },
  {
    pageKey: 'about',
    titleEn: 'Welcome to SAMDAN',
    titleAr: 'مرحباً بكم في سمدان',
    subtitleEn: 'Inspired by the timeless landscapes and enduring values of Najd, Samdan is more than a name — it is a tribute to Saudi heritage, reimagined for a modern dining experience.',
    subtitleAr: 'مستوحاة من مشهد جنوب الخالد وقيمها الراسخة، سمدان أكثر من مجرد اسم — إنها تحية للتراث السعودي، أُعيد تقديمها بروح عصرية.',
    image: localAsset('photo-sadu-interior.jpg')
  },
  {
    pageKey: 'menu',
    titleEn: 'Our Signature Dishes',
    titleAr: 'أطباقنا المميزة',
    subtitleEn: 'Prepared with love and tradition, each dish tells a story',
    subtitleAr: 'محضرة بحب وتقاليد، كل طبق يحكي قصة',
    image: localAsset('photo-sadu-interior.jpg')
  },
  {
    pageKey: 'branches',
    titleEn: 'Our Branches',
    titleAr: 'فروعنا',
    subtitleEn: 'Visit us at our Riyadh location, with more branches opening soon.',
    subtitleAr: 'زورونا في فرعنا بالرياض، مع افتتاح فروع جديدة قريباً.',
    image: localAsset('photo-sadu-interior.jpg')
  },
  {
    pageKey: 'gallery',
    titleEn: 'Gallery',
    titleAr: 'معرض الصور',
    subtitleEn: "A visual journey through SAMDAN's ambiance and signature dishes.",
    subtitleAr: 'جولة بصرية عبر أجواء سمدان وأطباقها المميزة.',
    image: localAsset('photo-sadu-interior.jpg')
  },
  {
    pageKey: 'contact',
    titleEn: 'Visit Us',
    titleAr: 'زورونا',
    subtitleEn: "We'd love to welcome you to SAMDAN. Reach out to reserve your table or ask about our menu.",
    subtitleAr: 'يسعدنا الترحيب بكم في سمدان. تواصلوا معنا لحجز طاولتكم أو للاستفسار عن قائمتنا.',
    image: localAsset('photo-sadu-interior.jpg')
  }
];

const items = [
  {
    order: 1,
    price: 25,
    calories: 420,
    featured: true,
    image: localAsset('dish-kabda-baladi.webp'),
    nameEn: 'Kabda Baladi',
    nameAr: 'كبدة بلدي',
    descriptionEn: 'Sautéed local liver with onions and warm spices',
    descriptionAr: 'كبدة طازجة سوتيه مع البصل والبهارات الدافئة',
    categoryName: 'Breakfast'
  },
  {
    order: 2,
    price: 30,
    calories: 510,
    featured: false,
    image: localAsset('photo-breakfast-spread-1.webp'),
    nameEn: 'Muqalqal Lahm',
    nameAr: 'مقلقل لحم',
    descriptionEn: 'Pan-tossed beef with peppers, onion, and tomato',
    descriptionAr: 'لحم مقلقل مع الفلفل والبصل والطماطم',
    categoryName: 'Breakfast'
  },
  {
    order: 3,
    price: 20,
    calories: 430,
    featured: false,
    image: localAsset('photo-breakfast-spread-1.webp'),
    nameEn: 'Muqalqal Dajaj',
    nameAr: 'مقلقل دجاج',
    descriptionEn: 'Pan-tossed chicken with peppers and tomato',
    descriptionAr: 'دجاج مقلقل مع الفلفل والطماطم',
    categoryName: 'Breakfast'
  },
  {
    order: 4,
    price: 30,
    calories: 540,
    featured: false,
    image: localAsset('photo-nawashef.webp'),
    nameEn: 'Nawashef',
    nameAr: 'نواشف',
    descriptionEn: 'Traditional dried-meat morning stew',
    descriptionAr: 'طبق فطور تقليدي من اللحم المجفف',
    categoryName: 'Breakfast'
  },
  {
    order: 5,
    price: 27,
    calories: 390,
    featured: false,
    image: localAsset('photo-breakfast-spread-1.webp'),
    nameEn: 'Meat Homaisa',
    nameAr: 'حميسة لحم',
    descriptionEn: 'Slow-simmered wheat and meat breakfast porridge',
    descriptionAr: 'قمح مطهو ببطء مع اللحم، فطور تقليدي',
    categoryName: 'Breakfast'
  },
  {
    order: 6,
    price: 15,
    calories: 280,
    featured: true,
    image: localAsset('dish-tuna.webp'),
    nameEn: 'Homaisa Tuna',
    nameAr: 'حميسة تونة',
    descriptionEn: 'Fresh tuna breakfast plate with vegetables',
    descriptionAr: 'طبق تونة طازج مع الخضار',
    categoryName: 'Breakfast'
  },
  {
    order: 7,
    price: 10,
    calories: 330,
    featured: false,
    image: localAsset('photo-breakfast-spread-1.webp'),
    nameEn: 'Shakshuka',
    nameAr: 'شكشوكة',
    descriptionEn: 'Eggs poached in a spiced tomato and pepper sauce',
    descriptionAr: 'بيض مطهو في صلصة الطماطم والفلفل المتبلة',
    categoryName: 'Breakfast'
  },
  {
    order: 8,
    price: 12,
    calories: 350,
    featured: false,
    image: localAsset('photo-breakfast-spread-1.webp'),
    nameEn: 'Lahsa',
    nameAr: 'لحسة',
    descriptionEn: 'Warm spiced flour porridge, a Najdi breakfast classic',
    descriptionAr: 'عصيدة دقيق دافئة ومتبلة، طبق نجدي تقليدي',
    categoryName: 'Breakfast'
  },
  {
    order: 9,
    price: 10,
    calories: 240,
    featured: true,
    image: localAsset('dish-fried-eggs.webp'),
    nameEn: 'Fried Eggs',
    nameAr: 'بيض عيون',
    descriptionEn: 'Two eggs, sunny side up, with fresh bread',
    descriptionAr: 'بيضتان مقليتان مع خبز طازج',
    categoryName: null
  },
  {
    order: 10,
    price: 10,
    calories: 360,
    featured: false,
    image: localAsset('photo-breakfast-spread-1.webp'),
    nameEn: 'Foul',
    nameAr: 'فول',
    descriptionEn: 'Slow-cooked fava beans with olive oil and spices',
    descriptionAr: 'فول مدمس مطهو ببطء مع زيت الزيتون والبهارات',
    categoryName: 'Breakfast'
  },
  {
    order: 11,
    price: 20,
    calories: 420,
    featured: false,
    image: localAsset('photo-breakfast-spread-1.webp'),
    nameEn: 'Qishta & Honey',
    nameAr: 'قشطة وعسل',
    descriptionEn: 'Clotted cream drizzled with natural honey',
    descriptionAr: 'قشطة طازجة مغطاة بالعسل الطبيعي',
    categoryName: 'Breakfast'
  },
  {
    order: 12,
    price: 35,
    calories: 690,
    featured: false,
    image: localAsset('photo-najdi-breakfast-table.webp'),
    nameEn: 'Areeka Janoubia',
    nameAr: 'عريكة جنوبية',
    descriptionEn: 'Southern-style bread mash with meat and ghee',
    descriptionAr: 'عريكة على الطريقة الجنوبية مع اللحم والسمن',
    categoryName: 'Traditional Dishes'
  },
  {
    order: 13,
    price: 35,
    calories: 610,
    featured: false,
    image: localAsset('photo-najdi-breakfast-table.webp'),
    nameEn: 'Mashghoutha',
    nameAr: 'مشغوثة',
    descriptionEn: 'Traditional mashed bread and meat dish',
    descriptionAr: 'طبق تقليدي من الخبز المهروس واللحم',
    categoryName: 'Traditional Dishes'
  },
  {
    order: 14,
    price: 20,
    calories: 780,
    featured: false,
    image: localAsset('photo-najdi-breakfast-table.webp'),
    nameEn: 'Fattah with Ghee & Honey',
    nameAr: 'فتة بالسمن والعسل',
    descriptionEn: 'Layered bread soaked in ghee and honey',
    descriptionAr: 'خبز مطبق منقوع بالسمن والعسل',
    categoryName: 'Traditional Dishes'
  },
  {
    order: 15,
    price: 20,
    calories: 480,
    featured: false,
    image: localAsset('photo-najdi-breakfast-table.webp'),
    nameEn: 'Marasa',
    nameAr: 'مرسة',
    descriptionEn: 'Traditional Najdi bread and broth dish',
    descriptionAr: 'طبق نجدي تقليدي من الخبز والمرق',
    categoryName: 'Traditional Dishes'
  },
  {
    order: 16,
    price: 20,
    calories: 640,
    featured: false,
    image: localAsset('photo-najdi-breakfast-table.webp'),
    nameEn: 'Maksaf',
    nameAr: 'مكسف',
    descriptionEn: 'Hearty traditional bread and meat mash',
    descriptionAr: 'طبق تراثي دسم من الخبز واللحم المهروس',
    categoryName: 'Traditional Dishes'
  },
  {
    order: 17,
    price: 9,
    calories: 180,
    featured: false,
    image: localAsset('photo-najdi-breakfast-table.webp'),
    nameEn: 'Local Ghee',
    nameAr: 'سمن بلدي',
    descriptionEn: 'Pure traditional Saudi ghee',
    descriptionAr: 'سمن بلدي أصيل',
    categoryName: 'Traditional Dishes'
  },
  {
    order: 18,
    price: 10,
    calories: 95,
    featured: false,
    image: localAsset('photo-najdi-breakfast-table.webp'),
    nameEn: 'Natural Honey',
    nameAr: 'عسل طبيعي',
    descriptionEn: 'Pure natural Saudi honey',
    descriptionAr: 'عسل طبيعي سعودي خالص',
    categoryName: 'Traditional Dishes'
  },
  {
    order: 19,
    price: 6,
    calories: 320,
    featured: false,
    image: localAsset('photo-najdi-breakfast-table.webp'),
    nameEn: 'Radeefa',
    nameAr: 'رضيفة',
    descriptionEn: 'Traditional bread side',
    descriptionAr: 'طبق خبز تقليدي',
    categoryName: 'Traditional Dishes'
  },
  {
    order: 20,
    price: 95,
    calories: 980,
    featured: false,
    image: localAsset('photo-najdi-architecture.jpg'),
    nameEn: 'Madhghoot Ghanam (Sella Rice - American Rice)',
    nameAr: '(رز مزه - رز امريكي) مضغوط غنم',
    descriptionEn: 'Rice slow-pressed with tender mutton and warm spices',
    descriptionAr: 'أرز مضغوط ببطء مع لحم الغنم الطري والبهارات الدافئة',
    categoryName: 'Madhghoot & Kabsa Barriya'
  },
  {
    order: 21,
    price: 75,
    calories: 900,
    featured: false,
    image: localAsset('photo-najdi-architecture.jpg'),
    nameEn: 'Madhghoot Hashi (Sella Rice - American Rice)',
    nameAr: '(رز مزه - رز امريكي) مضغوط حاشي',
    descriptionEn: 'Rice slow-pressed with tender lamb and warm spices',
    descriptionAr: 'أرز مضغوط ببطء مع لحم الحاشي الطري والبهارات الدافئة',
    categoryName: 'Madhghoot & Kabsa Barriya'
  },
  {
    order: 22,
    price: 95,
    calories: 1040,
    featured: false,
    image: localAsset('photo-najdi-architecture.jpg'),
    nameEn: 'Arabic Madhghoot Ghanam (American Rice)',
    nameAr: '( رز امريكي ) مضغوط عربي غنم',
    descriptionEn: 'Arabic-style pressed rice with mutton',
    descriptionAr: 'أرز مضغوط على الطريقة العربية مع لحم الغنم',
    categoryName: 'Madhghoot & Kabsa Barriya'
  },
  {
    order: 23,
    price: 75,
    calories: 950,
    featured: false,
    image: localAsset('photo-najdi-architecture.jpg'),
    nameEn: 'Arabic Madhghoot Hashi (American Rice)',
    nameAr: '( رز امريكي ) مضغوط عربي حاشي',
    descriptionEn: 'Arabic-style pressed rice with lamb',
    descriptionAr: 'أرز مضغوط على الطريقة العربية مع لحم الحاشي',
    categoryName: 'Madhghoot & Kabsa Barriya'
  },
  {
    order: 24,
    price: 95,
    calories: 950,
    featured: false,
    image: localAsset('photo-najdi-architecture.jpg'),
    nameEn: 'Kabsa Barriya Ghanam (Peshawar Rice)',
    nameAr: '( رز بشاور) كبسة بريه غنم',
    descriptionEn: 'Open-fire Bedouin-style kabsa with mutton',
    descriptionAr: 'كبسة بريّة على الفحم مع لحم الغنم',
    categoryName: 'Madhghoot & Kabsa Barriya'
  },
  {
    order: 25,
    price: 75,
    calories: 870,
    featured: false,
    image: localAsset('photo-najdi-architecture.jpg'),
    nameEn: 'Kabsa Barriya Hashi (Peshawar Rice)',
    nameAr: '( رز بشاور) كبسة بريه حاشي',
    descriptionEn: 'Open-fire Bedouin-style kabsa with lamb',
    descriptionAr: 'كبسة بريّة على الفحم مع لحم الحاشي',
    categoryName: 'Madhghoot & Kabsa Barriya'
  },
  {
    order: 26,
    price: 100,
    calories: 2467,
    featured: false,
    image: localAsset('photo-najdi-architecture.jpg'),
    nameEn: 'Nafar Haneeth Mathloutha',
    nameAr: 'نفر تيس حنيذ مثلوثة',
    descriptionEn: 'Individual slow-roasted goat haneeth over spiced rice',
    descriptionAr: 'حنيذ تيس فردي مطهو ببطء فوق أرز متبل',
    categoryName: 'Whole Lamb'
  },
  {
    order: 27,
    price: 95,
    calories: 2467,
    featured: false,
    image: localAsset('photo-najdi-architecture.jpg'),
    nameEn: 'Nafar Haneeth Saleeg',
    nameAr: 'نفر تيس حنيذ سليق',
    descriptionEn: 'Individual goat haneeth served with creamy saleeg rice',
    descriptionAr: 'حنيذ تيس فردي يقدم مع أرز السليق الكريمي',
    categoryName: 'Whole Lamb'
  },
  {
    order: 28,
    price: 95,
    calories: 2467,
    featured: false,
    image: localAsset('photo-najdi-architecture.jpg'),
    nameEn: 'Nafar Haneeth Shaabi',
    nameAr: 'نفر تيس حنيذ شعبي',
    descriptionEn: 'Individual goat haneeth, traditional folk style',
    descriptionAr: 'حنيذ تيس فردي على الطريقة الشعبية',
    categoryName: 'Whole Lamb'
  },
  {
    order: 29,
    price: 95,
    calories: 2467,
    featured: false,
    image: localAsset('photo-najdi-architecture.jpg'),
    nameEn: 'Nafar Haneeth Bashawer',
    nameAr: 'نفر تيس حنيذ بشاور',
    descriptionEn: 'Individual goat haneeth with bashawer-style rice',
    descriptionAr: 'حنيذ تيس فردي مع أرز على طريقة البشاور',
    categoryName: 'Whole Lamb'
  },
  {
    order: 30,
    price: 380,
    calories: 9870,
    featured: false,
    image: localAsset('photo-najdi-architecture.jpg'),
    nameEn: 'Quarter Goat Haneeth',
    nameAr: 'ربع تيس حنيذ',
    descriptionEn: 'Slow-roasted quarter goat haneeth — serves 2–3',
    descriptionAr: 'ربع تيس حنيذ مطهو ببطء - يكفي ٢-٣ أشخاص',
    categoryName: 'Whole Lamb'
  },
  {
    order: 31,
    price: 760,
    calories: 20350,
    featured: false,
    image: localAsset('photo-najdi-architecture.jpg'),
    nameEn: 'Half Goat Haneeth',
    nameAr: 'نصف تيس حنيذ',
    descriptionEn: 'Slow-roasted half goat haneeth — serves 4–6',
    descriptionAr: 'نصف تيس حنيذ مطهو ببطء - يكفي ٤-٦ أشخاص',
    categoryName: 'Whole Lamb'
  },
  {
    order: 32,
    price: 1520,
    calories: 40750,
    featured: false,
    image: localAsset('photo-najdi-architecture.jpg'),
    nameEn: 'Whole Goat Haneeth',
    nameAr: 'تيس كامل حنيذ',
    descriptionEn: 'Slow-roasted whole goat haneeth — serves 8–10',
    descriptionAr: 'تيس كامل حنيذ مطهو ببطء - يكفي ٨-١٠ أشخاص',
    categoryName: 'Whole Lamb'
  },
  {
    order: 33,
    price: 80,
    calories: 780,
    featured: false,
    image: localAsset('photo-sadu-interior.jpg'),
    nameEn: 'Hashi Haneeth Mathloutha',
    nameAr: 'حاشي حنيذ مثلوثة',
    descriptionEn: 'Individual slow-roasted lamb haneeth over spiced rice',
    descriptionAr: 'حنيذ حاشي فردي مطهو ببطء فوق أرز متبل',
    categoryName: 'Camel Haneeth'
  },
  {
    order: 34,
    price: 75,
    calories: 720,
    featured: false,
    image: localAsset('photo-sadu-interior.jpg'),
    nameEn: 'Hashi Haneeth Saleeg',
    nameAr: 'حاشي حنيذ سليق',
    descriptionEn: 'Individual lamb haneeth served with creamy saleeg rice',
    descriptionAr: 'حنيذ حاشي فردي يقدم مع أرز السليق الكريمي',
    categoryName: 'Camel Haneeth'
  },
  {
    order: 35,
    price: 75,
    calories: 650,
    featured: false,
    image: localAsset('photo-sadu-interior.jpg'),
    nameEn: 'Hashi Haneeth Shaabi',
    nameAr: 'حاشي حنيذ شعبي',
    descriptionEn: 'Individual lamb haneeth, traditional folk style',
    descriptionAr: 'حنيذ حاشي فردي على الطريقة الشعبية',
    categoryName: 'Camel Haneeth'
  },
  {
    order: 36,
    price: 75,
    calories: 760,
    featured: false,
    image: localAsset('photo-sadu-interior.jpg'),
    nameEn: 'Hashi Haneeth Bashawer',
    nameAr: 'حاشي حنيذ بشاور',
    descriptionEn: 'Individual lamb haneeth with bashawer-style rice',
    descriptionAr: 'حنيذ حاشي فردي مع أرز على طريقة البشاور',
    categoryName: 'Camel Haneeth'
  },
  {
    order: 37,
    price: 50,
    calories: 2625,
    featured: false,
    image: localAsset('photo-breakfast-bread.webp'),
    nameEn: 'Whole Chicken (Madhbi-Haneeth)',
    nameAr: 'حبة دجاج (مضبي - حنيذ)',
    descriptionEn: 'Whole chicken, roasted or Madhbi-style, over spiced rice',
    descriptionAr: 'دجاجة كاملة مشوية أو مضبي فوق أرز متبل',
    categoryName: 'Chicken'
  },
  {
    order: 38,
    price: 25,
    calories: 1313,
    featured: false,
    image: localAsset('photo-breakfast-bread.webp'),
    nameEn: 'Half Chicken (Madhbi-Haneeth)',
    nameAr: 'نصف دجاج (مضبي - حنيذ)',
    descriptionEn: 'Half chicken, roasted or Madhbi-style, over spiced rice',
    descriptionAr: 'نصف دجاجة مشوية أو مضبي فوق أرز متبل',
    categoryName: 'Chicken'
  },
  {
    order: 39,
    price: 350,
    calories: undefined,
    featured: false,
    image: localAsset('photo-riyadh-skyline.jpg'),
    nameEn: 'Quarter Lamb',
    nameAr: 'ربع ذبيحة',
    descriptionEn: 'Quarter raw lamb, butchered to order — serves 2–3',
    descriptionAr: 'ربع ذبيحة نيّة حسب الطلب - يكفي ٢-٣ أشخاص',
    categoryName: 'Raw Meat'
  },
  {
    order: 40,
    price: 700,
    calories: undefined,
    featured: false,
    image: localAsset('photo-riyadh-skyline.jpg'),
    nameEn: 'Half Lamb',
    nameAr: 'نصف ذبيحة',
    descriptionEn: 'Half raw lamb, butchered to order — serves 4–6',
    descriptionAr: 'نصف ذبيحة نيّة حسب الطلب - يكفي ٤-٦ أشخاص',
    categoryName: 'Raw Meat'
  },
  {
    order: 41,
    price: 1400,
    calories: undefined,
    featured: false,
    image: localAsset('photo-riyadh-skyline.jpg'),
    nameEn: 'Whole Lamb',
    nameAr: 'ذبيحة كاملة',
    descriptionEn: 'Whole raw lamb, butchered to order — serves 8–10',
    descriptionAr: 'ذبيحة كاملة نيّة حسب الطلب - يكفي ٨-١٠ أشخاص',
    categoryName: 'Raw Meat'
  },
  {
    order: 42,
    price: 10,
    calories: undefined,
    featured: false,
    image: localAsset('photo-najdi-breakfast-table.webp'),
    nameEn: 'Rice Bashawer',
    nameAr: 'رز بشاور',
    descriptionEn: 'Fragrant bashawer-style rice',
    descriptionAr: 'أرز على طريقة البشاور العطر',
    categoryName: 'Rice'
  },
  {
    order: 43,
    price: 10,
    calories: undefined,
    featured: false,
    image: localAsset('photo-najdi-breakfast-table.webp'),
    nameEn: 'Rice Shaabi',
    nameAr: 'رز شعبي',
    descriptionEn: 'Traditional folk-style rice',
    descriptionAr: 'أرز على الطريقة الشعبية',
    categoryName: 'Rice'
  },
  {
    order: 44,
    price: 6,
    calories: undefined,
    featured: false,
    image: localAsset('photo-najdi-breakfast-table.webp'),
    nameEn: 'Sahn Qasdeer (Medium)',
    nameAr: 'صحن قصدير وسط',
    descriptionEn: 'Medium tin-plate rice portion',
    descriptionAr: 'صحن قصدير أرز - حجم وسط',
    categoryName: 'Rice'
  },
  {
    order: 45,
    price: 10,
    calories: undefined,
    featured: false,
    image: localAsset('photo-najdi-breakfast-table.webp'),
    nameEn: 'Sahn Qasdeer (Large)',
    nameAr: 'صحن قصدير كبير',
    descriptionEn: 'Large tin-plate rice portion',
    descriptionAr: 'صحن قصدير أرز - حجم كبير',
    categoryName: 'Rice'
  },
  {
    order: 46,
    price: 5,
    calories: 180,
    featured: false,
    image: localAsset('photo-hummus-meat.webp'),
    nameEn: 'Samdan Soup',
    nameAr: 'شوربة سمدان',
    descriptionEn: 'Our signature house soup',
    descriptionAr: 'شوربتنا المميزة الخاصة بسمدان',
    categoryName: 'Appetizers'
  },
  {
    order: 47,
    price: 3,
    calories: 130,
    featured: false,
    image: localAsset('photo-hummus-meat.webp'),
    nameEn: 'Meat Samosa',
    nameAr: 'سمبوسة لحم',
    descriptionEn: 'Crisp pastry filled with spiced meat',
    descriptionAr: 'سمبوسة مقرمشة محشوة باللحم المتبل',
    categoryName: 'Appetizers'
  },
  {
    order: 48,
    price: 10,
    calories: 577,
    featured: false,
    image: localAsset('photo-hummus-meat.webp'),
    nameEn: 'Jareesh (Side)',
    nameAr: 'جريش',
    descriptionEn: 'Cracked wheat side, simmered with spices',
    descriptionAr: 'جريش جانبي مطهو مع البهارات',
    categoryName: 'Appetizers'
  },
  {
    order: 49,
    price: 10,
    calories: 447,
    featured: false,
    image: localAsset('dish-southern-bread.webp'),
    nameEn: 'Qursan',
    nameAr: 'قرصان',
    descriptionEn: 'Traditional layered bread side',
    descriptionAr: 'خبز مطبق تقليدي',
    categoryName: 'Sides'
  },
  {
    order: 50,
    price: 10,
    calories: 543,
    featured: false,
    image: localAsset('dish-southern-bread.webp'),
    nameEn: 'Musaqqaa',
    nameAr: 'مصقعة',
    descriptionEn: 'Sautéed vegetable and meat side',
    descriptionAr: 'خضار ولحم سوتيه',
    categoryName: 'Sides'
  },
  {
    order: 51,
    price: 15,
    calories: 340,
    featured: false,
    image: localAsset('dish-southern-bread.webp'),
    nameEn: 'Meat Bamia',
    nameAr: 'بامية لحم',
    descriptionEn: 'Okra stewed with tender meat',
    descriptionAr: 'بامية مطهوة مع اللحم الطري',
    categoryName: 'Sides'
  },
  {
    order: 52,
    price: 10,
    calories: 116,
    featured: false,
    image: localAsset('dish-southern-bread.webp'),
    nameEn: 'Molokhia',
    nameAr: 'ملوخية',
    descriptionEn: 'Traditional jute-leaf stew',
    descriptionAr: 'طبق الملوخية التقليدي',
    categoryName: 'Sides'
  },
  {
    order: 53,
    price: 10,
    calories: 190,
    featured: false,
    image: localAsset('dish-southern-bread.webp'),
    nameEn: 'Vegetable Stew',
    nameAr: 'ايدام خضار',
    descriptionEn: 'Mixed vegetable stew',
    descriptionAr: 'إيدام خضار مشكل',
    categoryName: 'Sides'
  },
  {
    order: 54,
    price: 5,
    calories: 260,
    featured: false,
    image: localAsset('dish-southern-bread.webp'),
    nameEn: 'Southern Bread',
    nameAr: 'خبز جنوبي',
    descriptionEn: 'Fresh-baked traditional southern bread',
    descriptionAr: 'خبز جنوبي طازج تقليدي',
    categoryName: 'Sides'
  },
  {
    order: 55,
    price: 10,
    calories: 90,
    featured: false,
    image: localAsset('photo-tomato-relish.webp'),
    nameEn: 'Green Salad',
    nameAr: 'سلطة خضراء',
    descriptionEn: 'Crisp seasonal green salad',
    descriptionAr: 'سلطة خضراء طازجة',
    categoryName: 'Salads'
  },
  {
    order: 56,
    price: 10,
    calories: 120,
    featured: false,
    image: localAsset('dish-tea.webp'),
    nameEn: 'Laban Khiyar',
    nameAr: 'لبن خيار',
    descriptionEn: 'Cucumber and yogurt salad',
    descriptionAr: 'سلطة اللبن والخيار',
    categoryName: 'Drinks'
  },
  {
    order: 57,
    price: 4,
    calories: 170,
    featured: false,
    image: localAsset('photo-tomato-relish.webp'),
    nameEn: 'Samtara',
    nameAr: 'سومطرة',
    descriptionEn: 'Traditional Saudi vegetable salad',
    descriptionAr: 'سلطة سعودية تقليدية',
    categoryName: 'Salads'
  },
  {
    order: 58,
    price: 4,
    calories: 70,
    featured: false,
    image: localAsset('photo-tomato-relish.webp'),
    nameEn: 'Spicy Salad',
    nameAr: 'سلطة حارة',
    descriptionEn: 'Chopped salad with a spiced dressing',
    descriptionAr: 'سلطة مفرومة مع تتبيلة حارة',
    categoryName: 'Salads'
  },
  {
    order: 59,
    price: 4,
    calories: 180,
    featured: false,
    image: localAsset('photo-tomato-relish.webp'),
    nameEn: 'Tahini',
    nameAr: 'طحينة',
    descriptionEn: 'Traditional sesame tahini dip',
    descriptionAr: 'طحينة تقليدية',
    categoryName: 'Salads'
  },
  {
    order: 60,
    price: 5,
    calories: 160,
    featured: false,
    image: localAsset('dish-tea.webp'),
    nameEn: 'Laban Samdan',
    nameAr: 'لبن سمدان',
    descriptionEn: 'Our house-style traditional buttermilk',
    descriptionAr: 'لبن سمدان التقليدي الخاص بنا',
    categoryName: 'Drinks'
  },
  {
    order: 61,
    price: 4,
    calories: 132,
    featured: false,
    image: localAsset('dish-tea.webp'),
    nameEn: 'Soft Drink',
    nameAr: 'مشروب غازي',
    descriptionEn: 'Assorted soft drinks',
    descriptionAr: 'مشروبات غازية متنوعة',
    categoryName: 'Drinks'
  },
  {
    order: 62,
    price: 4,
    calories: 175,
    featured: false,
    image: localAsset('dish-tea.webp'),
    nameEn: 'Al-Qarya Laban',
    nameAr: 'لبن القرية',
    descriptionEn: 'Chilled traditional laban',
    descriptionAr: 'لبن القرية بارد',
    categoryName: 'Drinks'
  },
  {
    order: 63,
    price: 2,
    calories: 120,
    featured: false,
    image: localAsset('dish-tea.webp'),
    nameEn: 'Almarai Laban',
    nameAr: 'لبن مراعي',
    descriptionEn: 'Chilled Almarai laban',
    descriptionAr: 'لبن مراعي بارد',
    categoryName: 'Drinks'
  },
  {
    order: 64,
    price: 1,
    calories: undefined,
    featured: false,
    image: localAsset('dish-tea.webp'),
    nameEn: 'Water',
    nameAr: 'ماء',
    descriptionEn: 'Bottled water',
    descriptionAr: 'مياه معدنية',
    categoryName: 'Drinks'
  },
  {
    order: 65,
    price: 3,
    calories: 2,
    featured: false,
    image: localAsset('dish-tea.webp'),
    nameEn: 'Tea',
    nameAr: 'شاهي تلقيمة',
    descriptionEn: 'Traditional Saudi tea',
    descriptionAr: 'شاهي سعودي تقليدي',
    categoryName: 'Drinks'
  },
  {
    order: 66,
    price: 20,
    calories: 220,
    featured: false,
    image: localAsset('dish-tea.webp'),
    nameEn: 'Arabic Coffee Pot with Dates',
    nameAr: 'دلة مع التمر',
    descriptionEn: 'Traditional dallah of qahwa served with premium dates',
    descriptionAr: 'دلة قهوة عربية تقدم مع أجود أنواع التمر',
    categoryName: 'Drinks'
  },
  {
    order: 67,
    price: 10,
    calories: 560,
    featured: true,
    image: localAsset('photo-breakfast-spread-1.webp'),
    nameEn: 'Kunafa',
    nameAr: 'كنافة',
    descriptionEn: 'Crisp shredded pastry with cheese and syrup',
    descriptionAr: 'كنافة مقرمشة بالجبن والقطر',
    categoryName: 'Desserts'
  },
  {
    order: 68,
    price: 10,
    calories: 290,
    featured: false,
    image: localAsset('photo-breakfast-spread-1.webp'),
    nameEn: 'Crème Caramel',
    nameAr: 'كريم كراميل',
    descriptionEn: 'Silky caramel custard dessert',
    descriptionAr: 'حلا الكريم كرميل الحريري',
    categoryName: 'Desserts'
  },
  {
    order: 69,
    price: 30,
    calories: 580,
    featured: false,
    image: localAsset('photo-najdi-breakfast-table.webp'),
    nameEn: 'Mabthoutha Janoubia',
    nameAr: 'مبثوثة جنوبية',
    descriptionEn: 'Traditional southern-style bread and meat mash',
    descriptionAr: 'طبق تقليدي من الخبز واللحم المهروس على الطريقة الجنوبية',
    categoryName: 'Traditional Dishes'
  },
  {
    order: 70,
    price: 30,
    calories: 520,
    featured: false,
    image: localAsset('photo-najdi-breakfast-table.webp'),
    nameEn: 'Thareef Dakhn',
    nameAr: 'ثريف دخن',
    descriptionEn: 'Traditional millet thareef bread dish',
    descriptionAr: 'طبق ثريد تقليدي من خبز الدخن',
    categoryName: 'Traditional Dishes'
  },
  {
    order: 71,
    price: 20,
    calories: 450,
    featured: false,
    image: localAsset('photo-sadu-interior.jpg'),
    nameEn: 'Masabib',
    nameAr: 'مصابيب',
    descriptionEn: 'Traditional Saudi pancake-style bread',
    descriptionAr: 'طبق مصابيب تقليدي، فطائر سعودية',
    categoryName: null
  },
  {
    order: 72,
    price: 9,
    calories: 280,
    featured: false,
    image: localAsset('photo-sadu-interior.jpg'),
    nameEn: 'Hummus',
    nameAr: 'حمص',
    descriptionEn: 'A creamy, savory dip made from blended chickpeas, tahini, lemon juice, and garlic.',
    descriptionAr: 'غموس كريمي لذيذ مصنوع من الحمص المهروس، الطحينة، عصير الليمون، والثوم',
    categoryName: null
  },
  {
    order: 73,
    price: 9,
    calories: 220,
    featured: false,
    image: localAsset('photo-sadu-interior.jpg'),
    nameEn: 'Mutabbal',
    nameAr: 'متبل',
    descriptionEn: 'A smoky, creamy dip made from roasted eggplant, tahini, yogurt, and garlic.',
    descriptionAr: 'غموس كريمي بنكهة مدخنة مصنوع من الباذنجان المشوي، الطحينة، اللبن، والثوم',
    categoryName: null
  },
  {
    order: 74,
    price: 9,
    calories: 180,
    featured: false,
    image: localAsset('photo-sadu-interior.jpg'),
    nameEn: 'Baba Ghanouj',
    nameAr: 'بابا غنوج',
    descriptionEn: 'A smoky, chunky dip made from roasted eggplant, tomatoes, bell peppers, onions, and pomegranate molasses',
    descriptionAr: 'مقبلات شهية بقوام خشن ونكهة مدخنة مصنوعة من الباذنجان المشوي، الطماطم، الفلفل، البصل، ودبس الرمان',
    categoryName: null
  },
  {
    order: 75,
    price: 10,
    calories: 240,
    featured: false,
    image: localAsset('photo-sadu-interior.jpg'),
    nameEn: 'Stuffed Wine Leaves',
    nameAr: 'ورق عنب',
    descriptionEn: 'Tender vine leaves stuffed with a savory mixture of rice, fresh herbs, and warm spices.',
    descriptionAr: 'ورق عنب طري محشي بمزيج شهي من الأرز، الأعشاب الطازجة، والبهارات الدافئة',
    categoryName: null
  },
  {
    order: 76,
    price: 15,
    calories: 180,
    featured: false,
    image: localAsset('photo-sadu-interior.jpg'),
    nameEn: 'Samdan Salad',
    nameAr: 'سلطة سمدان',
    descriptionEn: 'Crisp seasonal green salad',
    descriptionAr: 'سلطة خضراء طازجة',
    categoryName: null
  },
  {
    order: 77,
    price: 10,
    calories: 90,
    featured: false,
    image: localAsset('photo-sadu-interior.jpg'),
    nameEn: 'Home Salad',
    nameAr: 'سلطة البيت',
    descriptionEn: 'Crisp seasonal green salad',
    descriptionAr: 'سلطة خضراء طازجة',
    categoryName: null
  },
  {
    order: 78,
    price: 8,
    calories: 180,
    featured: false,
    image: localAsset('photo-sadu-interior.jpg'),
    nameEn: 'Tabbouleh',
    nameAr: 'تبوله',
    descriptionEn: 'A refreshing, herb-forward salad made with finely chopped parsley, mint, tomatoes, bulgur, and a zesty lemon-olive oil dressing.',
    descriptionAr: 'سلطة منعشة وغنية بالأعشاب مصنوعة من البقدونس المفروم فرماً ناعماً، النعناع، الطماطم، البرغل، وتتبيلة الليمون وزيت الزيتون',
    categoryName: null
  },
  {
    order: 0,
    price: 4,
    calories: undefined,
    featured: false,
    image: localAsset('photo-hummus-meat.webp'),
    nameEn: 'Hummus',
    nameAr: 'حمص',
    descriptionEn: 'Additional item with breakfast',
    descriptionAr: 'عنصر إضافي مع وجبة الإفطار',
    categoryName: 'Add-ons'
  },
  {
    order: 0,
    price: 4,
    calories: undefined,
    featured: false,
    image: localAsset('photo-hummus-meat.webp'),
    nameEn: 'Cheese',
    nameAr: 'جبن',
    descriptionEn: 'Additional item with breakfast',
    descriptionAr: 'عنصر إضافي مع وجبة الإفطار',
    categoryName: 'Add-ons'
  }
];

const carouselSlides = [
  {
    order: 1,
    isActive: true,
    image: localAsset('photo-riyadh-skyline.jpg'),
    badgeEn: 'Now Open',
    titleEn: 'Now Open in Riyadh',
    subtitleEn: 'Join us today — the doors are open and the kitchen is ready to welcome you.',
    badgeAr: 'افتتحنا الآن',
    titleAr: 'افتتحنا الآن في الرياض',
    subtitleAr: 'انضموا إلينا اليوم — الأبواب مفتوحة والمطبخ جاهز لاستقبالكم.'
  },
  {
    order: 2,
    isActive: true,
    image: localAsset('dish-kabda-baladi.webp'),
    badgeEn: 'Signature Dish',
    titleEn: 'Lamb Kabsa',
    subtitleEn: 'Tender lamb slow-cooked with heirloom spices over saffron rice.',
    badgeAr: 'طبق مميز',
    titleAr: 'كبسة لحم',
    subtitleAr: 'لحم ضأن طري مطهو ببطء مع بهارات تراثية فوق أرز الزعفران.'
  },
  {
    order: 3,
    isActive: true,
    image: localAsset('photo-nawashef.webp'),
    badgeEn: "Chef's Pick",
    titleEn: 'Hejazi Mandi',
    subtitleEn: 'Slow-roasted lamb with smoky flavors and crispy fried onions.',
    badgeAr: 'اختيار الشيف',
    titleAr: 'مندي حجازي',
    subtitleAr: 'لحم ضأن مشوي ببطء بنكهات مدخنة وبصل مقرمش.'
  }
];

const MAP_QUERY = 'Khalid bin Al Waleed Street, Qurtubah, Riyadh, Saudi Arabia';

const branches = [
  {
    order: 1,
    nameEn: 'SAMDAN — Qurtubah',
    nameAr: 'سمدان - قرطبة',
    locationEn: 'Saeed bin Zaid Street, Qurtubah, Riyadh, Saudi Arabia',
    locationAr: 'طريق سعيد بن زيد، قرطبة، الرياض، المملكة العربية السعودية',
    hoursEn: '24 Hours | Daily',
    hoursAr: 'مفتوح 24 ساعة يومياً',
    image: localAsset('photo-najdi-architecture.jpg'),
    mapsLink: `https://maps.google.com/?q=${encodeURIComponent(MAP_QUERY)}`
  }
];

const galleryImages = [
  { order: 1, image: localAsset('photo-najdi-architecture.jpg'), captionEn: 'Najdi Architecture', captionAr: 'العمارة النجدية' },
  { order: 2, image: localAsset('photo-sadu-interior.jpg'), captionEn: 'Sadu-Inspired Interior', captionAr: 'الديكور المستوحى من السدو' },
  { order: 3, image: localAsset('photo-riyadh-skyline.jpg'), captionEn: 'SAMDAN, Riyadh', captionAr: 'سمدان، الرياض' },
  { order: 4, image: localAsset('photo-nawashef.webp'), captionEn: 'Hejazi Mandi', captionAr: 'مندي حجازي' },
  { order: 5, image: localAsset('dish-kabda-baladi.webp'), captionEn: 'Lamb Kabsa', captionAr: 'كبسة لحم' },
  { order: 6, image: localAsset('photo-najdi-breakfast-table.webp'), captionEn: 'Kabsa Mashawi', captionAr: 'كبسة مشاوي' },
  { order: 7, image: localAsset('photo-breakfast-spread-1.webp'), captionEn: 'Saleeg', captionAr: 'سليق' },
  { order: 8, image: localAsset('dish-tea.webp'), captionEn: 'Arabic Coffee & Dates', captionAr: 'قهوة عربية وتمر' },
  { order: 9, image: localAsset('photo-hummus-meat.webp'), captionEn: 'Luqaimat', captionAr: 'لقيمات' }
];

module.exports = { items, categories: CATEGORIES, pageHeroes, carouselSlides, branches, galleryImages };
