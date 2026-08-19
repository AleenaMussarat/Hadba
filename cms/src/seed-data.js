'use strict';

const path = require('path');

const img = (id, w = 800) => `https://images.unsplash.com/${id}?auto=format&fit=crop&w=${w}&q=70`;
// Local brand asset, copied into cms/public/brand so the seed script is
// self-contained and works when only the cms/ folder is deployed (e.g. Railway
// with Root Directory set to cms — it never sees the sibling frontend folder).
const localAsset = (filename) => path.join(__dirname, '..', 'public', 'brand', filename);

const IMAGES = {
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
  fattoush: img('photo-1540420773420-3366772f4999')
};

// Canonical menu categories — kept in sync with src/i18n/translations.jsx (CAT/CATEGORY_ORDER)
// on the frontend. seed.js creates these as real menu-category records (idempotent, by
// nameEn), then each seeded item below is linked to one via the real relation. Any category
// added later through the Strapi admin just becomes another row in the same collection.
const CATEGORIES = [
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
];

// Maps each MENU_ROWS category key below to its canonical category name above.
const CATEGORY_NAME_BY_KEY = {
  breakfast: 'Breakfast',
  traditional: 'Traditional Dishes',
  madhghoot: 'Madhghoot & Kabsa Barriya',
  goatHaneeth: 'Goat Haneeth',
  lambHaneeth: 'Camel Haneeth',
  chicken: 'Chicken',
  wholeLamb: 'Whole Lamb',
  riceSides: 'Rice',
  soupsPastries: 'Appetizers',
  sides: 'Sides',
  salads: 'Salads',
  drinks: 'Drinks',
  desserts: 'Desserts'
};

// Default hero content for each secondary page — seeded once as real menu-category-
// style records, then editable in Strapi like everything else. Home's hero already
// works via its own richer fallback in Hero.jsx and isn't seeded here.
const pageHeroes = [
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

// [en name, ar name, en desc, ar desc, category key, price, calories|null, imageKey, featured?]
const MENU_ROWS = [
  ['Kabda Baladi', 'كبدة بلدي', 'Sautéed local liver with onions and warm spices', 'كبدة طازجة سوتيه مع البصل والبهارات الدافئة', 'breakfast', '25', 420, 'margoog'],
  ['Muqalqal Lahm', 'مقلقل لحم', 'Pan-tossed beef with peppers, onion, and tomato', 'لحم مقلقل مع الفلفل والبصل والطماطم', 'breakfast', '30', 510, 'margoog'],
  ['Muqalqal Dajaj', 'مقلقل دجاج', 'Pan-tossed chicken with peppers and tomato', 'دجاج مقلقل مع الفلفل والطماطم', 'breakfast', '20', 430, 'chickenKabsa'],
  ['Nawashef', 'نواشف', 'Traditional dried-meat morning stew', 'طبق فطور تقليدي من اللحم المجفف', 'breakfast', '30', 540, 'margoog'],
  ['Homaisa', 'حميسة', 'Slow-simmered wheat and meat breakfast porridge', 'قمح مطهو ببطء مع اللحم، فطور تقليدي', 'breakfast', '27', 390, 'jarish'],
  ['Tuna', 'تونة', 'Fresh tuna breakfast plate with vegetables', 'طبق تونة طازج مع الخضار', 'breakfast', '15', 280, 'fattoush'],
  ['Shakshuka', 'شكشوكة', 'Eggs poached in a spiced tomato and pepper sauce', 'بيض مطهو في صلصة الطماطم والفلفل المتبلة', 'breakfast', '10', 330, 'margoog'],
  ['Lahsa', 'لحسة', 'Warm spiced flour porridge, a Najdi breakfast classic', 'عصيدة دقيق دافئة ومتبلة، طبق نجدي تقليدي', 'breakfast', '12', 350, 'jarish'],
  ['Fried Eggs', 'بيض عيون', 'Two eggs, sunny side up, with fresh bread', 'بيضتان مقليتان مع خبز طازج', 'breakfast', '10', 240, 'margoog'],
  ['Foul', 'فول', 'Slow-cooked fava beans with olive oil and spices', 'فول مدمس مطهو ببطء مع زيت الزيتون والبهارات', 'breakfast', '10', 360, 'margoog'],
  ['Qishta & Honey', 'قشطة وعسل', 'Clotted cream drizzled with natural honey', 'قشطة طازجة مغطاة بالعسل الطبيعي', 'breakfast', '20', 420, 'luqaimat'],

  ['Areeka Janoubia', 'عريكة جنوبية', 'Southern-style bread mash with meat and ghee', 'عريكة على الطريقة الجنوبية مع اللحم والسمن', 'traditional', '35', 690, 'jarish', true],
  ['Mashghoutha', 'مشغوثة', 'Traditional mashed bread and meat dish', 'طبق تقليدي من الخبز المهروس واللحم', 'traditional', '35', 610, 'margoog'],
  ['Fattah with Ghee & Honey', 'فتة بالسمن والعسل', 'Layered bread soaked in ghee and honey', 'خبز مطبق منقوع بالسمن والعسل', 'traditional', '20', 780, 'luqaimat'],
  ['Marasa', 'مرسة', 'Traditional Najdi bread and broth dish', 'طبق نجدي تقليدي من الخبز والمرق', 'traditional', '20', 480, 'jarish'],
  ['Maksaf', 'مكسف', 'Hearty traditional bread and meat mash', 'طبق تراثي دسم من الخبز واللحم المهروس', 'traditional', '20', 640, 'margoog'],
  ['Local Ghee', 'سمن بلدي', 'Pure traditional Saudi ghee', 'سمن بلدي أصيل', 'traditional', '9', 180, 'jarish'],
  ['Natural Honey', 'عسل طبيعي', 'Pure natural Saudi honey', 'عسل طبيعي سعودي خالص', 'traditional', '10', 95, 'luqaimat'],
  ['Radeefa', 'رضيفة', 'Traditional bread side', 'طبق خبز تقليدي', 'traditional', '6', 320, 'jarish'],

  ['Madhghoot Ghanam', 'مضغوط غنم', 'Rice slow-pressed with tender mutton and warm spices', 'أرز مضغوط ببطء مع لحم الغنم الطري والبهارات الدافئة', 'madhghoot', '95', 980, 'lambKabsa'],
  ['Madhghoot Hashi', 'مضغوط حاشي', 'Rice slow-pressed with tender lamb and warm spices', 'أرز مضغوط ببطء مع لحم الحاشي الطري والبهارات الدافئة', 'madhghoot', '75', 900, 'kabsaMashawi'],
  ['Arabic Madhghoot Ghanam', 'مضغوط عربي غنم', 'Arabic-style pressed rice with mutton', 'أرز مضغوط على الطريقة العربية مع لحم الغنم', 'madhghoot', '95', 1040, 'hejaziMandi'],
  ['Arabic Madhghoot Hashi', 'مضغوط عربي حاشي', 'Arabic-style pressed rice with lamb', 'أرز مضغوط على الطريقة العربية مع لحم الحاشي', 'madhghoot', '75', 950, 'hejaziSaleeg'],
  ['Kabsa Barriya Ghanam', 'كبسة بريه غنم', 'Open-fire Bedouin-style kabsa with mutton', 'كبسة بريّة على الفحم مع لحم الغنم', 'madhghoot', '95', 950, 'lambKabsa'],
  ['Kabsa Barriya Hashi', 'كبسة بريه حاشي', 'Open-fire Bedouin-style kabsa with lamb', 'كبسة بريّة على الفحم مع لحم الحاشي', 'madhghoot', '75', 870, 'kabsaMashawi'],

  ['Nafar Haneeth Mathloutha', 'نفر تيس حنيذ مثلوثة', 'Individual slow-roasted goat haneeth over spiced rice', 'حنيذ تيس فردي مطهو ببطء فوق أرز متبل', 'goatHaneeth', '100', 2467, 'hejaziMandi', true],
  ['Nafar Haneeth Saleeg', 'نفر تيس حنيذ سليق', 'Individual goat haneeth served with creamy saleeg rice', 'حنيذ تيس فردي يقدم مع أرز السليق الكريمي', 'goatHaneeth', '95', 2467, 'saleeg'],
  ['Nafar Haneeth Shaabi', 'نفر تيس حنيذ شعبي', 'Individual goat haneeth, traditional folk style', 'حنيذ تيس فردي على الطريقة الشعبية', 'goatHaneeth', '95', 2467, 'hejaziMandi'],
  ['Nafar Haneeth Bashawer', 'نفر تيس حنيذ بشاور', 'Individual goat haneeth with bashawer-style rice', 'حنيذ تيس فردي مع أرز على طريقة البشاور', 'goatHaneeth', '95', 2467, 'kabsaMashawi'],
  ['Quarter Goat Haneeth', 'ربع تيس حنيذ', 'Slow-roasted quarter goat haneeth — serves 2–3', 'ربع تيس حنيذ مطهو ببطء - يكفي ٢-٣ أشخاص', 'goatHaneeth', '380', 9870, 'hejaziMandi'],
  ['Half Goat Haneeth', 'نصف تيس حنيذ', 'Slow-roasted half goat haneeth — serves 4–6', 'نصف تيس حنيذ مطهو ببطء - يكفي ٤-٦ أشخاص', 'goatHaneeth', '760', 20350, 'hejaziMandi', true],
  ['Whole Goat Haneeth', 'تيس كامل حنيذ', 'Slow-roasted whole goat haneeth — serves 8–10', 'تيس كامل حنيذ مطهو ببطء - يكفي ٨-١٠ أشخاص', 'goatHaneeth', '1520', 40750, 'hejaziMandi'],

  ['Hashi Haneeth Mathloutha', 'حاشي حنيذ مثلوثة', 'Individual slow-roasted lamb haneeth over spiced rice', 'حنيذ حاشي فردي مطهو ببطء فوق أرز متبل', 'lambHaneeth', '80', 780, 'lambKabsa'],
  ['Hashi Haneeth Saleeg', 'حاشي حنيذ سليق', 'Individual lamb haneeth served with creamy saleeg rice', 'حنيذ حاشي فردي يقدم مع أرز السليق الكريمي', 'lambHaneeth', '75', 720, 'saleeg'],
  ['Hashi Haneeth Shaabi', 'حاشي حنيذ شعبي', 'Individual lamb haneeth, traditional folk style', 'حنيذ حاشي فردي على الطريقة الشعبية', 'lambHaneeth', '75', 650, 'lambKabsa'],
  ['Hashi Haneeth Bashawer', 'حاشي حنيذ بشاور', 'Individual lamb haneeth with bashawer-style rice', 'حنيذ حاشي فردي مع أرز على طريقة البشاور', 'lambHaneeth', '75', 760, 'kabsaMashawi'],

  ['Whole Chicken (Madhbi-Haneeth)', 'حبة دجاج (مضبي - حنيذ)', 'Whole chicken, roasted or Madhbi-style, over spiced rice', 'دجاجة كاملة مشوية أو مضبي فوق أرز متبل', 'chicken', '50', 2625, 'chickenKabsa'],
  ['Half Chicken (Madhbi-Haneeth)', 'نصف دجاج (مضبي - حنيذ)', 'Half chicken, roasted or Madhbi-style, over spiced rice', 'نصف دجاجة مشوية أو مضبي فوق أرز متبل', 'chicken', '25', 1313, 'hejaziSaleeg'],

  ['Quarter Lamb', 'ربع ذبيحة', 'Quarter raw lamb, butchered to order — serves 2–3', 'ربع ذبيحة نيّة حسب الطلب - يكفي ٢-٣ أشخاص', 'wholeLamb', '350', null, 'lambKabsa'],
  ['Half Lamb', 'نص ذبيحة', 'Half raw lamb, butchered to order — serves 4–6', 'نصف ذبيحة نيّة حسب الطلب - يكفي ٤-٦ أشخاص', 'wholeLamb', '700', null, 'lambKabsa'],
  ['Whole Lamb', 'ذبيحة كاملة', 'Whole raw lamb, butchered to order — serves 8–10', 'ذبيحة كاملة نيّة حسب الطلب - يكفي ٨-١٠ أشخاص', 'wholeLamb', '1400', null, 'lambKabsa'],

  ['Rice Bashawer', 'رز بشاور', 'Fragrant bashawer-style rice', 'أرز على طريقة البشاور العطر', 'riceSides', '10', null, 'jarish'],
  ['Rice Shaabi', 'رز شعبي', 'Traditional folk-style rice', 'أرز على الطريقة الشعبية', 'riceSides', '10', null, 'saleeg'],
  ['Sahn Qasdeer (Medium)', 'صحن قصدير وسط', 'Medium tin-plate rice portion', 'صحن قصدير أرز - حجم وسط', 'riceSides', '6', null, 'jarish'],
  ['Sahn Qasdeer (Large)', 'صحن قصدير كبير', 'Large tin-plate rice portion', 'صحن قصدير أرز - حجم كبير', 'riceSides', '10', null, 'saleeg'],

  ['Samdan Soup', 'شوربة سمدان', 'Our signature house soup', 'شوربتنا المميزة الخاصة بسمدان', 'soupsPastries', '5', 180, 'margoog'],
  ['Meat Samosa', 'سمبوسة لحم', 'Crisp pastry filled with spiced meat', 'سمبوسة مقرمشة محشوة باللحم المتبل', 'soupsPastries', '3', 130, 'mutabbaq'],

  ['Jareesh (Side)', 'جريش', 'Cracked wheat side, simmered with spices', 'جريش جانبي مطهو مع البهارات', 'sides', '10', 577, 'jarish'],
  ['Qursan', 'قرصان', 'Traditional layered bread side', 'خبز مطبق تقليدي', 'sides', '10', 447, 'mutabbaq'],
  ['Musaqqaa', 'مسقعة', 'Sautéed vegetable and meat side', 'خضار ولحم سوتيه', 'sides', '10', 543, 'margoog'],
  ['Bamia Lahm', 'بامية لحم', 'Okra stewed with tender meat', 'بامية مطهوة مع اللحم الطري', 'sides', '15', 340, 'margoog'],
  ['Mulukhiyah', 'ملوخية', 'Traditional jute-leaf stew', 'طبق الملوخية التقليدي', 'sides', '10', 116, 'margoog'],
  ['Vegetable Idam', 'ايدام خضار', 'Mixed vegetable stew', 'إيدام خضار مشكل', 'sides', '10', 190, 'margoog'],
  ['Southern Bread', 'خبز جنوبي', 'Fresh-baked traditional southern bread', 'خبز جنوبي طازج تقليدي', 'sides', '5', 260, 'jarish'],

  ['Green Salad', 'سلطة خضراء', 'Crisp seasonal green salad', 'سلطة خضراء طازجة', 'salads', '10', 90, 'fattoush'],
  ['Laban Khiyar', 'لبن خيار', 'Cucumber and yogurt salad', 'سلطة اللبن والخيار', 'salads', '10', 120, 'fattoush'],
  ['Samtara', 'سمطرة', 'Traditional Saudi vegetable salad', 'سلطة سعودية تقليدية', 'salads', '4', 170, 'fattoush'],
  ['Spicy Salad', 'سلطة حارة', 'Chopped salad with a spiced dressing', 'سلطة مفرومة مع تتبيلة حارة', 'salads', '0', 70, 'fattoush'],
  ['Tahini', 'طحينية', 'Traditional sesame tahini dip', 'طحينة تقليدية', 'salads', '0', 180, 'fattoush'],

  ['Laban Samdan', 'لبن سمدان', 'Our house-style traditional buttermilk', 'لبن سمدان التقليدي الخاص بنا', 'drinks', '5', 160, 'coffeeDates'],
  ['Soft Drink', 'مشروب غازي', 'Assorted soft drinks', 'مشروبات غازية متنوعة', 'drinks', '4', 132, 'coffeeDates'],
  ['Al-Qarya Laban', 'لبن القرية', 'Chilled traditional laban', 'لبن القرية بارد', 'drinks', '4', 175, 'coffeeDates'],
  ['Almarai Laban', 'لبن مراعي', 'Chilled Almarai laban', 'لبن مراعي بارد', 'drinks', '2', 120, 'coffeeDates'],
  ['Water', 'ماء', 'Bottled water', 'مياه معدنية', 'drinks', '1', 0, 'coffeeDates'],
  ['Tea', 'شاهي تلقيمة', 'Traditional Saudi tea', 'شاهي سعودي تقليدي', 'drinks', '3', 2, 'coffeeDates'],
  ['Arabic Coffee Pot with Dates', 'دلة مع التمر', 'Traditional dallah of qahwa served with premium dates', 'دلة قهوة عربية تقدم مع أجود أنواع التمر', 'drinks', '20', 220, 'coffeeDates'],

  ['Kunafa', 'كنافة', 'Crisp shredded pastry with cheese and syrup', 'كنافة مقرمشة بالجبن والقطر', 'desserts', '10', 560, 'luqaimat', true],
  ['Crème Caramel', 'كريم كراميل', 'Silky caramel custard dessert', 'حلا كريم كراميل الحريري', 'desserts', '10', 290, 'luqaimat']
];

const items = MENU_ROWS.map(([enName, arName, enDesc, arDesc, catKey, price, calories, imageKey, featured], index) => ({
  order: index + 1,
  price,
  calories: calories || undefined,
  featured: !!featured,
  image: IMAGES[imageKey],
  nameEn: enName,
  nameAr: arName,
  descriptionEn: enDesc,
  descriptionAr: arDesc,
  categoryName: CATEGORY_NAME_BY_KEY[catKey]
}));

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
    image: IMAGES.lambKabsa,
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
    image: IMAGES.hejaziMandi,
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
    locationEn: 'Khalid bin Al Waleed Street, Qurtubah, Riyadh, Saudi Arabia',
    locationAr: 'شارع خالد بن الوليد، قرطبة، الرياض، المملكة العربية السعودية',
    hoursEn: 'Daily 12:00 PM – 12:00 AM',
    hoursAr: 'يومياً ١٢:٠٠ ظهراً - ١٢:٠٠ منتصف الليل',
    image: localAsset('photo-najdi-architecture.jpg'),
    mapsLink: `https://maps.google.com/?q=${encodeURIComponent(MAP_QUERY)}`
  }
];

const galleryImages = [
  { order: 1, image: localAsset('photo-najdi-architecture.jpg'), captionEn: 'Najdi Architecture', captionAr: 'العمارة النجدية' },
  { order: 2, image: localAsset('photo-sadu-interior.jpg'), captionEn: 'Sadu-Inspired Interior', captionAr: 'الديكور المستوحى من السدو' },
  { order: 3, image: localAsset('photo-riyadh-skyline.jpg'), captionEn: 'SAMDAN, Riyadh', captionAr: 'سمدان، الرياض' },
  { order: 4, image: IMAGES.hejaziMandi, captionEn: 'Hejazi Mandi', captionAr: 'مندي حجازي' },
  { order: 5, image: IMAGES.lambKabsa, captionEn: 'Lamb Kabsa', captionAr: 'كبسة لحم' },
  { order: 6, image: IMAGES.kabsaMashawi, captionEn: 'Kabsa Mashawi', captionAr: 'كبسة مشاوي' },
  { order: 7, image: IMAGES.saleeg, captionEn: 'Saleeg', captionAr: 'سليق' },
  { order: 8, image: IMAGES.coffeeDates, captionEn: 'Arabic Coffee & Dates', captionAr: 'قهوة عربية وتمر' },
  { order: 9, image: IMAGES.luqaimat, captionEn: 'Luqaimat', captionAr: 'لقيمات' }
];

module.exports = { items, categories: CATEGORIES, pageHeroes, carouselSlides, branches, galleryImages };