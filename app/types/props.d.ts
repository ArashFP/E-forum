import { ReactNode } from "react";

declare global {
  interface AuthLayoutProps {
    children: ReactNode;
  }
  interface AuthContextProviderProps {
    children: ReactNode;
  }
}