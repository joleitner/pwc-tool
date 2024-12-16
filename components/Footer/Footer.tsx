import { Link } from "@/i18n/routing";
import { Box, BoxProps, Container, Group, Text } from "@mantine/core";
import { IconAB } from "@tabler/icons-react";
import { useTranslations } from "next-intl";
import classes from "./Footer.module.css";

export function Footer({ ...props }: Partial<BoxProps>) {
  const t = useTranslations("Footer");

  const links = [
    { link: "/imprint", label: t("imprint") },
    { link: "/data-privacy", label: t("dataPrivacy") },
    { link: "/participate", label: t("participate") },
  ];

  const items = links.map((link) => (
    <Link className={classes.link} key={link.label} href={link.link}>
      {link.label}
    </Link>
  ));

  return (
    <Box className={classes.footer} {...props}>
      <Container className={classes.inner}>
        <Group>
          <IconAB size={25} color="var(--mantine-primary-color-6)" />
          <Text>{t("title")}</Text>
        </Group>
        <Group className={classes.links}>{items}</Group>
      </Container>
    </Box>
  );
}
