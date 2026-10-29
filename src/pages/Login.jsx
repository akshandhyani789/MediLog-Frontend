
import { useCallback, useEffect, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  GoogleAuthProvider,
  signInWithPopup,
  signInWithRedirect,
  getRedirectResult,
  getAdditionalUserInfo,
} from "firebase/auth";

import { auth } from "../firebase/firebase";
import { useAuth } from "../hooks/useAuth";
import { sendUserToBackend } from "../services/api";
import SignInCard from "../components/login/SignInCard";
import SignUpCard from "../components/login/SignUpCard";

function Login({ mode = "login" }) {
  const navigate = useNavigate();
  const { setUserData } = useAuth();
  const [loading, setLoading] = useState(false);
  const isLoggingIn = useRef(false);
  const redirectChecked = useRef(false);

  const finishLogin = useCallback(async (user, profile) => {
    const backendRes = await sendUserToBackend(user, profile);

    if (!backendRes) {
      alert("Backend not connected");
      return;
    }

    setUserData(backendRes.user);
    navigate("/dashboard", { replace: true });
  }, [navigate, setUserData]);

  useEffect(() => {
    if (redirectChecked.current) return;
    redirectChecked.current = true;

    const handleRedirect = async () => {
      try {
        const result = await getRedirectResult(auth);

        if (result) {
          isLoggingIn.current = true;
          setLoading(true);
          const role = sessionStorage.getItem("medilog-signup-role");
          sessionStorage.removeItem("medilog-signup-role");
          await finishLogin(
            result.user,
            mode === "signup" && getAdditionalUserInfo(result)?.isNewUser
              ? { role: role || "individual" }
              : undefined
          );
        }
      } catch (error) {
        console.error("Google redirect login error:", error);
        alert("Login failed. Please try again.");
      } finally {
        isLoggingIn.current = false;
        setLoading(false);
      }
    };

    handleRedirect();
  }, [finishLogin, mode]);

  const handleClick = async (role) => {
    if (isLoggingIn.current) return;

    isLoggingIn.current = true;
    setLoading(true);

    try {
      const provider = new GoogleAuthProvider();
      provider.setCustomParameters({ prompt: "select_account" });

      try {
        const result = await signInWithPopup(auth, provider);
        await finishLogin(
          result.user,
          mode === "signup" && getAdditionalUserInfo(result)?.isNewUser
            ? { role }
            : undefined
        );
      } catch (error) {
        if (
          error.code === "auth/popup-blocked" ||
          error.code === "auth/operation-not-supported-in-this-environment"
        ) {
          if (mode === "signup") {
            sessionStorage.setItem("medilog-signup-role", role || "individual");
          }
          await signInWithRedirect(auth, provider);
          return;
        }

        throw error;
      }
    } catch (error) {
      console.error("Login error:", error);
      alert("Login failed. Please try again.");
    } finally {
      isLoggingIn.current = false;
      setLoading(false);
    }
  };

  return (
  <main className="auth-page relative isolate flex min-h-screen w-full items-center justify-center overflow-hidden px-4 py-8 sm:px-6">

    {/* Full-page teal background */}
    <div
      aria-hidden="true"
      className="pointer-events-none fixed inset-0 -z-10 overflow-hidden"
    >
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_50%_0%,rgba(204,251,241,0.65)_0%,rgba(248,250,251,0.8)_48%,rgba(236,253,245,0.85)_100%)]" />

      <div className="absolute -top-48 left-1/2 h-[650px] w-[1000px] max-w-[140vw] -translate-x-1/2 rounded-full bg-teal-500/[0.12] blur-[150px]" />

      <div className="absolute -bottom-64 left-1/2 h-[650px] w-[1100px] max-w-[150vw] -translate-x-1/2 rounded-full bg-emerald-500/[0.08] blur-[160px]" />

      <div className="absolute top-1/3 -left-40 h-[500px] w-[500px] rounded-full bg-cyan-500/[0.045] blur-[150px]" />

      <div className="absolute top-1/3 -right-40 h-[500px] w-[500px] rounded-full bg-teal-400/[0.045] blur-[150px]" />
    </div>

    {/* Render the appropriate existing account form. */}
    <div className="relative z-10 w-full max-w-[420px]">
      {mode === "signup" ? (
        <SignUpCard
          onGoogleClick={(role) => handleClick(role)}
          loading={loading}
        />
      ) : (
        <SignInCard
          onGoogleClick={() => handleClick()}
          googleLoading={loading}
        />
      )}
    </div>

  </main>

  );
}

export default Login;
