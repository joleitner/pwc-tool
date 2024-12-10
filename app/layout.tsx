import { ColorSchemeScript, createTheme, MantineProvider } from "@mantine/core";
import "@mantine/core/styles.css";
import "@mantine/carousel/styles.css";
import "@mantine/notifications/styles.css";
import type { Metadata } from "next";
import { Notifications } from "@mantine/notifications";
import { Analytics } from "@vercel/analytics/react";

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
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="de" suppressHydrationWarning>
      <head>
        <meta charSet="UTF-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1.0" />
        <link rel="shortcut icon" href="/favicon.ico" />
        <ColorSchemeScript />
      </head>
      <body>
        <Analytics />
        <MantineProvider defaultColorScheme="light" theme={theme}>
          {children}
          <Notifications />
        </MantineProvider>
      </body>
    </html>
  );
}
