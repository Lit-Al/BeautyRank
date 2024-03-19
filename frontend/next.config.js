/** @type {import('next').NextConfig} */
const path = require('path');

const nextConfig = {
  reactStrictMode: true,
  swcMinify: true,
  images: {
    domains: ['127.0.0.1', 'beautyrank.ru'],
  },
  webpack: (config, { isServer }) => {
    config.resolve.alias['@public'] = path.join(__dirname, 'public');
    return config;
  },
};

module.exports = nextConfig;
