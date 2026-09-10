'use strict';

const seed = require('./seed');
const { backfillMissingImages } = require('./seed');

module.exports = {
  /**
   * An asynchronous register function that runs before
   * your application is initialized.
   *
   * This gives you an opportunity to extend code.
   */
  register(/*{ strapi }*/) {},

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
