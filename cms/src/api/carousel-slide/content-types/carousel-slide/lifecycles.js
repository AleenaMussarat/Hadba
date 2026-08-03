'use strict';

const { ApplicationError } = require('@strapi/utils').errors;

const MAX_ACTIVE_SLIDES = 5;

async function countActive(excludeId) {
  const where = { isActive: true };
  if (excludeId) where.id = { $ne: excludeId };
  return strapi.db.query('api::carousel-slide.carousel-slide').count({ where });
}

module.exports = {
  // The "order" field is presented in the admin as a read-only "Id" column —
  // staff never type it in; it's always the next number after the current max.
  async beforeCreate(event) {
    const [last] = await strapi.db.query('api::carousel-slide.carousel-slide').findMany({
      orderBy: { order: 'desc' },
      limit: 1
    });
    event.params.data.order = (last?.order || 0) + 1;

    if (event.params.data.isActive) {
      const activeCount = await countActive();
      if (activeCount >= MAX_ACTIVE_SLIDES) {
        throw new ApplicationError(`Maximum of ${MAX_ACTIVE_SLIDES} active carousel slides allowed. Deactivate an existing slide before activating another one.`);
      }
    }
  },

  async beforeUpdate(event) {
    if (event.params.data.isActive === true) {
      const targetId = event.params.where?.id;
      const activeCount = await countActive(targetId);
      if (activeCount >= MAX_ACTIVE_SLIDES) {
        throw new ApplicationError(`Maximum of ${MAX_ACTIVE_SLIDES} active carousel slides allowed. Deactivate an existing slide before activating another one.`);
      }
    }
  }
};
