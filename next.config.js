/**
 * @type {import('next').NextConfig}
 */

/* eslint-disable @typescript-eslint/no-var-requires */
const withTM = require('next-transpile-modules')([
  '@babel/preset-react',
  '@fullcalendar/core',
  '@fullcalendar/daygrid',
  '@fullcalendar/interaction',
  '@fullcalendar/list',
  '@fullcalendar/react',
  '@fullcalendar/resource',
  '@fullcalendar/resource-timegrid',
  '@fullcalendar/timegrid',
  '@fullcalendar/timeline',
  'react-syntax-highlighter',
  'react-dnd',
  'react-dnd-html5-backend'
]);

module.exports = withTM({
  reactStrictMode: false,
  images: {
    domains: ['flagcdn.com']
  },
  experimental: {
    forceSwcTransforms: true
  },
  eslint: {
    // Legacy source contains repo-wide lint debt; run lint separately while allowing production builds.
    ignoreDuringBuilds: true
  }
});