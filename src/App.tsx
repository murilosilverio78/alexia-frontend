import type { ReactNode } from "react";
import { Navigate, Route, Routes } from "react-router-dom";
import { ErrorBoundary } from "./components/ErrorBoundary";
import { Layout } from "./components/Layout";
import { PrivateRoute } from "./components/PrivateRoute";
import { useAuth } from "./contexts/AuthContext";
import { CadastroPage } from "./pages/CadastroPage";
import { Historico } from "./pages/Historico";
import { LandingPage } from "./pages/LandingPage";
import { LoginPage } from "./pages/LoginPage";
import { NovaConsulta } from "./pages/NovaConsulta";
import { VerificarEmailPage } from "./pages/VerificarEmailPage";

function PublicOnlyRoute({ children }: { children: ReactNode }) {
  const { user } = useAuth();

  if (user?.emailVerified) {
    return <Navigate to="/app" replace />;
  }

  if (user && !user.emailVerified) {
    return <Navigate to="/verificar-email" replace />;
  }

  return children;
}

export default function App() {
  return (
    <ErrorBoundary>
      <Routes>
        <Route
          path="/"
          element={
            <PublicOnlyRoute>
              <LandingPage />
            </PublicOnlyRoute>
          }
        />
        <Route
          path="/login"
          element={
            <PublicOnlyRoute>
              <LoginPage />
            </PublicOnlyRoute>
          }
        />
        <Route
          path="/cadastro"
          element={<CadastroPage />}
        />
        <Route path="/verificar-email" element={<VerificarEmailPage />} />

        <Route element={<PrivateRoute />}>
          <Route element={<Layout />}>
            <Route path="/app" element={<NovaConsulta />} />
            <Route path="/app/historico" element={<Historico />} />
            <Route path="/app/*" element={<Navigate to="/app" replace />} />
          </Route>
        </Route>

        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </ErrorBoundary>
  );
}
