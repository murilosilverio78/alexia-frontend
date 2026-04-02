import { useState } from "react";
import { Link, Navigate, useNavigate } from "react-router-dom";
import { sendEmailVerification } from "firebase/auth";
import toast from "react-hot-toast";
import { Eye, EyeOff, Mail, Scale } from "lucide-react";
import { GoogleIcon } from "../components/GoogleIcon";
import { useAuth } from "../contexts/AuthContext";
import { auth } from "../firebase";

export function CadastroPage() {
  const { user, signInWithGoogle, signUp, error } = useAuth();
  const [nome, setNome] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [confirmationEmail, setConfirmationEmail] = useState("");
  const [cooldown, setCooldown] = useState(0);
  const navigate = useNavigate();

  if (user?.emailVerified) {
    return <Navigate to="/app" replace />;
  }

  const startCooldown = () => {
    setCooldown(60);
    const intervalId = window.setInterval(() => {
      setCooldown((current) => {
        if (current <= 1) {
          window.clearInterval(intervalId);
          return 0;
        }

        return current - 1;
      });
    }, 1000);
  };

  const handleSignup = async () => {
    if (!nome.trim() || !email.trim() || !password || !confirmPassword) {
      toast.error("Preencha todos os campos.");
      return;
    }

    if (password.length < 6) {
      toast.error("Senha muito fraca (mínimo 6 caracteres)");
      return;
    }

    if (password !== confirmPassword) {
      toast.error("As senhas não coincidem.");
      return;
    }

    try {
      setIsSubmitting(true);
      await signUp(email.trim(), password, nome.trim());
      setConfirmationEmail(email.trim());
      startCooldown();
    } catch {
      return;
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleResendEmail = async () => {
    if (!auth.currentUser || cooldown > 0) {
      return;
    }

    try {
      await sendEmailVerification(auth.currentUser);
      toast.success("Email de confirmação reenviado.");
      startCooldown();
    } catch {
      toast.error("Não foi possível reenviar o email.");
    }
  };

  if (confirmationEmail) {
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

          <div className="card-base p-6 text-center sm:p-8">
            <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl bg-info-bg text-info-fg">
              <Mail className="h-7 w-7" />
            </div>
            <h1 className="mt-6 font-serif text-4xl font-semibold tracking-tight text-text">
              Verifique seu email
            </h1>
            <p className="mt-4 text-base leading-7 text-text-muted">
              Enviamos um link de confirmação para {confirmationEmail}. Clique no
              link para ativar sua conta e fazer login.
            </p>
            <button
              type="button"
              onClick={() => void handleResendEmail()}
              disabled={cooldown > 0}
              className="button-primary mt-8 w-full justify-center"
            >
              {cooldown > 0
                ? `Reenviar email em ${cooldown}s`
                : "Reenviar email"}
            </button>
            <Link
              to="/login"
              className="mt-5 inline-flex text-sm font-semibold text-primary-700"
            >
              Voltar para o login
            </Link>
          </div>
        </div>
      </div>
    );
  }

  const handleGoogleSignup = async () => {
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
            Criar conta
          </h1>

          <button
            type="button"
            onClick={() => void handleGoogleSignup()}
            disabled={isSubmitting}
            className="button-secondary mt-6 w-full justify-center"
          >
            <GoogleIcon />
            Cadastrar com Google
          </button>

          <div className="my-6 flex items-center gap-3">
            <div className="h-px flex-1 bg-border" />
            <span className="text-sm font-medium text-text-muted">ou</span>
            <div className="h-px flex-1 bg-border" />
          </div>

          <div className="space-y-4">
            <div>
              <label className="mb-2 block text-sm font-semibold text-text">
                Nome completo
              </label>
              <input
                type="text"
                className="field"
                value={nome}
                onChange={(event) => setNome(event.target.value)}
              />
            </div>
            <div>
              <label className="mb-2 block text-sm font-semibold text-text">
                Email
              </label>
              <input
                type="email"
                className="field"
                value={email}
                onChange={(event) => setEmail(event.target.value)}
              />
            </div>
            <div>
              <label className="mb-2 block text-sm font-semibold text-text">
                Senha
              </label>
              <div className="relative">
                <input
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
            <div>
              <label className="mb-2 block text-sm font-semibold text-text">
                Confirmar senha
              </label>
              <div className="relative">
                <input
                  type={showConfirmPassword ? "text" : "password"}
                  className="field pr-12"
                  value={confirmPassword}
                  onChange={(event) => setConfirmPassword(event.target.value)}
                />
                <button
                  type="button"
                  onClick={() =>
                    setShowConfirmPassword((current) => !current)
                  }
                  className="absolute right-3 top-1/2 flex h-9 w-9 -translate-y-1/2 items-center justify-center rounded-full text-text-muted transition duration-200 hover:bg-surface-soft focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-primary-500/20 motion-reduce:transition-none"
                >
                  {showConfirmPassword ? (
                    <EyeOff className="h-4 w-4" />
                  ) : (
                    <Eye className="h-4 w-4" />
                  )}
                </button>
              </div>
            </div>
          </div>

          {error ? <p className="mt-4 text-sm text-danger-fg">{error}</p> : null}

          <button
            type="button"
            onClick={() => void handleSignup()}
            disabled={isSubmitting}
            className="button-primary mt-6 w-full justify-center"
          >
            Criar conta
          </button>

          <p className="mt-5 text-sm text-text-muted">
            Já tem conta?{" "}
            <Link to="/login" className="font-semibold text-primary-700">
              Entrar
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}
