'use strict';

// Entry point for hosts that run a persistent Node process from a single
// file (e.g. Hostinger's Node.js app type "express") instead of invoking
// the `strapi` CLI. Mirrors what `strapi start` itself does — see
// node_modules/@strapi/strapi/dist/src/cli/commands/start.js — since this
// isn't a TypeScript project, distDir is just appDir.
//
// Every path is resolved from __dirname rather than process.cwd(): the
// host's process supervisor decides the working directory it launches this
// file from, and that isn't guaranteed to be this file's own directory.
//
// Startup failures are logged explicitly and cause a non-zero exit instead
// of a silent hang, so a crash is visible in the host's process logs
// instead of just an empty log file.

const path = require('path');
const fs = require('fs');

process.on('uncaughtException', (err) => {
  console.error('[server.js] Uncaught exception:', err);
  process.exit(1);
});

process.on('unhandledRejection', (err) => {
  console.error('[server.js] Unhandled rejection:', err);
  process.exit(1);
});

// Persist uploaded media across deploys. Hostinger (and most PaaS) give each
// deploy a fresh directory tree, so the default <appDir>/public/uploads is
// wiped on every redeploy. When UPLOADS_PATH points at a directory OUTSIDE
// the deploy tree (e.g. /home/<user>/domains/<site>/persistent_uploads),
// symlink public/uploads to it so the local upload provider reads/writes the
// persistent location. No-op locally when UPLOADS_PATH is unset.
function linkPersistentUploads() {
  const target = process.env.UPLOADS_PATH;
  const localUploads = path.join(__dirname, 'public', 'uploads');

  if (!target) {
    // Loud on purpose: this is silent data loss waiting to happen — every
    // file uploaded in this state lives only in this deploy's ephemeral
    // tree and disappears on the next redeploy. It printed exactly this way
    // once before and went unnoticed until every uploaded image 404'd.
    console.warn(
      '[server.js] UPLOADS_PATH is not set — uploads are being stored inside ' +
        'this deploy tree and will NOT survive the next redeploy. Set ' +
        'UPLOADS_PATH to a persistent absolute path outside the app/deploy ' +
        'directory in the host\'s Node.js environment variables.'
    );
    fs.mkdirSync(localUploads, { recursive: true });
    return;
  }

  fs.mkdirSync(target, { recursive: true });

  let current = null;
  try {
    current = fs.lstatSync(localUploads);
  } catch (e) {
    // localUploads doesn't exist yet — fine
  }

  if (current) {
    if (current.isSymbolicLink() && fs.realpathSync(localUploads) === fs.realpathSync(target)) {
      console.log(`[server.js] uploads already linked -> ${target}`);
      return; // already linked to the right place
    }
    fs.rmSync(localUploads, { recursive: true, force: true });
  }

  fs.symlinkSync(target, localUploads, 'dir'); // type ignored on Linux

  // Confirm the link actually resolves and report what's already in it —
  // an empty count here means the persistent directory itself is empty
  // (wiped, wrong path, or never had anything written to it), not a
  // symlink problem, and is worth telling apart in the boot log.
  let fileCount = 'unknown';
  try {
    fileCount = fs.readdirSync(target).length;
  } catch (e) {
    console.warn(`[server.js] uploads target ${target} could not be read after linking: ${e.message}`);
  }
  console.log(`[server.js] uploads -> ${target} (${fileCount} existing file(s))`);
}

try {
  linkPersistentUploads();

  const { createStrapi } = require('@strapi/strapi');

  createStrapi({
    appDir: __dirname,
    distDir: __dirname,
  })
    .start()
    .catch((err) => {
      console.error('[server.js] Strapi failed to start:', err);
      process.exit(1);
    });
} catch (err) {
  console.error('[server.js] Fatal error before Strapi could start:', err);
  process.exit(1);
}
