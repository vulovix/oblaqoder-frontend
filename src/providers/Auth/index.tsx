import { Center, Loader } from "@mantine/core";
import { useAuth } from "./useAuth";
import { useEffect } from "react";

export default function AuthProvider({ children }: { children: React.ReactNode }) {
  const { user, getUserByEmail, registerUser, isAppReady } = useAuth();
  useEffect(() => {
    const loadOrCreateAccount = async () => {
      if (user) {
        const email = user.email!;
        await getUserByEmail(email);

        // If no account was set after calling getUserByEmail, register one
        const currentAccount = useAuth.getState().account;
        if (!currentAccount) {
          await registerUser({
            email,
          });
          await getUserByEmail(email);
        }
      }
    };

    if (user) {
      loadOrCreateAccount();
    }
  }, [user]);

  if (!isAppReady)
    return (
      <Center mih="100dvh">
        <Loader color="gray" size="sm" />
      </Center>
    );

  return <>{children}</>;
}
