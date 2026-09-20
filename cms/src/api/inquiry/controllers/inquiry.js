'use strict';

const { createCoreController } = require('@strapi/strapi').factories;

const escapeHtml = (value) =>
  String(value)
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#39;');

// "12:00:00.000" -> "12:00"
const formatTime = (time) => (time ? String(time).slice(0, 5) : '');

const reservationFields = (payload) => [
  ['Name', payload.name],
  ['Phone', payload.phone],
  ['Guests', payload.guests],
  ['Date', payload.date],
  ['Time', formatTime(payload.time)],
  ['Notes', payload.notes],
];

// Plain-text fallback for mail clients that don't render HTML.
const buildReservationText = (payload) =>
  ['New reservation inquiry', '', ...reservationFields(payload).map(([label, value]) => `${label}: ${value || 'N/A'}`)].join('\n');

// Table-based layout with inline styles only — the one format every mail
// client (Gmail, Outlook, Apple Mail) renders consistently. Every guest-
// supplied value is escaped; dir="auto" lets Arabic names/notes align RTL
// while English ones stay LTR within the same row.
const buildReservationHtml = (payload) => {
  const rows = reservationFields(payload)
    .map(([label, value], index) => {
      const shown = value ? escapeHtml(value) : '<span style="color:#9a8f85;">N/A</span>';
      const content =
        label === 'Phone' && value
          ? `<a href="tel:${escapeHtml(String(value).replace(/\s+/g, ''))}" style="color:#BC3433;text-decoration:none;">${shown}</a>`
          : shown;
      const background = index % 2 === 0 ? '#ffffff' : '#faf6f1';
      return `<tr style="background:${background};">
        <td style="padding:14px 20px;width:130px;font-size:13px;font-weight:600;color:#8c7c6a;text-transform:uppercase;letter-spacing:0.5px;border-bottom:1px solid #eee6dc;vertical-align:top;">${label}</td>
        <td dir="auto" style="padding:14px 20px;font-size:16px;color:#221910;border-bottom:1px solid #eee6dc;white-space:pre-wrap;">${content}</td>
      </tr>`;
    })
    .join('');

  return `<!DOCTYPE html>
<html>
<body style="margin:0;padding:0;background:#f3ece3;font-family:Segoe UI,Tahoma,Arial,sans-serif;">
  <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="background:#f3ece3;padding:32px 12px;">
    <tr><td align="center">
      <table role="presentation" width="560" cellpadding="0" cellspacing="0" style="max-width:560px;width:100%;background:#ffffff;border-radius:12px;overflow:hidden;box-shadow:0 4px 18px rgba(34,25,16,0.10);">
        <tr><td style="background:#BC3433;padding:28px 24px;text-align:center;">
          <div style="font-size:26px;font-weight:700;color:#ffffff;letter-spacing:1px;">SAMDAN</div>
          <div style="font-size:14px;color:#ffd9a0;margin-top:6px;">New Reservation Inquiry</div>
        </td></tr>
        <tr><td style="padding:24px 24px 8px;font-size:15px;color:#5c4f3f;">
          A guest just submitted a reservation request through the website.
        </td></tr>
        <tr><td style="padding:8px 24px 24px;">
          <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="border:1px solid #eee6dc;border-radius:8px;overflow:hidden;border-collapse:separate;">
            ${rows}
          </table>
        </td></tr>
        <tr><td style="background:#faf6f1;padding:16px 24px;text-align:center;font-size:12px;color:#8c7c6a;">
          Sent automatically by the SAMDAN website. You can also review this inquiry in the CMS.
        </td></tr>
      </table>
    </td></tr>
  </table>
</body>
</html>`;
};

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

    const recipient = process.env.RESERVATION_EMAIL_TO || 'smdn.ksa@gmail.com';
    const sender = process.env.SMTP_FROM || 'smdn.ksa@gmail.com';

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
        from: sender,
        subject: `New reservation inquiry from ${payload.name || 'Guest'}`,
        text: buildReservationText(payload),
        html: buildReservationHtml(payload),
      });
    } catch (emailError) {
      strapi.log.error('Reservation email failed to send:', emailError);
    }

    return created;
  },
}));
