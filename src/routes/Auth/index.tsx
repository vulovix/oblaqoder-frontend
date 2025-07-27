import { supabase } from "~/lib/supabase";
import { Auth } from "@supabase/auth-ui-react";
import { ThemeSupa } from "@supabase/auth-ui-shared";
import { Loader, Stack } from "@mantine/core";
import { useColorScheme } from "@mantine/hooks";
import { useAuth } from "~/providers/Auth/useAuth";
import { LogoQ } from "~/components/LogoQ/Logo";

export default function AuthRoute() {
  const { session, loading } = useAuth();
  const theme = useColorScheme();

  if (loading) return <Loader />;

  if (!session)
    return (
      <Stack>
        <LogoQ />
        <Auth
          supabaseClient={supabase}
          theme={theme}
          appearance={{
            theme: ThemeSupa,
            style: {
              message: {
                textTransform: "capitalize",
                fontWeight: "bold",
              },
              container: {
                minWidth: "340px",
              },
              input: {
                background: "transparent",
                outlineColor: "var(--mantine-color-default-border)",
                color: "var(--mantine-color-text)",
                maxHeight: "40px",
                borderColor: "var(--mantine-color-default-border)",
              },
              label: {
                fontSize: "12px",
                fontWeight: "600",
                textTransform: "capitalize",
                color: "var(--mantine-color-text)",
              },
              button: {
                fontWeight: "bold",
                // outline: "none",
                // fontSize: "13px",
                // minHeight: "44px",
                outlineWidth: "0px",
                outlineColor: "var(--mantine-color-text)",
                textTransform: "capitalize",
                background: "transparent",
                backgroundColor: "var(--mantine-color-default-border)",
                color: "var(--mantine-color-text)",
                borderColor: "var(--mantine-color-default-border)",
              },
            },
          }}
          providers={[]}
        />
      </Stack>
    );

  return <></>;
}
