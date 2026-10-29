
import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import {
  signInWithEmailAndPassword,
  signInWithPopup,
  sendPasswordResetEmail,
  GoogleAuthProvider,
  GithubAuthProvider,
} from "firebase/auth";
import { auth } from "../../firebase/firebase";
import { sendUserToBackend } from "../../services/api";
import {
  Mail,
  LockKeyhole,
  Eye,
  EyeOff,
  ArrowRight,
  LoaderCircle,
  Github,
} from "lucide-react";
import Logo from "../Logo";

const googleProvider = new GoogleAuthProvider();
const githubProvider = new GithubAuthProvider();

const getErrorMessage = (error) => {
  const messages = {
    "auth/invalid-credential": "Incorrect email or password.",
    "auth/user-not-found": "No account found with this email.",
    "auth/wrong-password": "Incorrect password.",
    "auth/invalid-email": "Please enter a valid email address.",
    "auth/too-many-requests": "Too many attempts. Please try again later.",
    "auth/popup-closed-by-user": "The sign-in window was closed.",
    "auth/network-request-failed": "Network error. Check your connection.",
  };

  return messages[error.code] || error.message || "Something went wrong.";
};

export default function SignInCard({ onGoogleClick, googleLoading = false }) {
  const navigate = useNavigate();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [resetLoading, setResetLoading] = useState(false);
  const [error, setError] = useState("");
  const [notice, setNotice] = useState("");

  const handleEmailLogin = async (e) => {
    e.preventDefault();
    setError("");
    setNotice("");
    setLoading(true);

    try {
      const credential = await signInWithEmailAndPassword(
        auth,
        email.trim(),
        password
      );

      const backendRes = await sendUserToBackend(credential.user);
      if (!backendRes) {
        throw new Error("Your account is signed in, but the backend could not be reached.");
      }

      navigate("/dashboard", { replace: true });
    } catch (err) {
      setError(getErrorMessage(err));
    } finally {
      setLoading(false);
    }
  };

  const handleProviderLogin = async (provider) => {
    setError("");
    setNotice("");
    setLoading(true);

    try {
      const result = await signInWithPopup(auth, provider);
      const backendRes = await sendUserToBackend(result.user);
      if (!backendRes) {
        throw new Error("Your account is signed in, but the backend could not be reached.");
      }
      navigate("/dashboard", { replace: true });
    } catch (err) {
      setError(getErrorMessage(err));
    } finally {
      setLoading(false);
    }
  };

  const handleForgotPassword = async () => {
    setError("");
    setNotice("");

    if (!email.trim()) {
      setError("Enter your email address first to reset your password.");
      return;
    }

    setResetLoading(true);

    try {
      await sendPasswordResetEmail(auth, email.trim());
      setNotice("Password reset link sent. Check your email inbox.");
    } catch (err) {
      setError(getErrorMessage(err));
    } finally {
      setResetLoading(false);
    }
  };

  return (
    <main className="relative flex min-h-screen items-center justify-center overflow-hidden px-4 py-8 font-sans text-slate-900">
      {/* Ambient teal lighting */}
      {/* <div className="pointer-events-none absolute -top-32 left-1/2 h-80 w-80 -translate-x-1/2 rounded-full bg-teal-500/10 blur-[100px]" />
      <div className="pointer-events-none absolute bottom-0 right-0 h-72 w-72 rounded-full bg-cyan-500/[0.06] blur-[100px]" /> */}

      <section className="auth-card relative w-full max-w-[420px] p-6 sm:p-8">
        {/* Logo */}
              <Logo variant="dark" />


        <h1 className="text-2xl font-semibold tracking-tight">Login</h1>
        <p className="mt-1 max-w-[290px] text-sm leading-5 text-slate-400">
          Welcome back! Please enter your details to continue.
        </p>

        <form onSubmit={handleEmailLogin} className="mt-7 space-y-4">
          <div>
            <label
              htmlFor="email"
              className="mb-2 block text-xs font-medium text-slate-200"
            >
              Email address
            </label>

            <div className="flex h-11 items-center gap-2.5 rounded-lg border border-[#2b4145] bg-[#0b1518] px-3 transition focus-within:border-teal-400 focus-within:ring-2 focus-within:ring-teal-400/10">
              <Mail size={16} className="shrink-0 text-slate-400" />
              <input
                id="email"
                type="email"
                autoComplete="email"
                placeholder="Enter your email address"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                className="h-full min-w-0 flex-1 bg-transparent text-sm text-white outline-none placeholder:text-slate-500"
              />
            </div>
          </div>

          <div>
            <label
              htmlFor="password"
              className="mb-2 block text-xs font-medium text-slate-200"
            >
              Password
            </label>

            <div className="flex h-11 items-center gap-2.5 rounded-lg border border-[#2b4145] bg-[#0b1518] px-3 transition focus-within:border-teal-400 focus-within:ring-2 focus-within:ring-teal-400/10">
              <LockKeyhole size={16} className="shrink-0 text-slate-400" />
              <input
                id="password"
                type={showPassword ? "text" : "password"}
                autoComplete="current-password"
                placeholder="Enter your password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                className="h-full min-w-0 flex-1 bg-transparent text-sm text-white outline-none placeholder:text-slate-500"
              />

              <button
                type="button"
                onClick={() => setShowPassword((prev) => !prev)}
                aria-label={showPassword ? "Hide password" : "Show password"}
                className="shrink-0 text-slate-400 transition hover:text-teal-300"
              >
                {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
              </button>
            </div>
          </div>

          <div className="-mt-1 flex justify-end">
            <button
              type="button"
              onClick={handleForgotPassword}
              disabled={resetLoading}
              className="text-xs font-medium text-teal-400 transition hover:text-teal-300 disabled:opacity-50"
            >
              {resetLoading ? "Sending link..." : "Forgot password?"}
            </button>
          </div>

          {error && (
            <p
              role="alert"
              className="rounded-lg border border-red-500/20 bg-red-500/[0.08] px-3 py-2 text-xs leading-5 text-red-300"
            >
              {error}
            </p>
          )}

          {notice && (
            <p
              role="status"
              className="rounded-lg border border-teal-500/20 bg-teal-500/[0.08] px-3 py-2 text-xs leading-5 text-teal-300"
            >
              {notice}
            </p>
          )}

          <button
            type="submit"
            disabled={loading}
            className="flex h-11 w-full items-center justify-center gap-2 rounded-lg bg-gradient-to-r from-teal-600 to-cyan-600 text-sm font-semibold text-white shadow-lg shadow-teal-950/30 transition hover:brightness-110 active:scale-[0.99] disabled:cursor-not-allowed disabled:opacity-60"
          >
            {loading ? (
              <>
                <LoaderCircle size={17} className="animate-spin" />
                Signing in...
              </>
            ) : (
              <>
                Log In
                <ArrowRight size={17} />
              </>
            )}
          </button>
        </form>

        {/* Divider */}
        <div className="my-6 flex items-center gap-3">
          <div className="h-px flex-1 bg-[#253639]" />
          <span className="text-[11px] text-slate-400">OR</span>
          <div className="h-px flex-1 bg-[#253639]" />
        </div>

        {/* Google */}
        <button
          type="button"
          disabled={loading || googleLoading}
          onClick={() =>
            onGoogleClick
              ? onGoogleClick()
              : handleProviderLogin(googleProvider)
          }
          className="flex h-11 w-full items-center justify-center gap-3 rounded-lg border border-[#2b4145] bg-[#0b1518] text-sm font-medium transition hover:border-teal-500/50 hover:bg-[#112022] disabled:opacity-50"
        >
          <svg viewBox="0 0 48 48" className="h-[17px] w-[17px]" aria-hidden="true">
            <path fill="#EA4335" d="M24 9.5c3.5 0 6.6 1.2 9 3.5l6.7-6.7C35.6 2.5 30.3 0 24 0 14.6 0 6.5 5.4 3 13.3l7.8 6.1C12.7 13.1 17.9 9.5 24 9.5Z" />
            <path fill="#4285F4" d="M46.1 24.5c0-1.6-.1-3.1-.4-4.5H24v9h12.4c-.5 2.9-2.2 5.4-4.7 7l7.4 5.7c4.3-4 7-10 7-17.2Z" />
            <path fill="#FBBC05" d="M10.8 28.6A14.5 14.5 0 0 1 10 24c0-1.6.3-3.1.8-4.6L3 13.3A24 24 0 0 0 0 24c0 3.9.9 7.6 3 10.7l7.8-6.1Z" />
            <path fill="#34A853" d="M24 48c6.3 0 11.6-2.1 15.4-6.3L32 36c-2.1 1.4-4.8 2.3-8 2.3-6.1 0-11.3-3.6-13.2-8.7L3 35.7C6.5 43.1 14.6 48 24 48Z" />
          </svg>
          {googleLoading ? "Connecting..." : "Continue with Google"}
        </button>

        {/* Other provider: GitHub */}
        <button
          type="button"
          disabled={loading}
          onClick={() => handleProviderLogin(githubProvider)}
          className="mt-3 flex h-11 w-full items-center justify-center gap-3 rounded-lg border border-[#2b4145] bg-[#0b1518] text-sm font-medium transition hover:border-teal-500/50 hover:bg-[#112022] disabled:opacity-50"
        >
          <Github size={17} className="text-slate-200" />
          Continue with GitHub
        </button>

        <p className="mt-8 text-center text-xs text-slate-400">
          Don't have an account?{" "}
          <Link
            to="/signup"
            className="ml-1 font-medium text-teal-400 underline-offset-4 transition hover:text-teal-300 hover:underline"
          >
            Create one
          </Link>
        </p>
      </section>
    </main>
  );
}
