import { Anchor, Box, Container, Group, Text } from "@mantine/core";
import classes from "./Footer.module.css";
import { IconAB } from "@tabler/icons-react";

const links = [
  { link: "/imprint", label: "Impressum" },
  { link: "/data-privacy", label: "Datenschutz" },
  { link: "/participate", label: "Hilf mit" },
];

export function Footer() {
  const items = links.map((link) => (
    <Anchor<"a">
      c="dimmed"
      key={link.label}
      href={link.link}
      //   onClick={(event) => event.preventDefault()}
      size="sm"
    >
      {link.label}
    </Anchor>
  ));

  return (
    <div className={classes.footer}>
      <Container className={classes.inner}>
        <Group>
          <IconAB size={25} color="var(--mantine-primary-color-6)" />
          <Text>Nutzerstudie - Gruppenbilder</Text>
        </Group>
        <Group className={classes.links}>{items}</Group>
      </Container>
    </div>
  );
}
