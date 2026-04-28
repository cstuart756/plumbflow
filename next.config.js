const path = require('path');
const { i18n } = require('./next-i18next.config');

/** @type {import('next').NextConfig} */
const nextConfig = {
  i18n,
  // Ensure Next uses this package as the workspace root when multiple lockfiles exist
  outputFileTracingRoot: path.join(__dirname),
};

module.exports = nextConfig;
