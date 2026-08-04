'use strict';

const os = require('os');
const fs = require('fs');
const path = require('path');
const crypto = require('crypto');
const { items, carouselSlides, branches, galleryImages } = require('./seed-data');

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
    'api::carousel-slide.carousel-slide.find',
    'api::carousel-slide.carousel-slide.findOne',
    'api::branch.branch.find',
    'api::branch.branch.findOne',
    'api::gallery-image.gallery-image.find',
    'api::gallery-image.gallery-image.findOne',
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

module.exports = async function seed({ strapi }) {
  await setPublicPermissions(strapi);
  await ensureArabicLocale(strapi);

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
          categoryEn: item.categoryEn,
          categoryAr: item.categoryAr,
          price: item.price,
          calories: item.calories,
          featured: item.featured,
          image: media.id
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
