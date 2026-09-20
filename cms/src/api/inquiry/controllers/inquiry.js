'use strict';

const { createCoreController } = require('@strapi/strapi').factories;

module.exports = createCoreController('api::inquiry.inquiry', ({ strapi }) => ({
  async create(ctx) {
    const payload = ctx.request.body?.data || ctx.request.body || {};
    const dateValue = payload.date;

    if (dateValue) {
      const selectedDate = new Date(dateValue);
      const today = new Date();
      selectedDate.setHours(0, 0, 0, 0);
      today.setHours(0, 0, 0, 0);

      if (selectedDate.getTime() !== today.getTime()) {
        return ctx.badRequest('Bookings are only available for today.');
      }
    }

    const settings = await strapi.db.query('api::reservation-setting.reservation-setting').findOne({})
      .catch(() => null);
    const acceptingReservations = settings?.acceptingReservations ?? true;

    if (!acceptingReservations) {
      return ctx.forbidden('Sorry, bookings are full try another day');
    }

    const created = await super.create(ctx);

    const recipient = process.env.RESERVATION_EMAIL_TO || 'aleenamussarat@gmail.com';

    if (!process.env.SMTP_PASSWORD) {
      strapi.log.warn(
        'SMTP_PASSWORD is not set — reservation emails cannot be sent. Set it (a Gmail app password) in the host\'s environment variables.'
      );
    }

    // The service is named "email" (strapi.plugin('email').service('email')),
    // not "send" — looking up a service by the wrong name returns undefined
    // rather than throwing, which is how this used to be silently skipped on
    // every reservation. Awaited inside try/catch so a mail failure is logged
    // but never fails the guest's booking, which is already saved above.
    try {
      await strapi.plugin('email').service('email').send({
        to: recipient,
        from: process.env.SMTP_FROM || 'aleenamussarat@gmail.com',
        subject: `New reservation inquiry from ${payload.name || 'Guest'}`,
        text: [
          `Name: ${payload.name || 'N/A'}`,
          `Phone: ${payload.phone || 'N/A'}`,
          `Guests: ${payload.guests || 'N/A'}`,
          `Date: ${payload.date || 'N/A'}`,
          `Time: ${payload.time || 'N/A'}`,
          `Notes: ${payload.notes || 'N/A'}`,
        ].join('\n'),
      });
    } catch (emailError) {
      strapi.log.error('Reservation email failed to send:', emailError);
    }

    return created;
  },
}));
