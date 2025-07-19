import { createContext, useContext } from "react";
import type { ICollapseDesktopLayoutContext } from "./types";

export const CollapseDesktopLayoutContext = createContext<ICollapseDesktopLayoutContext | null>(null);

export const useCollapseDesktopLayoutContext = (): ICollapseDesktopLayoutContext => {
  const ctx = useContext(CollapseDesktopLayoutContext);
  if (!ctx) {
    throw new Error("You are trying to use useCollapseDesktopLayoutContext outside of CollapseDesktopLayoutContextProvider.");
  }
  return ctx;
};
