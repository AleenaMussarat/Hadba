'use strict';

// Entry point for hosts that run a persistent Node process from a single
// file (e.g. Hostinger's Node.js app type "express") instead of invoking
// the `strapi` CLI. Mirrors what `strapi start` itself does — see
// node_modules/@strapi/strapi/dist/src/cli/commands/start.js — since this
// isn't a TypeScript project, distDir is just appDir.

require('fs').mkdirSync('public/uploads', { recursive: true });

const { createStrapi } = require('@strapi/strapi');

createStrapi({
  appDir: __dirname,
  distDir: __dirname,
}).start();
