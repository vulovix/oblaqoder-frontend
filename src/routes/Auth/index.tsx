import { supabase } from "~/lib/supabase";
import { Auth } from "@supabase/auth-ui-react";
import { ThemeSupa } from "@supabase/auth-ui-shared";
import { Loader, Stack } from "@mantine/core";
import { useColorScheme } from "@mantine/hooks";
import { useAuth } from "~/providers/Auth/useAuth";
// import { Logo } from "~/components/Logo/Logo";
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
                // fontSize: "13px",
                maxHeight: "40px",
              },
              label: {
                fontSize: "12px",
                fontWeight: "600",
                textTransform: "capitalize",
              },
              button: {
                fontWeight: "bold",
                // fontSize: "13px",
                // minHeight: "44px",
                textTransform: "capitalize",
                background: "var(--mantine-color-gray-filled)",
                borderColor: "var(--mantine-color-gray-7)",
              },
            },
          }}
          providers={[]}
        />
      </Stack>
    );

  return <></>;
}
