import "@mantine/carousel/styles.css";
import { ColorSchemeScript, createTheme, MantineProvider } from "@mantine/core";
import "@mantine/core/styles.css";
import { Notifications } from "@mantine/notifications";
import "@mantine/notifications/styles.css";
import type { Metadata } from "next";
import { NextIntlClientProvider } from "next-intl";

import { routing } from "@/i18n/routing";

import { getMessages } from "next-intl/server";
import { notFound } from "next/navigation";

export const metadata: Metadata = {
  title: "Gruppenbilder - Nutzerstudie",
  description:
    "Nutzerstudie zur Bewertung der ästhetischen Bildqualität von Gruppenbildern",
};

const theme = createTheme({
  colors: {
    primary: [
      "#fff4e1",
      "#ffe8cc",
      "#fed09b",
      "#fdb766",
      "#fca13a",
      "#fc931d",
      "#fc8c0c",
      "#e17800",
      "#c86a00",
      "#af5a00",
    ],
  },
  primaryColor: "primary",
});

export default async function RootLayout({
  children,
  params,
}: Readonly<{
  children: React.ReactNode;
  params: { locale: string };
}>) {
  const { locale } = await params;
  // Ensure that the incoming `locale` is valid
  if (!routing.locales.includes(locale as any)) {
    notFound();
  }

  // Providing all messages to the client
  // side is the easiest way to get started
  const messages = await getMessages();

  return (
    <html lang={locale} suppressHydrationWarning>
      <head>
        <meta charSet="UTF-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1.0" />
        <link rel="shortcut icon" href="/favicon.ico" />
        <ColorSchemeScript />
        <script
          defer
          src="https://umami.jonasleitner.com/script.js"
          data-website-id="4b732082-fdb8-48aa-ac1f-c9e1a7a3ab29"
        ></script>
      </head>
      <body>
        <NextIntlClientProvider messages={messages}>
          <MantineProvider defaultColorScheme="light" theme={theme}>
            {children}
            <Notifications />
          </MantineProvider>
        </NextIntlClientProvider>
      </body>
    </html>
  );
}
