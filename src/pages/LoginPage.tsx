import { useState } from "react";
import { Link, Navigate, useNavigate } from "react-router-dom";
import { sendPasswordResetEmail } from "firebase/auth";
import toast from "react-hot-toast";
import { Eye, EyeOff, Scale } from "lucide-react";
import { GoogleIcon } from "../components/GoogleIcon";
import { useAuth } from "../contexts/AuthContext";
import { auth } from "../firebase";

function traduzirResetSenha(error: unknown) {
  if (
    typeof error === "object" &&
    error !== null &&
    "code" in error &&
    typeof error.code === "string"
  ) {
    switch (error.code) {
      case "auth/user-not-found":
        return "Email não encontrado";
      case "auth/invalid-email":
        return "Email inválido";
      case "auth/too-many-requests":
        return "Muitas tentativas. Tente mais tarde.";
      default:
        return "Não foi possível enviar o email de recuperação.";
    }
  }

  return "Não foi possível enviar o email de recuperação.";
}

export function LoginPage() {
  const { user, signInWithEmail, signInWithGoogle, error } = useAuth();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const navigate = useNavigate();

  if (user) {
    return <Navigate to="/app" replace />;
  }

  const handleEmailLogin = async () => {
    if (!email.trim() || !password) {
      toast.error("Preencha email e senha.");
      return;
    }

    try {
      setIsSubmitting(true);
      await signInWithEmail(email.trim(), password);
      navigate("/app", { replace: true });
    } catch {
      return;
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleGoogleLogin = async () => {
    try {
      setIsSubmitting(true);
      await signInWithGoogle();
      navigate("/app", { replace: true });
    } catch {
      return;
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleResetPassword = async () => {
    if (!email.trim()) {
      toast.error("Informe seu email para recuperar a senha.");
      return;
    }

    try {
      await sendPasswordResetEmail(auth, email.trim());
      toast.success("Email de recuperação enviado.");
    } catch (resetError) {
      toast.error(traduzirResetSenha(resetError));
    }
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-app-shell px-4 py-10">
      <div className="w-full max-w-md">
        <Link
          to="/"
          className="mx-auto mb-6 inline-flex min-h-11 items-center gap-3 rounded-2xl px-2 text-text focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-primary-500/20"
        >
          <span className="flex h-11 w-11 items-center justify-center rounded-2xl bg-primary-700 text-white shadow-soft">
            <Scale className="h-5 w-5" />
          </span>
          <span className="font-serif text-2xl font-semibold tracking-tight">
            Alexia
          </span>
        </Link>

        <div className="card-base p-6 sm:p-8">
          <h1 className="font-serif text-4xl font-semibold tracking-tight text-text">
            Entrar
          </h1>

          <button
            type="button"
            onClick={() => void handleGoogleLogin()}
            disabled={isSubmitting}
            className="button-secondary mt-6 w-full justify-center"
          >
            <GoogleIcon />
            Continuar com Google
          </button>

          <div className="my-6 flex items-center gap-3">
            <div className="h-px flex-1 bg-border" />
            <span className="text-sm font-medium text-text-muted">ou</span>
            <div className="h-px flex-1 bg-border" />
          </div>

          <div className="space-y-4">
            <div>
              <label
                htmlFor="login-email"
                className="mb-2 block text-sm font-semibold text-text"
              >
                Email
              </label>
              <input
                id="login-email"
                type="email"
                className="field"
                value={email}
                onChange={(event) => setEmail(event.target.value)}
              />
            </div>

            <div>
              <label
                htmlFor="login-password"
                className="mb-2 block text-sm font-semibold text-text"
              >
                Senha
              </label>
              <div className="relative">
                <input
                  id="login-password"
                  type={showPassword ? "text" : "password"}
                  className="field pr-12"
                  value={password}
                  onChange={(event) => setPassword(event.target.value)}
                />
                <button
                  type="button"
                  onClick={() => setShowPassword((current) => !current)}
                  className="absolute right-3 top-1/2 flex h-9 w-9 -translate-y-1/2 items-center justify-center rounded-full text-text-muted transition duration-200 hover:bg-surface-soft focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-primary-500/20 motion-reduce:transition-none"
                >
                  {showPassword ? (
                    <EyeOff className="h-4 w-4" />
                  ) : (
                    <Eye className="h-4 w-4" />
                  )}
                </button>
              </div>
            </div>
          </div>

          <button
            type="button"
            onClick={() => void handleResetPassword()}
            className="mt-3 text-sm font-semibold text-primary-700 transition duration-200 hover:text-primary-600 focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-primary-500/20 motion-reduce:transition-none"
          >
            Esqueci minha senha
          </button>

          {error ? <p className="mt-4 text-sm text-danger-fg">{error}</p> : null}

          <button
            type="button"
            onClick={() => void handleEmailLogin()}
            disabled={isSubmitting}
            className="button-primary mt-6 w-full justify-center"
          >
            Entrar
          </button>

          <p className="mt-5 text-sm text-text-muted">
            Não tem conta?{" "}
            <Link to="/cadastro" className="font-semibold text-primary-700">
              Cadastre-se
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}
