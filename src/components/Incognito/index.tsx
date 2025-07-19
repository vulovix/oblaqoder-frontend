// import { useAuth } from "providers/Auth/hooks";
import type { PropsWithChildren } from "react";
import { useAuth } from "~/providers/Auth/useAuth";

export function Incognito(props: PropsWithChildren<unknown>) {
  const { isLoggedIn } = useAuth();

  if (!isLoggedIn) {
    return <></>;
  }

  return <>{props.children}</>;
}
