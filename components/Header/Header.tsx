"use client";

import { Burger, Button, Container, Group, Title } from "@mantine/core";
import { useDisclosure } from "@mantine/hooks";
import classes from "./Header.module.css";
import { ThemeToggle } from "../ThemeToggle/ThemeToggle";
import { IconAB } from "@tabler/icons-react";
import { logout } from "@/actions/auth";

const links = [
  { link: "/", label: "Um was gehts?" },
  { link: "/participate", label: "Hilf mit!" },
];

export function Header({
  admin,
  survey,
}: {
  admin?: boolean;
  survey?: boolean;
}) {
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
  const adminLinks = (
    <Button variant={"subtle"} onClick={logout}>
      Logout
    </Button>
  );

  return (
    <header className={classes.header} data-survey={survey}>
      <Container size="lg" className={classes.inner}>
        <Group>
          <IconAB size={40} color="var(--mantine-primary-color-6)" />
          {!survey && (
            <Title order={1} size="h3" visibleFrom="sm">
              Nutzerstudie - Gruppenbilder
            </Title>
          )}
        </Group>

        <Group gap={10} visibleFrom="xs">
          {survey ? null : admin ? adminLinks : items}
          <ThemeToggle />
        </Group>

        <Burger opened={opened} onClick={toggle} hiddenFrom="xs" size="sm" />
      </Container>
    </header>
  );
}
