module.exports = {
  title: "Jyfti",
  tagline: "The workflow engine for software engineers",
  url: "https://jyfti.github.io",
  baseUrl: "/jyfti/",
  onBrokenLinks: "throw",
  favicon: "img/favicon.ico",
  organizationName: "jyfti",
  projectName: "jyfti",
  themeConfig: {
    navbar: {
      title: "Jyfti",
      items: [
        {
          to: "docs/",
          activeBasePath: "docs",
          label: "Docs",
          position: "left",
        },
        {
          href: "https://github.com/jyfti/jyfti",
          label: "GitHub",
          position: "right",
        },
      ],
    },
    footer: {
      style: "dark",
      links: [
        {
          title: "Docs",
          items: [
            {
              label: "Introduction",
              to: "docs/",
            },
            {
              label: "Installation",
              to: "docs/installation",
            },
            {
              label: "Usage",
              to: "docs/usage",
            },
          ],
        },
        {
          title: "Community",
          items: [
            {
              label: "Stack Overflow",
              href: "https://stackoverflow.com/questions/tagged/jyfti",
            }
          ],
        },
        {
          title: "More",
          items: [
            {
              label: "GitHub",
              href: "https://github.com/jyfti/jyfti",
            },
            {
              label: "NPM",
              href: "https://www.npmjs.com/package/@jyfti/cli",
            },
          ],
        },
      ],
      copyright: `Copyright © ${new Date().getFullYear()} Fabian Boeller. Built with Docusaurus.`,
    },
  },
  presets: [
    [
      "@docusaurus/preset-classic",
      {
        docs: {
          // It is recommended to set document id as docs home page (`docs/` path).
          homePageId: "introduction",
          sidebarPath: require.resolve("./sidebars.js"),
          // Please change this to your repo.
          editUrl: "https://github.com/jyfti/jyfti/edit/master/website/",
        },
        theme: {
          customCss: require.resolve("./src/css/custom.css"),
        },
      },
    ],
  ],
};
