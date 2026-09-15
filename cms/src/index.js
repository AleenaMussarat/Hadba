'use strict';

const { errors } = require('@strapi/utils');
const seed = require('./seed');
const { backfillMissingImages } = require('./seed');

// Media Library upload limits, specifically for images. `sizeLimit` in
// config/plugins.js already caps every upload provider-wide (10MB default,
// any file type) — this adds a smaller, image-only size cap plus min/max
// pixel dimensions, which Strapi has no built-in setting for at all. All
// five are overridable via env vars so they can be tuned without a code
// change. Defaults were picked to comfortably admit the seeded logo
// (4508x1644px, ~116KB — see cms/src/admin/assets/logo-red.png) while still
// rejecting the two real failure modes admins hit: a multi-megabyte photo
// straight off a phone, and a tiny icon-sized image stretched into a menu
// card.
const MAX_IMAGE_SIZE_KB = Number(process.env.UPLOAD_IMAGE_MAX_MB || 5) * 1024;
const MIN_IMAGE_WIDTH = Number(process.env.UPLOAD_IMAGE_MIN_WIDTH || 100);
const MIN_IMAGE_HEIGHT = Number(process.env.UPLOAD_IMAGE_MIN_HEIGHT || 100);
const MAX_IMAGE_WIDTH = Number(process.env.UPLOAD_IMAGE_MAX_WIDTH || 6000);
const MAX_IMAGE_HEIGHT = Number(process.env.UPLOAD_IMAGE_MAX_HEIGHT || 6000);

// Runs on every plugin::upload.file create/update (a fresh upload, or an
// admin replacing an existing asset's file). By the time this lifecycle
// fires, Strapi's upload provider has already read the file off disk and
// populated `data.width`/`data.height`/`data.size` — throwing here rejects
// the whole request before a row is written, so an oversized/undersized
// image never reaches the database or the persistent uploads folder.
const assertImageWithinLimits = (data) => {
  if (!data || typeof data.mime !== 'string' || !data.mime.startsWith('image/')) return;
  // SVGs are vector — no pixel dimensions, and providers don't always report
  // a meaningful size for them either. Nothing to check here.
  if (data.mime === 'image/svg+xml') return;

  if (typeof data.size === 'number' && data.size > MAX_IMAGE_SIZE_KB) {
    throw new errors.ApplicationError(
      `Image is too large (${(data.size / 1024).toFixed(1)}MB). Maximum allowed is ${(MAX_IMAGE_SIZE_KB / 1024).toFixed(0)}MB.`
    );
  }

  if (typeof data.width === 'number' && typeof data.height === 'number') {
    if (data.width < MIN_IMAGE_WIDTH || data.height < MIN_IMAGE_HEIGHT) {
      throw new errors.ApplicationError(
        `Image is too small (${data.width}x${data.height}px). Minimum allowed is ${MIN_IMAGE_WIDTH}x${MIN_IMAGE_HEIGHT}px.`
      );
    }
    if (data.width > MAX_IMAGE_WIDTH || data.height > MAX_IMAGE_HEIGHT) {
      throw new errors.ApplicationError(
        `Image is too large (${data.width}x${data.height}px). Maximum allowed is ${MAX_IMAGE_WIDTH}x${MAX_IMAGE_HEIGHT}px.`
      );
    }
  }
};

module.exports = {
  /**
   * An asynchronous register function that runs before
   * your application is initialized.
   *
   * This gives you an opportunity to extend code.
   */
  register({ strapi }) {
    strapi.db.lifecycles.subscribe({
      models: ['plugin::upload.file'],
      async beforeCreate(event) {
        assertImageWithinLimits(event.params.data);
      },
      async beforeUpdate(event) {
        assertImageWithinLimits(event.params.data);
      },
    });
  },

  /**
   * An asynchronous bootstrap function that runs before
   * your application gets started.
   *
   * This gives you an opportunity to set up your data model,
   * run jobs, or perform some special logic.
   */
  async bootstrap({ strapi }) {
    // Deliberately not awaited: bootstrap() blocks the HTTP server from
    // starting until it resolves, and seeding ~80 items with real images
    // (each generating multiple thumbnail sizes) takes tens of seconds even
    // with local files. On a host with a process startup timeout, that risks
    // the app being killed before it ever binds a port. Run seeding in the
    // background instead so the server starts listening immediately.
    seed({ strapi })
      .then(() => backfillMissingImages(strapi))
      .catch((err) => {
        strapi.log.error('[seed] Background seeding failed:', err);
      });
  },
};
