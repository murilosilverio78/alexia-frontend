import { Navigate, Outlet } from "react-router-dom";
import { Scale } from "lucide-react";
import { useAuth } from "../contexts/AuthContext";

export function PrivateRoute() {
  const { user, loading } = useAuth();

  if (loading) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-app-shell px-4">
        <div className="card-base flex w-full max-w-sm flex-col items-center gap-4 p-8 text-center">
          <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-primary-700 text-white shadow-soft">
            <Scale className="h-6 w-6 animate-spin motion-reduce:animate-none" />
          </div>
          <p className="text-sm text-text-muted">Validando autenticação...</p>
        </div>
      </div>
    );
  }

  if (!user) {
    return <Navigate to="/login" replace />;
  }

  if (!user.emailVerified) {
    return <Navigate to="/verificar-email" replace />;
  }

  return <Outlet />;
}
