import {
  createContext,
  useContext,
  useEffect,
  useMemo,
  useState,
  type ReactNode,
} from "react";
import {
  createUserWithEmailAndPassword,
  onAuthStateChanged,
  sendEmailVerification,
  signInWithEmailAndPassword,
  signInWithPopup,
  signOut as firebaseSignOut,
  updateProfile,
  type User,
} from "firebase/auth";
import { Scale } from "lucide-react";
import { auth, googleProvider } from "../firebase";

type AuthContextValue = {
  user: User | null;
  loading: boolean;
  error: string | null;
  signInWithEmail: (email: string, password: string) => Promise<void>;
  signInWithGoogle: () => Promise<void>;
  signUp: (email: string, password: string, nome: string) => Promise<void>;
  signOut: () => Promise<void>;
};

const AuthContext = createContext<AuthContextValue | undefined>(undefined);

function traduzirErroFirebase(error: unknown, fallback: string) {
  if (
    typeof error === "object" &&
    error !== null &&
    "code" in error &&
    typeof error.code === "string"
  ) {
    switch (error.code) {
      case "auth/user-not-found":
        return "Email não encontrado";
      case "auth/wrong-password":
        return "Senha incorreta";
      case "auth/too-many-requests":
        return "Muitas tentativas. Tente mais tarde.";
      case "auth/invalid-email":
        return "Email inválido";
      case "auth/email-already-in-use":
        return "Este email já está cadastrado";
      case "auth/weak-password":
        return "Senha muito fraca (mínimo 6 caracteres)";
      case "auth/popup-closed-by-user":
        return "O login com Google foi cancelado.";
      default:
        return fallback;
    }
  }

  return fallback;
}

function AuthLoadingScreen() {
  return (
    <div className="flex min-h-screen items-center justify-center bg-app-shell px-4">
      <div className="card-base flex w-full max-w-sm flex-col items-center gap-4 p-8 text-center">
        <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-primary-700 text-white shadow-soft">
          <Scale className="h-6 w-6 animate-spin motion-reduce:animate-none" />
        </div>
        <div>
          <p className="font-serif text-3xl font-semibold tracking-tight text-text">
            Alexia
          </p>
          <p className="mt-2 text-sm text-text-muted">
            Carregando sua sessão...
          </p>
        </div>
      </div>
    </div>
  );
}

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (nextUser) => {
      setUser(nextUser);
      setLoading(false);
    });

    return unsubscribe;
  }, []);

  const value = useMemo<AuthContextValue>(
    () => ({
      user,
      loading,
      error,
      signInWithEmail: async (email, password) => {
        try {
          setError(null);
          await signInWithEmailAndPassword(auth, email, password);
        } catch (authError) {
          setError(
            traduzirErroFirebase(authError, "Erro ao entrar. Tente novamente."),
          );
          throw authError;
        }
      },
      signInWithGoogle: async () => {
        try {
          setError(null);
          await signInWithPopup(auth, googleProvider);
        } catch (authError) {
          setError(
            traduzirErroFirebase(authError, "Erro ao entrar. Tente novamente."),
          );
          throw authError;
        }
      },
      signUp: async (email, password, nome) => {
        try {
          setError(null);
          const credential = await createUserWithEmailAndPassword(
            auth,
            email,
            password,
          );
          await updateProfile(credential.user, { displayName: nome });
          await sendEmailVerification(credential.user);
        } catch (authError) {
          setError(
            traduzirErroFirebase(
              authError,
              "Erro ao criar conta. Tente novamente.",
            ),
          );
          throw authError;
        }
      },
      signOut: async () => {
        setError(null);
        await firebaseSignOut(auth);
      },
    }),
    [error, loading, user],
  );

  if (loading) {
    return <AuthLoadingScreen />;
  }

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const context = useContext(AuthContext);

  if (!context) {
    throw new Error("useAuth deve ser usado dentro de AuthProvider.");
  }

  return context;
}
