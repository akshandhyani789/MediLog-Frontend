import { useNavigate } from "react-router-dom";
import { useRef, useState } from "react";
import Logo from "../components/Logo";
import {
  GoogleAuthProvider,
  signInWithPopup,
  signInWithRedirect,
  getAdditionalUserInfo,
} from "firebase/auth";
import { auth } from "../firebase/firebase";
 import { sendUserToBackend } from "../services/api"; // ✅ add this


function Login() {

  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const isLoggingIn = useRef(false);

const handleClick = async () => {
  if (isLoggingIn.current) return;

  try {
    isLoggingIn.current = true;
    setLoading(true);

    const provider = new GoogleAuthProvider();
    let result;

    try {
      result = await signInWithPopup(auth, provider);
    } catch (popupError) {
      await signInWithRedirect(auth, provider);
      return;
    }

    const user = result.user;

    // 🔥 SEND TO BACKEND
    const backendRes = await sendUserToBackend(user);

if (!backendRes) {
  alert("Backend not connected ❌");
  return;
}

if (backendRes.isFirstLogin) {
  navigate("/onboarding");
} else {
  navigate("/dashboard");
}

  } catch (error) {
    console.error("Login error:", error);
    alert("Login failed");

    isLoggingIn.current = false;
    setLoading(false);
  }
};

  return (
    <div className="min-h-screen flex items-center justify-center bg-[#F4F9F8] px-4 relative overflow-hidden">
      <div className="absolute -bottom-24 -right-24 w-96 h-96 bg-[#B2DFDB] blur-[120px] opacity-30 rounded-full -z-10" />

      <div className="w-full max-w-md bg-white rounded-[2.5rem] shadow-sm p-10 text-center border border-gray-100">
        <div className="flex justify-center">
          <Logo />
        </div>

        <h3 className="mt-8 text-2xl font-serif text-[#1A2E2C]">
          Sign in to MediLog
        </h3>

        <p className="mt-2 text-sm text-gray-500 font-light">
          Your secure medical narrative awaits.
        </p>

        <button
          onClick={handleClick}
          disabled={loading}
          className="mt-8 w-full flex items-center justify-center gap-3 border border-gray-200 rounded-full py-4 text-gray-700 font-medium hover:bg-gray-50 hover:shadow-md transition-all duration-300 disabled:opacity-50"
        >
          <img
            src="/assets/google-color.svg"
            alt="Google"
            className="w-5 h-5"
          />
          {loading ? "Signing in..." : "Continue with Google"}
        </button>

        <footer className="mt-10 text-[10px] text-gray-400 tracking-widest uppercase">
          Verified Authentication
        </footer>
      </div>
    </div>
  );
}

export default Login;