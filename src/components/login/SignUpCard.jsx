
import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import {
  createUserWithEmailAndPassword,
  updateProfile,
} from "firebase/auth";
import { auth } from "../../firebase/firebase";
import { sendUserToBackend } from "../../services/api";
import { useAuth } from "../../hooks/useAuth";
import {
  UserRound,
  Mail,
  Phone,
  LockKeyhole,
  Eye,
  EyeOff,
  ArrowRight,
  Store,
  LoaderCircle,
} from "lucide-react";

import Logo from "../Logo";


export default function SignUpCard({ onGoogleClick, loading: googleLoading = false }) {
  const navigate = useNavigate();
  const { setUserData } = useAuth();

  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [role, setRole] = useState("individual");
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const busy = loading || googleLoading;

  const getErrorMessage = (err) => {
    const messages = {
      "auth/email-already-in-use": "An account with this email already exists.",
      "auth/invalid-email": "Please enter a valid email address.",
      "auth/weak-password": "Choose a password with at least 6 characters.",
      "auth/operation-not-allowed": "Email/password registration is not enabled.",
      "auth/network-request-failed": "Network error. Check your connection.",
    };

    return messages[err.code] || "Unable to create your account. Please try again.";
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    if (fullName.trim().length < 2) {
      setError("Please enter your full name.");
      return;
    }

    if (password.length < 6) {
      setError("Your password must contain at least 6 characters.");
      return;
    }

    if (password !== confirmPassword) {
      setError("Passwords do not match.");
      return;
    }

    if (phone.trim() && !/^[6-9]\d{9}$/.test(phone.trim())) {
      setError("Enter a valid 10-digit phone number.");
      return;
    }

    setLoading(true);

    try {
      const credential = await createUserWithEmailAndPassword(
        auth,
        email.trim(),
        password
      );

      await updateProfile(credential.user, {
        displayName: fullName.trim(),
      });

      // Keep the existing MediLog backend user-sync flow.
      const backendRes = await sendUserToBackend(credential.user, {
        name: fullName.trim(),
        phone: phone.trim(),
        role,
      });

      if (!backendRes) {
        setError(
          "Your account was created, but the backend could not be reached. Please sign in again later."
        );
        return;
      }

      setUserData(backendRes.user);
      navigate("/dashboard", { replace: true });
    } catch (err) {
      console.error("Sign-up error:", err);
      setError(getErrorMessage(err));
    } finally {
      setLoading(false);
    }
  };

  return (
    <section className="auth-card w-full p-5 text-slate-900 sm:p-6">
      {/* Logo */}
      <Logo variant="dark" />
      

      <h1 className="text-[22px] font-semibold tracking-tight">
        Create Account
      </h1>
      <p className="mt-1 text-xs leading-[18px] text-slate-400">
        Join MediLog and start managing your medicines today.
      </p>

      <form onSubmit={handleSubmit} className="mt-4 space-y-3">
        {/* Full name */}
        <div>
          <label htmlFor="signup-name" className="mb-1 block text-[11px] font-medium text-slate-200">
            Full Name
          </label>
          <div className="flex h-9 items-center gap-2 rounded-lg border border-[#2b4145] bg-[#0b1518] px-2.5 transition focus-within:border-teal-400">
            <UserRound size={14} className="shrink-0 text-slate-400" />
            <input
              id="signup-name"
              type="text"
              autoComplete="name"
              placeholder="Enter your full name"
              value={fullName}
              onChange={(e) => setFullName(e.target.value)}
              required
              className="h-full min-w-0 flex-1 bg-transparent text-xs outline-none placeholder:text-slate-500"
            />
          </div>
        </div>

        {/* Email */}
        <div>
          <label htmlFor="signup-email" className="mb-1 block text-[11px] font-medium text-slate-200">
            Email Address
          </label>
          <div className="flex h-9 items-center gap-2 rounded-lg border border-[#2b4145] bg-[#0b1518] px-2.5 transition focus-within:border-teal-400">
            <Mail size={14} className="shrink-0 text-slate-400" />
            <input
              id="signup-email"
              type="email"
              autoComplete="email"
              placeholder="Enter your email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              className="h-full min-w-0 flex-1 bg-transparent text-xs outline-none placeholder:text-slate-500"
            />
          </div>
        </div>

        {/* Optional phone */}
        <div>
          <label htmlFor="signup-phone" className="mb-1 block text-[11px] font-medium text-slate-200">
            Phone Number <span className="text-teal-400">(Optional)</span>
          </label>
          <div className="flex h-9 items-center gap-2 rounded-lg border border-[#2b4145] bg-[#0b1518] px-2.5 transition focus-within:border-teal-400">
            <Phone size={14} className="shrink-0 text-slate-400" />
            <input
              id="signup-phone"
              type="tel"
              autoComplete="tel"
              placeholder="Enter your phone number"
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
              className="h-full min-w-0 flex-1 bg-transparent text-xs outline-none placeholder:text-slate-500"
            />
          </div>
        </div>

        {/* Password */}
        <div>
          <label htmlFor="signup-password" className="mb-1 block text-[11px] font-medium text-slate-200">
            Password
          </label>
          <div className="flex h-9 items-center gap-2 rounded-lg border border-[#2b4145] bg-[#0b1518] px-2.5 transition focus-within:border-teal-400">
            <LockKeyhole size={14} className="shrink-0 text-slate-400" />
            <input
              id="signup-password"
              type={showPassword ? "text" : "password"}
              autoComplete="new-password"
              placeholder="Create a password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              minLength={6}
              className="h-full min-w-0 flex-1 bg-transparent text-xs outline-none placeholder:text-slate-500"
            />
            <button
              type="button"
              onClick={() => setShowPassword((v) => !v)}
              aria-label={showPassword ? "Hide password" : "Show password"}
              className="text-slate-400 hover:text-teal-300"
            >
              {showPassword ? <EyeOff size={14} /> : <Eye size={14} />}
            </button>
          </div>
        </div>

        {/* Confirm password */}
        <div>
          <label htmlFor="signup-confirm" className="mb-1 block text-[11px] font-medium text-slate-200">
            Confirm Password
          </label>
          <div className="flex h-9 items-center gap-2 rounded-lg border border-[#2b4145] bg-[#0b1518] px-2.5 transition focus-within:border-teal-400">
            <LockKeyhole size={14} className="shrink-0 text-slate-400" />
            <input
              id="signup-confirm"
              type={showConfirmPassword ? "text" : "password"}
              autoComplete="new-password"
              placeholder="Confirm your password"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              required
              className="h-full min-w-0 flex-1 bg-transparent text-xs outline-none placeholder:text-slate-500"
            />
            <button
              type="button"
              onClick={() => setShowConfirmPassword((v) => !v)}
              aria-label={showConfirmPassword ? "Hide password" : "Show password"}
              className="text-slate-400 hover:text-teal-300"
            >
              {showConfirmPassword ? <EyeOff size={14} /> : <Eye size={14} />}
            </button>
          </div>
        </div>

        {/* Account type */}
        <fieldset>
          <legend className="mb-1.5 text-[11px] font-medium text-slate-200">
            I am a
          </legend>
          <div className="grid grid-cols-2 gap-2">
            <button
              type="button"
              aria-pressed={role === "individual"}
              onClick={() => setRole("individual")}
              className={`flex min-h-[48px] items-start gap-2 rounded-lg border p-2 text-left transition ${
                role === "individual"
                  ? "border-teal-400 bg-teal-500/[0.08]"
                  : "border-[#2b4145] bg-[#0b1518] hover:border-teal-500/50"
              }`}
            >
              <UserRound size={15} className="mt-0.5 shrink-0 text-teal-300" />
              <span>
                <span className="block text-[11px] font-medium">Individual</span>
                <span className="mt-0.5 block text-[9px] leading-3 text-slate-400">
                  For personal use
                </span>
              </span>
            </button>

            <button
              type="button"
              aria-pressed={role === "vendor"}
              onClick={() => setRole("vendor")}
              className={`flex min-h-[48px] items-start gap-2 rounded-lg border p-2 text-left transition ${
                role === "vendor"
                  ? "border-teal-400 bg-teal-500/[0.08]"
                  : "border-[#2b4145] bg-[#0b1518] hover:border-teal-500/50"
              }`}
            >
              <Store size={15} className="mt-0.5 shrink-0 text-teal-300" />
              <span>
                <span className="block text-[11px] font-medium">Vendor</span>
                <span className="mt-0.5 block text-[9px] leading-3 text-slate-400">
                  For pharmacies / businesses
                </span>
              </span>
            </button>
          </div>
        </fieldset>

        {error && (
          <p role="alert" className="rounded-md border border-red-500/20 bg-red-500/[0.08] p-2 text-[11px] leading-4 text-red-300">
            {error}
          </p>
        )}

        <button
          type="submit"
          disabled={busy}
          className="flex h-9 w-full items-center justify-center gap-2 rounded-lg bg-gradient-to-r from-teal-600 to-cyan-600 text-xs font-semibold transition hover:brightness-110 disabled:cursor-not-allowed disabled:opacity-60"
        >
          {loading ? (
            <>
              <LoaderCircle size={15} className="animate-spin" />
              Creating account...
            </>
          ) : (
            <>
              Create Account
              <ArrowRight size={15} />
            </>
          )}
        </button>
      </form>

      {/* Divider */}
      <div className="my-3 flex items-center gap-3">
        <div className="h-px flex-1 bg-[#253639]" />
        <span className="text-[10px] text-slate-400">OR</span>
        <div className="h-px flex-1 bg-[#253639]" />
      </div>

      {/* Google signup */}
      <button
        type="button"
        disabled={busy || !onGoogleClick}
        onClick={() => onGoogleClick?.(role)}
        className="flex h-9 w-full items-center justify-center gap-2 rounded-lg border border-[#2b4145] bg-[#0b1518] text-xs font-medium transition hover:border-teal-500/50 hover:bg-[#112022] disabled:cursor-not-allowed disabled:opacity-60"
      >
        {googleLoading ? (
          <LoaderCircle size={15} className="animate-spin" />
        ) : (
          <svg viewBox="0 0 48 48" className="h-4 w-4" aria-hidden="true">
            <path fill="#EA4335" d="M24 9.5c3.5 0 6.6 1.2 9 3.5l6.7-6.7C35.6 2.5 30.3 0 24 0 14.6 0 6.5 5.4 3 13.3l7.8 6.1C12.7 13.1 17.9 9.5 24 9.5Z" />
            <path fill="#4285F4" d="M46.1 24.5c0-1.6-.1-3.1-.4-4.5H24v9h12.4c-.5 2.9-2.2 5.4-4.7 7l7.4 5.7c4.3-4 7-10 7-17.2Z" />
            <path fill="#FBBC05" d="M10.8 28.6A14.5 14.5 0 0 1 10 24c0-1.6.3-3.1.8-4.6L3 13.3A24 24 0 0 0 0 24c0 3.9.9 7.6 3 10.7l7.8-6.1Z" />
            <path fill="#34A853" d="M24 48c6.3 0 11.6-2.1 15.4-6.3L32 36c-2.1 1.4-4.8 2.3-8 2.3-6.1 0-11.3-3.6-13.2-8.7L3 35.7C6.5 43.1 14.6 48 24 48Z" />
          </svg>
        )}
        Continue with Google
      </button>

      <p className="mt-5 text-center text-[10px] text-slate-400">
        Already have an account?{" "}
        <Link
          to="/login"
          className="ml-1 font-medium text-teal-400 underline-offset-4 hover:text-teal-300 hover:underline"
        >
          Log In
        </Link>
      </p>
    </section>
  );
}
