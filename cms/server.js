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

try {
  fs.mkdirSync(path.join(__dirname, 'public', 'uploads'), { recursive: true });

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
