const path = require('path');

/** @type {import('next').NextConfig} */
const nextConfig = {
  // Ensure Next uses this package as the workspace root when multiple lockfiles exist
  outputFileTracingRoot: path.join(__dirname),
};

module.exports = nextConfig;
