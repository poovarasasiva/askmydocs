// @ts-check
// Docusaurus config for AskMyDocs GitHub Pages deployment

module.exports = {
  title: 'AskMyDocs',
  tagline: 'AI-Powered Document Intelligence Platform',
  favicon: 'img/favicon.ico',

  // --- Site Deployment Config ---
  url: 'https://poovarasasiva.github.io',       // Your GitHub Pages URL
  baseUrl: '/askmydocs/',                       // Repo name with trailing slash
  organizationName: 'poovarasasiva',            // GitHub username or org
  projectName: 'askmydocs',                     // Repo name
  deploymentBranch: 'gh-pages',                 // Branch used for deployment

  // --- Build Rules ---
  onBrokenLinks: 'throw',
  markdown: {
    hooks: {
      onBrokenMarkdownLinks: 'warn',
    },
  },

  // --- Localization ---
  i18n: {
    defaultLocale: 'en',
    locales: ['en'],
  },

  // --- Presets ---
  presets: [
    [
      'classic',
      ({
        docs: {
          sidebarPath: require.resolve('./sidebars.js'),
          editUrl: 'https://github.com/poovarasasiva/askmydocs/tree/main/website/',
        },
        blog: false, // disable blog
        theme: {
          customCss: require.resolve('./src/css/custom.css'),
        },
      }),
    ],
  ],

  // --- Plugins & Themes ---
  themes: ['@docusaurus/theme-mermaid'],
  markdown: {
    mermaid: true,
  },

  // --- Theme Config ---
  themeConfig: {
    navbar: {
      title: 'AskMyDocs',
      logo: {
        alt: 'AskMyDocs Logo',
        src: 'img/logo.svg',
      },
      items: [
        {
          href: 'https://askmydocuments.netlify.app/',
          label: '🌐 View Live Site',
          position: 'right',
          target: '_blank',
        },
        {
          href: 'https://github.com/poovarasasiva/askmydocs',
          label: 'GitHub',
          position: 'right',
        },
      ],
    },
    footer: {
      style: 'dark',
      copyright: `© ${new Date().getFullYear()} AskMyDocs. All rights reserved.`,
    },
  },
};
