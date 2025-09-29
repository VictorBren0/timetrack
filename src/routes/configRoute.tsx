import { Navigate } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import type { JSX } from "react";

interface AuthRouteProps {
  children: JSX.Element;
  isPrivate?: boolean;
}

export function ConfigRoute({ children, isPrivate = false }: AuthRouteProps) {
  const { user, loading } = useAuth();

  if (loading) {
    return <div>Carregando...</div>;
  }

  if (isPrivate && !user) {
    return <Navigate to="/login" />;
  }

  if (!isPrivate && user) {
    return <Navigate to="/" />;
  }

  return children;
}
