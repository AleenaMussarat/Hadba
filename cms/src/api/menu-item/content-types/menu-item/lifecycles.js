'use strict';

// The "order" field is presented in the admin as a read-only "Id" column —
// staff never type it in; it's always the next number after the current max.
module.exports = {
  async beforeCreate(event) {
    const [last] = await strapi.db.query('api::menu-item.menu-item').findMany({
      orderBy: { order: 'desc' },
      limit: 1
    });
    event.params.data.order = (last?.order || 0) + 1;
  }
};
