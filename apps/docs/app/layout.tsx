import type { Metadata } from "next";
import { Footer, Layout, Navbar } from "nextra-theme-docs";
import "nextra-theme-docs/style.css";
import { Banner, Head } from "nextra/components";
import { getPageMap } from "nextra/page-map";
import type { ReactNode } from "react";

export const metadata: Metadata = {
  // Define your metadata here
  // For more information on metadata API, see: https://nextjs.org/docs/app/building-your-application/optimizing/metadata
};

const banner = <></>;
const navbar = (
  <Navbar
    logo={<span>Welcome Bot</span>}
    projectLink="https://github.com/xuc323/discord-welcome-bot"
    chatLink="https://discord.com/api/oauth2/authorize?client_id=853751983683928114&permissions=274914761792&scope=bot"
  />
);
const footer = <Footer />;

export default async function RootLayout({
  children,
}: Readonly<{ children: ReactNode }>) {
  return (
    <html lang="en" dir="ltr" suppressHydrationWarning>
      <Head
      // ... Your additional head options
      >
        {/* Your additional tags should be passed as `children` of `<Head>` element */}
      </Head>
      <body>
        <Layout
          banner={banner}
          navbar={navbar}
          toc={{ float: true }}
          pageMap={await getPageMap()}
          docsRepositoryBase="https://github.com/xuc323/discord-welcome-bot/tree/main/apps/docs"
          footer={footer}
          navigation={false}
        >
          {children}
        </Layout>
      </body>
    </html>
  );
}
