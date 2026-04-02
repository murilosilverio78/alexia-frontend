import { useState } from "react";
import { Link, Navigate, useNavigate } from "react-router-dom";
import { sendEmailVerification } from "firebase/auth";
import toast from "react-hot-toast";
import { Mail } from "lucide-react";
import { useAuth } from "../contexts/AuthContext";

export function VerificarEmailPage() {
  const { user, signOut } = useAuth();
  const [cooldown, setCooldown] = useState(0);
  const [isReloading, setIsReloading] = useState(false);
  const navigate = useNavigate();

  if (!user) {
    return <Navigate to="/login" replace />;
  }

  if (user.emailVerified) {
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

  const handleResendEmail = async () => {
    if (cooldown > 0) {
      return;
    }

    try {
      await sendEmailVerification(user);
      toast.success("Email de confirmação reenviado.");
      startCooldown();
    } catch {
      toast.error("Não foi possível reenviar o email.");
    }
  };

  const handleReloadUser = async () => {
    try {
      setIsReloading(true);
      await user.reload();

      if (authUserVerified(user)) {
        navigate("/app", { replace: true });
        return;
      }

      toast.error("Seu email ainda não foi confirmado.");
    } finally {
      setIsReloading(false);
    }
  };

  const handleSignOut = async () => {
    await signOut();
    navigate("/login", { replace: true });
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-app-shell px-4 py-10">
      <div className="card-base w-full max-w-md p-6 text-center sm:p-8">
        <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl bg-info-bg text-info-fg">
          <Mail className="h-7 w-7" />
        </div>
        <h1 className="mt-6 font-serif text-4xl font-semibold tracking-tight text-text">
          Confirme seu email
        </h1>
        <p className="mt-4 text-base leading-7 text-text-muted">
          Acesse o link que enviamos para {user.email} para liberar o acesso à
          Alexia.
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

        <button
          type="button"
          onClick={() => void handleReloadUser()}
          disabled={isReloading}
          className="button-secondary mt-3 w-full justify-center"
        >
          Já confirmei — Entrar
        </button>

        <button
          type="button"
          onClick={() => void handleSignOut()}
          className="mt-5 inline-flex text-sm font-semibold text-primary-700"
        >
          Sair
        </button>

        <div className="mt-3">
          <Link to="/login" className="text-sm font-medium text-text-muted">
            Voltar para o login
          </Link>
        </div>
      </div>
    </div>
  );
}

function authUserVerified(user: { emailVerified: boolean }) {
  return user.emailVerified === true;
}
