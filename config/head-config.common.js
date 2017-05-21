/**
 * Configuration for head elements added during the creation of index.html.
 *
 * All href attributes are added the publicPath (if exists) by default.
 * You can explicitly hint to prefix a publicPath by setting a boolean value to a key that has
 * the same name as the attribute you want to operate on, but prefix with =
 *
 * Example:
 * { name: 'msapplication-TileImage', content: '/assets/icon/ms-icon-144x144.png', '=content': true },
 * Will prefix the publicPath to content.
 *
 * { rel: 'apple-touch-icon', sizes: '57x57', href: '/assets/icon/apple-icon-57x57.png', '=href': false },
 * Will not prefix the publicPath on href (href attributes are added by default
 *
 */
module.exports = {
  link: [
    /** <link> tags for 'apple-touch-icon' (AKA Web Clips). **/
    { rel: 'apple-touch-icon', sizes: '120x120', href: '/icons/ios/icon_120x120.png' },
    { rel: 'apple-touch-icon', sizes: '152x152', href: '/icons/ios/icon_152x152.png' },
    { rel: 'apple-touch-icon', sizes: '167x167', href: '/icons/ios/icon_167x167.png' },
    { rel: 'apple-touch-icon', sizes: '180x180', href: '/icons/ios/icon_180x180.png' },
    { rel: 'apple-touch-icon', sizes: '1024x1024', href: '/icons/ios/icon_1024x1024.png' },

    { rel: 'apple-touch-startup-image', href: '/icons/ios/icon_1024x1024.png' },

    /** <link> tags for android web app icons **/
    { rel: 'icon', type: 'image/png', sizes: '192x192', href: '/icons/android/icon_192x192.png' },

    /** <link> tags for favicons **/
    { rel: 'icon', type: 'image/png', sizes: '16x16', href: '/favicon.png' },
    { rel: 'icon', type: 'image/png', sizes: '32x32', href: '/icons/android/icon_32x32.png' },
    { rel: 'icon', type: 'image/png', sizes: '96x96', href: '/icons/android/icon_96x96.png' },
    { rel: 'icon', type: 'image/png', sizes: '144x144', href: '/icons/android/icon_144x144.png' },
    { rel: 'icon', type: 'image/png', sizes: '192x192', href: '/icons/android/icon_192x192.png' },

    /** <link> tags for a Web App Manifest **/
    { rel: 'manifest', href: '/manifest.json' }
  ],
  meta: [
    { name: 'msapplication-TileColor', content: '#00bcd4' },
    { name: 'msapplication-TileImage', content: '/icons/android/icon_144x144.png' },
    { name: 'theme-color', content: '#00bcd4' },
    { name: 'apple-mobile-web-app-capable', content: 'yes' },
  ]
};
