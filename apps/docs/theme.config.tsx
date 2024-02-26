import React from "react";
import { DocsThemeConfig } from "nextra-theme-docs";

const config: DocsThemeConfig = {
  logo: <span>Welcome Bot</span>,
  project: {
    link: "https://github.com/xuc323/discord-welcome-bot",
  },
  chat: {
    link: "https://discord.com/api/oauth2/authorize?client_id=853751983683928114&permissions=274914761792&scope=bot",
  },
  docsRepositoryBase:
    "https://github.com/xuc323/discord-welcome-bot/tree/main/apps/docs",
  toc: {
    float: true,
  },
  navigation: false,
  footer: {
    component: <></>,
  },
};

export default config;
