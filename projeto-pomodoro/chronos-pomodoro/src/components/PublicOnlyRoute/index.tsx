import { Navigate } from "react-router";
import { useAuthContext } from "../../contexts/TaskContext/AuthContext";
import type React from "react";

export function PublicOnlyRoute({ children }: { children: React.ReactNode }) {
  const { isAuthenticated } = useAuthContext();

  if (isAuthenticated) {
    return <Navigate to="/home" replace />;
  }

  return <>{children}</>;
}