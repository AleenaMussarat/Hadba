'use strict';

const os = require('os');
const fs = require('fs');
const path = require('path');
const crypto = require('crypto');
const { items, categories, pageHeroes, carouselSlides, branches, galleryImages } = require('./seed-data');

async function downloadToTemp(url) {
  const res = await fetch(url);
  const buffer = Buffer.from(await res.arrayBuffer());
  const tmpPath = path.join(os.tmpdir(), `samdan-seed-${crypto.randomUUID()}.jpg`);
  fs.writeFileSync(tmpPath, buffer);
  return tmpPath;
}

async function uploadImage(strapi, source, name) {
  const isUrl = /^https?:\/\//.test(source);
  const filepath = isUrl ? await downloadToTemp(source) : source;
  const stats = fs.statSync(filepath);
  try {
    const [file] = await strapi.plugin('upload').service('upload').upload({
      data: {},
      files: {
        filepath,
        originalFilename: name,
        mimetype: 'image/jpeg',
        size: stats.size
      }
    });
    return file;
  } finally {
    // Only clean up downloaded temp files — never delete a source asset from public/brand.
    if (isUrl) fs.unlinkSync(filepath);
  }
}

async function ensureArabicLocale(strapi) {
  const locales = await strapi.plugin('i18n').service('locales').find();
  if (!locales.some((l) => l.code === 'ar')) {
    await strapi.plugin('i18n').service('locales').create({
      code: 'ar',
      name: 'Arabic (ar)',
      isDefault: false
    });
  }
}

async function setPublicPermissions(strapi) {
  const publicRole = await strapi
    .query('plugin::users-permissions.role')
    .findOne({ where: { type: 'public' } });

  const actions = [
    'api::menu-item.menu-item.find',
    'api::menu-item.menu-item.findOne',
    'api::menu-category.menu-category.find',
    'api::menu-category.menu-category.findOne',
    'api::page-hero.page-hero.find',
    'api::page-hero.page-hero.findOne',
    'api::carousel-slide.carousel-slide.find',
    'api::carousel-slide.carousel-slide.findOne',
    'api::branch.branch.find',
    'api::branch.branch.findOne',
    'api::gallery-image.gallery-image.find',
    'api::gallery-image.gallery-image.findOne',
    'api::site-setting.site-setting.find',
    // Create-only — the public can submit an inquiry but never list/read
    // other people's submissions back out through the API.
    'api::inquiry.inquiry.create'
  ];

  for (const action of actions) {
    const existing = await strapi
      .query('plugin::users-permissions.permission')
      .findOne({ where: { action, role: publicRole.id } });

    if (!existing) {
      await strapi.query('plugin::users-permissions.permission').create({
        data: { action, role: publicRole.id }
      });
    }
  }
}

// Idempotent per category (matched by nameEn) so it also backfills any category
// missing from an already-seeded instance, not just a completely empty one.
async function seedMenuCategories(strapi) {
  const categoryMap = {};

  for (const category of categories) {
    let record = await strapi.db.query('api::menu-category.menu-category').findOne({
      where: { nameEn: category.nameEn }
    });

    if (!record) {
      record = await strapi.db.query('api::menu-category.menu-category').create({ data: category });
      strapi.log.info(`[seed] Created menu category: ${category.nameEn}`);
    }

    categoryMap[category.nameEn] = record.id;
  }

  // Backfill displayLabel for every category (canonical + any added manually in the
  // admin), since records created before the lifecycle hook existed won't have it set.
  const allCategories = await strapi.db.query('api::menu-category.menu-category').findMany();
  for (const record of allCategories) {
    const displayLabel = [record.nameEn, record.nameAr].filter(Boolean).join(' / ');
    if (record.displayLabel !== displayLabel) {
      await strapi.db.query('api::menu-category.menu-category').update({
        where: { id: record.id },
        data: { displayLabel }
      });
    }
  }

  return categoryMap;
}

// Idempotent single-row seed — creates the record once from the site's current
// static values so nothing changes on the live site until an admin edits it.
async function seedSiteSettings(strapi) {
  const existing = await strapi.db.query('api::site-setting.site-setting').findOne();
  if (existing) {
    strapi.log.info('[seed] Site settings already present — skipping.');
    return;
  }

  await strapi.documents('api::site-setting.site-setting').create({
    data: {
      taglineEn: 'Authentic Experience... With A Modern Spirit',
      taglineAr: 'تجربة أصيلة…<br /> بروح معاصرة',
      addressEn: 'Saeed bin Zaid Street, Qurtubah, Riyadh, Saudi Arabia',
      addressAr: 'طريق سعيد بن زيد، قرطبة، الرياض، المملكة العربية السعودية',
      phone: '+966 55 518 5657 | +966 53 334 7721',
      email: 'smdn.ksa@gmail.com',
      hoursEn: '24 Hours Daily',
      hoursAr: 'مفتوح 24 ساعة يومياً',
      instagramUrl: 'https://www.instagram.com/smdn.ksa/',
      xUrl: 'https://x.com/smdnksa',
      snapchatUrl: 'https://snapchat.com/t/eJEGJY7M',
      tiktokUrl: 'https://www.tiktok.com/@smdn.ksa',
      facebookUrl: 'https://www.facebook.com/profile.php?id=61592403342115',
      whatsappUrl: 'https://wa.me/966555185657'
    }
  });
  strapi.log.info('[seed] Created site settings.');
}

async function seedPageHeroes(strapi) {
  for (const hero of pageHeroes) {
    const existing = await strapi.db.query('api::page-hero.page-hero').findOne({
      where: { pageKey: hero.pageKey }
    });

    if (existing) continue;

    const media = await uploadImage(strapi, hero.image, `page-hero-${hero.pageKey}.jpg`);

    await strapi.documents('api::page-hero.page-hero').create({
      data: {
        pageKey: hero.pageKey,
        titleEn: hero.titleEn,
        titleAr: hero.titleAr,
        subtitleEn: hero.subtitleEn,
        subtitleAr: hero.subtitleAr,
        backgroundImage: media.id
      }
    });
    strapi.log.info(`[seed] Created page hero: ${hero.pageKey}`);
  }
}

module.exports = async function seed({ strapi }) {
  await setPublicPermissions(strapi);
  await ensureArabicLocale(strapi);
  const categoryMap = await seedMenuCategories(strapi);
  await seedPageHeroes(strapi);
  await seedSiteSettings(strapi);

  const existingItems = await strapi.documents('api::menu-item.menu-item').findMany();
  if (existingItems.length > 0) {
    strapi.log.info('[seed] Menu items already present — skipping.');
  } else {
    strapi.log.info('[seed] Seeding menu items...');
    for (const item of items) {
      const media = await uploadImage(strapi, item.image, `${item.nameEn}.jpg`);

      await strapi.documents('api::menu-item.menu-item').create({
        data: {
          nameEn: item.nameEn,
          nameAr: item.nameAr,
          descriptionEn: item.descriptionEn,
          descriptionAr: item.descriptionAr,
          price: item.price,
          calories: item.calories,
          featured: item.featured,
          image: media.id,
          menuCategory: categoryMap[item.categoryName]
        }
      });
    }
  }

  const existingSlides = await strapi.documents('api::carousel-slide.carousel-slide').findMany();
  if (existingSlides.length > 0) {
    strapi.log.info('[seed] Carousel slides already present — skipping.');
  } else {
    strapi.log.info('[seed] Seeding carousel slides...');
    for (const slide of carouselSlides) {
      const media = await uploadImage(strapi, slide.image, `carousel-${slide.order}.jpg`);

      await strapi.documents('api::carousel-slide.carousel-slide').create({
        data: {
          badgeEn: slide.badgeEn,
          titleEn: slide.titleEn,
          subtitleEn: slide.subtitleEn,
          badgeAr: slide.badgeAr,
          titleAr: slide.titleAr,
          subtitleAr: slide.subtitleAr,
          isActive: slide.isActive,
          image: media.id
        }
      });
    }
  }

  const existingBranches = await strapi.documents('api::branch.branch').findMany();
  if (existingBranches.length > 0) {
    strapi.log.info('[seed] Branches already present — skipping.');
  } else {
    strapi.log.info('[seed] Seeding branches...');
    for (const branch of branches) {
      const media = await uploadImage(strapi, branch.image, `branch-${branch.order}.jpg`);

      await strapi.documents('api::branch.branch').create({
        data: {
          nameEn: branch.nameEn,
          nameAr: branch.nameAr,
          locationEn: branch.locationEn,
          locationAr: branch.locationAr,
          hoursEn: branch.hoursEn,
          hoursAr: branch.hoursAr,
          mapsLink: branch.mapsLink,
          image: media.id
        }
      });
    }
  }

  const existingGalleryImages = await strapi.documents('api::gallery-image.gallery-image').findMany();
  if (existingGalleryImages.length > 0) {
    strapi.log.info('[seed] Gallery images already present — skipping.');
    strapi.log.info('[seed] Done.');
    return;
  }

  strapi.log.info('[seed] Seeding gallery images...');
  for (const galleryImage of galleryImages) {
    const media = await uploadImage(strapi, galleryImage.image, `gallery-${galleryImage.order}.jpg`);

    await strapi.documents('api::gallery-image.gallery-image').create({
      data: {
        captionEn: galleryImage.captionEn,
        captionAr: galleryImage.captionAr,
        image: media.id
      }
    });
  }

  strapi.log.info('[seed] Done.');
};