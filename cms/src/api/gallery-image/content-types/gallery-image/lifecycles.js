'use strict';

module.exports = {
  async beforeCreate(event) {
    const [last] = await strapi.db.query('api::gallery-image.gallery-image').findMany({
      orderBy: { order: 'desc' },
      limit: 1
    });
    event.params.data.order = (last?.order || 0) + 1;
  }
};
