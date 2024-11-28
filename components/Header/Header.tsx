"use client";

import { Burger, Button, Container, Group, Title } from "@mantine/core";
import { useDisclosure } from "@mantine/hooks";
import classes from "./Header.module.css";
import { ThemeToggle } from "../ThemeToggle/ThemeToggle";
import { IconAB } from "@tabler/icons-react";

const links = [
  { link: "/", label: "Um was gehts?" },
  { link: "/participate", label: "Hilf mit!" },
];

export function Header() {
  const [opened, { toggle }] = useDisclosure(false);
  //   const [active, setActive] = useState(links[0].link);

  const items = links.map((link) => (
    <Button
      component="a"
      key={link.label}
      href={link.link}
      //   className={classes.link}
      variant={"subtle"}
      //   data-active={active === link.link || undefined}
    >
      {link.label}
    </Button>
  ));

  return (
    <header className={classes.header}>
      <Container size="lg" className={classes.inner}>
        <Group>
          <IconAB size={40} color="var(--mantine-primary-color-6)" />
          <Title order={1} size="h3">
            Nutzerstudie - Gruppenbilder
          </Title>
        </Group>

        <Group gap={10} visibleFrom="xs">
          {items}
          <ThemeToggle />
        </Group>

        <Burger opened={opened} onClick={toggle} hiddenFrom="xs" size="sm" />
      </Container>
    </header>
  );
}
