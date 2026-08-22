"use client";

import { Providers } from "./providers";

export default function RootLayout({
  children,
  params,
}: {
  children: React.ReactNode;
  params: { [key: string]: string };
}) {
  return (
    <html dir={"rtl"} lang={"fa"}>
      <head>
        <meta charSet="utf-8" />
        <meta
          name="viewport"
          content="width=device-width,initial-scale=1,minimum-scale=1,maximum-scale=1,user-scalable=no"
        />
        <meta name="robots" content="noindex" />
        <meta name="keywords" content="Admin Panel" />
        <title>پنل مدیریت</title>
        <meta name="description" content="Admin Panel" />
        <link
          href="/favicon-96x96.png"
          rel="icon"
          type="image/png"
          sizes="96x96"
        />

        <link rel="shortcut icon" href="/favicon.ico" />
        <link rel="manifest" href="/manifest.json" />

        <meta name="theme-color" content="#18181b" />
      </head>

      <body>
        <Providers>{children}</Providers>
      </body>
    </html>
  );
}
// mohamadghasem
// 09921686138
