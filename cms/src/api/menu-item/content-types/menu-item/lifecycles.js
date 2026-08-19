'use strict';

const computeDisplayLabel = (nameEn, nameAr) => [nameEn, nameAr].filter(Boolean).join(' / ');

module.exports = {
  async beforeCreate(event) {
    const { data } = event.params;
    data.displayLabel = computeDisplayLabel(data.nameEn, data.nameAr);
  },
  async beforeUpdate(event) {
    const { data, where } = event.params;
    if (data.nameEn === undefined && data.nameAr === undefined) return;

    const existing = await strapi.db.query('api::menu-category.menu-category').findOne({ where });
    data.displayLabel = computeDisplayLabel(
      data.nameEn ?? existing?.nameEn,
      data.nameAr ?? existing?.nameAr
    );
  }
};