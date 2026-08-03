'use strict';

const { ApplicationError } = require('@strapi/utils').errors;

const PASSWORD_MIN_LENGTH = 8;
// Secret sentinel used only by the one-off backfill script that records
// accounts which already existed before this table did — never something a
// real form submission would coincidentally type as a password.
const BACKFILL_MARKER = '__EXISTING_ACCOUNT_RECORD_ONLY__';

module.exports = {
  // Runs the moment you hit Save in the Content Manager. If anything below
  // throws, the row is never saved — no half-finished/orphaned entries.
  async beforeCreate(event) {
    const { data } = event.params;
    const { firstName, lastName, email, temporaryPassword, role } = data;

    if (temporaryPassword === BACKFILL_MARKER) {
      // Just a historical record of an account that already existed — skip
      // straight past every account-creation step below.
      event.params.data.temporaryPassword = '(pre-existing account, recorded for visibility only)';
      return;
    }

    if (!temporaryPassword || temporaryPassword.length < PASSWORD_MIN_LENGTH) {
      throw new ApplicationError(`Password must be at least ${PASSWORD_MIN_LENGTH} characters.`);
    }
    if (!/[a-zA-Z]/.test(temporaryPassword) || !/[0-9]/.test(temporaryPassword)) {
      throw new ApplicationError('Password must contain at least one letter and one number.');
    }

    const existingAdmin = await strapi.query('admin::user').findOne({ where: { email } });
    if (existingAdmin) {
      throw new ApplicationError(`An admin account with the email "${email}" already exists.`);
    }

    const adminRole = await strapi.query('admin::role').findOne({ where: { name: role } });
    if (!adminRole) {
      throw new ApplicationError(`Role "${role}" was not found in Settings > Roles.`);
    }

    try {
      await strapi.service('admin::user').create({
        firstname: firstName,
        lastname: lastName,
        email,
        password: temporaryPassword,
        roles: [adminRole.id],
        isActive: true
      });
    } catch (e) {
      throw new ApplicationError(`Couldn't create the account: ${e.message || 'unknown error'}`);
    }

    // The real account is already created above (with its own separate,
    // independently-salted hash in Strapi's admin_users table) — this row
    // never keeps the plaintext, only a one-way bcrypt hash of it, via the
    // same hashing service Strapi's own login uses. A hash can't be reversed
    // back into the original password, so this is a record that a password
    // was set, not a way to retrieve or reuse it.
    event.params.data.temporaryPassword = await strapi.service('admin::auth').hashPassword(temporaryPassword);
  }
};
