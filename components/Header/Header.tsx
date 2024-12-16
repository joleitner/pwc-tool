"use client";

import {
  Burger,
  Button,
  Container,
  Group,
  Modal,
  Stack,
  Title,
} from "@mantine/core";
import { useDisclosure } from "@mantine/hooks";
import classes from "./Header.module.css";
import { ThemeToggle } from "../ThemeToggle/ThemeToggle";
import { IconAB } from "@tabler/icons-react";
import { logout } from "@/actions/auth";
import { Link } from "@/i18n/routing";
import { useTranslations } from "next-intl";

export function Header({
  admin,
  survey,
}: {
  admin?: boolean;
  survey?: boolean;
}) {
  const [opened, { toggle }] = useDisclosure(false);
  const t = useTranslations("Header");

  const links = [
    { link: "/", label: t("home") },
    { link: "/participate", label: t("participate") },
  ];
  //   const [active, setActive] = useState(links[0].link);

  const items = links.map((link) => (
    <Button
      component={Link}
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
              {t("title")}
            </Title>
          )}
        </Group>

        <Group gap={10} visibleFrom="xs">
          {survey ? null : admin ? adminLinks : items}
          {!survey && <ThemeToggle />}
        </Group>

        {survey ? (
          <ThemeToggle />
        ) : (
          <Burger opened={opened} onClick={toggle} hiddenFrom="xs" size="sm" />
        )}
      </Container>
      <Modal
        opened={opened}
        onClose={toggle}
        fullScreen
        yOffset={69}
        transitionProps={{ transition: "fade", duration: 200 }}
        // withCloseButton={false}
      >
        <Stack gap={10}>
          {admin ? adminLinks : items}
          <ThemeToggle />
        </Stack>
      </Modal>
    </header>
  );
}
