import { Center } from "@mantine/core";
import { type PropsWithChildren, useEffect } from "react";
import { useNavigate } from "react-router";
import { useAuth } from "~/providers/Auth/useAuth";

export function AuthLayout(props: PropsWithChildren<unknown>) {
  const { session } = useAuth();
  const isLoggedIn = !!session;
  const navigate = useNavigate();

  useEffect(() => {
    if (isLoggedIn) {
      navigate("/");
    }
  }, [isLoggedIn]);

  return <Center mih="100dvh">{props.children}</Center>;
}
